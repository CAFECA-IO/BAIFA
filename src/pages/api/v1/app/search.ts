// 003 - GET /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {THRESHOLD_FOR_BLOCK_STABILITY} from '../../../../constants/config';
import {isValid64BitInteger} from '../../../../lib/common';
import {PrismaClient} from '@prisma/client';

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
  stability: STABILITY;
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

/* Deprecated: (20240205 - Shirley) -------------- Mock Data --------------
const dummyResult: ResponseData = [
  {
    'type': 'BLOCK',
    'data': {
      'id': '210018',
      'chainId': 'btc',
      'createdTimestamp': 1665798400,
      'stability': 'MEDIUM',
    },
  },
  {
    'type': 'ADDRESS',
    'data': {
      'id': '148208',
      'chainId': 'usdt',
      'createdTimestamp': 1682940241,
      'address': '0x278432201',
      'flaggingCount': 10,
      'riskLevel': 'MEDIUM_RISK',
    },
  },
  {
    'type': 'CONTRACT',
    'data': {
      'id': '314839',
      'chainId': 'btc',
      'createdTimestamp': 1681918401,
      'contractAddress': '0x444357813',
    },
  },
  {
    'type': 'EVIDENCE',
    'data': {
      'id': '528401',
      'chainId': 'eth',
      'createdTimestamp': 1680421348,
      'evidenceAddress': '0x898765432',
    },
  },
  {
    'type': 'TRANSACTION',
    'data': {
      'id': '924044',
      'chainId': 'eth',
      'createdTimestamp': 1684482143,
      'hash': '0x213456789',
    },
  },
  {
    'type': 'BLACKLIST',
    'data': {
      'id': '142523',
      'chainId': 'usdt',
      'createdTimestamp': 1684801889,
      'address': '0x270183713',
      'publicTag': ['PUBLIC_TAG.HACKER'],
    },
  },
  {
    'type': 'RED_FLAG',
    'data': {
      'id': '1138290086',
      'chainId': 'btc',
      'createdTimestamp': 1689244021,
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
      'interactedAddresses': [
        {
          'id': '148208',
          'chainId': 'usdt',
        },
        {
          'id': '142523',
          'chainId': 'usdt',
        },
      ],
    },
  },
];
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(400).json([]);
  }

  const result: ResponseDataItem[] = [];
  let stability = STABILITY.LOW;

  try {
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
        OR: [
          {
            hash: {
              startsWith: searchInput,
            },
          },
          {
            id:
              !searchInput.startsWith('0x') && isValid64BitInteger(searchInput)
                ? +searchInput
                : undefined,
          },
        ],
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
      if (latestBlock && latestBlock.number && item.number) {
        if (THRESHOLD_FOR_BLOCK_STABILITY.HIGH < latestBlock.number - item.number) {
          stability = STABILITY.HIGH;
        } else if (THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM < latestBlock.number - item.number) {
          stability = STABILITY.MEDIUM;
        } else if (latestBlock.number - item.number < THRESHOLD_FOR_BLOCK_STABILITY.MEDIUM) {
          stability = STABILITY.LOW;
        }
      }

      result.push({
        type: RESPONSE_DATA_TYPE.BLOCK,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp
            ? Math.floor(item.created_timestamp.getTime() / 1000)
            : 0,
          stability: stability,
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
          createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
          contractAddress: `${item.contract_address}`,
        },
      });
    });

    const evidences = await prisma.evidences.findMany({
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

    evidences.forEach(item => {
      result.push({
        type: RESPONSE_DATA_TYPE.EVIDENCE,
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
          evidenceAddress: `${item.contract_address}`,
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
          createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
          hash: `${item.hash}`,
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
            createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
            redFlagType: `${item.red_flag_type}`,
            interactedAddresses: item.related_addresses.map(address => {
              return {
                id: `${address}`,
                chainId: `${item.chain_id}`,
              };
            }),
          },
        });
      }
    });

    const addresses = await prisma.addresses.findMany({
      where: {
        OR: [
          {
            address: {
              startsWith: searchInput,
            },
          },
          {
            id:
              !searchInput.startsWith('0x') && isValid64BitInteger(searchInput)
                ? +searchInput
                : undefined,
          },
        ],
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
          createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
          address: `${item.address}`,
          flaggingCount: redFlags.length,
          riskLevel: RISK_LEVEL.LOW_RISK,
        },
      });
    });

    if (addresses.length > 0) {
      for (const address of addresses) {
        const blacklists = await prisma.black_lists.findMany({
          where: {
            address_id: address.id,
          },
          select: {
            id: true,
            chain_id: true,
            created_timestamp: true,
            address_id: true,
            public_tag: true,
          },
        });

        blacklists.forEach(item => {
          result.push({
            type: RESPONSE_DATA_TYPE.BLACKLIST,
            data: {
              id: `${item.id}`,
              chainId: `${item.chain_id}`,
              createdTimestamp: item.created_timestamp
                ? item.created_timestamp.getTime() / 1000
                : 0,
              address: `${item.address_id}`,
              publicTag: item.public_tag ? item.public_tag.split(',') : [], // TODO: 假設 public_tag 是以逗號分隔的字串，如果 schema 改成 string[] 要再改回來 (20240201 - Shirley)
            },
          });
        });
      }
    } else if (!searchInput.startsWith('0x') && isValid64BitInteger(searchInput)) {
      const blacklists = await prisma.black_lists.findMany({
        where: {
          address_id: +searchInput,
        },
        select: {
          id: true,
          chain_id: true,
          created_timestamp: true,
          address_id: true,
          public_tag: true,
        },
      });

      blacklists.forEach(item => {
        result.push({
          type: RESPONSE_DATA_TYPE.BLACKLIST,
          data: {
            id: `${item.id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item.created_timestamp ? item.created_timestamp.getTime() / 1000 : 0,
            address: `${item.address_id}`,
            publicTag: item.public_tag ? item.public_tag.split(',') : [], // TODO: 假設 public_tag 是以逗號分隔的字串，如果 schema 改成 string[] 要再改回來 (20240201 - Shirley)
          },
        });
      });
    }

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('search result request', error);
    res.status(500).json([] as ResponseData);
  }
}
