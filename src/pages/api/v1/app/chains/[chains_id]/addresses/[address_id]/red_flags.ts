// 013 - GET /app/chains/:chain_id/addresses/:address_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {IRedFlag} from '../../../../../../../../interfaces/red_flag';
import {RED_FLAG_CODE_WHEN_NULL} from '../../../../../../../../constants/config';

type ResponseData = IRedFlag[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();

  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id, 10) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  if (!chain_id || !address_id) {
    return res.status(400).json([]);
  }

  try {
    const redFlags = await prisma.red_flags.findMany({
      where: {
        chain_id,
        related_addresses: {
          hasSome: [address_id],
        },
      },
      select: {
        id: true,
        chain_id: true,
        red_flag_type: true,
        created_timestamp: true,
        related_addresses: true,
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

    const result = redFlags.map(redFlag => {
      const redFlagTypeCode = redFlag.red_flag_type
        ? +redFlag.red_flag_type
        : RED_FLAG_CODE_WHEN_NULL;
      const redFlagType = redFlagCodes.find(code => code.value === redFlagTypeCode)?.meaning ?? '';

      return {
        id: `${redFlag.id}`,
        chainId: `${redFlag.chain_id}`,
        addressId: address_id,
        redFlagType: redFlagType,
        createdTimestamp: redFlag.created_timestamp ? redFlag.created_timestamp : 0,
        interactedAddresses: redFlag.related_addresses.map(address => ({
          id: address,
          chainId: `${redFlag.chain_id}`,
        })),
      };
    });

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error in /app/chains/:chain_id/addresses/:address_id/red_flags', error);
    res.status(500).json([] as ResponseData);
  }
}
