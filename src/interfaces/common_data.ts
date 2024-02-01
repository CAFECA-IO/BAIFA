// Info: (20240201 - Julian) 定義共用的 interface
// IBlock | IAddress | IContract | IEvidence | ITransaction | IRedFlags

export interface ICommonData {
  id: string;
  chainId: string;
  createdTimestamp: number;
}
