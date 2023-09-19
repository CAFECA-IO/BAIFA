import {useEffect, useState} from 'react';
import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTable from '../../components/report_table/report_table';
import ReportExchageRateForm from '../../components/report_exchage_rate_form/report_exchage_rate_form';
import {ITable} from '../../interfaces/report_table';
import {IResult} from '../../interfaces/result';
import {
  IStatementsOfCashFlows,
  INonCashAccountingDetail,
} from '../../interfaces/statements_of_cash_flows';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {timestampToString, roundToDecimal, getReportTimeSpan} from '../../lib/common';
import {APIURL} from '../../constants/api_request';

const StatementsOfCashFlows = () => {
  const reportTitle = BaifaReports.STATEMENTS_OF_CASH_FLOWS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];

  // Info: (20230913 - Julian) Get timespan of report
  const startDateStr = timestampToString(getReportTimeSpan().start);
  const endDateStr = timestampToString(getReportTimeSpan().end);

  const [startCashFlowsData, setStartCashFlowsData] = useState<IStatementsOfCashFlows>();
  const [endCashFlowsData, setEndCashFlowsData] = useState<IStatementsOfCashFlows>();
  const [historicalCashFlowsData, setHistoricalCashFlowsData] = useState<IStatementsOfCashFlows>();

  const getStatementsOfCashFlows = async (date: string) => {
    let reportData;
    try {
      const response = await fetch(`${APIURL.STATEMENTS_OF_CASH_FLOWS}?date=${date}`, {
        method: 'GET',
      });
      const result: IResult = await response.json();
      if (result.success) {
        reportData = result.data as IStatementsOfCashFlows;
      }
    } catch (error) {
      // console.log('Get statements of cash flows error');
    }
    return reportData;
  };

  useEffect(() => {
    getStatementsOfCashFlows(startDateStr.date).then(data => setStartCashFlowsData(data));
    getStatementsOfCashFlows(endDateStr.date).then(data => setEndCashFlowsData(data));
    getStatementsOfCashFlows(endDateStr.dateOfLastYear).then(data =>
      setHistoricalCashFlowsData(data)
    );
  }, []);

  const getCashFlows = (data: IStatementsOfCashFlows | undefined) => {
    if (!data)
      return {
        cashDepositedByCustomers: 0,
        cashWithdrawnByCustomers: 0,
        purchaseOfCryptocurrencies: 0,
        disposalOfCryptocurrencies: 0,
        cashReceivedFromCustomersAsTransactionFee: 0,
        cashReceivedFromCustomersForLiquidationInCFDTrading: 0,
        cashPaidToCustomersAsRebatesForTransactionFees: 0,
        cashPaidToSuppliersForExpenses: 0,
        cashPaidToCustomersForCFDTradingProfits: 0,
        netCashProvidedByOperatingActivities: 0,
        netCashProvidedByInvestingActivities: 0,
        netCashProvidedByFinancingActivities: 0,
        netIncreaseDecreaseInCryptocurrencies: 0,
        cashCashEquivalentsAndRestrictedCashBeginningOfPeriod: 0,
        cashCashEquivalentsAndRestrictedCashEndOfPeriod: 0,
        cryptocurrenciesDepositedByCustomers: 0,
        cryptocurrenciesWithdrawnByCustomers: 0,
        cryptocurrencyInflows: 0,
        cryptocurrencyOutflows: 0,
        cryptocurrenciesReceivedFromCustomersAsTransactionFees: 0,
        cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading: 0,
        cryptocurrenciesPaidToCustomersForCFDTradingProfits: 0,
        purchaseOfCryptocurrenciesWithNonCashConsideration: 0,
        disposalOfCryptocurrenciesForNonCashConsideration: 0,
        netIncreaseInNonCashOperatingActivities: 0,
        cryptocurrenciesBeginningOfPeriod: 0,
        cryptocurrenciesEndOfPeriod: 0,
      };

    // Info: (20230918 - Julian) Cash flows from operating activities
    const cashDepositedByCustomers =
      +data?.operatingActivities.cashDepositedByCustomers.weightedAverageCost ?? 0;
    const cashWithdrawnByCustomers =
      +data?.operatingActivities.cashWithdrawnByCustomers.weightedAverageCost ?? 0;
    const purchaseOfCryptocurrencies =
      +data?.operatingActivities.purchaseOfCryptocurrencies.weightedAverageCost ?? 0;
    const disposalOfCryptocurrencies =
      +data?.operatingActivities.disposalOfCryptocurrencies.weightedAverageCost ?? 0;
    const cashReceivedFromCustomersAsTransactionFee =
      +data?.operatingActivities.cashReceivedFromCustomersAsTransactionFee.weightedAverageCost ?? 0;
    const cashReceivedFromCustomersForLiquidationInCFDTrading =
      +data?.operatingActivities.cashReceivedFromCustomersForLiquidationInCFDTrading
        .weightedAverageCost ?? 0;
    const cashPaidToCustomersAsRebatesForTransactionFees =
      +data?.operatingActivities.cashPaidToCustomersAsRebatesForTransactionFees
        .weightedAverageCost ?? 0;
    const cashPaidToSuppliersForExpenses =
      +data?.operatingActivities.cashPaidToSuppliersForExpenses.weightedAverageCost ?? 0;
    const cashPaidToCustomersForCFDTradingProfits =
      +data?.operatingActivities.cashPaidToCustomersForCFDTradingProfits.weightedAverageCost ?? 0;
    const netCashProvidedByOperatingActivities =
      cashDepositedByCustomers +
      cashWithdrawnByCustomers +
      purchaseOfCryptocurrencies +
      disposalOfCryptocurrencies +
      cashReceivedFromCustomersAsTransactionFee +
      cashReceivedFromCustomersForLiquidationInCFDTrading +
      cashPaidToCustomersAsRebatesForTransactionFees +
      cashPaidToSuppliersForExpenses +
      cashPaidToCustomersForCFDTradingProfits;
    // Info: (20230918 - Julian) Cash flows from investing activities
    const netCashProvidedByInvestingActivities = +data?.investingActivities.details ?? 0;
    // Info: (20230918 - Julian) Cash flows from financing activities
    const netCashProvidedByFinancingActivities =
      (+data.financingActivities.longTermDebt.weightedAverageCost ?? 0) +
      (+data.financingActivities.paymentsOfDividends.weightedAverageCost ?? 0) +
      (+data.financingActivities.proceedsFromIssuanceOfCommonStock.weightedAverageCost ?? 0) +
      (+data.financingActivities.shortTermBorrowings.weightedAverageCost ?? 0) +
      (+data.financingActivities.treasuryStock.weightedAverageCost ?? 0);
    const netIncreaseDecreaseInCryptocurrencies =
      +data?.otherSupplementaryItems.relatedToNonCash.netIncreaseDecreaseInCryptocurrencies
        .weightedAverageCost ?? 0;
    const cashCashEquivalentsAndRestrictedCashBeginningOfPeriod =
      +data.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
        .weightedAverageCost ?? 0;
    const cashCashEquivalentsAndRestrictedCashEndOfPeriod =
      +data.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesEndOfPeriod
        .weightedAverageCost ?? 0;

    // Info: (20230918 - Julian) Supplemental schedule of non-cash operating activities
    const cryptocurrenciesDepositedByCustomers =
      +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrenciesDepositedByCustomers
        .weightedAverageCost ?? 0;
    const cryptocurrenciesWithdrawnByCustomers =
      +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrenciesWithdrawnByCustomers
        .weightedAverageCost ?? 0;
    const cryptocurrencyInflows =
      +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyInflows
        .weightedAverageCost ?? 0;
    const cryptocurrencyOutflows =
      +data.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyOutflows
        .weightedAverageCost ?? 0;
    const cryptocurrenciesReceivedFromCustomersAsTransactionFees =
      +data.supplementalScheduleOfNonCashOperatingActivities
        .cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost ?? 0;
    const cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading =
      +data.supplementalScheduleOfNonCashOperatingActivities
        .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading.weightedAverageCost ?? 0;
    const cryptocurrenciesPaidToCustomersForCFDTradingProfits =
      +data.supplementalScheduleOfNonCashOperatingActivities
        .cryptocurrenciesPaidToCustomersForCFDTradingProfits.weightedAverageCost ?? 0;
    const purchaseOfCryptocurrenciesWithNonCashConsideration =
      +data.supplementalScheduleOfNonCashOperatingActivities
        .purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost ?? 0;
    const disposalOfCryptocurrenciesForNonCashConsideration =
      +data.supplementalScheduleOfNonCashOperatingActivities
        .disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost ?? 0;
    const netIncreaseInNonCashOperatingActivities =
      cryptocurrenciesDepositedByCustomers +
      cryptocurrenciesWithdrawnByCustomers +
      cryptocurrencyInflows +
      cryptocurrencyOutflows +
      cryptocurrenciesReceivedFromCustomersAsTransactionFees +
      cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading +
      cryptocurrenciesPaidToCustomersForCFDTradingProfits +
      purchaseOfCryptocurrenciesWithNonCashConsideration +
      disposalOfCryptocurrenciesForNonCashConsideration;
    const cryptocurrenciesBeginningOfPeriod =
      +data?.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesBeginningOfPeriod
        .weightedAverageCost ?? 0;
    const cryptocurrenciesEndOfPeriod =
      +data?.otherSupplementaryItems.relatedToNonCash.cryptocurrenciesEndOfPeriod
        .weightedAverageCost ?? 0;

    return {
      cashDepositedByCustomers,
      cashWithdrawnByCustomers,
      purchaseOfCryptocurrencies,
      disposalOfCryptocurrencies,
      cashReceivedFromCustomersAsTransactionFee,
      cashReceivedFromCustomersForLiquidationInCFDTrading,
      cashPaidToCustomersAsRebatesForTransactionFees,
      cashPaidToSuppliersForExpenses,
      cashPaidToCustomersForCFDTradingProfits,
      netCashProvidedByOperatingActivities,
      netCashProvidedByInvestingActivities,
      netCashProvidedByFinancingActivities,
      netIncreaseDecreaseInCryptocurrencies,
      cashCashEquivalentsAndRestrictedCashBeginningOfPeriod,
      cashCashEquivalentsAndRestrictedCashEndOfPeriod,
      cryptocurrenciesDepositedByCustomers,
      cryptocurrenciesWithdrawnByCustomers,
      cryptocurrencyInflows,
      cryptocurrencyOutflows,
      cryptocurrenciesReceivedFromCustomersAsTransactionFees,
      cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading,
      cryptocurrenciesPaidToCustomersForCFDTradingProfits,
      purchaseOfCryptocurrenciesWithNonCashConsideration,
      disposalOfCryptocurrenciesForNonCashConsideration,
      netIncreaseInNonCashOperatingActivities,
      cryptocurrenciesBeginningOfPeriod,
      cryptocurrenciesEndOfPeriod,
    };
  };

  const endCashFlows = getCashFlows(endCashFlowsData);
  const startCashFlows = getCashFlows(startCashFlowsData);
  const historicalCashFlows = getCashFlows(historicalCashFlowsData);

  const cash_flows_p3_1: ITable = {
    subThead: [
      'Statements of Cash Flows - USD ($)',
      `30 Days Ended ${endDateStr.monthAndDay},`,
      '*-*',
    ],
    thead: ['$ in Thousands', endDateStr.dateFormatForForm, startDateStr.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flows from operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash deposited by customers',
          `$ ${roundToDecimal(endCashFlows.cashDepositedByCustomers, 2)}`,
          `$ ${roundToDecimal(startCashFlows.cashDepositedByCustomers, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash withdrawn by customers',
          `${roundToDecimal(endCashFlows.cashWithdrawnByCustomers, 2)}`,
          `${roundToDecimal(startCashFlows.cashWithdrawnByCustomers, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Purchase of cryptocurrencies',
          `${roundToDecimal(endCashFlows.purchaseOfCryptocurrencies, 2)}`,
          `${roundToDecimal(startCashFlows.purchaseOfCryptocurrencies, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Disposal of cryptocurrencies',
          `${roundToDecimal(endCashFlows.disposalOfCryptocurrencies, 2)}`,
          `${roundToDecimal(startCashFlows.disposalOfCryptocurrencies, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash received from customers as transaction fee',
          `${roundToDecimal(endCashFlows.cashReceivedFromCustomersAsTransactionFee, 2)}`,
          `${roundToDecimal(startCashFlows.cashReceivedFromCustomersAsTransactionFee, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash received from customers for liquidation in CFD trading',
          `${roundToDecimal(endCashFlows.cashReceivedFromCustomersForLiquidationInCFDTrading, 2)}`,
          `${roundToDecimal(
            startCashFlows.cashReceivedFromCustomersForLiquidationInCFDTrading,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash paid to customers as rebates for transaction fees',
          `${roundToDecimal(endCashFlows.cashPaidToCustomersAsRebatesForTransactionFees, 2)}`,
          `${roundToDecimal(startCashFlows.cashPaidToCustomersAsRebatesForTransactionFees, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash paid to suppliers for expenses',
          `${roundToDecimal(endCashFlows.cashPaidToSuppliersForExpenses, 2)}`,
          `${roundToDecimal(startCashFlows.cashPaidToSuppliersForExpenses, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash paid to customers for CFD trading profits',
          `${roundToDecimal(endCashFlows.cashPaidToCustomersForCFDTradingProfits, 2)}`,
          `${roundToDecimal(startCashFlows.cashPaidToCustomersForCFDTradingProfits, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash provided by operating activities',
          `${roundToDecimal(endCashFlows.netCashProvidedByOperatingActivities, 2)}`,
          `${roundToDecimal(startCashFlows.netCashProvidedByOperatingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from investing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash provided by investing activities',
          `${roundToDecimal(endCashFlows.netCashProvidedByInvestingActivities, 2)}`,
          `${roundToDecimal(startCashFlows.netCashProvidedByInvestingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from financing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash used in financing activities',
          `${roundToDecimal(endCashFlows.netCashProvidedByFinancingActivities, 2)}`,
          `${roundToDecimal(startCashFlows.netCashProvidedByFinancingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net increase in cash, cash equivalents, and restricted cash',
          `${roundToDecimal(endCashFlows.netIncreaseDecreaseInCryptocurrencies ?? 0, 2)}`,
          `${roundToDecimal(startCashFlows.netIncreaseDecreaseInCryptocurrencies ?? 0, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash, cash equivalents, and restricted cash, beginning of period',
          `${roundToDecimal(
            endCashFlows.cashCashEquivalentsAndRestrictedCashBeginningOfPeriod ?? 0,
            2
          )}`,
          `${roundToDecimal(
            startCashFlows.cashCashEquivalentsAndRestrictedCashBeginningOfPeriod ?? 0,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Cash, cash equivalents, and restricted cash, end of period',
          `$ ${roundToDecimal(endCashFlows.cashCashEquivalentsAndRestrictedCashEndOfPeriod, 2)}`,
          `$ ${roundToDecimal(startCashFlows.cashCashEquivalentsAndRestrictedCashEndOfPeriod, 2)}`,
        ],
      },
    ],
  };

  const cash_flows_p4_1: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Supplemental schedule of non-cash operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies deposited by customers',
          `$ ${roundToDecimal(endCashFlows.cryptocurrenciesDepositedByCustomers, 2)}`,
          `$ ${roundToDecimal(startCashFlows.cryptocurrenciesDepositedByCustomers, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies withdrawn by customers',
          `(${roundToDecimal(endCashFlows.cryptocurrenciesWithdrawnByCustomers, 2)})`,
          `(${roundToDecimal(startCashFlows.cryptocurrenciesWithdrawnByCustomers, 2)})`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency inflows',
          `${roundToDecimal(endCashFlows.cryptocurrencyInflows, 2)}`,
          `${roundToDecimal(startCashFlows.cryptocurrencyInflows, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency outflows',
          `${roundToDecimal(endCashFlows.cryptocurrencyOutflows, 2)}`,
          `${roundToDecimal(startCashFlows.cryptocurrencyOutflows, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies received from customers as transaction fees',
          `${roundToDecimal(
            endCashFlows.cryptocurrenciesReceivedFromCustomersAsTransactionFees,
            2
          )}`,
          `${roundToDecimal(
            startCashFlows.cryptocurrenciesReceivedFromCustomersAsTransactionFees,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies received from customers for liquidation in CFD trading',
          `${roundToDecimal(
            endCashFlows.cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading,
            2
          )}`,
          `${roundToDecimal(
            startCashFlows.cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies paid to customers for CFD trading profits',
          `${roundToDecimal(endCashFlows.cryptocurrenciesPaidToCustomersForCFDTradingProfits, 2)}`,
          `${roundToDecimal(
            startCashFlows.cryptocurrenciesPaidToCustomersForCFDTradingProfits,
            2
          )}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Purchase of cryptocurrencies with non-cash consideration',
          `${roundToDecimal(endCashFlows.purchaseOfCryptocurrenciesWithNonCashConsideration, 2)}`,
          `${roundToDecimal(startCashFlows.purchaseOfCryptocurrenciesWithNonCashConsideration, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Disposal of cryptocurrencies for non-cash consideration',
          `${roundToDecimal(endCashFlows.disposalOfCryptocurrenciesForNonCashConsideration, 2)}`,
          `${roundToDecimal(startCashFlows.disposalOfCryptocurrenciesForNonCashConsideration, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net increase in non-cash operating activities',
          `${roundToDecimal(endCashFlows.netIncreaseInNonCashOperatingActivities, 2)}`,
          `${roundToDecimal(startCashFlows.netIncreaseInNonCashOperatingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies, beginning of period',
          `${roundToDecimal(endCashFlows.cryptocurrenciesBeginningOfPeriod, 2)}`,
          `${roundToDecimal(startCashFlows.cryptocurrenciesBeginningOfPeriod, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Cryptocurrencies, end of period',
          `$ ${roundToDecimal(endCashFlows.cryptocurrenciesEndOfPeriod, 2)}`,
          `$ ${roundToDecimal(startCashFlows.cryptocurrenciesEndOfPeriod, 2)}`,
        ],
      },
    ],
  };

  const cash_flows_p8_1: ITable = {
    subThead: ['', `30 Days Ended ${endDateStr.monthAndDay},`, '*-*'],
    thead: ['*|*', endDateStr.year, endDateStr.lastYear],
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash provided by operating activities',
          `$ ${roundToDecimal(endCashFlows.netCashProvidedByOperatingActivities, 2)}`,
          `$ ${roundToDecimal(historicalCashFlows.netCashProvidedByOperatingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash used in investing activities',
          `${roundToDecimal(endCashFlows.netCashProvidedByInvestingActivities, 2)}`,
          `${roundToDecimal(historicalCashFlows.netCashProvidedByInvestingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net cash used in financing activities',
          `${roundToDecimal(endCashFlows.netCashProvidedByFinancingActivities, 2)}`,
          `${roundToDecimal(historicalCashFlows.netCashProvidedByFinancingActivities, 2)}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Net increase in cash, cash equivalents, and restricted cash',
          `$ ${roundToDecimal(endCashFlows.netIncreaseDecreaseInCryptocurrencies ?? 0, 2)}`,
          `$ ${roundToDecimal(historicalCashFlows.netIncreaseDecreaseInCryptocurrencies ?? 0, 2)}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Net increase in non-cash operating activities',
          `$ ${roundToDecimal(endCashFlows.netIncreaseInNonCashOperatingActivities, 2)}`,
          `$ ${roundToDecimal(historicalCashFlows.netIncreaseInNonCashOperatingActivities, 2)}`,
        ],
      },
    ],
  };

  const getActivitiesAnalysis = (data: INonCashAccountingDetail | undefined) => {
    if (!data)
      return {
        totalAmount: '—',
        totalCost: 0,
        totalPercentage: 0,
        btcAmount: 0,
        btcCost: 0,
        btcPercentage: 0,
        ethAmount: 0,
        ethCost: 0,
        ethPercentage: 0,
        usdtAmount: 0,
        usdtCost: 0,
        usdtPercentage: 0,
      };

    const totalCost = +data?.weightedAverageCost ?? 0;
    const btcAmount = +data.breakdown.BTC.amount ?? 0;
    const btcCost = +data.breakdown.BTC.weightedAverageCost ?? 0;
    const ethAmount = +data.breakdown.ETH.amount ?? 0;
    const ethCost = +data.breakdown.ETH.weightedAverageCost ?? 0;
    const usdtAmount = +data.breakdown.USDT.amount ?? 0;
    const usdtCost = +data.breakdown.USDT.weightedAverageCost ?? 0;

    const btcPercentage = (btcCost / (btcCost + ethCost + usdtCost)) * 100;
    const ethPercentage = (ethCost / (btcCost + ethCost + usdtCost)) * 100;
    const usdtPercentage = (usdtCost / (btcCost + ethCost + usdtCost)) * 100;
    const totalPercentage = btcPercentage + ethPercentage + usdtPercentage;

    return {
      totalAmount: '—',
      totalCost: roundToDecimal(totalCost, 2),
      totalPercentage: `${roundToDecimal(totalPercentage, 1)} %`,
      btcAmount: roundToDecimal(btcAmount, 2),
      btcCost: `$ ${roundToDecimal(btcCost, 2)}`,
      btcPercentage: `${roundToDecimal(btcPercentage, 1)} %`,
      ethAmount: roundToDecimal(ethAmount, 2),
      ethCost: roundToDecimal(ethCost, 2),
      ethPercentage: `${roundToDecimal(ethPercentage, 1)} %`,
      usdtAmount: roundToDecimal(usdtAmount, 2),
      usdtCost: roundToDecimal(usdtCost, 2),
      usdtPercentage: `${roundToDecimal(usdtPercentage, 1)} %`,
    };
  };

  const endDepositedAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesDepositedByCustomers
  );
  const startDepositedAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesDepositedByCustomers
  );

  const cash_flows_p9_1: ITable = {
    thead: [
      'Cryptocurrencies deposited by customers',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endDepositedAnalysis.btcAmount}`,
          `${endDepositedAnalysis.btcCost}`,
          `${endDepositedAnalysis.btcPercentage}`,
          `${startDepositedAnalysis.btcAmount}`,
          `${startDepositedAnalysis.btcCost}`,
          `${startDepositedAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endDepositedAnalysis.ethAmount}`,
          `${endDepositedAnalysis.ethCost}`,
          `${endDepositedAnalysis.ethPercentage}`,
          `${startDepositedAnalysis.ethAmount}`,
          `${startDepositedAnalysis.ethCost}`,
          `${startDepositedAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endDepositedAnalysis.usdtAmount}`,
          `${endDepositedAnalysis.usdtCost}`,
          `${endDepositedAnalysis.usdtPercentage}`,
          `${startDepositedAnalysis.usdtAmount}`,
          `${startDepositedAnalysis.usdtCost}`,
          `${startDepositedAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies deposited by customers',
          `${endDepositedAnalysis.totalAmount}`,
          `${endDepositedAnalysis.totalCost}`,
          `${endDepositedAnalysis.totalPercentage}`,
          `${startDepositedAnalysis.totalAmount}`,
          `${startDepositedAnalysis.totalCost}`,
          `${startDepositedAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endWithdrawnAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesWithdrawnByCustomers
  );
  const startWithdrawnAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesWithdrawnByCustomers
  );

  const cash_flows_p9_2: ITable = {
    thead: [
      'Cryptocurrencies withdrawn by customers',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endWithdrawnAnalysis.btcAmount}`,
          `${endWithdrawnAnalysis.btcCost}`,
          `${endWithdrawnAnalysis.btcPercentage}`,
          `${startWithdrawnAnalysis.btcAmount}`,
          `${startWithdrawnAnalysis.btcCost}`,
          `${startWithdrawnAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endWithdrawnAnalysis.ethAmount}`,
          `${endWithdrawnAnalysis.ethCost}`,
          `${endWithdrawnAnalysis.ethPercentage}`,
          `${startWithdrawnAnalysis.ethAmount}`,
          `${startWithdrawnAnalysis.ethCost}`,
          `${startWithdrawnAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endWithdrawnAnalysis.usdtAmount}`,
          `${endWithdrawnAnalysis.usdtCost}`,
          `${endWithdrawnAnalysis.usdtPercentage}`,
          `${startWithdrawnAnalysis.usdtAmount}`,
          `${startWithdrawnAnalysis.usdtCost}`,
          `${startWithdrawnAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies withdrawn by customers',
          `${endWithdrawnAnalysis.totalAmount}`,
          `${endWithdrawnAnalysis.totalCost}`,
          `${endWithdrawnAnalysis.totalPercentage}`,
          `${startWithdrawnAnalysis.totalAmount}`,
          `${startWithdrawnAnalysis.totalCost}`,
          `${startWithdrawnAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endInflowsAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyInflows
  );
  const startInflowsAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyInflows
  );

  const cash_flows_p10_1: ITable = {
    thead: [
      'Cryptocurrency inflows',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endInflowsAnalysis.btcAmount}`,
          `${endInflowsAnalysis.btcCost}`,
          `${endInflowsAnalysis.btcPercentage}`,
          `${startInflowsAnalysis.btcAmount}`,
          `${startInflowsAnalysis.btcCost}`,
          `${startInflowsAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endInflowsAnalysis.ethAmount}`,
          `${endInflowsAnalysis.ethCost}`,
          `${endInflowsAnalysis.ethPercentage}`,
          `${startInflowsAnalysis.ethAmount}`,
          `${startInflowsAnalysis.ethCost}`,
          `${startInflowsAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endInflowsAnalysis.usdtAmount}`,
          `${endInflowsAnalysis.usdtCost}`,
          `${endInflowsAnalysis.usdtPercentage}`,
          `${startInflowsAnalysis.usdtAmount}`,
          `${startInflowsAnalysis.usdtCost}`,
          `${startInflowsAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrency inflows',
          `${endInflowsAnalysis.totalAmount}`,
          `${endInflowsAnalysis.totalCost}`,
          `${endInflowsAnalysis.totalPercentage}`,
          `${startInflowsAnalysis.totalAmount}`,
          `${startInflowsAnalysis.totalCost}`,
          `${startInflowsAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endOutflowsAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyOutflows
  );
  const startOutflowsAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities.cryptocurrencyOutflows
  );

  const cash_flows_p10_2: ITable = {
    thead: [
      'Cryptocurrency outflows',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endOutflowsAnalysis.btcAmount}`,
          `${endOutflowsAnalysis.btcCost}`,
          `${endOutflowsAnalysis.btcPercentage}`,
          `${startOutflowsAnalysis.btcAmount}`,
          `${startOutflowsAnalysis.btcCost}`,
          `${startOutflowsAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endOutflowsAnalysis.ethAmount}`,
          `${endOutflowsAnalysis.ethCost}`,
          `${endOutflowsAnalysis.ethPercentage}`,
          `${startOutflowsAnalysis.ethAmount}`,
          `${startOutflowsAnalysis.ethCost}`,
          `${startOutflowsAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endOutflowsAnalysis.usdtAmount}`,
          `${endOutflowsAnalysis.usdtCost}`,
          `${endOutflowsAnalysis.usdtPercentage}`,
          `${startOutflowsAnalysis.usdtAmount}`,
          `${startOutflowsAnalysis.usdtCost}`,
          `${startOutflowsAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrency outflows',
          `${endOutflowsAnalysis.totalAmount}`,
          `${endOutflowsAnalysis.totalCost}`,
          `${endOutflowsAnalysis.totalPercentage}`,
          `${startOutflowsAnalysis.totalAmount}`,
          `${startOutflowsAnalysis.totalCost}`,
          `${startOutflowsAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endFeesAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersAsTransactionFees
  );
  const startFeesAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersAsTransactionFees
  );

  const cash_flows_p11_1: ITable = {
    thead: [
      'Cryptocurrencies received from customers as transaction fees',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endFeesAnalysis.btcAmount}`,
          `${endFeesAnalysis.btcCost}`,
          `${endFeesAnalysis.btcPercentage}`,
          `${startFeesAnalysis.btcAmount}`,
          `${startFeesAnalysis.btcCost}`,
          `${startFeesAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endFeesAnalysis.ethAmount}`,
          `${endFeesAnalysis.ethCost}`,
          `${endFeesAnalysis.ethPercentage}`,
          `${startFeesAnalysis.ethAmount}`,
          `${startFeesAnalysis.ethCost}`,
          `${startFeesAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endFeesAnalysis.usdtAmount}`,
          `${endFeesAnalysis.usdtCost}`,
          `${endFeesAnalysis.usdtPercentage}`,
          `${startFeesAnalysis.usdtAmount}`,
          `${startFeesAnalysis.usdtCost}`,
          `${startFeesAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies received from customers as transaction fees',
          `${endFeesAnalysis.totalAmount}`,
          `${endFeesAnalysis.totalCost}`,
          `${endFeesAnalysis.totalPercentage}`,
          `${startFeesAnalysis.totalAmount}`,
          `${startFeesAnalysis.totalCost}`,
          `${startFeesAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endLiquidationAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading
  );
  const startLiquidationAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesReceivedFromCustomersForLiquidationInCFDTrading
  );

  const cash_flows_p12_1: ITable = {
    thead: [
      'Cryptocurrencies received from customers for liquidation in CFD trading',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endLiquidationAnalysis.btcAmount}`,
          `${endLiquidationAnalysis.btcCost}`,
          `${endLiquidationAnalysis.btcPercentage}`,
          `${startLiquidationAnalysis.btcAmount}`,
          `${startLiquidationAnalysis.btcCost}`,
          `${startLiquidationAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endLiquidationAnalysis.ethAmount}`,
          `${endLiquidationAnalysis.ethCost}`,
          `${endLiquidationAnalysis.ethPercentage}`,
          `${startLiquidationAnalysis.ethAmount}`,
          `${startLiquidationAnalysis.ethCost}`,
          `${startLiquidationAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endLiquidationAnalysis.usdtAmount}`,
          `${endLiquidationAnalysis.usdtCost}`,
          `${endLiquidationAnalysis.usdtPercentage}`,
          `${startLiquidationAnalysis.usdtAmount}`,
          `${startLiquidationAnalysis.usdtCost}`,
          `${startLiquidationAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies received from customers for liquidation in CFD trading',
          `${endLiquidationAnalysis.totalAmount}`,
          `${endLiquidationAnalysis.totalCost}`,
          `${endLiquidationAnalysis.totalPercentage}`,
          `${startLiquidationAnalysis.totalAmount}`,
          `${startLiquidationAnalysis.totalCost}`,
          `${startLiquidationAnalysis.totalPercentage}`,
        ],
      },
    ],
  };

  const endProfitsAnalysis = getActivitiesAnalysis(
    endCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesPaidToCustomersForCFDTradingProfits
  );
  const startProfitsAnalysis = getActivitiesAnalysis(
    startCashFlowsData?.supplementalScheduleOfNonCashOperatingActivities
      .cryptocurrenciesPaidToCustomersForCFDTradingProfits
  );

  const cash_flows_p13_1: ITable = {
    thead: [
      'Cryptocurrencies paid to customers for CFD trading profits',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
          'Bitcoin',
          `${endProfitsAnalysis.btcAmount}`,
          `${endProfitsAnalysis.btcCost}`,
          `${endProfitsAnalysis.btcPercentage}`,
          `${startProfitsAnalysis.btcAmount}`,
          `${startProfitsAnalysis.btcCost}`,
          `${startProfitsAnalysis.btcPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endProfitsAnalysis.ethAmount}`,
          `${endProfitsAnalysis.ethCost}`,
          `${endProfitsAnalysis.ethPercentage}`,
          `${startProfitsAnalysis.ethAmount}`,
          `${startProfitsAnalysis.ethCost}`,
          `${startProfitsAnalysis.ethPercentage}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endProfitsAnalysis.usdtAmount}`,
          `${endProfitsAnalysis.usdtCost}`,
          `${endProfitsAnalysis.usdtPercentage}`,
          `${startProfitsAnalysis.usdtAmount}`,
          `${startProfitsAnalysis.usdtCost}`,
          `${startProfitsAnalysis.usdtPercentage}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies paid to customers for CFD trading profits',
          `${endProfitsAnalysis.totalAmount}`,
          `${endProfitsAnalysis.totalCost}`,
          `${endProfitsAnalysis.totalPercentage}`,
          `${startProfitsAnalysis.totalAmount}`,
          `${startProfitsAnalysis.totalCost}`,
          `${startProfitsAnalysis.totalPercentage}`,
        ],
      },
    ],
  };
  // --------------------------------------------------------- ??
  const cash_flows_p14_1: ITable = {
    thead: [
      'Purchase of cryptocurrencies with non-cash consideration',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
        rowData: ['Bitcoin', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total purchase of cryptocurrencies with non-cash consideration',
          '—',
          '$ 0',
          '—',
          '—',
          '$ 0',
          '—',
        ],
      },
    ],
  };
  // --------------------------------------------------------- ??
  const cash_flows_p15_1: ITable = {
    thead: [
      'Disposal of cryptocurrencies for non-cash consideration',
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ],
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
        rowData: ['Bitcoin', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total disposal of cryptocurrencies for non-cash consideration',
          '—',
          '$ 0',
          '—',
          '—',
          '$ 0',
          '—',
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>BAIFA - {reportTitle}</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230808 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startDateStr.date}
          reportDateEnd={endDateStr.date}
        />
        <hr />

        {/* Info: (20230808 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230808 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230807 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-12px py-10px leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTable tableData={cash_flows_p3_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <ReportTable tableData={cash_flows_p4_1} />
            <p>
              For a crypto exchange, the distinction between cash and non-cash activities by
              cryptocurrencies in its cash flow statement isn't just a matter of accounting
              formality; it's a reflection of its operational, regulatory, and strategic
              imperatives. Here are the reasons why this distinction is crucial:
            </p>
            <ol className="ml-5 list-decimal font-bold">
              <li>
                <h2>Nature of Assets:</h2>
                <ul className="my-1 ml-5 list-disc">
                  <li>
                    Cash Activities:{' '}
                    <span className="font-normal">
                      These represent the traditional flow of fiat money (like USD) in and out of
                      the business. It's a universal measure of liquidity and is used for general
                      business operations, including paying suppliers or receiving cash from
                      customers.
                    </span>
                  </li>
                  <li>
                    Non-Cash Activities:{' '}
                    <span className="font-normal">
                      These pertain to the flow of cryptocurrencies, which are digital or virtual
                      assets. Given the volatile nature of cryptocurrencies, their value can
                      fluctuate significantly in short periods. By separating them, the exchange
                      provides a clearer picture of its liquidity in terms of stable fiat money
                      versus the more volatile cryptocurrencies.
                    </span>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <ol start={2} className="ml-5 list-decimal font-bold">
              <li>
                <h2>Regulatory and Reporting Requirements:</h2>
                <ul className="my-1 ml-5 list-disc">
                  <li>
                    <span className="font-normal">
                      Cryptocurrencies are still a relatively new asset class, and regulatory
                      frameworks around them are evolving. By separating cash and non-cash
                      activities, the exchange ensures that it can meet specific reporting
                      requirements that might differ between fiat and crypto assets.
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                <h2>Risk Management:</h2>
                <ul className="my-1 ml-5 list-disc">
                  <li>
                    <span className="font-normal">
                      Cryptocurrencies come with a unique set of risks, including price volatility,
                      security concerns, and technological changes. By distinguishing between cash
                      and non-cash activities, the exchange can better manage and communicate these
                      risks to stakeholders.
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                <h2>Investor and Stakeholder Transparency:</h2>
                <ul className="my-1 ml-5 list-disc">
                  <li>
                    <span className="font-normal">
                      By separating these activities, the exchange offers greater transparency to
                      its investors and stakeholders. It allows them to understand the business's
                      health in terms of both its traditional cash holdings and its holdings in the
                      more speculative world of cryptocurrencies.
                    </span>
                  </li>
                </ul>
              </li>
              <li>
                <h2>Liquidity Management:</h2>
                <ul className="my-1 ml-5 list-disc">
                  <li>
                    <span className="font-normal">
                      Cash represents immediate liquidity, which can be used for operational needs,
                      investments, or to cover liabilities. Cryptocurrencies, while liquid, might
                      not be as readily convertible to cash, especially in large amounts or during
                      market downturns. By separating the two, the exchange can better manage its
                      liquidity position.
                    </span>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Note To Statements of Cash Flows</h1>
            {/* Info: (20230906 - Julian) Note 1 */}
            <h2 className="font-bold uppercase"> 1. Nature of Operations</h2>
            <p>
              TideBit DeFi is a decentralized financial exchange that provides accessible financial
              services to a broad range of users. As a part of the burgeoning decentralized finance
              (DeFi) sector, TideBit DeFi leverages blockchain technology to offer financial
              services that are open, transparent, and free from the control of traditional
              financial intermediaries like banks and brokerages.
            </p>
            <p>
              Operating on a global scale, TideBit DeFi's platform allows users to trade a variety
              of digital assets in a secure and decentralized manner. This means that rather than
              relying on a central authority to facilitate transactions, trades are executed
              directly between users through smart contracts on the blockchain. This not only
              enhances security but also increases transaction speed and reduces costs.
            </p>
            <p>
              By harnessing the power of blockchain technology and the principles of
              decentralization, TideBit DeFi is democratizing access to financial services and
              providing users with greater control over their financial destiny.
            </p>
            {/* Info: (20230906 - Julian) Note 2 */}
            <h2 className="font-bold uppercase"> 2. SUMMARY OF SIGNIFICANT ACCOUNTING POLICIES</h2>
            <p className="font-bold">Foundation for Presentation and Consolidation Principles </p>
            <p>
              The attached financial statements of the Company are not audited. These non-audited
              financial statements are prepared following the United States Generally Accepted
              Accounting Principles ("GAAP") in the same manner as the audited financial statements.
              In the management's view, they include all necessary adjustments, which are only
              regular, recurring adjustments, for a fair representation of the Company's financial
              statements for the periods shown. The non-audited operational results for the 30 days
              ending<span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, may
              not necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
            <p>
              The creation of these financial statements in accordance with GAAP requires management
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <p>
              to make estimates and assumptions. Significant estimates and assumptions include the
              fair value of customer cryptocurrencies and liabilities.
            </p>
            <p className="font-bold">User deposits</p>
            <p>
              User deposits represent cryptocurrencies maintained on
              <span className="font-bold text-violet"> BOLT VAULT</span> that are held for the
              exclusive benefit of customers and deposits in transit from payment processors and
              financial institutions. User deposits represent the obligation to return
              cryptocurrencies deposits held by customers on TideBit DeFi and unsettled crypto
              deposits and withdrawals. The Company restricts the use of the assets underlying the
              user deposits to meet regulatory requirements and classifies the assets as current
              based on their purpose and availability to fulfill the Company’s direct obligation
              under user deposits. As of{' '}
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>, the
              Company’s eligible liquid assets were greater than the aggregate amount of user
              deposits.
            </p>
            {/* Info: (20230906 - Julian) Note 3 */}
            <h2 className="font-bold uppercase">3. P3 TECHNOLOGY</h2>
            <p>
              TideBit DeFi employs a "P3 (Partial Private-Key Protection)" system of
              <span className="font-bold text-violet"> BOLT</span> to safeguard the client's
              cryptocurrencies, held in digital wallets, alongside essential fragments of
              cryptographic keys required for accessing these assets on our platform. 'P3 (Partial
              Private-Key Protection)' protocol allows us to safeguard the user's private key. In
              the event of a loss of the private key, through user authentication, a new set of
              authorized private key combinations can be reconstituted from other private key
              fragments, thereby ensuring the retrieval of the user's assets.
            </p>
            <p>
              These assets and keys are shielded from loss, theft, or any form of misuse. The Firm
              diligently records cryptocurrencies owned by clients as well as corresponding client
              crypto liabilities, adhering to the recently enforced SAB 121. We keep track of all
              assets in digital wallets and parts or the entirety of private keys, including backup
              keys, managed on behalf of clients on our platform. Cryptocurrencies for which the
              TideBit DeFi can't recover a client's access to, are not recorded , as there is no
              related safeguarding obligation in accordance with SAB 121. TideBit DeFi regularly
              updates and initially recognizes the assets and liabilities at the fair value of the
              cryptocurrencies safeguarded for our clients.
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. Cash Flows</h2>
            <p>
              Below is a comprehensive overview of our cash flow activities for the 30-day periods
              ending
              <span className="font-bold text-violet">
                {' '}
                {endDateStr.monthFullName} {endDateStr.day}
              </span>{' '}
              in both
              <span className="font-bold text-violet"> {endDateStr.year}</span> and
              <span className="font-bold text-violet"> {endDateStr.lastYear}</span>. This table
              provides insights into the net cash generated from operating activities, the cash
              utilized in investing and financing activities, as well as the net increase in both
              cash and non-cash operating activities.
            </p>
            <ReportTable tableData={cash_flows_p8_1} />
            {/* Info: (20230906 - Julian) Note 5 */}
            <h2 className="font-bold uppercase"> 5. ACTIVITIES ANALYSIS</h2>
            <p>
              To provide our investors with a comprehensive understanding of our financial
              activities, we have meticulously broken down our cash flow statements. This approach
              allows us to highlight the specific movements and operations involving
              <span className="font-bold"> cryptocurrencies</span>. By segregating each activity, we
              aim to offer a clear picture of how cryptocurrencies flow in and out of our
              operations, ensuring that our stakeholders have a thorough grasp of our financial
              dynamics. The following sections delve into each category in detail:
            </p>
            <p className="font-bold">Cryptocurrencies deposited by customers</p>
            <p>
              The following table provides a detailed breakdown of the cryptocurrencies deposited by
              our customers. It compares the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, to that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total deposits for each
              cryptocurrency.
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="flex flex-col gap-y-10px py-16px text-xs leading-5">
            <ReportTable tableData={cash_flows_p9_1} />
            <p className="font-bold">Cryptocurrencies withdrawn by customers</p>
            <p>
              This table illustrates the cryptocurrencies that have been withdrawn by our customers.
              It contrasts the figures from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              highlighting the amount, cost value, and percentage of total withdrawals for each
              cryptocurrency.
            </p>
            <ReportTable tableData={cash_flows_p9_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 10 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={10}>
          <div className="flex flex-col gap-y-10px py-16px text-xs leading-5">
            <p className="font-bold">Cryptocurrency inflows</p>
            <p>
              Here, we present the increases of cryptocurrencies for the specified dates. This table
              compares the inflow data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, to that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p10_1} />
            <p className="font-bold">Cryptocurrency outflows</p>
            <p>
              This table depicts the decreases of cryptocurrencies. It provides a comparison between
              the data from
              <span className="font-bold text-violet">
                {' '}
                {endDateStr.dateFormatInUS}, and {startDateStr.dateFormatInUS}
              </span>
              .
            </p>
            <ReportTable tableData={cash_flows_p10_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 11 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={11}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">
              Cryptocurrencies received from customers as transaction fees
            </p>
            <p>
              Below is a representation of the cryptocurrencies we received as transaction fees from
              our customers. The data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, is
              compared with that of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p11_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 12 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={12}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">
              Cryptocurrencies received from customers for liquidation in CFD trading
            </p>
            <p>
              This table showcases the cryptocurrencies we received from our customers for
              liquidation in CFD trading. It contrasts the figures from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p12_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 13 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={13}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Cryptocurrencies paid to customers for CFD trading profits</p>
            <p>
              Here, we detail the cryptocurrencies we paid to our customers as profits from CFD
              trading. The data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, is
              juxtaposed with that of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p13_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 14 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={14}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Purchase of cryptocurrencies with non-cash consideration</p>
            <p>
              The following table provides insights into the cryptocurrencies we purchased using
              non-cash considerations. It compares the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, to that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p14_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 15 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={15}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Disposal of cryptocurrencies for non-cash consideration</p>
            <p>
              This table illustrates the cryptocurrencies we disposed of in exchange for non-cash
              considerations. It contrasts the figures from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p15_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 16 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={16}>
          <div className="flex flex-col gap-y-5px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 6 */}
            <h2 className="font-bold uppercase">6. Exchange rate</h2>
            <p>
              The table represents the exchange rates at 00:00 in the UTC+0 time zone. The exchange
              rates are used in revenue recognization.
            </p>
            <ReportExchageRateForm />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 17 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={17}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p>
              Please note that the values are approximate and may vary slightly due to market
              fluctuations.
            </p>
            {/* Info: (20230906 - Julian) Note 7 */}
            <h2 className="font-bold uppercase">7. Market price risk of cryptocurrencies</h2>
            <p>
              Our revenue model primarily hinges on transaction fees, which can be a flat fee or
              calculated as a percentage of the transaction value. The exact fee may fluctuate
              depending on the payment type and the transaction value.
            </p>
            <p>
              However, it's important to be cognizant of the risks associated with cryptocurrency
              price volatility, which could negatively impact our operational results. Market prices
              of Bitcoin, Ethereum, and other cryptocurrencies play a crucial role in determining
              our future profitability. These prices have shown significant fluctuation month over
              month, matching the pattern of our operational results, and there is no certainty that
              they will follow historical trends.
            </p>
            <p>
              A downturn in the market price of Bitcoin, Ethereum, and other cryptocurrencies could
              negatively affect our earnings, the carrying value of our cryptocurrencies, and our
              projected future cash flows. It could also pose a challenge to our liquidity and
              capability to fulfill ongoing obligations.
            </p>
            <p>
              In terms of accounting procedures, we record impairment charges on our
              cryptocurrencies when the market prices fall below the assets' carrying value.
            </p>
          </div>
        </ReportPageBody>
        <hr />
      </div>
    </>
  );
};

export default StatementsOfCashFlows;
