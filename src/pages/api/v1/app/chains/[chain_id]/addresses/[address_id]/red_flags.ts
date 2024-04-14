// 013 - GET /app/chains/:chain_id/addresses/:address_id/red_flags

import type {NextApiRequest, NextApiResponse} from 'next';
import {IRedFlagOfAddress} from '../../../../../../../../interfaces/red_flag';
import {
  DEFAULT_PAGE,
  ITEM_PER_PAGE,
  CODE_WHEN_NULL,
} from '../../../../../../../../constants/config';
import prisma from '../../../../../../../../../prisma/client';

type ResponseData = IRedFlagOfAddress;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const chain_id =
    typeof req.query.chain_id === 'string' ? parseInt(req.query.chain_id, 10) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
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
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;

  if (!chain_id || !address_id) {
    return res.status(400).json({} as ResponseData);
  }

  try {
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

    // Info: create map to store red flag type (20240304 - Shirley)
    const typeCodeToMeaningMap = new Map<number, string>();
    const typeMeaningToCodeMap = new Map<string, number>();

    redFlagCodes.forEach(code => {
      typeCodeToMeaningMap.set(code.value ?? CODE_WHEN_NULL, code.meaning ?? '');
      typeMeaningToCodeMap.set(code.meaning ?? '', code.value ?? CODE_WHEN_NULL);
    });

    const skip = page > 0 ? (page - 1) * offset : 0;

    const whereClause = {
      chain_id,
      AND: [
        {related_addresses: {has: address_id}},
        ...(search ? [{related_addresses: {has: search}}] : []),
      ],
      ...(start_date && end_date ? {created_timestamp: {gte: start_date, lte: end_date}} : {}),
    };

    const whereClauseWithType = {
      ...whereClause,
      ...(type ? {red_flag_type: typeMeaningToCodeMap.get(type)?.toString() ?? ''} : {}),
    };

    // Info: get all red flag types that has been happened to this address whatever the `type` parameter is (20240304 - Shirley)
    const allPossibleRedFlagTypes = await prisma.red_flags.findMany({
      where: {
        ...whereClause,
      },
      select: {
        red_flag_type: true,
      },
    });

    const typesSet = new Set<string>();

    allPossibleRedFlagTypes.forEach(redFlag => {
      typesSet.add(
        typeCodeToMeaningMap.get(
          !!redFlag.red_flag_type ? +redFlag.red_flag_type : CODE_WHEN_NULL
        ) ?? ''
      );
    });

    // Info: red flag data that accord to parameters (20240304 - Shirley)
    const redFlags = await prisma.red_flags.findMany({
      where: {
        ...whereClauseWithType,
      },
      orderBy: [{created_timestamp: sort}, {id: sort}],
      take: offset,
      skip,
      select: {
        id: true,
        chain_id: true,
        red_flag_type: true,
        created_timestamp: true,
        related_addresses: true,
      },
    });

    const redFlagCount = await prisma.red_flags.count({where: whereClauseWithType});
    const totalPage = await prisma.red_flags
      .count({where: whereClauseWithType})
      .then(count => Math.ceil(count / offset));

    const redFlagData = redFlags.map(redFlag => {
      const redFlagTypeCode = redFlag.red_flag_type ? +redFlag.red_flag_type : CODE_WHEN_NULL;
      const redFlagType = typeCodeToMeaningMap.get(redFlagTypeCode) ?? '';

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

    const result = {
      redFlagCount,
      totalPage,
      redFlagData,
      allRedFlagTypes: Array.from(typesSet),
    };

    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error in /app/chains/:chain_id/addresses/:address_id/red_flags', error);
    res.status(500).json({} as ResponseData);
  }
}
