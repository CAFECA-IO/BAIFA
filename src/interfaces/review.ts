//import {dummyAddressData} from './address';

export interface IReviewDetail {
  id: string;
  transactionId: string;
  chainId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
}

export interface IReviews {
  id: string;
  address: string;
  score: number;
  reviewData: IReviewDetail[];
}

export const dummyReview: IReviewDetail[] = [
  {
    id: 'T93130200001',
    transactionId: '931302',
    chainId: 'eth',
    createdTimestamp: 1689352795,
    authorAddressId: '324801',
    content: 'This is a review',
    stars: 3,
  },
];
