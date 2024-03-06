// 003 - GET /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {assessAddressRisk, assessBlockStability, isValid64BitInteger} from '../../../../lib/common';
import {StabilityLevel} from '../../../../constants/stability_level';
import {ISearchResult, ISearchResultData} from '../../../../interfaces/search_result';
import {ISearchType, SearchType, isSearchType} from '../../../../constants/search_type';
import {RiskLevel} from '../../../../constants/risk_level';
import {
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
  PUBLIC_TAGS_REFERENCE,
  RED_FLAG_CODE_WHEN_NULL,
} from '../../../../constants/config';
import prisma from '../../../../../prisma/client';
import {AddressType} from '../../../../interfaces/address_info';

// Info: Array of ResponseDataItem (20240131 - Shirley)
type ResponseData = ISearchResultData;

type AddressRecords = {
  [address: string]: {
    recordsCount: number;
    riskLevel: string;
  };
};

type CodesTargetType = {
  [key: string]: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;
  const order = (req.query.order as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const start_date =
    typeof req.query.start_date === 'string' && parseInt(req.query.start_date, 10) > 0
      ? parseInt(req.query.start_date, 10)
      : undefined;
  const end_date =
    typeof req.query.end_date === 'string' && parseInt(req.query.end_date, 10) > 0
      ? parseInt(req.query.end_date, 10)
      : undefined;
  const type =
    typeof req.query.type === 'string' && isSearchType(req.query.type.toUpperCase())
      ? req.query.type.toUpperCase()
      : SearchType.ALL;

  if (!searchInput) {
    return res.status(400).json({} as ResponseData);
  }

  const searchType = isSearchType(type) ? type : SearchType.ALL;

  try {
    const take = offset;
    const skip = page > 0 ? (page - 1) * offset : 0;
    const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    const searchResult = await searchByType(
      searchType,
      searchInput,
      take,
      skip,
      order,
      start_date,
      end_date,
      searchId
    );

    const count = await countResultsByType(searchType, searchInput, start_date, end_date, searchId);
    const totalPage = Math.ceil(count / offset);

    const result: ISearchResultData = {
      type: searchType,
      count: count,
      totalPage: totalPage,
      data: searchResult,
    };

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('search result request', error);
    res.status(500).json({} as ResponseData);
  }
}

/** Info: (20240306 - Shirley)
 * @return data searched by type
 */
async function searchByType(
  type: ISearchType,
  searchInput: string,
  take: number,
  skip: number,
  order: 'asc' | 'desc',
  start_date?: number,
  end_date?: number,
  searchId?: number
): Promise<ISearchResult[]> {
  const resultData: ISearchResult[] = [];
  let stability = StabilityLevel.LOW;
  const whereClause = {
    ...(start_date && end_date ? {created_timestamp: {gte: start_date, lte: end_date}} : {}),
  };

  /** Info: (20240306 - Shirley)
   * 如果 type 不是 ALL，則根據 type 進行搜尋，
   * 如果沒有輸入 type 或者 type 是 ALL，則依序搜尋 block, transaction, contract, evidence, red flag, address, blacklist，
   * 其中搜尋的邏輯一一對應 `switch (type)` 的 case ，
   * 所以更改搜尋邏輯時需要更改兩個地方
   *  */
  if (type && type !== SearchType.ALL) {
    switch (type) {
      case SearchType.BLOCK:
        // Info: calculate the stability for the targeted block (20240201 - Shirley)
        const latestBlock = await prisma.blocks.findFirst({
          orderBy: {
            created_timestamp: 'desc',
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            hash: true,
            number: true,
          },
        });

        if (!!searchId) {
          const blocks = await prisma.blocks.findMany({
            orderBy: {
              created_timestamp: order,
            },
            where: {
              ...whereClause,
              number: searchId,
            },
            take,
            skip,
            select: {
              id: true,
              chain_id: true,
              created_timestamp: true,
              hash: true,
              number: true,
            },
          });

          blocks.forEach(item => {
            if (latestBlock && latestBlock.number) {
              const targetBlockId = item.number ? +item.number : 0;
              stability = assessBlockStability(targetBlockId, latestBlock.number);
            }

            resultData.push({
              type: SearchType.BLOCK,
              data: {
                id: `${item.number}`,
                chainId: `${item.chain_id}`,
                createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
                stability: stability,
              },
            });
          });
        }

        break;
      case SearchType.TRANSACTION:
        const transactions = await prisma.transactions.findMany({
          where: {
            ...whereClause,

            hash: {
              startsWith: searchInput,
            },
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            hash: true,
          },
        });

        transactions.forEach(item => {
          resultData.push({
            type: SearchType.TRANSACTION,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              hash: `${item.hash}`,
            },
          });
        });
        break;
      case SearchType.CONTRACT:
        const contracts = await prisma.contracts.findMany({
          where: {
            ...whereClause,

            contract_address: {
              startsWith: searchInput,
            },
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            contract_address: true,
          },
        });

        contracts.forEach(item => {
          resultData.push({
            type: SearchType.CONTRACT,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              contractAddress: `${item.contract_address}`,
            },
          });
        });

        break;
      case SearchType.EVIDENCE:
        const evidences = await prisma.evidences.findMany({
          where: {
            ...whereClause,

            OR: [
              {evidence_id: {startsWith: searchInput}},
              {contract_address: {startsWith: searchInput}},
            ],
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            contract_address: true,
            evidence_id: true,
          },
        });

        evidences.forEach(item => {
          resultData.push({
            type: SearchType.EVIDENCE,
            data: {
              id: `${item.evidence_id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              evidenceAddress: `${item.contract_address}`,
            },
          });
        });

        break;
      case SearchType.RED_FLAG:
        const redFlags = await prisma.red_flags.findMany({
          where: {
            ...whereClause,

            related_addresses: {
              hasSome: [`${searchInput}`],
            },
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            related_addresses: true,
            red_flag_type: true,
          },
        });

        const redFlagCodes = await prisma.codes.findMany({
          where: {
            table_name: 'red_flags',
          },
          select: {
            table_column: true,
            value: true,
            meaning: true,
          },
        });

        const redFlagHistoryData = redFlags.map(redFlag => {
          const relatedAddresses = redFlag.related_addresses.map(address => {
            return {
              id: `${address}`,
              chainId: `${redFlag.chain_id}`,
            };
          });

          const redFlagTypeCode = redFlag.red_flag_type
            ? +redFlag.red_flag_type
            : RED_FLAG_CODE_WHEN_NULL;

          const redFlagType =
            redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

          return {
            id: `${redFlag.id}`,
            chainId: `${redFlag.chain_id}`,
            createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
            redFlagType: redFlagType,
            interactedAddresses: relatedAddresses,
          };
        });

        resultData.push(
          ...redFlagHistoryData.map(item => ({
            type: SearchType.RED_FLAG,
            data: {
              id: `${item.id}`,
              chainId: `${item.chainId}`,
              createdTimestamp: item.createdTimestamp,
              redFlagType: item.redFlagType,
              interactedAddresses: item.interactedAddresses,
            },
          }))
        );

        break;
      case SearchType.ADDRESS:
        const addressRecords: AddressRecords = {};

        const addresses = await prisma.addresses.findMany({
          where: {
            ...whereClause,
            address: {
              startsWith: searchInput,
            },
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            address: true,
          },
        });

        for (const address of addresses) {
          if (address) {
            const addressStr = address.address ?? '';
            const count = await prisma.red_flags.count({
              where: {related_addresses: {hasSome: [addressStr]}},
            });
            const riskLevel = assessAddressRisk(count);

            addressRecords[addressStr] = {recordsCount: count, riskLevel: riskLevel};
          }
        }

        addresses.forEach(item => {
          resultData.push({
            type: SearchType.ADDRESS,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              address: `${item.address}`,
              flaggingCount: addressRecords[item.address ?? '']?.recordsCount ?? 0,
              riskLevel: addressRecords[item.address ?? '']?.riskLevel ?? RiskLevel.HIGH_RISK,
            },
          });
        });

        break;
      case SearchType.BLACKLIST:
        const codes = await prisma.codes.findMany({
          where: {
            table_name: 'public_tags',
            table_column: 'target_type',
          },
          select: {
            table_column: true,
            value: true,
            meaning: true,
          },
        });

        const codesTargetType: CodesTargetType = {};
        codes.forEach(code => {
          if (code.value !== null && code.value !== undefined && !!code.meaning) {
            codesTargetType[code.meaning] = `${code.value}`;
          }
        });

        // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
        const blacklistedAddresses = await prisma.public_tags.findMany({
          where: {
            ...whereClause,

            target: {
              startsWith: searchInput,
            },
            tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST,
          },
          take,
          skip,
          orderBy: {
            created_timestamp: order,
          },
          select: {
            id: true,
            name: true,
            target: true,
            target_type: true,
            created_timestamp: true,
          },
        });

        const contractTargets = blacklistedAddresses
          .filter(tag => {
            return tag.target_type === codesTargetType['contract'];
          })
          .map(tag => tag.target as string);
        const addressTargets = blacklistedAddresses
          .filter(tag => tag.target_type === codesTargetType['address'])
          .map(tag => tag.target as string);

        const contractsChainIds = await prisma.contracts.findMany({
          where: {
            contract_address: {in: contractTargets},
          },
          select: {
            contract_address: true,
            chain_id: true,
          },
        });

        const addressesChainIds = await prisma.addresses.findMany({
          where: {
            address: {in: addressTargets},
          },
          select: {
            address: true,
            chain_id: true,
            latest_active_time: true,
          },
        });

        const chainIdMap = new Map();
        const lastActiveTimeMap = new Map();
        const addressTypeMap = new Map();

        addressesChainIds.forEach(address => {
          lastActiveTimeMap.set(address.address, address.latest_active_time);
          addressTypeMap.set(address.address, AddressType.ADDRESS);
        });

        contractsChainIds.forEach(contract => {
          chainIdMap.set(contract.contract_address, contract.chain_id);
          addressTypeMap.set(contract.contract_address, AddressType.CONTRACT);
        });
        addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

        blacklistedAddresses.forEach(item => {
          const chainId = chainIdMap.get(item.target) ?? '';
          const addressType = addressTypeMap.get(item.target) ?? AddressType.ADDRESS;

          resultData.push({
            type: SearchType.BLACKLIST,
            data: {
              id: `${item?.id}`,
              chainId: `${chainId}`,
              createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
              address: `${item.target}`,
              targetType: `${addressType}`,
              latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
              tagName: `${item.name}`,
            },
          });
        });

        break;
      default:
        break;
    }
  } else {
    const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    // Info: calculate the stability for the targeted block (20240201 - Shirley)
    const latestBlock = await prisma.blocks.findFirst({
      orderBy: {
        created_timestamp: 'desc',
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        hash: true,
        number: true,
      },
    });

    if (!!searchId && resultData.length < take) {
      const blocks = await prisma.blocks.findMany({
        orderBy: {
          created_timestamp: order,
        },
        where: {
          ...whereClause,

          number: searchId,
        },
        take,
        skip,
        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          hash: true,
          number: true,
        },
      });

      blocks.forEach(item => {
        if (latestBlock && latestBlock.number) {
          const targetBlockId = item.number ? +item.number : 0;
          stability = assessBlockStability(targetBlockId, latestBlock.number);
        }

        resultData.push({
          type: SearchType.BLOCK,
          data: {
            id: `${item.number}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
            stability: stability,
          },
        });
      });
    }

    if (resultData.length < take) {
      const transactions = await prisma.transactions.findMany({
        where: {
          ...whereClause,

          hash: {
            startsWith: searchInput,
          },
        },
        take,
        skip,
        orderBy: [{created_timestamp: order}, {id: order}],
        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          hash: true,
        },
      });

      transactions.forEach(item => {
        resultData.push({
          type: SearchType.TRANSACTION,
          data: {
            id: `${item.id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
            hash: `${item.hash}`,
          },
        });
      });
    }

    if (resultData.length < take) {
      const contracts = await prisma.contracts.findMany({
        where: {
          ...whereClause,

          contract_address: {
            startsWith: searchInput,
          },
        },
        take,
        skip,
        orderBy: [{created_timestamp: order}],
        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          contract_address: true,
        },
      });

      contracts.forEach(item => {
        resultData.push({
          type: SearchType.CONTRACT,
          data: {
            id: `${item.id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
            contractAddress: `${item.contract_address}`,
          },
        });
      });
    }

    if (resultData.length < take) {
      const evidences = await prisma.evidences.findMany({
        where: {
          ...whereClause,

          OR: [
            {evidence_id: {startsWith: searchInput}},
            {contract_address: {startsWith: searchInput}},
          ],
        },
        take,
        skip,
        orderBy: [{created_timestamp: order}],

        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          contract_address: true,
          evidence_id: true,
        },
      });

      evidences.forEach(item => {
        resultData.push({
          type: SearchType.EVIDENCE,
          data: {
            id: `${item.evidence_id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
            evidenceAddress: `${item.contract_address}`,
          },
        });
      });
    }

    if (resultData.length < take) {
      const redFlags = await prisma.red_flags.findMany({
        where: {
          ...whereClause,

          related_addresses: {
            hasSome: [`${searchInput}`],
          },
        },
        take,
        skip,
        orderBy: [{created_timestamp: order}],

        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          related_addresses: true,
          red_flag_type: true,
        },
      });

      const redFlagCodes = await prisma.codes.findMany({
        where: {
          table_name: 'red_flags',
        },
        select: {
          table_column: true,
          value: true,
          meaning: true,
        },
      });

      const redFlagHistoryData = redFlags.map(redFlag => {
        const relatedAddresses = redFlag.related_addresses.map(address => {
          return {
            id: `${address}`,
            chainId: `${redFlag.chain_id}`,
          };
        });

        const redFlagTypeCode = redFlag.red_flag_type
          ? +redFlag.red_flag_type
          : RED_FLAG_CODE_WHEN_NULL;

        const redFlagType =
          redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

        return {
          id: `${redFlag.id}`,
          chainId: `${redFlag.chain_id}`,
          createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
          redFlagType: redFlagType,
          interactedAddresses: relatedAddresses,
        };
      });

      resultData.push(
        ...redFlagHistoryData.map(item => ({
          type: SearchType.RED_FLAG,
          data: {
            id: `${item.id}`,
            chainId: `${item.chainId}`,
            createdTimestamp: item.createdTimestamp,
            redFlagType: item.redFlagType,
            interactedAddresses: item.interactedAddresses,
          },
        }))
      );

      if (resultData.length < take) {
        const addressRecords: AddressRecords = {};

        const addresses = await prisma.addresses.findMany({
          where: {
            ...whereClause,

            address: {
              startsWith: searchInput,
            },
          },
          take,
          skip,
          orderBy: [{created_timestamp: order}],
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            address: true,
          },
        });

        for (const address of addresses) {
          if (address) {
            const addressStr = address.address ?? '';
            const count = await prisma.red_flags.count({
              where: {related_addresses: {hasSome: [addressStr]}},
            });
            const riskLevel = assessAddressRisk(count);

            addressRecords[addressStr] = {recordsCount: count, riskLevel: riskLevel};
          }
        }

        addresses.forEach(item => {
          resultData.push({
            type: SearchType.ADDRESS,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              address: `${item.address}`,
              flaggingCount: addressRecords[item.address ?? '']?.recordsCount ?? 0,
              riskLevel: addressRecords[item.address ?? '']?.riskLevel ?? RiskLevel.HIGH_RISK,
            },
          });
        });

        const codes = await prisma.codes.findMany({
          where: {
            table_name: 'public_tags',
            table_column: 'target_type',
          },
          select: {
            table_column: true,
            value: true,
            meaning: true,
          },
        });

        const codesTargetType: CodesTargetType = {};
        codes.forEach(code => {
          if (code.value !== null && code.value !== undefined && !!code.meaning) {
            codesTargetType[code.meaning] = `${code.value}`;
          }
        });

        // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
        const blacklistedAddresses = await prisma.public_tags.findMany({
          where: {
            ...whereClause,
            target: {
              startsWith: searchInput,
            },
            tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST,
          },
          take,
          skip,
          orderBy: [{created_timestamp: order}],

          select: {
            id: true,
            name: true,
            target: true,
            target_type: true,
            created_timestamp: true,
          },
        });

        const contractTargets = blacklistedAddresses
          .filter(tag => tag.target_type === codesTargetType['contract'])
          .map(tag => tag.target as string);
        const addressTargets = blacklistedAddresses
          .filter(tag => tag.target_type === codesTargetType['address'])
          .map(tag => tag.target as string);

        const contractsChainIds = await prisma.contracts.findMany({
          where: {
            contract_address: {in: contractTargets},
          },
          select: {
            contract_address: true,
            chain_id: true,
          },
        });

        const addressesChainIds = await prisma.addresses.findMany({
          where: {
            address: {in: addressTargets},
          },
          select: {
            address: true,
            chain_id: true,
            latest_active_time: true,
          },
        });

        const chainIdMap = new Map();
        const lastActiveTimeMap = new Map();
        const addressTypeMap = new Map();

        addressesChainIds.forEach(address => {
          lastActiveTimeMap.set(address.address, address.latest_active_time);
          addressTypeMap.set(address.address, AddressType.ADDRESS);
        });

        contractsChainIds.forEach(contract => {
          chainIdMap.set(contract.contract_address, contract.chain_id);
          addressTypeMap.set(contract.contract_address, AddressType.CONTRACT);
        });
        addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

        blacklistedAddresses.forEach(item => {
          const chainId = chainIdMap.get(item.target) ?? '';
          const addressType = addressTypeMap.get(item.target) ?? AddressType.ADDRESS;

          resultData.push({
            type: SearchType.BLACKLIST,
            data: {
              id: `${item?.id}`,
              chainId: `${chainId}`,
              createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
              address: `${item.target}`,
              targetType: `${addressType}`,
              latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
              tagName: `${item.name}`,
            },
          });
        });
      }
    }
  }

  // Info: only return the first 10 data (20240305 - Shirley)
  const result = resultData.slice(0, take);
  return result;
}

/** Info: (20240306 - Shirley)
 * @return count of data searched by type
 */
async function countResultsByType(
  type: string,
  searchInput: string,
  start_date?: number,
  end_date?: number,
  searchId?: number
): Promise<number> {
  const whereClause = {
    ...(start_date && end_date ? {created_timestamp: {gte: start_date, lte: end_date}} : {}),
  };

  switch (type) {
    case SearchType.BLOCK:
      // Info: Count blocks matching the search input (20240306 - Shirley)
      if (!!searchId) {
        const blocksCount = await prisma.blocks.count({
          where: {
            ...whereClause,
            number: searchId,
          },
        });

        return blocksCount;
      } else {
        return 0;
      }
    case SearchType.TRANSACTION:
      // Info: Count transactions matching the search input (20240306 - Shirley)
      const transactionsCount = await prisma.transactions.count({
        where: {
          ...whereClause,
          hash: {
            startsWith: searchInput,
          },
        },
      });
      return transactionsCount;
    case SearchType.CONTRACT:
      // Info: Count contracts matching the search input (20240306 - Shirley)
      const contractsCount = await prisma.contracts.count({
        where: {
          ...whereClause,
          contract_address: {
            startsWith: searchInput,
          },
        },
      });
      return contractsCount;
    case SearchType.EVIDENCE:
      // Info: Count evidences matching the search input (20240306 - Shirley)
      const evidencesCount = await prisma.evidences.count({
        where: {
          ...whereClause,
          OR: [
            {evidence_id: {startsWith: searchInput}},
            {contract_address: {startsWith: searchInput}},
          ],
        },
      });
      return evidencesCount;
    case SearchType.RED_FLAG:
      // Info: Count red flags matching the search input (20240306 - Shirley)
      const redFlagsCount = await prisma.red_flags.count({
        where: {
          ...whereClause,
          related_addresses: {
            hasSome: [`${searchInput}`],
          },
        },
      });
      return redFlagsCount;
    case SearchType.ADDRESS:
      // Info: Count addresses matching the search input (20240306 - Shirley)
      const addressesCount = await prisma.addresses.count({
        where: {
          ...whereClause,
          address: {
            startsWith: searchInput,
          },
        },
      });
      return addressesCount;
    case SearchType.BLACKLIST:
      // Info: Count blacklisted items matching the search input (20240306 - Shirley)
      const blacklistedAddressesCount = await prisma.public_tags.count({
        where: {
          ...whereClause,
          target: {
            startsWith: searchInput,
          },
          tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST,
        },
      });
      return blacklistedAddressesCount;
    default:
      // Info: Count all types matching the search input (20240306 - Shirley)
      let countBlock = 0;
      if (!!searchId) {
        countBlock = await prisma.blocks.count({
          where: {
            ...whereClause,
            number: searchId,
          },
        });
      } else {
        countBlock = 0;
      }

      const countTx = await prisma.transactions.count({
        where: {
          ...whereClause,
          hash: {
            startsWith: searchInput,
          },
        },
      });

      const countContract = await prisma.contracts.count({
        where: {
          ...whereClause,

          contract_address: {
            startsWith: searchInput,
          },
        },
      });

      const countEvidence = await prisma.evidences.count({
        where: {
          ...whereClause,

          OR: [
            {evidence_id: {startsWith: searchInput}},
            {contract_address: {startsWith: searchInput}},
          ],
        },
      });

      const countRedFlag = await prisma.red_flags.count({
        where: {
          ...whereClause,

          related_addresses: {
            hasSome: [`${searchInput}`],
          },
        },
      });

      const countAddress = await prisma.addresses.count({
        where: {
          ...whereClause,

          address: {
            startsWith: searchInput,
          },
        },
      });

      const countBlacklist = await prisma.public_tags.count({
        where: {
          ...whereClause,

          target: {
            startsWith: searchInput,
          },
          tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST,
        },
      });

      const totalCount =
        countBlock +
        countTx +
        countContract +
        countEvidence +
        countRedFlag +
        countAddress +
        countBlacklist;
      return totalCount;
  }
}
