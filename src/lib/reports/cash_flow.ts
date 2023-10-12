import {
  IStatementsOfCashFlow,
  INonCashAccountingDetail,
  INonCashConsiderationDetail,
} from '../../interfaces/statements_of_cash_flow';
import {roundToDecimal} from '../common';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';

export const createCashFlowFirstPart = (
  endedDate: string,
  dates: string[],
  dataA: IStatementsOfCashFlow | undefined,
  dataB: IStatementsOfCashFlow | undefined
) => {
  const subThead = ['Statements of Cash Flow - USD ($)', `30 Days Ended ${endedDate},`, '*-*'];
  const thead = ['$ in Thousands', dates[0], dates[1]];
  const defaultTable: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flow from operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C027 Cash deposited by customers', `$ -`, `$ -`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C028 Cash withdrawn by customers', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C029 Purchase of cryptocurrencies', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C030 Disposal of cryptocurrencies', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C031 Cash received from customers as transaction fee', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C032 Cash received from customers for liquidation in CFD trading', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C033 Cash paid to customers as rebates for transaction fees', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C034 Cash paid to suppliers for expenses', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C036 Cash paid to customers for CFD trading profits', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C037 Insurance fund for perpetual contracts', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C038 Cash paid to customers for funding rates in perpetual contract', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C039 Cash paid to customers for profits in perpetual contract', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C040 Cash received from customers for liquidation in perpetual contract',
          `-`,
          `-`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C041 Net cash provided by operating activities', `-`, `-`],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from investing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C042 Net cash provided by investing activities', `-`, `-`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const result: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flow from operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C027 Cash deposited by customers',
          `$ ${roundToDecimal(
            +dataA.operatingActivities.details.cashDepositedByCustomers.weightedAverageCost,
            2
          )}`,
          `$ ${roundToDecimal(
            +dataB.operatingActivities.details.cashDepositedByCustomers.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C028 Cash withdrawn by customers',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashWithdrawnByCustomers.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashWithdrawnByCustomers.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C029 Purchase of cryptocurrencies',
          `${roundToDecimal(
            +dataA.operatingActivities.details.purchaseOfCryptocurrencies.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.purchaseOfCryptocurrencies.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C030 Disposal of cryptocurrencies',
          `${roundToDecimal(
            +dataA.operatingActivities.details.disposalOfCryptocurrencies.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.disposalOfCryptocurrencies.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C031 Cash received from customers as transaction fee',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashReceivedFromCustomersAsTransactionFee
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashReceivedFromCustomersAsTransactionFee
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C032 Cash received from customers for liquidation in CFD trading',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashReceivedFromCustomersForLiquidationInCFDTrading
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashReceivedFromCustomersForLiquidationInCFDTrading
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C033 Cash paid to customers as rebates for transaction fees',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashPaidToCustomersAsRebatesForTransactionFees
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashPaidToCustomersAsRebatesForTransactionFees
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C034 Cash paid to suppliers for expenses',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashPaidToSuppliersForExpenses.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashPaidToSuppliersForExpenses.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C036 Cash paid to customers for CFD trading profits',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashPaidToCustomersForCFDTradingProfits
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashPaidToCustomersForCFDTradingProfits
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C037 Insurance fund for perpetual contracts',
          `${roundToDecimal(
            +dataA.operatingActivities.details.insuranceFundForPerpetualContracts
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.insuranceFundForPerpetualContracts
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C038 Cash paid to customers for funding rates in perpetual contract',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashPaidToCustomersForFundingRatesInPerpetualContract
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashPaidToCustomersForFundingRatesInPerpetualContract
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C039 Cash paid to customers for profits in perpetual contract',
          `${roundToDecimal(
            +dataA.operatingActivities.details.cashPaidToCustomersForPerpetualContractProfits
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details.cashPaidToCustomersForPerpetualContractProfits
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C040 Cash received from customers for liquidation in perpetual contract',
          `${roundToDecimal(
            +dataA.operatingActivities.details
              .cashReceivedFromCustomersForLiquidationInPerpetualContract.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.operatingActivities.details
              .cashReceivedFromCustomersForLiquidationInPerpetualContract.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C041 Net cash provided by operating activities',
          `${roundToDecimal(+dataA.operatingActivities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.operatingActivities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from investing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C042 Net cash provided by investing activities',
          `${roundToDecimal(+dataA.investingActivities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.investingActivities.weightedAverageCost, 2)}`,
        ],
      },
    ],
  };
  return result;
};

export const createCashFlowSecondPart = (
  dataA: IStatementsOfCashFlow | undefined,
  dataB: IStatementsOfCashFlow | undefined
) => {
  const defaultTable: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flows from financing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C043 Proceeds from issuance of common stock', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C044 Long-term debt', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C045 Short-term borrowings', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C046 Payments of dividends', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C047 Treasury Stock', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C048 Net cash used in financing activities', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C049 Net increase in cash, cash equivalents, and restricted cash', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C050 Cash, cash equivalents, and restricted cash, beginning of period',
          `-`,
          `-`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['C051 Cash, cash equivalents, and restricted cash, end of period', `-`, `-`],
      },
      {
        rowType: RowType.title,
        rowData: ['Supplemental schedule of non-cash operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C001 Cryptocurrencies deposited by customers', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C009 Cryptocurrencies withdrawn by customers', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C015 Cryptocurrency inflows', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C016 Cryptocurrency outflows', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C004 Cryptocurrencies received from customers as transaction fees', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C017 Cryptocurrencies received from customers for liquidation in CFD trading',
          `-`,
          `-`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C018 Cryptocurrencies paid to customers as rebates for transaction fees',
          `-`,
          `-`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C012 Cryptocurrencies paid to suppliers for expenses', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C026 Cryptocurrencies paid to customers for CFD trading profits', `-`, `-`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const result: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flows from financing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C043 Proceeds from issuance of common stock',
          `${roundToDecimal(
            +dataA.financingActivities.details.proceedsFromIssuanceOfCommonStock
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financingActivities.details.proceedsFromIssuanceOfCommonStock
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C044 Long-term debt',
          `${roundToDecimal(
            +dataA.financingActivities.details.longTermDebt.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financingActivities.details.longTermDebt.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C045 Short-term borrowings',
          `${roundToDecimal(
            +dataA.financingActivities.details.shortTermBorrowings.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financingActivities.details.shortTermBorrowings.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C046 Payments of dividends',
          `${roundToDecimal(
            +dataA.financingActivities.details.paymentsOfDividends.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financingActivities.details.paymentsOfDividends.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C047 Treasury Stock',
          `${roundToDecimal(
            +dataA.financingActivities.details.treasuryStock.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.financingActivities.details.treasuryStock.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C048 Net cash used in financing activities',
          `${roundToDecimal(+dataA.financingActivities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.financingActivities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C049 Net increase in cash, cash equivalents, and restricted cash',
          `${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash
              .netIncreaseDecreaseInCryptocurrencies.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash
              .netIncreaseDecreaseInCryptocurrencies.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C050 Cash, cash equivalents, and restricted cash, beginning of period',
          `${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash
              .cryptocurrenciesBeginningOfPeriod.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash
              .cryptocurrenciesBeginningOfPeriod.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'C051 Cash, cash equivalents, and restricted cash, end of period',
          `$ ${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
              .weightedAverageCost,
            2
          )}`,
          `$ ${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Supplemental schedule of non-cash operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C001 Cryptocurrencies deposited by customers',
          `$ ${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesDepositedByCustomers.weightedAverageCost,
            2
          )}`,
          `$ ${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesDepositedByCustomers.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C009 Cryptocurrencies withdrawn by customers',
          `(${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesWithdrawnByCustomers.weightedAverageCost,
            2
          )})`,
          `(${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesWithdrawnByCustomers.weightedAverageCost,
            2
          )})`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C015 Cryptocurrency inflows',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C016 Cryptocurrency outflows',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows
              .weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C004 Cryptocurrencies received from customers as transaction fees',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C017 Cryptocurrencies received from customers for liquidation in CFD trading',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C018 Cryptocurrencies paid to customers as rebates for transaction fees',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersAsRebatesForTransactionFees.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersAsRebatesForTransactionFees.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C012 Cryptocurrencies paid to suppliers for expenses',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToSuppliersForExpenses.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToSuppliersForExpenses.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C026 Cryptocurrencies paid to customers for CFD trading profits',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersForCFDTradingProfits.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersForCFDTradingProfits.weightedAverageCost,
            2
          )}`,
        ],
      },
    ],
  };
  return result;
};

export const createCashFlowLastPart = (
  dataA: IStatementsOfCashFlow | undefined,
  dataB: IStatementsOfCashFlow | undefined
) => {
  const defaultTable: ITable = {
    tbody: [
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C022 Cryptocurrencies paid to customers for profits in perpetual contract',
          `-`,
          `-`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C023 Purchase of cryptocurrencies with non-cash consideration', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C024 Disposal of cryptocurrencies for non-cash consideration', `-`, `-`],
      },
      {
        rowType: RowType.foot,
        rowData: ['C007 Net increase in non-cash operating activities', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C025 Cryptocurrencies, beginning of period', `-`, `-`],
      },
      {
        rowType: RowType.foot,
        rowData: ['C008 Cryptocurrencies, end of period', `$ -`, `$ -`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const result: ITable = {
    tbody: [
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C022 Cryptocurrencies paid to customers for profits in perpetual contract',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersForProfitsInPerpetualContract.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .cryptocurrenciesPaidToCustomersForProfitsInPerpetualContract.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C023 Purchase of cryptocurrencies with non-cash consideration',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C024 Disposal of cryptocurrencies for non-cash consideration',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.details
              .disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.details
              .disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'C007 Net increase in non-cash operating activities',
          `${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C025 Cryptocurrencies, beginning of period',
          `${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash
              .cryptocurrenciesBeginningOfPeriod.weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash
              .cryptocurrenciesBeginningOfPeriod.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'C008 Cryptocurrencies, end of period',
          `${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
              .weightedAverageCost,
            2
          )}`,
          `${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod
              .weightedAverageCost,
            2
          )}`,
        ],
      },
    ],
  };
  return result;
};

export const createHistoricalCashFlowTable = (
  endedDate: string,
  dates: string[],
  dataA: IStatementsOfCashFlow | undefined,
  dataB: IStatementsOfCashFlow | undefined
) => {
  const subThead = ['', `30 Days Ended ${endedDate},`, '*-*'];
  const thead = ['*|*', dates[0], dates[1]];
  const defaultTable: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C041 Net cash provided by operating activities', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C042 Net cash used in investing activities', `-`, `-`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C048 Net cash used in financing activities', `-`, `-`],
      },
      {
        rowType: RowType.foot,
        rowData: ['C049 Net increase in cash, cash equivalents, and restricted cash', `$ —`, `$ —`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['C007 Net increase in non-cash operating activities', `$ —`, `$ —`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const result: ITable = {
    subThead,
    thead,
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C041 Net cash provided by operating activities',
          `$ ${roundToDecimal(+dataA.operatingActivities.weightedAverageCost, 2)}`,
          `$ ${roundToDecimal(+dataB.operatingActivities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C042 Net cash used in investing activities',
          `${roundToDecimal(+dataA.investingActivities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.investingActivities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C048 Net cash used in financing activities',
          `${roundToDecimal(+dataA.financingActivities.weightedAverageCost, 2)}`,
          `${roundToDecimal(+dataB.financingActivities.weightedAverageCost, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'C049 Net increase in cash, cash equivalents, and restricted cash',
          `$ ${roundToDecimal(
            +dataA.otherSupplementaryItems.details.relatedToNonCash
              .netIncreaseDecreaseInCryptocurrencies.weightedAverageCost,
            2
          )}`,
          `$ ${roundToDecimal(
            +dataB.otherSupplementaryItems.details.relatedToNonCash
              .netIncreaseDecreaseInCryptocurrencies.weightedAverageCost,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'C007 Net increase in non-cash operating activities',
          `$ ${roundToDecimal(
            +dataA.supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost,
            2
          )}`,
          `$ ${roundToDecimal(
            +dataB.supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost,
            2
          )}`,
        ],
      },
    ],
  };
  return result;
};

export const createActivitiesAnalysis = (
  title: string,
  dates: string[],
  dataA: INonCashAccountingDetail | undefined,
  dataB: INonCashAccountingDetail | undefined,
  numero: string[]
) => {
  const thead = [`${numero[0]} ${title}`, dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];
  const defaultTable: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '(Cost Value in thousands)',
          'Amount',
          'Cost Value',
          'Percentage of Total',
          'Amount',
          'Cost Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Bitcoin ${numero[1]}`, `—`, `$ —`, `—`, `—`, `$ —`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Ethereum ${numero[2]}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`USDT ${numero[3]}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: [`Total ${title}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  const btcA = dataA.breakdown.BTC;
  const btcB = dataB.breakdown.BTC;
  const ethA = dataA.breakdown.ETH;
  const ethB = dataB.breakdown.ETH;
  const usdtA = dataA.breakdown.USDT;
  const usdtB = dataB.breakdown.USDT;

  const totalCostA = +dataA.weightedAverageCost;
  const totalCostB = +dataB.weightedAverageCost;

  const btcPerA = (+btcA.weightedAverageCost / totalCostA) * 100;
  const btcPerB = (+btcB.weightedAverageCost / totalCostB) * 100;
  const ethPerA = (+ethA.weightedAverageCost / totalCostA) * 100;
  const ethPerB = (+ethB.weightedAverageCost / totalCostB) * 100;
  const usdtPerA = (+usdtA.weightedAverageCost / totalCostA) * 100;
  const usdtPerB = (+usdtB.weightedAverageCost / totalCostB) * 100;
  const totalPerA = btcPerA + ethPerA + usdtPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB;

  const result: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '(Cost Value in thousands)',
          'Amount',
          'Cost Value',
          'Percentage of Total',
          'Amount',
          'Cost Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Bitcoin ${numero[1]}`,
          `${roundToDecimal(+btcA.amount, 2)}`,
          `$ ${roundToDecimal(+btcA.weightedAverageCost, 2)}`,
          `${roundToDecimal(btcPerA, 1)} %`,
          `${roundToDecimal(+btcB.amount, 2)}`,
          `$ ${roundToDecimal(+btcB.weightedAverageCost, 2)}`,
          `${roundToDecimal(btcPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Ethereum ${numero[2]}`,
          `${roundToDecimal(+ethA.amount, 2)}`,
          `${roundToDecimal(+ethA.weightedAverageCost, 2)}`,
          `${roundToDecimal(ethPerA, 1)} %`,
          `${roundToDecimal(+ethB.amount, 2)}`,
          `${roundToDecimal(+ethB.weightedAverageCost, 2)}`,
          `${roundToDecimal(ethPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `USDT ${numero[3]}`,
          `${roundToDecimal(+usdtA.amount, 2)}`,
          `${roundToDecimal(+usdtA.weightedAverageCost, 2)}`,
          `${roundToDecimal(usdtPerA, 1)} %`,
          `${roundToDecimal(+usdtB.amount, 2)}`,
          `${roundToDecimal(+usdtB.weightedAverageCost, 2)}`,
          `${roundToDecimal(usdtPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `Total ${title}`,
          `—`,
          `${roundToDecimal(totalCostA, 2)}`,
          `${roundToDecimal(totalPerA, 1)} %`,
          `—`,
          `${roundToDecimal(totalCostB, 2)}`,
          `${roundToDecimal(totalPerB, 1)} %`,
        ],
      },
    ],
  };
  return result;
};

const getCurrenciesData = (data: INonCashConsiderationDetail, currency: string) => {
  if (data.type === 'STABLECOIN_TO_CRYPTO') {
    // Info: (20230922 - Julian) STABLECOIN_TO_CRYPTO: purchase of cryptocurrencies with non-cash consideration
    // Info: (20230922 - Julian) 找出買入(to)的資料
    const toData = data.details.filter(item => item.to.name === currency);
    return {
      // Info: (20230922 - Julian) 將 amount 加總
      amount: toData.reduce((acc, cur) => acc + +cur.to.amount, 0) ?? 0,
      // Info: (20230922 - Julian) 將所花費的(from) USDT 加總
      costValue: toData.reduce((acc, cur) => acc + +cur.from.weightedAverageCost, 0) ?? 0,
    };
  } else {
    // Info: (20230922 - Julian) CRYPTO_TO_STABLECOIN: disposal of cryptocurrencies for non-cash consideration
    // Info: (20230922 - Julian) 找出賣出(from)的資料
    const fromData = data.details.filter(item => item.from.name === currency);
    return {
      // Info: (20230922 - Julian) 將 amount 加總
      amount: fromData.reduce((acc, cur) => acc + +cur.from.amount, 0) ?? 0,
      // Info: (20230922 - Julian) 將得到的(to) USDT 加總
      costValue: fromData.reduce((acc, cur) => acc + +cur.to.weightedAverageCost, 0) ?? 0,
    };
  }
};

export const createNonCashConsideration = (
  title: string,
  dates: string[],
  dataA: INonCashConsiderationDetail | undefined,
  dataB: INonCashConsiderationDetail | undefined,
  numero: string[]
) => {
  const thead = [`${numero[0]} ${title}`, dates[0], '*-*', '*-*', dates[1], '*-*', '*-*'];
  const defaultTable: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '(Cost Value in thousands)',
          'Amount',
          'Cost Value',
          'Percentage of Total',
          'Amount',
          'Cost Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Bitcoin ${numero[1]}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`Ethereum ${numero[2]}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [`USDT ${numero[3]}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
      {
        rowType: RowType.foot,
        rowData: [`Total ${title}`, `—`, `—`, `—`, `—`, `—`, `—`],
      },
    ],
  };
  if (!dataA || !dataB) return defaultTable;

  if (dataA.type === 'STABLECOIN_TO_CRYPTO' && dataB.type === 'STABLECOIN_TO_CRYPTO') {
  }

  // Info: (20230922 - Julian) -------- BTC --------
  const btcDataA = getCurrenciesData(dataA, 'BTC');
  const btcDataB = getCurrenciesData(dataB, 'BTC');

  // Info: (20230922 - Julian) -------- ETH --------
  const ethDataA = getCurrenciesData(dataA, 'ETH');
  const ethDataB = getCurrenciesData(dataB, 'ETH');

  // Info: (20230922 - Julian) -------- USDT --------
  const usdtDataA = getCurrenciesData(dataA, 'USDT');
  const usdtDataB = getCurrenciesData(dataB, 'USDT');

  // Info: (20230922 - Julian) -------- Total --------
  const totalDataA = +dataA.weightedAverageCost;
  const totalDataB = +dataB.weightedAverageCost;

  // Info: (20230922 - Julian) -------- Percentage --------
  const btcPerA = (btcDataA.costValue / totalDataA) * 100;
  const btcPerB = (btcDataB.costValue / totalDataB) * 100;

  const ethPerA = (ethDataA.costValue / totalDataA) * 100;
  const ethPerB = (ethDataB.costValue / totalDataB) * 100;

  const usdtPerA = (usdtDataA.costValue / totalDataA) * 100;
  const usdtPerB = (usdtDataB.costValue / totalDataB) * 100;

  const totalPerA = btcPerA + ethPerA + usdtPerA;
  const totalPerB = btcPerB + ethPerB + usdtPerB;

  const result: ITable = {
    thead,
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          '(Cost Value in thousands)',
          'Amount',
          'Cost Value',
          'Percentage of Total',
          'Amount',
          'Cost Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Bitcoin ${numero[1]}`,
          `${roundToDecimal(btcDataA.amount, 2)}`,
          `$ ${roundToDecimal(btcDataA.costValue, 2)}`,
          `${roundToDecimal(btcPerA, 1)} %`,
          `${roundToDecimal(btcDataB.amount, 2)}`,
          `$ ${roundToDecimal(btcDataB.costValue, 2)}`,
          `${roundToDecimal(btcPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Ethereum ${numero[2]}`,
          `${roundToDecimal(ethDataA.amount, 2)}`,
          `${roundToDecimal(ethDataA.costValue, 2)}`,
          `${roundToDecimal(ethPerA, 1)} %`,
          `${roundToDecimal(ethDataB.amount, 2)}`,
          `${roundToDecimal(ethDataB.costValue, 2)}`,
          `${roundToDecimal(ethPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `USDT ${numero[3]}`,
          `${roundToDecimal(usdtDataA.amount, 2)}`,
          `${roundToDecimal(usdtDataA.costValue, 2)}`,
          `${roundToDecimal(usdtPerA, 1)} %`,
          `${roundToDecimal(usdtDataB.amount, 2)}`,
          `${roundToDecimal(usdtDataB.costValue, 2)}`,
          `${roundToDecimal(usdtPerB, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `Total ${title}`,
          `—`,
          `$ ${roundToDecimal(totalDataA, 2)}`,
          `${roundToDecimal(totalPerA, 1)} %`,
          `—`,
          `$ ${roundToDecimal(totalDataB, 2)}`,
          `${roundToDecimal(totalPerB, 1)} %`,
        ],
      },
    ],
  };
  return result;
};
