import {dummyAddressData} from './address';

export interface IReview {
  id: string;
  transactionId: string;
  chainId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
}

export const dummyReview: IReview[] = [
  {
    id: 'T93130200001',
    transactionId: '931302',
    chainId: '398251',
    createdTimestamp: 1689352795,
    authorAddressId: '324801',
    content: 'This is a review',
    stars: 3,
  },
];

export const getDummyReviewData = (addressId: string): IReview[] => {
  const transactionList =
    dummyAddressData.find(address => address.id === addressId)?.transactionIds ?? [];
  const doubleTransactionList = transactionList.concat(transactionList);
  const chainId = dummyAddressData.find(address => address.id === addressId)?.chainId ?? '398251';

  const today =
    new Date(
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`
    ).getTime() / 1000;

  const reviews = doubleTransactionList.map((id, i) => {
    const createdTimestamp = today - i * 86400;
    const authorAddressId =
      i % 3 === 0 ? '324801' : i % 3 === 1 ? '302841' : i % 3 === 2 ? '372840' : '392709';
    const stars = i % 5 === 0 ? 3 : i % 5 === 1 ? 5 : i % 5 === 2 ? 1 : i % 5 === 3 ? 2 : 4;

    return {
      id: `R${id}00001`,
      transactionId: id,
      chainId: chainId,
      createdTimestamp: createdTimestamp,
      authorAddressId: authorAddressId,
      content:
        'This is a review. eget volutpat volutpat malesuada In lobortis, viverra sed maximus elit vitae lorem. ultrices consectetur odio urna. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      stars: stars,
    };
  });

  return reviews;
};
