// 101 - GET /app/tracking-tool add address following list

import type {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../../../../../prisma/client';

type ResponseData = string[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const addressList = await prisma.addresses.findMany({
      select: {
        address: true,
      },
    });

    const result = addressList
      .map(address => `${address.address}`)
      .filter(address => address !== '');

    res.status(200).json(result);
  } catch (error) {
    // Info: (20240326 - Julian) Request error
    // eslint-disable-next-line no-console
    console.error('app/tracking-tool add address list request', error);
    res.status(500).json([]);
  } finally {
    await prisma.$disconnect();
  }
}
