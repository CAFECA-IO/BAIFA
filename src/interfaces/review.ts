export interface IReview {
  id: string;
  transactionId: string;
  createdTimestamp: number;
  authorAddressId: string;
  content: string;
  stars: number;
}
