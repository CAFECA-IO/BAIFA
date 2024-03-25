import {z} from 'zod';

const FiatCurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    USD: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

const CryptocurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    BTC: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    ETH: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USDT: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

const CurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    BTC: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    ETH: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USDT: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USD: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

export const BalanceSheetsNeoSchema = z.object({
  reportID: z.string(),
  reportName: z.string(),
  reportStartTime: z.number(),
  reportEndTime: z.number(),
  reportType: z.string(),
  totalAssetsFairValue: z.string(),
  totalLiabilitiesAndEquityFairValue: z.string(),
  assets: z.object({
    fairValue: z.string(),
    details: z.object({
      cryptocurrency: CryptocurrencyDetailSchema,
      cashAndCashEquivalent: FiatCurrencyDetailSchema,
      accountsReceivable: CryptocurrencyDetailSchema,
    }),
  }),
  nonAssets: z.object({
    fairValue: z.string(),
  }),
  liabilities: z.object({
    fairValue: z.string(),
    details: z.object({
      userDeposit: CurrencyDetailSchema,
      accountsPayable: CurrencyDetailSchema,
    }),
  }),
  equity: z.object({
    fairValue: z.string(),
    details: z.object({
      retainedEarning: CurrencyDetailSchema,
      otherCapitalReserve: CurrencyDetailSchema,
    }),
  }),
});

export type IFiatCurrencyDetail = z.infer<typeof FiatCurrencyDetailSchema>;
export type ICryptocurrencyDetail = z.infer<typeof CryptocurrencyDetailSchema>;
export type ICurrencyDetail = z.infer<typeof CurrencyDetailSchema>;

export type IBalanceSheetsNeo = z.infer<typeof BalanceSheetsNeoSchema>;
export interface IBalanceSheetsResponse {
  currentReport: IBalanceSheetsNeo;
  previousReport: IBalanceSheetsNeo;
}
