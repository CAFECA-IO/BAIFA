export interface IAddress {
  id: number;
  addressId: string;
  signUpTime: number;
  lastestActiveTime: number;
  relatedAddressIds: string[];
  interactedWith: string[]; // addresses & contacts
}
