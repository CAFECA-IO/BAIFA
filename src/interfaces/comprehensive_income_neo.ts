import {z} from 'zod';

// Info: create validation function (20240325 - Shirley)
const BreakdownSchema = z.object({
  USDT: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  ETH: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  BTC: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  USD: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
});

const IncomeAccountingDetailSchema = z.object({
  weightedAverageCost: z.string(),
  breakdown: BreakdownSchema,
});

const DetailsSchema = z.object({
  depositFee: IncomeAccountingDetailSchema,
  withdrawalFee: IncomeAccountingDetailSchema,
  tradingFee: IncomeAccountingDetailSchema,
  // TODO: 討論文件->修改文件->修改 type (20240325 - Shirley)
  // spreadFee: IncomeAccountingDetailSchema,
  // liquidationFee: IncomeAccountingDetailSchema,
  // guaranteedStopLossFee: IncomeAccountingDetailSchema,
});

export const ComprehensiveIncomeNeoSchema = z.object({
  reportType: z.string(),
  reportID: z.string(),
  reportName: z.string(),
  reportStartTime: z.number(),
  reportEndTime: z.number(),
  netProfit: z.string(),

  income: z.object({
    weightedAverageCost: z.string(),
    details: DetailsSchema,
    spreadFee: IncomeAccountingDetailSchema,
    liquidationFee: IncomeAccountingDetailSchema,
    guaranteedStopLossFee: IncomeAccountingDetailSchema,
  }),

  costs: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      technicalProviderFee: IncomeAccountingDetailSchema,
      marketDataProviderFee: z.object({
        weightedAverageCost: z.string(),
      }),
      newCoinListingCost: z.object({
        weightedAverageCost: z.string(),
      }),
    }),
  }),
  operatingExpenses: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      salaries: z.string(),
      rent: z.string(),
      marketing: z.string(),
      rebateExpenses: IncomeAccountingDetailSchema,
    }),
  }),
  financialCosts: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      interestExpense: z.string(),
      fiatToCryptocurrencyConversionLosses: z.string(),
      cryptocurrencyToFiatConversionLosses: z.string(),
      fiatToFiatConversionLosses: z.string(),
      cryptocurrencyForexLosses: IncomeAccountingDetailSchema,
    }),
  }),
  otherGainLosses: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      investmentGains: z.string(),
      forexGains: z.string(),
      cryptocurrencyGains: IncomeAccountingDetailSchema,
    }),
  }),
});

// Info: create relevant types (20240325 - Shirley)

export type IBreakdown = z.infer<typeof BreakdownSchema>;

export type IIncomeAccountingDetail = z.infer<typeof IncomeAccountingDetailSchema>;

export type IComprehensiveIncomeNeo = z.infer<typeof ComprehensiveIncomeNeoSchema>;

export interface IComprehensiveIncomeResponse {
  currentReport: IComprehensiveIncomeNeo;
  previousReport: IComprehensiveIncomeNeo;
  lastYearReport: IComprehensiveIncomeNeo;
}
