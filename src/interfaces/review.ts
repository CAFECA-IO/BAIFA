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
  totalPages: number;
}
