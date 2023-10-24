import {dummyAddressData} from './address';

export interface IReview {
  id: string;
  transactionId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
}

export const dummyReview: IReview[] = [
  {
    id: 'T93130200001',
    transactionId: '931302',
    createdTimestamp: 1689352795,
    authorAddressId: '324801',
    content: 'This is a review',
    stars: 3,
  },
];

export const getDummyReviewData = (addressId: string): IReview[] => {
  const transactionList = dummyAddressData.find(address => address.id === addressId)
    ?.transactionIds ?? ['None'];

  const reviews: IReview[] = transactionList.map((id, i) => {
    const createdTimestamp = Date.now() - (Math.random() * 10 + i * 1000);
    const authorAddressId =
      Math.random() > 0.2
        ? '324801'
        : Math.random() > 0.4
        ? '302841'
        : Math.random() > 0.6
        ? '392709'
        : '399283';
    const stars = Math.floor(Math.random() * 5) + 1;

    return {
      id: `T${id}00001`,
      transactionId: id,
      createdTimestamp: createdTimestamp,
      authorAddressId: authorAddressId,
      content:
        'This is a review. eget volutpat volutpat malesuada In lobortis, viverra sed maximus elit vitae lorem. ultrices consectetur odio urna.',
      stars: stars,
    };
  });

  return reviews;
};
