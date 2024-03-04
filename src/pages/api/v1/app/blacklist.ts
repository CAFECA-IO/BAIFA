// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {getPrismaInstance} from '../../../../lib/utils/prismaUtils';
import {IBlackList} from '../../../../interfaces/blacklist';

type ResponseData = IBlackList[] | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prisma = getPrismaInstance();
  try {
    // Info: (20240216 - Liz) 從 public_tags table 中取得 tag_type = 9 (黑名單標籤) 的資料
    const blacklist = await prisma.public_tags.findMany({
      where: {
        tag_type: '9', // Info: (20240216 - Liz) 9:黑名單標籤
      },
      select: {
        id: true,
        name: true, // Info: (20240216 - Liz) 標籤名稱
        target: true, // Info: (20240216 - Liz) 是個地址
        target_type: true, // Info: (20240216 - Liz)  0:contract / 1:address
        created_timestamp: true, // Info: (20240216 - Liz) 標籤建立時間
      },
    });

    // Info: (20240216 - Liz) 若查無黑名單資料，回傳 404
    if (blacklist.length === 0) {
      res.status(404).send('404 - redFlagData Not Found');
      return;
    }

    // Info: (20240301 - Liz) 從 blacklistData 中 target_type 為 0 的 target 值(target 值為地址)
    const contractTargets = blacklist
      .filter(item => item.target_type === '0')
      .map(item => item.target)
      .filter(value => typeof value === 'string') as string[];

    // Info: (20240301 - Liz) 從 blacklistData 中 target_type 為 1 的 target 值(target 值為地址)
    const addressTargets = blacklist
      .filter(item => item.target_type === '1')
      .map(item => item.target)
      .filter(value => typeof value === 'string') as string[];

    // Info: (20240301 - Liz) 從 contracts table 中取得黑名單合約的 chain_id
    const contractsData = await prisma.contracts.findMany({
      where: {
        contract_address: {
          in: contractTargets,
        },
      },
      select: {
        contract_address: true,
        chain_id: true,
        created_timestamp: true,
      },
    });

    // Info: (20240301 - Liz) 從 addresses table 中取得黑名單地址的 chain_id
    const addressesData = await prisma.addresses.findMany({
      where: {
        address: {
          in: addressTargets,
        },
      },
      select: {
        address: true,
        chain_id: true,
        latest_active_time: true,
      },
    });

    // Info: (20240301 - Liz) 將取得的 contractsData 轉換成物件，方便查找
    const contractChainId: {[address: string]: string} = {};
    contractsData.forEach(contractData => {
      if (contractData.contract_address) {
        contractChainId[contractData.contract_address] = `${contractData.chain_id}`;
      }
    });
    const contractCreatedTimestamp: {[address: string]: number} = {};
    contractsData.forEach(contractData => {
      if (contractData.contract_address) {
        contractCreatedTimestamp[contractData.contract_address] =
          contractData.created_timestamp ?? 0;
      }
    });

    // Info: (20240301 - Liz) 將取得的 addressesData 轉換成物件，方便查找
    const addressChainId: {[address: string]: string} = {};
    addressesData.forEach(addressData => {
      if (addressData.address) {
        addressChainId[addressData.address] = `${addressData.chain_id}`;
      }
    });
    const addressLatestActiveTime: {[address: string]: number} = {};
    addressesData.forEach(addressData => {
      if (addressData.address) {
        addressLatestActiveTime[addressData.address] = addressData.latest_active_time ?? 0;
      }
    });

    // Info: (20240304 - Liz) 從 codes Table 撈出 target_type 的 value 和 meaning 的對照表為一個物件陣列
    const targetTypesCodes = await prisma.codes.findMany({
      where: {
        table_name: 'public_tags',
        table_column: 'target_type',
      },
      select: {
        value: true,
        meaning: true,
      },
    });

    // Info: (20240304 - Liz) 遍歷物件陣列 轉換成物件
    const targetTypesCodesObj: {
      [key: string]: string;
    } = {};
    targetTypesCodes.forEach(item => {
      if (item.value !== null) {
        targetTypesCodesObj[item.value] = item.meaning as string;
      }
    });

    // Info: (20240216 - Liz) 將取得的資料轉換成 API 要的格式
    const blacklistData = blacklist
      .filter(item => item.target !== null && item.target !== undefined) // Info: (20240301 - Liz) 過濾掉 item.target 為 null 或 undefined 的資料
      .map(item => {
        const target = item.target as string;
        let chainId = '';
        let latestActiveTime = 0;

        switch (item.target_type) {
          case '0':
            chainId = contractChainId[target] ?? 'Unknown Chain ID';
            latestActiveTime = contractCreatedTimestamp[target] ?? 0;
            break;
          case '1':
            chainId = addressChainId[target] ?? 'Unknown Chain ID';
            latestActiveTime = addressLatestActiveTime[target] ?? 0;
            break;
        }

        const targetType = item.target_type
          ? targetTypesCodesObj[item.target_type]
          : 'Unknown Target Type';

        return {
          id: `${item.id}`,
          chainId,
          createdTimestamp: item.created_timestamp ?? 0,
          address: target,
          tagName: item.name ?? '',
          targetType,
          latestActiveTime,
        };
      });

    const result: ResponseData = blacklistData;

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data:', error);
    res.status(500).json([]);
  }
}
