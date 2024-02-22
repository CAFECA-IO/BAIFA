// 003 - GET /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {THRESHOLD_FOR_BLOCK_STABILITY} from '../../../../constants/config';
import {calculateBlockStability, isValid64BitInteger} from '../../../../lib/common';
import {IStabilityLevel, StabilityLevel} from '../../../../constants/stability_level';

// Info: Base type for common fields (20240131 - Shirley)
interface BaseResponseData {
  id: string;
  chainId: string;
  createdTimestamp: number;
}

enum RESPONSE_DATA_TYPE {
  BLOCK = 'BLOCK',
  ADDRESS = 'ADDRESS',
  CONTRACT = 'CONTRACT',
  EVIDENCE = 'EVIDENCE',
  TRANSACTION = 'TRANSACTION',
  BLACKLIST = 'BLACKLIST',
  RED_FLAG = 'RED_FLAG',
}

enum STABILITY {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

enum RISK_LEVEL {
  LOW_RISK = 'LOW_RISK',
  MEDIUM_RISK = 'MEDIUM_RISK',
  HIGH_RISK = 'HIGH_RISK',
}

// Info: Extending BaseResponseData for specific types (20240131 - Shirley)
interface ResponseDataBlock extends BaseResponseData {
  stability: IStabilityLevel;
}

interface ResponseDataAddress extends BaseResponseData {
  address: string;
  flaggingCount: number;
  riskLevel: RISK_LEVEL;
}

interface ResponseDataContract extends BaseResponseData {
  contractAddress: string;
}

interface ResponseDataEvidence extends BaseResponseData {
  evidenceAddress: string;
}

interface ResponseDataTransaction extends BaseResponseData {
  hash: string;
}

interface ResponseDataBlacklist extends BaseResponseData {
  address: string;
  publicTag: string[];
}

interface ResponseDataRedFlag extends BaseResponseData {
  redFlagType: string;
  interactedAddresses?: {
    id: string;
    chainId: string;
  }[];
}

// Info: Combining all types into a single union type (20240201 - Shirley)
type ResponseDataItem =
  | {
      type: RESPONSE_DATA_TYPE.BLOCK;
      data: ResponseDataBlock;
    }
  | {
      type: RESPONSE_DATA_TYPE.ADDRESS;
      data: ResponseDataAddress;
    }
  | {
      type: RESPONSE_DATA_TYPE.CONTRACT;
      data: ResponseDataContract;
    }
  | {
      type: RESPONSE_DATA_TYPE.EVIDENCE;
      data: ResponseDataEvidence;
    }
  | {
      type: RESPONSE_DATA_TYPE.TRANSACTION;
      data: ResponseDataTransaction;
    }
  | {
      type: RESPONSE_DATA_TYPE.BLACKLIST;
      data: ResponseDataBlacklist;
    }
  | {
      type: RESPONSE_DATA_TYPE.RED_FLAG;
      data: ResponseDataRedFlag;
    };

// Info: Array of ResponseDataItem (20240131 - Shirley)
type ResponseData = ResponseDataItem[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const searchInput = req.query.search_input as string;

  if (!searchInput || searchInput === '0x') {
    return res.status(400).json([]);
  }

  const result: ResponseDataItem[] = [];
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

    const blocks = await prisma.blocks.findMany({
      orderBy: {
        created_timestamp: 'desc',
      },
      where: {
        id: searchId,
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
        stability = calculateBlockStability(targetBlockId, latestBlock.number);
      }

      result.push({
        type: RESPONSE_DATA_TYPE.BLOCK,
        data: {
          id: `${item.number}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          stability: stability,
        },
      });
    });

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
        type: RESPONSE_DATA_TYPE.TRANSACTION,
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
        type: RESPONSE_DATA_TYPE.CONTRACT,
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
        type: RESPONSE_DATA_TYPE.EVIDENCE,
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

    redFlags.forEach(item => {
      if (item.related_addresses.some(address => address.startsWith(searchInput))) {
        result.push({
          type: RESPONSE_DATA_TYPE.RED_FLAG,
          data: {
            id: `${item.id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
            redFlagType: `${item.red_flag_type}`,
            interactedAddresses: item.related_addresses.map(address => {
              return {
                id: `${address}`, // TODO: addressID or address? (20240201 - Shirley)
                chainId: `${item.chain_id}`,
              };
            }),
          },
        });
      }
    });

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
        type: RESPONSE_DATA_TYPE.ADDRESS,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp : 0,
          address: `${item.address}`,
          flaggingCount: redFlags.length,
          riskLevel: RISK_LEVEL.LOW_RISK,
        },
      });
    });

    // Info: Find public tags with tag_type "9" matching search input (20240216 - Shirley)
    const blacklistedAddresses = await prisma.public_tags.findMany({
      where: {
        name: {
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
      },
    });

    const chainIdMap = new Map();

    contractsChainIds.forEach(contract =>
      chainIdMap.set(contract.contract_address, contract.chain_id)
    );
    addressesChainIds.forEach(address => chainIdMap.set(address.address, address.chain_id));

    blacklistedAddresses.forEach(item => {
      const chainId = chainIdMap.get(item.target) ?? '';
      result.push({
        type: RESPONSE_DATA_TYPE.BLACKLIST,
        data: {
          id: `${item?.id}`,
          chainId: `${chainId}`,
          createdTimestamp: item?.created_timestamp ? item?.created_timestamp : 0,
          address: `${item.target}`,
          publicTag: [`${item.target_type}`],
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
