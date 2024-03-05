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
  RED_FLAG_CODE_WHEN_NULL,
  TAG_TYPE,
} from '../../../../constants/config';
import prisma from '../../../../../prisma/client';
import {AddressType} from '../../../../interfaces/address_info';

// Info: Array of ResponseDataItem (20240131 - Shirley)
type ResponseData = ISearchResultData;

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

  // eslint-disable-next-line no-console
  console.log('all params', searchInput, order, page, offset, start_date, end_date, type);

  if (!searchInput) {
    return res.status(400).json({} as ResponseData);
  }

  const resultType = isSearchType(type) ? type : SearchType.ALL;
  // let totalPage = 0;
  // let count = 0;
  const resultData: ISearchResult[] = [];

  // let stability = StabilityLevel.LOW;

  try {
    const take = offset;
    const skip = page > 0 ? (page - 1) * offset : 0;
    const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    const searchResult = await searchByType(
      resultType,
      searchInput,
      take,
      skip,
      order,
      start_date,
      end_date,
      searchId
    );

    const count = await countResultsByType(resultType, searchInput, start_date, end_date, searchId);
    const totalPage = Math.ceil(count / offset);

    // if (type && type !== SearchType.ALL) {
    //   switch (type) {
    //     case SearchType.BLOCK:
    //       const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    //       // Info: calculate the stability for the targeted block (20240201 - Shirley)
    //       const latestBlock = await prisma.blocks.findFirst({
    //         orderBy: {
    //           created_timestamp: 'desc',
    //         },

    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           hash: true,
    //           number: true,
    //         },
    //       });

    //       if (!!searchId) {
    //         const blocks = await prisma.blocks.findMany({
    //           orderBy: {
    //             created_timestamp: order,
    //           },
    //           where: {
    //             number: searchId,
    //           },
    //           take,
    //           skip,
    //           select: {
    //             id: true,
    //             chain_id: true,
    //             created_timestamp: true,
    //             hash: true,
    //             number: true,
    //           },
    //         });

    //         blocks.forEach(item => {
    //           if (latestBlock && latestBlock.number) {
    //             const targetBlockId = item.number ? +item.number : 0;
    //             stability = assessBlockStability(targetBlockId, latestBlock.number);
    //           }

    //           resultData.push({
    //             type: SearchType.BLOCK,
    //             data: {
    //               id: `${item.number}`,
    //               chainId: `${item.chain_id}`,
    //               createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //               stability: stability,
    //             },
    //           });
    //         });
    //       }

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);
    //       break;
    //     case SearchType.TRANSACTION:
    //       const transactions = await prisma.transactions.findMany({
    //         where: {
    //           hash: {
    //             startsWith: searchInput,
    //           },
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           hash: true,
    //         },
    //       });

    //       transactions.forEach(item => {
    //         resultData.push({
    //           type: SearchType.TRANSACTION,
    //           data: {
    //             id: `${item.id}`,
    //             chainId: `${item.chain_id}`,
    //             createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //             hash: `${item.hash}`,
    //           },
    //         });
    //       });
    //       break;
    //     case SearchType.CONTRACT:
    //       const contracts = await prisma.contracts.findMany({
    //         where: {
    //           contract_address: {
    //             startsWith: searchInput,
    //           },
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           contract_address: true,
    //         },
    //       });

    //       contracts.forEach(item => {
    //         resultData.push({
    //           type: SearchType.CONTRACT,
    //           data: {
    //             id: `${item.id}`,
    //             chainId: `${item.chain_id}`,
    //             createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //             contractAddress: `${item.contract_address}`,
    //           },
    //         });
    //       });

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);
    //       break;
    //     case SearchType.EVIDENCE:
    //       const evidences = await prisma.evidences.findMany({
    //         where: {
    //           OR: [
    //             {evidence_id: {startsWith: searchInput}},
    //             {contract_address: {startsWith: searchInput}},
    //           ],
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           contract_address: true,
    //           evidence_id: true,
    //         },
    //       });

    //       evidences.forEach(item => {
    //         resultData.push({
    //           type: SearchType.EVIDENCE,
    //           data: {
    //             id: `${item.evidence_id}`,
    //             chainId: `${item.chain_id}`,
    //             createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //             evidenceAddress: `${item.contract_address}`,
    //           },
    //         });
    //       });

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);

    //       break;
    //     case SearchType.RED_FLAG:
    //       const redFlags = await prisma.red_flags.findMany({
    //         where: {
    //           related_addresses: {
    //             hasSome: [`${searchInput}`],
    //           },
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           related_addresses: true,
    //           red_flag_type: true,
    //         },
    //       });

    //       const redFlagCodes = await prisma.codes.findMany({
    //         where: {
    //           table_name: 'red_flags',
    //         },
    //         select: {
    //           table_column: true,
    //           value: true,
    //           meaning: true,
    //         },
    //       });

    //       const redFlagHistoryData = redFlags.map(redFlag => {
    //         const relatedAddresses = redFlag.related_addresses.map(address => {
    //           return {
    //             id: `${address}`,
    //             chainId: `${redFlag.chain_id}`,
    //           };
    //         });

    //         const redFlagTypeCode = redFlag.red_flag_type
    //           ? +redFlag.red_flag_type
    //           : RED_FLAG_CODE_WHEN_NULL;

    //         const redFlagType =
    //           redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

    //         return {
    //           id: `${redFlag.id}`,
    //           chainId: `${redFlag.chain_id}`,
    //           createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
    //           redFlagType: redFlagType,
    //           interactedAddresses: relatedAddresses,
    //         };
    //       });

    //       resultData.push(
    //         ...redFlagHistoryData.map(item => ({
    //           type: SearchType.RED_FLAG,
    //           data: {
    //             id: `${item.id}`,
    //             chainId: `${item.chainId}`,
    //             createdTimestamp: item.createdTimestamp,
    //             redFlagType: item.redFlagType,
    //             interactedAddresses: item.interactedAddresses,
    //           },
    //         }))
    //       );

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);
    //       break;
    //     case SearchType.ADDRESS:
    //       const addresses = await prisma.addresses.findMany({
    //         where: {
    //           address: {
    //             startsWith: searchInput,
    //           },
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           address: true,
    //         },
    //       });

    //       addresses.forEach(item => {
    //         resultData.push({
    //           type: SearchType.ADDRESS,
    //           data: {
    //             id: `${item.id}`,
    //             chainId: `${item.chain_id}`,
    //             createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //             address: `${item.address}`,
    //             flaggingCount: redFlags.length,
    //             riskLevel: RiskLevel.LOW_RISK, // TODO: Risk level calculation (20240201 - Shirley)
    //           },
    //         });
    //       });

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);
    //       break;
    //     case SearchType.BLACKLIST:
    //       // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
    //       const blacklistedAddresses = await prisma.public_tags.findMany({
    //         where: {
    //           target: {
    //             startsWith: searchInput,
    //           },
    //           tag_type: TAG_TYPE.BLACKLIST,
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           name: true,
    //           target: true,
    //           target_type: true,
    //           created_timestamp: true,
    //         },
    //       });

    //       // const blacklistedAddressesCount = await prisma.public_tags.count({
    //       //   where: {
    //       //     target: {
    //       //       startsWith: searchInput,
    //       //     },
    //       //     tag_type: TAG_TYPE.BLACKLIST,
    //       //   },
    //       // });

    //       // const resultTotalPage = Math.ceil(blacklistedAddressesCount / offset);

    //       const contractTargets = blacklistedAddresses
    //         .filter(tag => tag.target_type === '0')
    //         .map(tag => tag.target as string);
    //       const addressTargets = blacklistedAddresses
    //         .filter(tag => tag.target_type === '1')
    //         .map(tag => tag.target as string);

    //       const contractsChainIds = await prisma.contracts.findMany({
    //         where: {
    //           contract_address: {in: contractTargets},
    //         },
    //         select: {
    //           contract_address: true,
    //           chain_id: true,
    //         },
    //       });

    //       const addressesChainIds = await prisma.addresses.findMany({
    //         where: {
    //           address: {in: addressTargets},
    //         },
    //         select: {
    //           address: true,
    //           chain_id: true,
    //           latest_active_time: true,
    //         },
    //       });

    //       const chainIdMap = new Map();
    //       const lastActiveTimeMap = new Map();
    //       const addressTypeMap = new Map();

    //       addressesChainIds.forEach(address => {
    //         lastActiveTimeMap.set(address.address, address.latest_active_time);
    //         addressTypeMap.set(address.address, AddressType.ADDRESS);
    //       });

    //       contractsChainIds.forEach(contract => {
    //         chainIdMap.set(contract.contract_address, contract.chain_id);
    //         addressTypeMap.set(contract.contract_address, AddressType.CONTRACT);
    //       });
    //       addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

    //       blacklistedAddresses.forEach(item => {
    //         const chainId = chainIdMap.get(item.target) ?? '';
    //         const addressType = addressTypeMap.get(item.target) ?? AddressType.ADDRESS;
    //         const rs = {
    //           type: SearchType.BLACKLIST,
    //           data: {
    //             id: `${item?.id}`,
    //             chainId: `${chainId}`,
    //             createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
    //             address: `${item.target}`,
    //             targetType: `${addressType}`,
    //             latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
    //             tagName: `${item.name}`,
    //           },
    //         };

    //         resultData.push({
    //           type: SearchType.BLACKLIST,
    //           data: {
    //             id: `${item?.id}`,
    //             chainId: `${chainId}`,
    //             createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
    //             address: `${item.target}`,
    //             targetType: `${addressType}`,
    //             latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
    //             tagName: `${item.name}`,
    //           },
    //         });
    //       });

    //       count = resultData.length;
    //       totalPage = Math.ceil(count / offset);
    //       break;
    //     default:
    //       break;
    //   }
    // } else {
    //   const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

    //   // Info: calculate the stability for the targeted block (20240201 - Shirley)
    //   const latestBlock = await prisma.blocks.findFirst({
    //     orderBy: {
    //       created_timestamp: 'desc',
    //     },
    //     select: {
    //       id: true,
    //       chain_id: true,
    //       created_timestamp: true,
    //       hash: true,
    //       number: true,
    //     },
    //   });

    //   if (!!searchId && resultData.length < offset) {
    //     const blocks = await prisma.blocks.findMany({
    //       orderBy: {
    //         created_timestamp: order,
    //       },
    //       where: {
    //         number: searchId,
    //       },
    //       take,
    //       skip,
    //       select: {
    //         id: true,
    //         chain_id: true,
    //         created_timestamp: true,
    //         hash: true,
    //         number: true,
    //       },
    //     });

    //     blocks.forEach(item => {
    //       if (latestBlock && latestBlock.number) {
    //         const targetBlockId = item.number ? +item.number : 0;
    //         stability = assessBlockStability(targetBlockId, latestBlock.number);
    //       }

    //       resultData.push({
    //         type: SearchType.BLOCK,
    //         data: {
    //           id: `${item.number}`,
    //           chainId: `${item.chain_id}`,
    //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //           stability: stability,
    //         },
    //       });
    //     });
    //   }

    //   if (resultData.length < offset) {
    //     const transactions = await prisma.transactions.findMany({
    //       where: {
    //         hash: {
    //           startsWith: searchInput,
    //         },
    //       },
    //       take,
    //       skip,
    //       select: {
    //         id: true,
    //         chain_id: true,
    //         created_timestamp: true,
    //         hash: true,
    //       },
    //     });

    //     transactions.forEach(item => {
    //       resultData.push({
    //         type: SearchType.TRANSACTION,
    //         data: {
    //           id: `${item.id}`,
    //           chainId: `${item.chain_id}`,
    //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //           hash: `${item.hash}`,
    //         },
    //       });
    //     });
    //   }

    //   if (resultData.length < offset) {
    //     const contracts = await prisma.contracts.findMany({
    //       where: {
    //         contract_address: {
    //           startsWith: searchInput,
    //         },
    //       },
    //       take,
    //       skip,
    //       select: {
    //         id: true,
    //         chain_id: true,
    //         created_timestamp: true,
    //         contract_address: true,
    //       },
    //     });

    //     contracts.forEach(item => {
    //       resultData.push({
    //         type: SearchType.CONTRACT,
    //         data: {
    //           id: `${item.id}`,
    //           chainId: `${item.chain_id}`,
    //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //           contractAddress: `${item.contract_address}`,
    //         },
    //       });
    //     });
    //   }

    //   if (resultData.length < offset) {
    //     const evidences = await prisma.evidences.findMany({
    //       where: {
    //         OR: [
    //           {evidence_id: {startsWith: searchInput}},
    //           {contract_address: {startsWith: searchInput}},
    //         ],
    //       },
    //       take,
    //       skip,
    //       select: {
    //         id: true,
    //         chain_id: true,
    //         created_timestamp: true,
    //         contract_address: true,
    //         evidence_id: true,
    //       },
    //     });

    //     evidences.forEach(item => {
    //       resultData.push({
    //         type: SearchType.EVIDENCE,
    //         data: {
    //           id: `${item.evidence_id}`,
    //           chainId: `${item.chain_id}`,
    //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //           evidenceAddress: `${item.contract_address}`,
    //         },
    //       });
    //     });
    //   }

    //   if (resultData.length < offset) {
    //     const redFlags = await prisma.red_flags.findMany({
    //       where: {
    //         related_addresses: {
    //           hasSome: [`${searchInput}`],
    //         },
    //       },
    //       take,
    //       skip,
    //       select: {
    //         id: true,
    //         chain_id: true,
    //         created_timestamp: true,
    //         related_addresses: true,
    //         red_flag_type: true,
    //       },
    //     });

    //     const redFlagCodes = await prisma.codes.findMany({
    //       where: {
    //         table_name: 'red_flags',
    //       },
    //       select: {
    //         table_column: true,
    //         value: true,
    //         meaning: true,
    //       },
    //     });

    //     const redFlagHistoryData = redFlags.map(redFlag => {
    //       const relatedAddresses = redFlag.related_addresses.map(address => {
    //         return {
    //           id: `${address}`,
    //           chainId: `${redFlag.chain_id}`,
    //         };
    //       });

    //       const redFlagTypeCode = redFlag.red_flag_type
    //         ? +redFlag.red_flag_type
    //         : RED_FLAG_CODE_WHEN_NULL;

    //       const redFlagType =
    //         redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

    //       return {
    //         id: `${redFlag.id}`,
    //         chainId: `${redFlag.chain_id}`,
    //         createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
    //         redFlagType: redFlagType,
    //         interactedAddresses: relatedAddresses,
    //       };
    //     });

    //     resultData.push(
    //       ...redFlagHistoryData.map(item => ({
    //         type: SearchType.RED_FLAG,
    //         data: {
    //           id: `${item.id}`,
    //           chainId: `${item.chainId}`,
    //           createdTimestamp: item.createdTimestamp,
    //           redFlagType: item.redFlagType,
    //           interactedAddresses: item.interactedAddresses,
    //         },
    //       }))
    //     );

    //     //   redFlags.forEach(item => {
    //     //     if (item.related_addresses.some(address => address.startsWith(searchInput))) {
    //     //       resultData.push({
    //     //         type: SearchType.RED_FLAG,
    //     //         data: {
    //     //           id: `${item.id}`,
    //     //           chainId: `${item.chain_id}`,
    //     //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //     //           redFlagType: `${item.red_flag_type}`,
    //     //           interactedAddresses: item.related_addresses.map(address => {
    //     //             return {
    //     //               id: `${address}`, // TODO: addressID or address? (20240201 - Shirley)
    //     //               chainId: `${item.chain_id}`,
    //     //             };
    //     //           }),
    //     //         },
    //     //       });
    //     //     }
    //     //   });
    //     // }

    //     if (resultData.length < offset) {
    //       const addresses = await prisma.addresses.findMany({
    //         where: {
    //           address: {
    //             startsWith: searchInput,
    //           },
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           chain_id: true,
    //           created_timestamp: true,
    //           address: true,
    //         },
    //       });

    //       addresses.forEach(item => {
    //         resultData.push({
    //           type: SearchType.ADDRESS,
    //           data: {
    //             id: `${item.id}`,
    //             chainId: `${item.chain_id}`,
    //             createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
    //             address: `${item.address}`,
    //             flaggingCount: redFlags.length,
    //             riskLevel: RiskLevel.LOW_RISK, // TODO: Risk level calculation (20240201 - Shirley)
    //           },
    //         });
    //       });

    //       // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
    //       const blacklistedAddresses = await prisma.public_tags.findMany({
    //         where: {
    //           target: {
    //             startsWith: searchInput,
    //           },
    //           tag_type: TAG_TYPE.BLACKLIST,
    //         },
    //         take,
    //         skip,
    //         select: {
    //           id: true,
    //           name: true,
    //           target: true,
    //           target_type: true,
    //           created_timestamp: true,
    //         },
    //       });

    //       const contractTargets = blacklistedAddresses
    //         .filter(tag => tag.target_type === '0')
    //         .map(tag => tag.target as string);
    //       const addressTargets = blacklistedAddresses
    //         .filter(tag => tag.target_type === '1')
    //         .map(tag => tag.target as string);

    //       const contractsChainIds = await prisma.contracts.findMany({
    //         where: {
    //           contract_address: {in: contractTargets},
    //         },
    //         select: {
    //           contract_address: true,
    //           chain_id: true,
    //         },
    //       });

    //       const addressesChainIds = await prisma.addresses.findMany({
    //         where: {
    //           address: {in: addressTargets},
    //         },
    //         select: {
    //           address: true,
    //           chain_id: true,
    //           latest_active_time: true,
    //         },
    //       });

    //       const chainIdMap = new Map();
    //       const lastActiveTimeMap = new Map();
    //       const addressTypeMap = new Map();

    //       addressesChainIds.forEach(address => {
    //         lastActiveTimeMap.set(address.address, address.latest_active_time);
    //         addressTypeMap.set(address.address, AddressType.ADDRESS);
    //       });

    //       contractsChainIds.forEach(contract => {
    //         chainIdMap.set(contract.contract_address, contract.chain_id);
    //         addressTypeMap.set(contract.contract_address, AddressType.CONTRACT);
    //       });
    //       addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

    //       blacklistedAddresses.forEach(item => {
    //         const chainId = chainIdMap.get(item.target) ?? '';
    //         const addressType = addressTypeMap.get(item.target) ?? AddressType.ADDRESS;

    //         resultData.push({
    //           type: SearchType.BLACKLIST,
    //           data: {
    //             id: `${item?.id}`,
    //             chainId: `${chainId}`,
    //             createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
    //             address: `${item.target}`,
    //             targetType: `${addressType}`,
    //             latestActiveTime: lastActiveTimeMap.get(item.target) ?? 0,
    //             tagName: `${item.name}`,
    //           },
    //         });
    //       });
    //     }
    //   }

    //   count = resultData.length;
    //   totalPage = Math.ceil(count / offset);
    // }

    const result: ISearchResultData = {
      type: resultType,
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
  // Function to perform the search based on type and return the formatted results
  // Implement search logic similar to the original handler but more modular and efficient
  // Return an array of ISearchResult based on the search type and input
  const resultData: ISearchResult[] = [];
  let stability = StabilityLevel.LOW;
  const whereClause = {
    ...(start_date && end_date ? {created_timestamp: {gte: start_date, lte: end_date}} : {}),
  };

  if (type && type !== SearchType.ALL) {
    switch (type) {
      case SearchType.BLOCK:
        // const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

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
        const flaggingRecords = await prisma.red_flags.findMany({
          where: {related_addresses: {hasSome: [searchInput]}},
          select: {id: true, red_flag_type: true},
        });

        // eslint-disable-next-line no-console
        console.log('flaggingRecords', flaggingRecords);

        // const flaggingRecords1 = await prisma.red_flags.count({
        //   where: {related_addresses: {hasSome: [searchInput]}},
        //   select: {id: true, red_flag_type: true},
        // });

        const riskRecords = flaggingRecords.length;
        const riskLevel = assessAddressRisk(riskRecords);

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

        // eslint-disable-next-line no-console
        console.log('addresses', addresses);

        addresses.forEach(item => {
          resultData.push({
            type: SearchType.ADDRESS,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
              address: `${item.address}`,
              flaggingCount: riskRecords,
              riskLevel: riskLevel, // TODO: Risk level calculation (20240201 - Shirley)
            },
          });
        });

        break;
      case SearchType.BLACKLIST:
        // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
        const blacklistedAddresses = await prisma.public_tags.findMany({
          where: {
            ...whereClause,

            target: {
              startsWith: searchInput,
            },
            tag_type: TAG_TYPE.BLACKLIST,
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

      //   redFlags.forEach(item => {
      //     if (item.related_addresses.some(address => address.startsWith(searchInput))) {
      //       resultData.push({
      //         type: SearchType.RED_FLAG,
      //         data: {
      //           id: `${item.id}`,
      //           chainId: `${item.chain_id}`,
      //           createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
      //           redFlagType: `${item.red_flag_type}`,
      //           interactedAddresses: item.related_addresses.map(address => {
      //             return {
      //               id: `${address}`, // TODO: addressID or address? (20240201 - Shirley)
      //               chainId: `${item.chain_id}`,
      //             };
      //           }),
      //         },
      //       });
      //     }
      //   });
      // }

      if (resultData.length < take) {
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

        addresses.forEach(item => {
          resultData.push({
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
            ...whereClause,
            target: {
              startsWith: searchInput,
            },
            tag_type: TAG_TYPE.BLACKLIST,
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

async function countResultsByType(
  type: string,
  searchInput: string,
  start_date?: number,
  end_date?: number,
  searchId?: number
): Promise<number> {
  // Function to count the results based on type and input without actually retrieving all data
  // Use similar logic to searchByType but for counting
  // Return the count as a number
  switch (type) {
    case SearchType.BLOCK:
      // Count blocks matching the search input
      // const searchId = isValid64BitInteger(searchInput) ? parseInt(searchInput, 10) : undefined;

      const blocksCount = await prisma.blocks.count({
        where: {
          number: searchId,
        },
      });

      // eslint-disable-next-line no-console
      console.log('blockCount', blocksCount);
      return blocksCount;

      break;
    case SearchType.TRANSACTION:
      // Count transactions matching the search input
      const transactionsCount = await prisma.transactions.count({
        where: {
          hash: {
            startsWith: searchInput,
          },
        },
      });
      return transactionsCount;
      break;
    case SearchType.CONTRACT:
      // Count contracts matching the search input
      const contractsCount = await prisma.contracts.count({
        where: {
          contract_address: {
            startsWith: searchInput,
          },
        },
      });
      return contractsCount;
      break;
    case SearchType.EVIDENCE:
      // Count evidences matching the search input
      const evidencesCount = await prisma.evidences.count({
        where: {
          OR: [
            {evidence_id: {startsWith: searchInput}},
            {contract_address: {startsWith: searchInput}},
          ],
        },
      });
      return evidencesCount;
      break;
    case SearchType.RED_FLAG:
      // Count red flags matching the search input
      const redFlagsCount = await prisma.red_flags.count({
        where: {
          related_addresses: {
            hasSome: [`${searchInput}`],
          },
        },
      });
      return redFlagsCount;
      break;
    case SearchType.ADDRESS:
      // Count addresses matching the search input
      const addressesCount = await prisma.addresses.count({
        where: {
          address: {
            startsWith: searchInput,
          },
        },
      });
      return addressesCount;
      break;
    case SearchType.BLACKLIST:
      // Count blacklisted items matching the search input
      const blacklistedAddressesCount = await prisma.public_tags.count({
        where: {
          target: {
            startsWith: searchInput,
          },
          tag_type: TAG_TYPE.BLACKLIST,
        },
      });
      return blacklistedAddressesCount;
      break;
    default:
      // Count all types matching the search input
      const countBlock = await prisma.blocks.count({
        where: {
          number: searchId,
        },
      });

      const countTx = await prisma.transactions.count({
        where: {
          hash: {
            startsWith: searchInput,
          },
        },
      });

      const countContract = await prisma.contracts.count({
        where: {
          contract_address: {
            startsWith: searchInput,
          },
        },
      });

      const countEvidence = await prisma.evidences.count({
        where: {
          OR: [
            {evidence_id: {startsWith: searchInput}},
            {contract_address: {startsWith: searchInput}},
          ],
        },
      });

      const countRedFlag = await prisma.red_flags.count({
        where: {
          related_addresses: {
            hasSome: [`${searchInput}`],
          },
        },
      });

      const countAddress = await prisma.addresses.count({
        where: {
          address: {
            startsWith: searchInput,
          },
        },
      });

      const countBlacklist = await prisma.public_tags.count({
        where: {
          target: {
            startsWith: searchInput,
          },
          tag_type: TAG_TYPE.BLACKLIST,
        },
      });

      return (
        countBlock +
        countTx +
        countContract +
        countEvidence +
        countRedFlag +
        countAddress +
        countBlacklist
      );

      break;
  }
}
