// 003 - GET /app/search?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {
  THRESHOLD_FOR_HIGH_BLOCK_STABILITY,
  THRESHOLD_FOR_MEDIUM_AND_LOW_BLOCK_STABILITY,
} from '../../../../constants/config';

// Info: Base type for common fields (20240131 - Shirley)
interface BaseResponseData {
  id: string;
  chainId: string;
  createdTimestamp: number;
}

// Info: Extending BaseResponseData for specific types (20240131 - Shirley)
interface ResponseDataBlock extends BaseResponseData {
  stability: string;
}

interface ResponseDataAddress extends BaseResponseData {
  address: string;
  flaggingCount: number;
  riskLevel: string;
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
  address: string;
  redFlagType: string;
}

// Combining all types into a single union type
type ResponseDataItem =
  | {
      type: 'BLOCK';
      data: ResponseDataBlock;
    }
  | {
      type: 'ADDRESS';
      data: ResponseDataAddress;
    }
  | {
      type: 'CONTRACT';
      data: ResponseDataContract;
    }
  | {
      type: 'EVIDENCE';
      data: ResponseDataEvidence;
    }
  | {
      type: 'TRANSACTION';
      data: ResponseDataTransaction;
    }
  | {
      type: 'BLACKLIST';
      data: ResponseDataBlacklist;
    }
  | {
      type: 'RED_FLAG';
      data: ResponseDataRedFlag;
    };

// Array of ResponseDataItem
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
      'address': '0x383488493',
      'redFlagType': 'RED_FLAG_DETAIL_PAGE.FLAG_TYPE_MULTIPLE_RECEIVES',
    },
  },
];
*/

enum STABILITY {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(400).json([]);
  }

  const result: ResponseDataItem[] = [];
  let stability = '';

  try {
    // Info: search table: blocks with hash, addresses with address, contracts with contract_address, evidences with evidence_address, transactions with hash, blacklists with address, red_flags with address (20240131 - Shirley)

    // Select the latest block from blocks table
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
        hash: {
          startsWith: searchInput,
        },
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
      if (latestBlock) {
        if (THRESHOLD_FOR_HIGH_BLOCK_STABILITY < latestBlock.number - item.number) {
          stability = STABILITY.HIGH;
        } else if (
          THRESHOLD_FOR_MEDIUM_AND_LOW_BLOCK_STABILITY <
          latestBlock.number - item.number
        ) {
          stability = STABILITY.MEDIUM;
        } else if (
          latestBlock.number - item.number <
          THRESHOLD_FOR_MEDIUM_AND_LOW_BLOCK_STABILITY
        ) {
          stability = STABILITY.LOW;
        }
      }
      result.push({
        type: 'BLOCK',
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
          stability: stability,
        },
      });
    });

    // const addresses = await prisma.addresses.findMany({
    //   where: {
    //     address: {
    //       startsWith: searchInput,
    //     },
    //   },
    //   take: 10,
    //   select: {
    //     id: true,
    //     chain_id: true,
    //     created_timestamp: true,
    //     address: true,
    //     flagging_count: true,
    //     risk_level: true,
    //   },
    // });

    // addresses.forEach(item => {
    //   result.push({
    //     type: 'ADDRESS',
    //     data: {
    //       id: `${item.id}`,
    //       chainId: `${item.chain_id}`,
    //       createdTimestamp: item.created_timestamp,
    //       address: `${item.address}`,
    //       flaggingCount: item.flagging_count,
    //       riskLevel: `${item.risk_level}`,
    //     },
    //   });
    // });

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
        type: 'CONTRACT',
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
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
        type: 'EVIDENCE',
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
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
        type: 'TRANSACTION',
        data: {
          id: `${item.id}`,
          chainId: `${item.chain_id}`,
          createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
          hash: `${item.hash}`,
        },
      });
    });

    // const blacklists = await prisma.black_lists.findMany({
    //   where: {
    //     address_id: +searchInput, // TODO: check the data format (20240131 - Shirley)
    //     // address_id: {
    //     //   startsWith: searchInput,
    //     // },
    //   },
    //   select: {
    //     id: true,
    //     chain_id: true,
    //     created_timestamp: true,
    //     address_id: true,
    //     public_tag: true,
    //   },
    // });

    // blacklists.forEach(item => {
    //   result.push({
    //     type: 'BLACKLIST',
    //     data: {
    //       id: `${item.id}`,
    //       chainId: `${item.chain_id}`,
    //       createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
    //       address: `${item.address_id}`,
    //       publicTag: [item.public_tag], // TODO: check the demand and schema (20240131 - Shirley)
    //     },
    //   });
    // });

    const redFlags = await prisma.red_flags.findMany({
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
          type: 'RED_FLAG',
          data: {
            id: `${item.id}`,
            chainId: `${item.chain_id}`,
            createdTimestamp: item?.created_timestamp?.getTime() / 1000 ?? 0,
            address: item.related_addresses.join(', '), // Or handle array as needed
            redFlagType: `${item.red_flag_type}`,
          },
        });
      }
    });

    // const redFlags = await prisma.red_flags.findMany({
    //   where: {
    //     address: {
    //       startsWith: searchInput,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     chain_id: true,
    //     created_timestamp: true,
    //     address: true,
    //     red_flag_type: true,
    //   },
    // });

    // redFlags.forEach(item => {
    //   result.push({
    //     type: 'RED_FLAG',
    //     data: {
    //       id: `${item.id}`,
    //       chainId: `${item.chain_id}`,
    //       createdTimestamp: item.created_timestamp,
    //       address: `${item.address}`,
    //       redFlagType: `${item.red_flag_type}`,
    //     },
    //   });
    // });

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240130 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('search result request', error);
    res.status(500).json({} as ResponseData);
  }
}
