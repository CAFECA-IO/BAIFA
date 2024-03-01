// 003 - GET /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {assessBlockStability, isValid64BitInteger} from '../../../../lib/common';
import {StabilityLevel} from '../../../../constants/stability_level';
import {ISearchResult} from '../../../../interfaces/search_result';
import {SearchType} from '../../../../constants/search_type';
import {RiskLevel} from '../../../../constants/risk_level';
import {RED_FLAG_CODE_WHEN_NULL} from '../../../../constants/config';
import prisma from '../../../../../prisma/client';

// Info: Array of ResponseDataItem (20240131 - Shirley)
type ResponseData = ISearchResult[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(400).json([]);
  }

  const result: ISearchResult[] = [];
  let stability = StabilityLevel.LOW;

  try {
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

    if (!!searchId) {
      const blocks = await prisma.blocks.findMany({
        orderBy: {
          created_timestamp: 'desc',
        },
        where: {
          number: searchId,
        },
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

        result.push({
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

    const transactions = await prisma.transactions.findMany({
      where: {
        hash: {
          startsWith: searchInput,
        },
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        hash: true,
      },
    });

    transactions.forEach(item => {
      result.push({
        type: SearchType.TRANSACTION,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          hash: `${item.hash}`,
        },
      });
    });

    const contracts = await prisma.contracts.findMany({
      where: {
        contract_address: {
          startsWith: searchInput,
        },
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        contract_address: true,
      },
    });

    contracts.forEach(item => {
      result.push({
        type: SearchType.CONTRACT,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          contractAddress: `${item.contract_address}`,
        },
      });
    });

    const evidences = await prisma.evidences.findMany({
      where: {
        OR: [
          {evidence_id: {startsWith: searchInput}},
          {contract_address: {startsWith: searchInput}},
        ],
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
      result.push({
        type: SearchType.EVIDENCE,
        data: {
          id: `${item.evidence_id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          evidenceAddress: `${item.contract_address}`,
        },
      });
    });

    const redFlags = await prisma.red_flags.findMany({
      where: {
        related_addresses: {
          hasSome: [`${searchInput}`],
        },
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
      const redFlagType = redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

      return {
        id: `${redFlag.id}`,
        chainId: `${redFlag.chain_id}`,
        createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
        redFlagType: redFlagType,
        interactedAddresses: relatedAddresses,
      };
    });

    result.push(
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

    // redFlags.forEach(item => {
    //   if (item.related_addresses.some(address => address.startsWith(searchInput))) {
    //     result.push({
    //       type: SearchType.RED_FLAG,
    //       data: {
    //         id: `${item.id}`,
    //         chainId: `${item.chain_id}`,
    //         createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //         redFlagType: `${item.red_flag_type}`,
    //         interactedAddresses: item.related_addresses.map(address => {
    //           return {
    //             id: `${address}`, // TODO: addressID or address? (20240201 - Shirley)
    //             chainId: `${item.chain_id}`,
    //           };
    //         }),
    //       },
    //     });
    //   }
    // });

    const addresses = await prisma.addresses.findMany({
      where: {
        address: {
          startsWith: searchInput,
        },
      },
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        address: true,
      },
    });

    addresses.forEach(item => {
      result.push({
        type: SearchType.ADDRESS,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          address: `${item.address}`,
          flaggingCount: redFlags.length,
          riskLevel: RiskLevel.LOW_RISK, // TODO: Risk level calculation (20240201 - Shirley)
        },
      });
    });

    // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
    const blacklistedAddresses = await prisma.public_tags.findMany({
      where: {
        target: {
          startsWith: searchInput,
        },
        tag_type: '9',
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
      .filter(tag => tag.target_type === '0')
      .map(tag => tag.target as string);
    const addressTargets = blacklistedAddresses
      .filter(tag => tag.target_type === '1')
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

    addressesChainIds.forEach(address =>
      lastActiveTimeMap.set(address.address, address.latest_active_time)
    );

    contractsChainIds.forEach(contract =>
      chainIdMap.set(contract.contract_address, contract.chain_id)
    );
    addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

    blacklistedAddresses.forEach(item => {
      const chainId = chainIdMap.get(item.target) ?? '';
      result.push({
        type: SearchType.BLACKLIST,
        data: {
          id: `${item?.id}`,
          chainId: `${chainId}`,
          createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
          address: `${item.target}`,
          targetType: `${item.target_type}`, // TODO: 需要參考 codes table，回傳能判斷的字串，現在直接回傳 DB 裡面存的 target_type (20240216 - Shirley)
          latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
          tagName: `${item.name}`,
        },
      });
    });

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('search result request', error);
    res.status(500).json([] as ResponseData);
  }
}
