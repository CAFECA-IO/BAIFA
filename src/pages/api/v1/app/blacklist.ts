// 020 - GET /app/blacklist

import type {NextApiRequest, NextApiResponse} from 'next';
import {DEFAULT_PAGE, ITEM_PER_PAGE, PUBLIC_TAGS_REFERENCE} from '@/constants/config';
import {IBlackListData} from '@/interfaces/blacklist';
import prisma from '@/lib/utils/prisma';

type ResponseData = IBlackListData;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Info: (20240305 - Liz) query string parameter
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
  const offset =
    typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : ITEM_PER_PAGE;
  const sort = (req.query.sort as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const search =
    typeof req.query.search === 'string' ? req.query.search.toLowerCase().trim() : undefined;
  const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;

  // Info: (20240305 - Liz) 計算分頁的 skip 與 take
  const skip = page > 0 ? (page - 1) * offset : 0; // Info: (20240319 - Liz) 跳過前面幾筆
  const take = offset; // Info: (20240319 - Liz) 取幾筆

  // Info: (20240306 - Liz) tag name 篩選，如果是空字串就搜尋全部
  const tagName = tag === '' ? undefined : tag;

  try {
    // Info: (20240216 - Liz) 從 public_tags table 中取得 tag_type = 9 (黑名單標籤) 的資料為 blacklist，並做條件篩選以及分頁
    const blacklist = await prisma.public_tags.findMany({
      where: {
        tag_type: PUBLIC_TAGS_REFERENCE.TAG_TYPE.BLACKLIST, // Info: (20240216 - Liz) 9:黑名單標籤
        target: {contains: search}, // Info: (20240305 - Liz) 搜尋條件
        name: tagName, // Info: (20240306 - Liz) 篩選 tag name
      },
      select: {
        id: true,
        name: true, // Info: (20240216 - Liz) 標籤名稱
        target: true, // Info: (20240216 - Liz) 是個地址
        target_type: true, // Info: (20240216 - Liz)  0:contract / 1:address
        created_timestamp: true, // Info: (20240216 - Liz) 標籤建立時間
        chain_id: true,
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

    // Info: (20240305 - Liz) 用不重複的 tag name 做成下拉式選單的選項
    const tagNameOptions = uniqueTagNames.map(tag => tag.name ?? '');

    // Info: (20240305 - Liz) 取得 blacklist 總筆數
    const totalBlacklistAmount = await prisma.public_tags.count({
      where: {
        tag_type: '9', // Info: (20240216 - Liz) 9:黑名單標籤
        target: search ? {contains: search} : undefined, // Info: (20240305 - Liz) 搜尋條件
        name: tagName, // Info: (20240306 - Liz) 篩選 tag name
      },
    });

    // Info: (20240301 - Liz) 從 blacklist 中 target_type 為 0 的 target 值(target 值為地址) 和 chain_id，組成一個物件陣列作為 OR 的篩選條件
    const contractTargets = blacklist
      .filter(item => item.target_type === '0')
      .map(item => ({contract_address: item.target, chain_id: item.chain_id}));

    // Info: (20240301 - Liz) 從 blacklist 中 target_type 為 1 的 target 值(target 值為地址) 和 chain_id，組成一個物件陣列作為 OR 的篩選條件
    const addressTargets = blacklist
      .filter(item => item.target_type === '1')
      .map(item => ({address: item.target, chain_id: item.chain_id}));

    // Info: (20240301 - Liz) 從 contracts table 中取得滿足黑名單合約篩選條件的 chain_id 和 contract_address 和 latest_active_time
    const contractsData = await prisma.contracts.findMany({
      where: {
        OR: contractTargets,
      },
      select: {
        contract_address: true,
        chain_id: true,
        latest_active_time: true,
      },
    });

    // Info: (20240301 - Liz) 從 addresses table 中取得滿足黑名單地址篩選條件的 chain_id 和 address 和 latest_active_time
    const addressesData = await prisma.addresses.findMany({
      where: {
        OR: addressTargets,
      },
      select: {
        address: true,
        chain_id: true,
        latest_active_time: true,
      },
    });

    // Info: (20240301 - Liz) 將取得的 contractsData 物件陣列轉換成物件，方便查找
    const contractChainId: {[address: string]: string} = {};
    contractsData.forEach(contractData => {
      if (contractData.contract_address) {
        contractChainId[contractData.contract_address] = `${contractData.chain_id}`;
      }
    });
    const contractLatestActiveTime: {[address: string]: number} = {};
    contractsData.forEach(contractData => {
      if (contractData.contract_address) {
        contractLatestActiveTime[contractData.contract_address] =
          contractData.latest_active_time ?? 0;
      }
    });

    // Info: (20240301 - Liz) 將取得的 addressesData 物件陣列轉換成物件，方便查找
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

    // Info: (20240216 - Liz) 將取得的 blacklist 資料轉換成 API 要的格式，並且依照 sort 排序
    const blacklistData = blacklist
      .filter(item => item.target !== null && item.target !== undefined) // Info: (20240301 - Liz) 過濾掉 item.target 為 null 或 undefined 的資料
      .map(item => {
        const target = item.target as string;
        let chainId = '';
        let latestActiveTime = 0;

        switch (item.target_type) {
          case '0':
            chainId = contractChainId[target] ?? 'Unknown Chain ID';
            latestActiveTime = contractLatestActiveTime[target] ?? 0;
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
        if (sort === 'asc') {
          return a.latestActiveTime - b.latestActiveTime;
        }
        return b.latestActiveTime - a.latestActiveTime;
      });

    // Info: (20240305 - Liz) 計算總頁數
    const totalPages = Math.ceil(totalBlacklistAmount / offset);

    const result = {
      blacklist: blacklistData,
      totalPages,
      tagNameOptions, // Info: (20240306 - Liz) 下拉式選單選項
    };

    prisma.$connect();
    res.status(200).json(result);
  } catch (error) {
    // Info: (20240216 - Shirley) Request error
    // eslint-disable-next-line no-console
    console.error('Error fetching blacklist data (020):', error);
    res.status(500).json({} as ResponseData);
  }
}
