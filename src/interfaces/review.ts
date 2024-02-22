export interface IReviewDetail {
  id: string;
  chainId: string;
  createdTimestamp: number;
  authorAddress: string;
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
    chainId: 'eth',
    createdTimestamp: 1689352795,
    authorAddress: '324801',
    content: 'This is a review',
    stars: 3,
  },
  {
    id: 'T93130200002',
    chainId: 'eth',
    createdTimestamp: 1689352795,
    authorAddress: '3248012',
    content: 'This is a review',
    stars: 5,
  },
];
