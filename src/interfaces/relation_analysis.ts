export interface IRelationAnalysis {
  connectingLevel: string;
  directTransactionCount: number;
  directUnit: string;
  totalDirectTransactionsVolume: number;
  minimumConnectingLayer: number;
  transactionWithinThreeLayers: number;
  transactionWithinTenLayers: number;
  transactionOverTenLayers: number;
  commonAddressCount: number;
  commonContractCount: number;
  patternSimilarityLevel: string;
}
