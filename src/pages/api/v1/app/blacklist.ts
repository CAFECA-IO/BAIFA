// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {IBlackListData} from '../../../../interfaces/blacklist';
import prisma from '../../../../../prisma/client';
import {ITEM_PER_PAGE} from '../../../../constants/config';

type ResponseData = IBlackListData | string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240305 - Liz) query string
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  // Info: (20240305 - Liz) 計算分頁的 skip 與 take
  const skip = page ? (page - 1) * 10 : undefined; // (今天 - Liz) 跳過前面幾筆
  const take = 10; // (今天 - Liz) 取幾筆

  // Info: (20240305 - Liz) 排序
  const sorting = sort === 'SORTING.OLDEST' ? 'asc' : 'desc';

  try {
    // Info: (20240216 - Liz) 從 public_tags table 中取得 tag_type = 9 (黑名單標籤) 的資料為 blacklist，並做條件篩選以及分頁
    const blacklist = await prisma.public_tags.findMany({
      where: {
        tag_type: '9', // Info: (20240216 - Liz) 9:黑名單標籤
        target: search ? {contains: search} : undefined, // Info: (20240305 - Liz) 搜尋條件
      },
      select: {
        id: true,
        name: true, // Info: (20240216 - Liz) 標籤名稱
        target: true, // Info: (20240216 - Liz) 是個地址
        target_type: true, // Info: (20240216 - Liz)  0:contract / 1:address
        created_timestamp: true, // Info: (20240216 - Liz) 標籤建立時間
      },
      orderBy: [
        {
          created_timestamp: 'desc', // Info: (20240305 - Liz) 1. created_timestamp 由新到舊排序
        },
        {
          id: 'asc', // Info: (20240305 - Liz) 2. id 由小到大排序
        },
      ],
      // Info: (20240305 - Liz) 分頁
      skip,
      take,
    });

    // Info: (20240305 - Liz) 取得所有的 tagName 並去除重複
    const uniqueTagNames = await prisma.public_tags.findMany({
      where: {
        tag_type: '9',
      },
      select: {
        name: true,
      },
      distinct: ['name'],
    });

    // Deprecated: (今天 - Liz)
    // eslint-disable-next-line no-console
    console.log('uniqueTagNames: ', uniqueTagNames);

    // Info: (20240305 - Liz) 用不重複的 tag name 做成下拉式選單的選項
    const tagNameOptions = uniqueTagNames.map(tag => tag.name);

    // ToDo: (今天 - Liz) 依照 tag name 篩選資料

    // Info: (20240305 - Liz) 取得 blacklist 總筆數
    const totalBlacklistAmount = await prisma.public_tags.count({
      where: {
        tag_type: '9', // Info: (20240216 - Liz) 9:黑名單標籤
        target: search ? {contains: search} : undefined, // Info: (20240305 - Liz) 搜尋條件
      },
    });

    // Info: (20240216 - Liz) 若查無黑名單資料，回傳 404
    if (blacklist.length === 0) {
      res.status(404).send('404 - redFlagData Not Found');
      return;
    }

    // Info: (20240301 - Liz) 從 blacklist 中 target_type 為 0 的 target 值(target 值為地址)
    const contractTargets = blacklist
      .filter(item => item.target_type === '0')
      .map(item => item.target)
      .filter(value => typeof value === 'string') as string[];

    // Info: (20240301 - Liz) 從 blacklist 中 target_type 為 1 的 target 值(target 值為地址)
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
        created_timestamp: true, // ToDo: (20240305 - Liz) 等資料庫修改後就要改成拿"最後更新時間"
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

    // Info: (20240216 - Liz) 將取得的 blacklist 資料轉換成 API 要的格式，並且依照 sorting 排序
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
      })
      .sort((a, b) => {
        if (sorting === 'asc') {
          return a.latestActiveTime - b.latestActiveTime;
        }
        return b.latestActiveTime - a.latestActiveTime;
      });

    // Info: (20240305 - Liz) 計算總頁數
    const totalPages = Math.ceil(totalBlacklistAmount / ITEM_PER_PAGE);

    const result = {
      blacklist: blacklistData,
      totalPages,
      // tagNameOptions,
      // ToDo: (今天 - Liz) 從 blacklist 中取得所有的 tagName，做成選項給下拉式選單使用
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data:', error);
    res.status(500).json({} as ResponseData);
  }
}
