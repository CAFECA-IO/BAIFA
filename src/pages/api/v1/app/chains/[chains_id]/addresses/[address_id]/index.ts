// 011 - GET /app/chains/:chain_id/addresses/:address_id

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../../../../../lib/utils/prismaUtils';
import {AddressType} from '../../../../../../../../interfaces/address_info';
import {IAddressBrief} from '../../../../../../../../interfaces/address';
import {isAddress} from 'web3-validator';
import {assessAddressRisk} from '../../../../../../../../lib/common';

type ResponseData = IAddressBrief | undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  // Info: (20240122 - Julian) 解構 URL 參數，同時進行類型轉換
  const chain_id =
    typeof req.query.chains_id === 'string' ? parseInt(req.query.chains_id, 10) : undefined;
  const address_id = typeof req.query.address_id === 'string' ? req.query.address_id : undefined;

  if (!address_id || !chain_id) {
    return res.status(400).json(undefined);
  }
  // eslint-disable-next-line no-console
  console.log('chain_id:', chain_id);

  try {
    const addressData = await prisma.addresses.findUnique({
      where: {address: address_id},
      select: {
        id: true,
        chain_id: true,
        created_timestamp: true,
        address: true,
        score: true,
        latest_active_time: true,
      },
    });

    if (addressData?.chain_id !== chain_id) return res.status(404).json(undefined);

    const transactionData = await prisma.transactions.findMany({
      where: {related_addresses: {hasSome: [address_id]}},
      select: {
        id: true,
        chain_id: true,
        from_address: true,
        to_address: true,
        type: true,
        status: true,
        created_timestamp: true,
        related_addresses: true,
      },
    });

    const publicTags = await prisma.public_tags.findMany({
      where: {target: address_id},
      select: {name: true, target: true},
    });

    const flaggingRecords = await prisma.red_flags.findMany({
      where: {related_addresses: {hasSome: [address_id]}},
      select: {id: true, red_flag_type: true},
    });

    const relatedAddressRaw = transactionData.flatMap(transaction => {
      return transaction.related_addresses.filter(
        address => address !== address_id && address !== 'null'
      );
    });

    const relatedAddresses = Array.from(new Set(relatedAddressRaw));

    // // Calculate interacted addresses and contracts separately
    // const interactedAddresses = await prisma.addresses.findMany({
    //   where: {
    //     address: {
    //       in: relatedAddresses,
    //     },
    //   },
    // });

    // const interactedContracts = await prisma.contracts.findMany({
    //   where: {
    //     contract_address: {
    //       in: relatedAddresses,
    //     },
    //   },
    // });

    // // Calculate counts
    // const interactedAddressCount = interactedAddresses.length;
    // const interactedContractCount = interactedContracts.length;

    const interactedAddressCount = await prisma.addresses.count({
      where: {address: {in: relatedAddresses}},
    });

    const interactedContractCount = await prisma.contracts.count({
      where: {contract_address: {in: relatedAddresses}},
    });

    // const [interactedAddressCount, interactedContractCount] = await Promise.all([
    //   prisma.addresses.count({
    //     where: {address: {in: relatedAddresses}},
    //   }),
    //   prisma.contracts.count({
    //     where: {contract_address: {in: relatedAddresses}},
    //   }),
    // ]);
    const riskRecords = flaggingRecords.length;

    const riskLevel = assessAddressRisk(riskRecords);

    const responseData: ResponseData = addressData
      ? {
          id: `${addressData.id}`,
          type: AddressType.ADDRESS, // ToDo: (20240122 - Julian) 補上這個欄位
          chainId: `${addressData.chain_id}`,
          createdTimestamp: addressData.created_timestamp ?? 0,
          address: `${addressData.address}`,
          latestActiveTime: addressData.latest_active_time ?? 0,
          score: addressData.score ?? 0,
          flaggingCount: riskRecords,
          riskLevel: riskLevel, // ToDo: (20240122 - Julian) 補上這個欄位
          interactedAddressCount: interactedAddressCount,
          interactedContactCount: interactedContractCount, // ToDo: (20240122 - Julian) 補上這個欄位
          publicTag:
            publicTags.length > 0
              ? publicTags.map(tag => tag.name ?? 'Unknown User')
              : ['Unknown User'],
        }
      : undefined;

    res.status(200).json(responseData);
  } catch (error) {
    // Info: (20240206 - Shirley) 如果有錯誤就回傳 500
    // eslint-disable-next-line no-console
    console.error('Failed to fetch address details:', error);
    res.status(500).json(undefined);
  } finally {
    await prisma.$disconnect();
  }
}
