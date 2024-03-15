export enum AddressType {
  ADDRESS = 'address',
  CONTRACT = 'contract',
}

export type IAddressInfo = {
  type: AddressType.ADDRESS | AddressType.CONTRACT;
  address: string;
};
