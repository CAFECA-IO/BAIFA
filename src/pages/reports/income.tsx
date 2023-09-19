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
import {defaultStatementCurrencyDetail} from '../../interfaces/currency_detail';
import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {timestampToString, getReportTimeSpan, roundToDecimal} from '../../lib/common';
import {APIURL} from '../../constants/api_request';

const ComprehensiveIncomeStatements = () => {
  const reportTitle = BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];

  // Info: (20230913 - Julian) Get timespan of report
  const startDateStr = timestampToString(getReportTimeSpan().start);
  const endDateStr = timestampToString(getReportTimeSpan().end);

  const [startIncomeData, setStartIncomeData] = useState<IComprehensiveIncomeStatements>();
  const [endIncomeData, setEndIncomeData] = useState<IComprehensiveIncomeStatements>();
  const [historicalIncomeData, setHistoricalIncomeData] =
    useState<IComprehensiveIncomeStatements>();

  const getComprehensiveIncomeStatements = async (date: string) => {
    let reportData;
    try {
      const response = await fetch(`${APIURL.COMPREHENSIVE_INCOME_STATEMENTS}?date=${date}`, {
        method: 'GET',
      });
      const result: IResult = await response.json();
      if (result.success) {
        reportData = result.data as IComprehensiveIncomeStatements;
      }
    } catch (error) {
      // console.log('Get comprehensive income statements error');
    }
    return reportData;
  };

  useEffect(() => {
    getComprehensiveIncomeStatements(startDateStr.date).then(data => setStartIncomeData(data));
    getComprehensiveIncomeStatements(endDateStr.date).then(data => setEndIncomeData(data));
    getComprehensiveIncomeStatements(endDateStr.dateOfLastYear).then(data =>
      setHistoricalIncomeData(data)
    );
  }, []);

  const getCISData = (data: IComprehensiveIncomeStatements | undefined) => {
    if (!data)
      return {
        tradingFee: '0',
        spreadFee: '0',
        withdrawalFee: '0',
        depositFee: '0',
        liquidationFee: '0',
        guaranteedStopLossFee: '0',
        totalRevenue: '0',
        technicalSupplierCost: '0',
        marketDataSupplierCost: '0',
        newCoinListingCost: '0',
        totalCost: '0',
        employeeSalaries: '0',
        rent: '0',
        marketing: '0',
        rebateExpenses: '0',
        totalOperatingExpenses: '0',
        interestExpense: '0',
        cryptocurrencyForexLosses: '0',
        fiatToCryptocurrencyConversionLosses: '0',
        cryptocurrencyToFiatConversionLosses: '0',
        fiatToFiatConversionLosses: '0',
        totalFinancialCosts: '0',
        investmentGains: '0',
        forexGains: '0',
        cryptocurrencyGains: '0',
        totalOtherGains: '0',
        netProfit: '0',
      };

    // Info: (20230914 - Julian) ------------- Revene -------------
    const tradingFee = roundToDecimal(
      +data.income.details.transactionFee.weightedAverageCost ?? 0,
      2
    );
    const spreadFee = roundToDecimal(+data.income.details.spreadFee.weightedAverageCost ?? 0, 2);
    const withdrawalFee = roundToDecimal(
      +data.income.details.withdrawalFee.weightedAverageCost ?? 0,
      2
    );
    const depositFee = roundToDecimal(+data.income.details.depositFee.weightedAverageCost ?? 0, 2);
    const liquidationFee = roundToDecimal(
      +data.income.details.liquidationFee.weightedAverageCost ?? 0,
      2
    );
    const guaranteedStopLossFee = roundToDecimal(
      +data.income.details.guaranteedStopFee.weightedAverageCost ?? 0,
      2
    );
    const totalRevenue = roundToDecimal(
      +data.income.details.transactionFee.weightedAverageCost +
        +data.income.details.spreadFee.weightedAverageCost +
        +data.income.details.withdrawalFee.weightedAverageCost +
        +data.income.details.depositFee.weightedAverageCost +
        +data.income.details.liquidationFee.weightedAverageCost +
        +data.income.details.guaranteedStopFee.weightedAverageCost,
      2
    );

    // Info: (20230914 - Julian) ------------- Cost -------------
    const technicalSupplierCost = roundToDecimal(+data.costs.details.technicalProviderFee ?? 0, 2);
    const marketDataSupplierCost = roundToDecimal(
      +data.costs.details.marketDataProviderFee ?? 0,
      2
    );
    const newCoinListingCost = roundToDecimal(+data.costs.details.newCoinListingCost ?? 0, 2);
    const totalCost = roundToDecimal(
      +data.costs.details.technicalProviderFee +
        +data.costs.details.marketDataProviderFee +
        +data.costs.details.newCoinListingCost,
      2
    );

    // Info: (20230914 - Julian) ------------- Operating expenses -------------
    const employeeSalaries = roundToDecimal(+data.operatingExpenses.details.salaries ?? 0, 2);
    const rent = roundToDecimal(+data.operatingExpenses.details.rent ?? 0, 2);
    const marketing = roundToDecimal(+data.operatingExpenses.details.marketing ?? 0, 2);
    const rebateExpenses = roundToDecimal(
      +data.operatingExpenses.details.commissionRebates ?? 0,
      2
    );
    const totalOperatingExpenses = roundToDecimal(
      +data.operatingExpenses.details.salaries +
        +data.operatingExpenses.details.rent +
        +data.operatingExpenses.details.marketing +
        +data.operatingExpenses.details.commissionRebates,
      2
    );

    // Info: (20230914 - Julian) ------------- Financial costs -------------
    const interestExpense = roundToDecimal(+data.financialCosts.details.interestExpense ?? 0, 2);
    const cryptocurrencyForexLosses = roundToDecimal(
      +data.financialCosts.details.cryptocurrencyForexLosses ?? 0,
      2
    );
    const fiatToCryptocurrencyConversionLosses = roundToDecimal(
      +data.financialCosts.details.fiatToCryptocurrencyConversionLosses ?? 0,
      2
    );
    const cryptocurrencyToFiatConversionLosses = roundToDecimal(
      +data.financialCosts.details.cryptocurrencyToFiatConversionLosses ?? 0,
      2
    );
    const fiatToFiatConversionLosses = roundToDecimal(
      +data.financialCosts.details.fiatToFiatConversionLosses ?? 0,
      2
    );
    const totalFinancialCosts = roundToDecimal(
      +data.financialCosts.details.cryptocurrencyForexLosses +
        +data.financialCosts.details.cryptocurrencyForexLosses +
        +data.financialCosts.details.fiatToCryptocurrencyConversionLosses +
        +data.financialCosts.details.cryptocurrencyToFiatConversionLosses +
        +data.financialCosts.details.fiatToFiatConversionLosses,
      2
    );

    // Info: (20230914 - Julian) Total other gains/losses
    const investmentGains = roundToDecimal(data.otherGainsLosses.details.investmentGains ?? 0, 2);
    const forexGains = roundToDecimal(data.otherGainsLosses.details.forexGains ?? 0, 2);
    const cryptocurrencyGains = roundToDecimal(
      data.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost ?? 0,
      2
    );
    const totalOtherGains = roundToDecimal(
      +data.otherGainsLosses.details.investmentGains +
        +data.otherGainsLosses.details.forexGains +
        +data.otherGainsLosses.details.cryptocurrencyGains.weightedAverageCost,
      2
    );
    const netProfit = roundToDecimal(+data.netProfit ?? 0, 2);

    return {
      tradingFee,
      spreadFee,
      withdrawalFee,
      depositFee,
      liquidationFee,
      guaranteedStopLossFee,
      totalRevenue,
      technicalSupplierCost,
      marketDataSupplierCost,
      newCoinListingCost,
      totalCost,
      employeeSalaries,
      rent,
      marketing,
      rebateExpenses,
      totalOperatingExpenses,
      interestExpense,
      cryptocurrencyForexLosses,
      fiatToCryptocurrencyConversionLosses,
      cryptocurrencyToFiatConversionLosses,
      fiatToFiatConversionLosses,
      totalFinancialCosts,
      investmentGains,
      forexGains,
      cryptocurrencyGains,
      totalOtherGains,
      netProfit,
    };
  };

  const startCISData = getCISData(startIncomeData);
  const endCISData = getCISData(endIncomeData);

  const income_statements_p3_1: ITable = {
    subThead: [
      'Comprehensive Income Statements - USD ($)',
      `30 Days Ended ${endDateStr.monthAndDay},`,
      '*-*',
    ],
    thead: ['$ in Thousands', endDateStr.dateFormatForForm, startDateStr.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Trading fee', `${endCISData.tradingFee}`, `${startCISData.tradingFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Spread Fee', `${endCISData.spreadFee}`, `${startCISData.spreadFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Withdrawal fee', `${endCISData.withdrawalFee}`, `${startCISData.withdrawalFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Deposit fee', `${endCISData.depositFee}`, `${startCISData.depositFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Liquidation fee',
          `${endCISData.liquidationFee}`,
          `${startCISData.liquidationFee}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Guaranteed stop loss fee',
          `${endCISData.guaranteedStopLossFee}`,
          `${startCISData.guaranteedStopLossFee}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total revenue',
          `$ ${endCISData.totalRevenue}`,
          `$ ${startCISData.totalRevenue}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Technical supplier costs',
          `${endCISData.technicalSupplierCost}`,
          `${startCISData.technicalSupplierCost}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Market data supplier costs',
          `${endCISData.marketDataSupplierCost}`,
          `${startCISData.marketDataSupplierCost}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'New coin listing cost',
          `${endCISData.newCoinListingCost}`,
          `${startCISData.newCoinListingCost}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total cost', `$ ${endCISData.totalCost}`, `$ ${startCISData.totalCost}`],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Employee salaries',
          `${endCISData.employeeSalaries}`,
          `${startCISData.employeeSalaries}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rent', `${endCISData.rent}`, `${startCISData.rent}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Marketing', `${endCISData.marketing}`, `${startCISData.marketing}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Rebate expenses',
          `${endCISData.rebateExpenses}`,
          `${startCISData.rebateExpenses}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total operating expenses',
          `$ ${endCISData.totalOperatingExpenses}`,
          `$ ${startCISData.totalOperatingExpenses}`,
        ],
      },
    ],
  };

  const income_statements_p4_1: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Interest expense',
          `${endCISData.interestExpense}`,
          `${startCISData.interestExpense}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency forex losses',
          `${endCISData.cryptocurrencyForexLosses}`,
          `${startCISData.cryptocurrencyForexLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to cryptocurrency conversion losses',
          `${endCISData.fiatToCryptocurrencyConversionLosses}`,
          `${startCISData.fiatToCryptocurrencyConversionLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency to fiat conversion losses',
          `${endCISData.cryptocurrencyToFiatConversionLosses}`,
          `${startCISData.cryptocurrencyToFiatConversionLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to fiat conversion losses',
          `${endCISData.fiatToFiatConversionLosses}`,
          `${startCISData.fiatToFiatConversionLosses}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total financial costs',
          `$ ${endCISData.totalFinancialCosts}`,
          `$ ${startCISData.totalFinancialCosts}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Investment gains',
          `${endCISData.investmentGains}`,
          `${startCISData.investmentGains}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Forex gains', `${endCISData.forexGains}`, `${startCISData.forexGains}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency gains',
          `${endCISData.cryptocurrencyGains}`,
          `${startCISData.cryptocurrencyGains}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total other gains',
          `${endCISData.totalOtherGains}`,
          `${startCISData.totalOtherGains}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', `$ ${endCISData.netProfit}`, `$ ${startCISData.netProfit}`],
      },
    ],
  };

  // ToDo: (20230914 - Julian) Get revenue data
  const getRevenue = (data: IIncomeAccountingDetail | undefined) => {
    const defaultRevenue = {
      amount: '—',
      costValue: '—',
      percentage: '—',
    };

    if (!data)
      return {
        usd: {
          name: 'USD',
          ...defaultRevenue,
        },
        bit: {
          name: 'Bitcoin',
          ...defaultRevenue,
        },
        eth: {
          name: 'Ethereum',
          ...defaultRevenue,
        },
        usdt: {
          name: 'USDT',
          ...defaultRevenue,
        },
        total: {
          name: 'Total',
          ...defaultRevenue,
        },
      };

    const usdData = data.breakdown.USD ?? defaultStatementCurrencyDetail;
    const bitData = data.breakdown.BTC ?? defaultStatementCurrencyDetail;
    const ethData = data.breakdown.ETH ?? defaultStatementCurrencyDetail;
    const usdtData = data.breakdown.USDT ?? defaultStatementCurrencyDetail;
    const totalData = data.weightedAverageCost;

    const usdPer = roundToDecimal((usdData.weightedAverageCost / totalData) * 100, 1);
    const bitPer = roundToDecimal((bitData.weightedAverageCost / totalData) * 100, 1);
    const ethPer = roundToDecimal((ethData.weightedAverageCost / totalData) * 100, 1);
    const usdtPer = roundToDecimal((usdtData.weightedAverageCost / totalData) * 100, 1);

    return {
      usd: {
        name: 'USD',
        amount: roundToDecimal(+usdData.amount ?? 0, 2),
        costValue: roundToDecimal(usdData.weightedAverageCost ?? 0, 2),
        percentage: usdPer,
      },
      bit: {
        name: 'Bitcoin',
        amount: roundToDecimal(+bitData.amount ?? 0, 2),
        costValue: roundToDecimal(+bitData.weightedAverageCost ?? 0, 2),
        percentage: bitPer,
      },
      eth: {
        name: 'Ethereum',
        amount: roundToDecimal(+ethData.amount ?? 0, 2),
        costValue: roundToDecimal(+ethData.weightedAverageCost ?? 0, 2),
        percentage: ethPer,
      },
      usdt: {
        name: 'USDT',
        amount: roundToDecimal(+usdtData.amount ?? 0, 2),
        costValue: roundToDecimal(+usdtData.weightedAverageCost ?? 0, 2),
        percentage: usdtPer,
      },
      total: {
        name: 'Total',
        amount: '—',
        costValue: roundToDecimal(totalData ?? 0, 2),
        percentage: roundToDecimal(100, 1),
      },
    };
  };

  // Info: (20230915 - Julian) Trading Fee
  const startTradingFee = getRevenue(startIncomeData?.income.details.transactionFee);
  const endTradingFee = getRevenue(endIncomeData?.income.details.transactionFee);

  // ToDo: (20230915 - Julian) 縮減程式碼
  // const endTradingFeeTest =endIncomeData?.income.details.transactionFee
  // const startTradingFeeTest =startIncomeData?.income.details.transactionFee

  // const tradingFeeFormRow = {
  //   rowType: RowType.bookkeeping,
  //   rowData: [
  //     'USD',
  //     `${endTradingFeeTest?.breakdown.USDC?.amount ?? 0}`,
  //     `$ ${endTradingFeeTest?.breakdown.USDC?.weightedAverageCost??0}`,
  //     `${
  //       (endTradingFeeTest?.breakdown.USDC?.weightedAverageCost ?? 0) /
  //       (endTradingFeeTest?.weightedAverageCost ?? 1)
  //     } %`,
  //     `${startTradingFeeTest?.breakdown.USDC?.amount}`,
  //     `$ ${startTradingFeeTest?.breakdown.USDC?.weightedAverageCost}`,
  //     `${
  //       (startTradingFeeTest?.breakdown.USDC?.weightedAverageCost ?? 0) /
  //       (startTradingFeeTest?.weightedAverageCost ?? 1)
  //     } %`,
  //   ],
  // };

  const income_statements_p7_1: ITable = {
    thead: [
      'Trading fee',
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
          'USD',
          `${endTradingFee.usd.amount}`,
          `$ ${endTradingFee.usd.costValue}`,
          `${endTradingFee.usd.percentage} %`,
          `${startTradingFee.usd.amount}`,
          `$ ${startTradingFee.usd.costValue}`,
          `${startTradingFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endTradingFee.bit.amount}`,
          `${endTradingFee.bit.costValue}`,
          `${endTradingFee.bit.percentage} %`,
          `${startTradingFee.bit.amount}`,
          `${startTradingFee.bit.costValue}`,
          `${startTradingFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endTradingFee.eth.amount}`,
          `${endTradingFee.eth.costValue}`,
          `${endTradingFee.eth.percentage} %`,
          `${startTradingFee.eth.amount}`,
          `${startTradingFee.eth.costValue}`,
          `${startTradingFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endTradingFee.usdt.amount}`,
          `${endTradingFee.usdt.costValue}`,
          `${endTradingFee.usdt.percentage} %`,
          `${startTradingFee.usdt.amount}`,
          `${startTradingFee.usdt.costValue}`,
          `${startTradingFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total trading fee',
          `${endTradingFee.total.amount}`,
          `$ ${endTradingFee.total.costValue}`,
          `${endTradingFee.total.percentage} %`,
          `${startTradingFee.total.amount}`,
          `$ ${startTradingFee.total.costValue}`,
          `${startTradingFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Spread Fee
  const startSpreadFee = getRevenue(startIncomeData?.income.details.spreadFee);
  const endSpreadFee = getRevenue(endIncomeData?.income.details.spreadFee);

  const income_statements_p7_2: ITable = {
    thead: [
      'Spread fee',
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
          'USD',
          `${endSpreadFee.usd.amount}`,
          `$ ${endSpreadFee.usd.costValue}`,
          `${endSpreadFee.usd.percentage} %`,
          `${startSpreadFee.usd.amount}`,
          `$ ${startSpreadFee.usd.costValue}`,
          `${startSpreadFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endSpreadFee.bit.amount}`,
          `${endSpreadFee.bit.costValue}`,
          `${endSpreadFee.bit.percentage} %`,
          `${startSpreadFee.bit.amount}`,
          `${startSpreadFee.bit.costValue}`,
          `${startSpreadFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endSpreadFee.eth.amount}`,
          `${endSpreadFee.eth.costValue}`,
          `${endSpreadFee.eth.percentage} %`,
          `${startSpreadFee.eth.amount}`,
          `${startSpreadFee.eth.costValue}`,
          `${startSpreadFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endSpreadFee.usdt.amount}`,
          `${endSpreadFee.usdt.costValue}`,
          `${endSpreadFee.usdt.percentage} %`,
          `${startSpreadFee.usdt.amount}`,
          `${startSpreadFee.usdt.costValue}`,
          `${startSpreadFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total spread fee',
          `${endSpreadFee.total.amount}`,
          `$ ${endSpreadFee.total.costValue}`,
          `${endSpreadFee.total.percentage} %`,
          `${startSpreadFee.total.amount}`,
          `$ ${startSpreadFee.total.costValue}`,
          `${startSpreadFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Withdrawal Fee
  const startWithdrawalFee = getRevenue(startIncomeData?.income.details.withdrawalFee);
  const endWithdrawalFee = getRevenue(endIncomeData?.income.details.withdrawalFee);

  const income_statements_p8_1: ITable = {
    thead: [
      'Withdrawal fee',
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
          'USD',
          `${endWithdrawalFee.usd.amount}`,
          `$ ${endWithdrawalFee.usd.costValue}`,
          `${endWithdrawalFee.usd.percentage} %`,
          `${startWithdrawalFee.usd.amount}`,
          `$ ${startWithdrawalFee.usd.costValue}`,
          `${startWithdrawalFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endWithdrawalFee.bit.amount}`,
          `${endWithdrawalFee.bit.costValue}`,
          `${endWithdrawalFee.bit.percentage} %`,
          `${startWithdrawalFee.bit.amount}`,
          `${startWithdrawalFee.bit.costValue}`,
          `${startWithdrawalFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endWithdrawalFee.eth.amount}`,
          `${endWithdrawalFee.eth.costValue}`,
          `${endWithdrawalFee.eth.percentage} %`,
          `${startWithdrawalFee.eth.amount}`,
          `${startWithdrawalFee.eth.costValue}`,
          `${startWithdrawalFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endWithdrawalFee.usdt.amount}`,
          `${endWithdrawalFee.usdt.costValue}`,
          `${endWithdrawalFee.usdt.percentage} %`,
          `${startWithdrawalFee.usdt.amount}`,
          `${startWithdrawalFee.usdt.costValue}`,
          `${startWithdrawalFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total withdrawal fee',
          `${endWithdrawalFee.total.amount}`,
          `$ ${endWithdrawalFee.total.costValue}`,
          `${endWithdrawalFee.total.percentage} %`,
          `${startWithdrawalFee.total.amount}`,
          `$ ${startWithdrawalFee.total.costValue}`,
          `${startWithdrawalFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Deposit Fee
  const startDepositFee = getRevenue(startIncomeData?.income.details.depositFee);
  const endDepositFee = getRevenue(endIncomeData?.income.details.depositFee);

  const income_statements_p8_2: ITable = {
    thead: [
      'Deposit fee',
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
          'USD',
          `${endDepositFee.usd.amount}`,
          `$ ${endDepositFee.usd.costValue}`,
          `${endDepositFee.usd.percentage} %`,
          `${startDepositFee.usd.amount}`,
          `$ ${startDepositFee.usd.costValue}`,
          `${startDepositFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endDepositFee.bit.amount}`,
          `${endDepositFee.bit.costValue}`,
          `${endDepositFee.bit.percentage} %`,
          `${startDepositFee.bit.amount}`,
          `${startDepositFee.bit.costValue}`,
          `${startDepositFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endDepositFee.eth.amount}`,
          `${endDepositFee.eth.costValue}`,
          `${endDepositFee.eth.percentage} %`,
          `${startDepositFee.eth.amount}`,
          `${startDepositFee.eth.costValue}`,
          `${startDepositFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endDepositFee.usdt.amount}`,
          `${endDepositFee.usdt.costValue}`,
          `${endDepositFee.usdt.percentage} %`,
          `${startDepositFee.usdt.amount}`,
          `${startDepositFee.usdt.costValue}`,
          `${startDepositFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total deposit fee',
          `${endDepositFee.total.amount}`,
          `$ ${endDepositFee.total.costValue}`,
          `${endDepositFee.total.percentage} %`,
          `${startDepositFee.total.amount}`,
          `$ ${startDepositFee.total.costValue}`,
          `${startDepositFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Liquidation Fee
  const startLiquidationFee = getRevenue(startIncomeData?.income.details.liquidationFee);
  const endLiquidationFee = getRevenue(endIncomeData?.income.details.liquidationFee);

  const income_statements_p9_1: ITable = {
    thead: [
      'Liquidation fee',
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
          'USD',
          `${endLiquidationFee.usd.amount}`,
          `$ ${endLiquidationFee.usd.costValue}`,
          `${endLiquidationFee.usd.percentage} %`,
          `${startLiquidationFee.usd.amount}`,
          `$ ${startLiquidationFee.usd.costValue}`,
          `${startLiquidationFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endLiquidationFee.bit.amount}`,
          `${endLiquidationFee.bit.costValue}`,
          `${endLiquidationFee.bit.percentage} %`,
          `${startLiquidationFee.bit.amount}`,
          `${startLiquidationFee.bit.costValue}`,
          `${startLiquidationFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endLiquidationFee.eth.amount}`,
          `${endLiquidationFee.eth.costValue}`,
          `${endLiquidationFee.eth.percentage} %`,
          `${startLiquidationFee.eth.amount}`,
          `${startLiquidationFee.eth.costValue}`,
          `${startLiquidationFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endLiquidationFee.usdt.amount}`,
          `${endLiquidationFee.usdt.costValue}`,
          `${endLiquidationFee.usdt.percentage} %`,
          `${startLiquidationFee.usdt.amount}`,
          `${startLiquidationFee.usdt.costValue}`,
          `${startLiquidationFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liquidation fee',
          `${endLiquidationFee.total.amount}`,
          `$ ${endLiquidationFee.total.costValue}`,
          `${endLiquidationFee.total.percentage} %`,
          `${startLiquidationFee.total.amount}`,
          `$ ${startLiquidationFee.total.costValue}`,
          `${startLiquidationFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Guaranteed Stop Loss Fee
  const startGuaranteedStopFee = getRevenue(startIncomeData?.income.details.guaranteedStopFee);
  const endGuaranteedStopFee = getRevenue(endIncomeData?.income.details.guaranteedStopFee);

  const income_statements_p10_1: ITable = {
    thead: [
      'Guaranteed stop loss fee',
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
          'USD',
          `${endGuaranteedStopFee.usd.amount}`,
          `$ ${endGuaranteedStopFee.usd.costValue}`,
          `${endGuaranteedStopFee.usd.percentage} %`,
          `${startGuaranteedStopFee.usd.amount}`,
          `$ ${startGuaranteedStopFee.usd.costValue}`,
          `${startGuaranteedStopFee.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endGuaranteedStopFee.bit.amount}`,
          `${endGuaranteedStopFee.bit.costValue}`,
          `${endGuaranteedStopFee.bit.percentage} %`,
          `${startGuaranteedStopFee.bit.amount}`,
          `${startGuaranteedStopFee.bit.costValue}`,
          `${startGuaranteedStopFee.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endGuaranteedStopFee.eth.amount}`,
          `${endGuaranteedStopFee.eth.costValue}`,
          `${endGuaranteedStopFee.eth.percentage} %`,
          `${startGuaranteedStopFee.eth.amount}`,
          `${startGuaranteedStopFee.eth.costValue}`,
          `${startGuaranteedStopFee.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endGuaranteedStopFee.usdt.amount}`,
          `${endGuaranteedStopFee.usdt.costValue}`,
          `${endGuaranteedStopFee.usdt.percentage} %`,
          `${startGuaranteedStopFee.usdt.amount}`,
          `${startGuaranteedStopFee.usdt.costValue}`,
          `${startGuaranteedStopFee.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total guaranteed stop loss fee',
          `${endGuaranteedStopFee.total.amount}`,
          `$ ${endGuaranteedStopFee.total.costValue}`,
          `${endGuaranteedStopFee.total.percentage} %`,
          `${startGuaranteedStopFee.total.amount}`,
          `$ ${startGuaranteedStopFee.total.costValue}`,
          `${startGuaranteedStopFee.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Rebate Expenses
  const startRebateExpenses = getRevenue(
    startIncomeData?.operatingExpenses.details.commissionRebates
  );
  const endRebateExpenses = getRevenue(endIncomeData?.operatingExpenses.details.commissionRebates);

  const income_statements_p11_1: ITable = {
    thead: [
      'Rebate expenses',
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
          'USD',
          `${endRebateExpenses.usd.amount}`,
          `$ ${endRebateExpenses.usd.costValue}`,
          `${endRebateExpenses.usd.percentage} %`,
          `${startRebateExpenses.usd.amount}`,
          `$ ${startRebateExpenses.usd.costValue}`,
          `${startRebateExpenses.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endRebateExpenses.bit.amount}`,
          `${endRebateExpenses.bit.costValue}`,
          `${endRebateExpenses.bit.percentage} %`,
          `${startRebateExpenses.bit.amount}`,
          `${startRebateExpenses.bit.costValue}`,
          `${startRebateExpenses.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endRebateExpenses.eth.amount}`,
          `${endRebateExpenses.eth.costValue}`,
          `${endRebateExpenses.eth.percentage} %`,
          `${startRebateExpenses.eth.amount}`,
          `${startRebateExpenses.eth.costValue}`,
          `${startRebateExpenses.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endRebateExpenses.usdt.amount}`,
          `${endRebateExpenses.usdt.costValue}`,
          `${endRebateExpenses.usdt.percentage} %`,
          `${startRebateExpenses.usdt.amount}`,
          `${startRebateExpenses.usdt.costValue}`,
          `${startRebateExpenses.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total rebate expenses',
          `${endRebateExpenses.total.amount}`,
          `$ ${endRebateExpenses.total.costValue}`,
          `${endRebateExpenses.total.percentage} %`,
          `${startRebateExpenses.total.amount}`,
          `$ ${startRebateExpenses.total.costValue}`,
          `${startRebateExpenses.total.percentage} %`,
        ],
      },
    ],
  };

  // Info: (20230915 - Julian) Cryptocurrency Forex Losses
  const startForexLosses = getRevenue(
    startIncomeData?.otherGainsLosses.details.cryptocurrencyGains
  );
  const endForexLosses = getRevenue(endIncomeData?.otherGainsLosses.details.cryptocurrencyGains);

  const income_statements_p12_1: ITable = {
    thead: [
      'Cryptocurrency forex losses',
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
          'USD',
          `${endForexLosses.usd.amount}`,
          `$ ${endForexLosses.usd.costValue}`,
          `${endForexLosses.usd.percentage} %`,
          `${startForexLosses.usd.amount}`,
          `$ ${startForexLosses.usd.costValue}`,
          `${startForexLosses.usd.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endForexLosses.bit.amount}`,
          `${endForexLosses.bit.costValue}`,
          `${endForexLosses.bit.percentage} %`,
          `${startForexLosses.bit.amount}`,
          `${startForexLosses.bit.costValue}`,
          `${startForexLosses.bit.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endForexLosses.eth.amount}`,
          `${endForexLosses.eth.costValue}`,
          `${endForexLosses.eth.percentage} %`,
          `${startForexLosses.eth.amount}`,
          `${startForexLosses.eth.costValue}`,
          `${startForexLosses.eth.percentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endForexLosses.usdt.amount}`,
          `${endForexLosses.usdt.costValue}`,
          `${endForexLosses.usdt.percentage} %`,
          `${startForexLosses.usdt.amount}`,
          `${startForexLosses.usdt.costValue}`,
          `${startForexLosses.usdt.percentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrency forex losses',
          `${endForexLosses.total.amount}`,
          `$ ${endForexLosses.total.costValue}`,
          `${endForexLosses.total.percentage} %`,
          `${startForexLosses.total.amount}`,
          `$ ${startForexLosses.total.costValue}`,
          `${startForexLosses.total.percentage} %`,
        ],
      },
    ],
  };

  const historicalCISData = getCISData(historicalIncomeData);

  const income_statements_p13_1: ITable = {
    subThead: [
      'Comprehensive Income Statements - USD ($)',
      `30 Days Ended ${endDateStr.monthAndDay},`,
      '*-*',
    ],
    thead: ['shares in Thousands, $ in Thousands', endDateStr.year, endDateStr.lastYear],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Trading fee', `${endCISData.tradingFee}`, `${historicalCISData.tradingFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Spread Fee', `${endCISData.spreadFee}`, `${historicalCISData.spreadFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Withdrawal fee',
          `${endCISData.withdrawalFee}`,
          `${historicalCISData.withdrawalFee}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Deposit fee', `${endCISData.depositFee}`, `${historicalCISData.depositFee}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Liquidation fee',
          `${endCISData.liquidationFee}`,
          `${historicalCISData.liquidationFee}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Guaranteed stop loss fee',
          `${endCISData.guaranteedStopLossFee}`,
          `${historicalCISData.guaranteedStopLossFee}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total revenue',
          `$ ${endCISData.totalRevenue}`,
          `$ ${historicalCISData.totalRevenue}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Technical supplier costs',
          `${endCISData.technicalSupplierCost}`,
          `${historicalCISData.technicalSupplierCost}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Market data supplier costs',
          `${endCISData.marketDataSupplierCost}`,
          `${historicalCISData.marketDataSupplierCost}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'New coin listing cost',
          `${endCISData.newCoinListingCost}`,
          `${historicalCISData.newCoinListingCost}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total cost', `$ ${endCISData.totalCost}`, `$ ${historicalCISData.totalCost}`],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Employee salaries',
          `${endCISData.employeeSalaries}`,
          `${historicalCISData.employeeSalaries}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rent', `${endCISData.rent}`, `${historicalCISData.rent}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Marketing', `${endCISData.marketing}`, `${historicalCISData.marketing}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Rebate expenses',
          `${endCISData.rebateExpenses}`,
          `${historicalCISData.rebateExpenses}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total operating expenses',
          `$ ${endCISData.totalOperatingExpenses}`,
          `$ ${historicalCISData.totalOperatingExpenses}`,
        ],
      },
    ],
  };

  const income_statements_p14_1: ITable = {
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Financial costs:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Interest expense',
          `${endCISData.interestExpense}`,
          `${historicalCISData.interestExpense}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency forex losses',
          `${endCISData.cryptocurrencyForexLosses}`,
          `${historicalCISData.cryptocurrencyForexLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to cryptocurrency conversion losses',
          `${endCISData.fiatToFiatConversionLosses}`,
          `${historicalCISData.fiatToFiatConversionLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency to fiat conversion losses',
          `${endCISData.cryptocurrencyToFiatConversionLosses}`,
          `${historicalCISData.cryptocurrencyToFiatConversionLosses}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Fiat to fiat conversion losses',
          `${endCISData.fiatToFiatConversionLosses}`,
          `${historicalCISData.fiatToFiatConversionLosses}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total financial costs',
          `$ ${endCISData.totalFinancialCosts}`,
          `$ ${historicalCISData.totalFinancialCosts}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Investment gains',
          `${endCISData.investmentGains}`,
          `${startCISData.investmentGains}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Forex gains', `${endCISData.forexGains}`, `${startCISData.forexGains}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency gains',
          `${endCISData.cryptocurrencyGains}`,
          `${startCISData.cryptocurrencyGains}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total other gains',
          `${endCISData.totalOtherGains}`,
          `${startCISData.totalOtherGains}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', `$ ${endCISData.netProfit}`, `$ ${startCISData.netProfit}`],
      },
    ],
  };

  const getRevenueChange = (thisYear: number, lastYear: number) => {
    const percentage = ((thisYear - lastYear) / lastYear) * 100;
    return roundToDecimal(percentage, 2);
  };

  const income_statements_p14_2: ITable = {
    subThead: ['', `30 Days Ended ${endDateStr.monthAndDay},`, '*-*', '*-*'],
    thead: ['', endDateStr.year, endDateStr.lastYear, '% Change'],
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Trading fee',
          `${endCISData.tradingFee}`,
          `${historicalCISData.tradingFee}`,
          `${getRevenueChange(+endCISData.tradingFee, +historicalCISData.tradingFee)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Spread Fee',
          `${endCISData.spreadFee}`,
          `${historicalCISData.spreadFee}`,
          `${getRevenueChange(+endCISData.spreadFee, +historicalCISData.spreadFee)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Withdrawal fee',
          `${endCISData.withdrawalFee}`,
          `${historicalCISData.withdrawalFee}`,
          `${getRevenueChange(+endCISData.withdrawalFee, +historicalCISData.withdrawalFee)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Deposit fee',
          `${endCISData.depositFee}`,
          `${historicalCISData.depositFee}`,
          `${getRevenueChange(+endCISData.depositFee, +historicalCISData.depositFee)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Liquidation fee',
          `${endCISData.liquidationFee}`,
          `${historicalCISData.liquidationFee}`,
          `${getRevenueChange(+endCISData.liquidationFee, +historicalCISData.liquidationFee)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Guaranteed stop loss fee',
          `${endCISData.guaranteedStopLossFee}`,
          `${historicalCISData.guaranteedStopLossFee}`,
          `${getRevenueChange(
            +endCISData.guaranteedStopLossFee,
            +historicalCISData.guaranteedStopLossFee
          )} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total revenue',
          `$ ${endCISData.totalRevenue}`,
          `$ ${historicalCISData.totalRevenue}`,
          `${getRevenueChange(+endCISData.totalRevenue, +historicalCISData.totalRevenue)} %`,
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
        {/* Info: (20230807 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startDateStr.date}
          reportDateEnd={endDateStr.date}
        />
        <hr />

        {/* Info: (20230807 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230807 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230807 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-12px py-16px leading-5">
            <h1 className="text-2xl font-bold text-violet">{reportTitle}</h1>
            <ReportTable tableData={income_statements_p3_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <ReportTable tableData={income_statements_p4_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">
              Note To Comprehensive Income Statements
            </h1>
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
              ending <span className="font-bold text-violet">{endDateStr.dateFormatInUS}</span>, may
              not necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
            <p>
              The creation of these financial statements in accordance with GAAP requires management{' '}
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p>
              to make estimates and assumptions. Significant estimates and assumptions include the
              fair value of customer cryptocurrencies and liabilities.
            </p>
            {/* Info: (20230906 - Julian) Note 3 */}
            <h2 className="font-bold uppercase">3. REVENUE, EXPENSES AND COSTS ANALYSIS</h2>
            <p className="font-bold">Revenue recognition</p>
            <p>
              The organization establishes the process of acknowledging income from customer
              contracts through the subsequent stages:
            </p>
            <ul className="ml-5 list-disc text-xs leading-5">
              <li>Pinpointing the agreement, or agreements, made with the client;</li>
              <li>Recognizing the duties to be performed as stated in the agreement;</li>
              <li>Calculating the price of the transaction;</li>
              <li>
                Distributing the transaction price to the duties to be performed as per the
                agreement;
              </li>
              <li>
                Acknowledging the income when the organization fulfills a duty to be performed.
              </li>
            </ul>
            <p>
              Revenue is recognized when the control of the promised products or services is handed
              over to the clients, in a quantity that mirrors the payment the organization
              anticipates to receive in return for those products or services.
            </p>
            <p>
              It is essential to provide our investors with a granular view of our financial
              activities. By breaking down each revenue and cost category associated with fiat
              currencies and cryptocurrencies, we aim to offer a comprehensive understanding of our
              operations and financial health. This detailed approach ensures that our stakeholders
              can make informed decisions based on a thorough analysis of our income streams and
              expenditures. Below, you'll find specific breakdowns for each category:
            </p>
            <p className="font-bold">Trading fee</p>
            <p>
              The table below provides a detailed breakdown of the trading fees we have collected.
              It contrasts the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total fees for each currency.
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <ReportTable tableData={income_statements_p7_1} />
            <p className="font-bold">Spread fee</p>
            <p>
              The table below provides a detailed breakdown of the spread fees we have collected. It
              contrasts the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p7_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-3px text-xs leading-5">
            <p className="font-bold">Withdrawal fee</p>
            <p>
              This section offers insights into the fees associated with customer withdrawals. The
              table compares the withdrawal fee data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, to that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p8_1} />
            <p className="font-bold">Deposit fee</p>
            <p>
              Here, we present a comprehensive overview of the fees collected from customer
              deposits. The table contrasts the figures from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p8_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Liquidation fee</p>
            <p>
              This table provides a detailed view of the fees collected from liquidation activities.
              It compares the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, to that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              highlighting the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p9_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 10 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={10}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Guaranteed stop loss fee</p>
            <p>
              Below is a representation of the fees associated with the guaranteed stop loss
              feature. The table contrasts the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p10_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 11 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={11}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Rebate expenses</p>
            <p>
              This section offers a comprehensive view of the expenses related to rebates provided
              to our customers. The table contrasts the figures from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p11_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 12 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={12}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p className="font-bold">Cryptocurrency forex losses</p>
            <p>
              The table below provides insights into the losses incurred from cryptocurrency forex
              activities. It contrasts the data from
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, with that
              of
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total losses for each currency.
            </p>
            <ReportTable tableData={income_statements_p12_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 13 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={13}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. Results of Operations</h2>
            <p>The following table summarizes the historical statement of income data:</p>
            <ReportTable tableData={income_statements_p13_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 14 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={14}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <ReportTable tableData={income_statements_p14_1} />
            <p>
              Comparison of the 30 days ended
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {endDateStr.lastYear}</span>
            </p>
            <ReportTable tableData={income_statements_p14_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 15 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={15}>
          <div className="flex flex-col gap-y-5px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 5 */}
            <h2 className="font-bold uppercase">5. Exchange rate</h2>
            <p>
              The table represents the exchange rates at 00:00 in the UTC+0 time zone. The exchange
              rates are used in revenue recognization.
            </p>

            <ReportExchageRateForm />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230906 - Julian) Page 16 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={16}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p>
              Please note that the values are approximate and may vary slightly due to market
              fluctuations.
            </p>
            {/* Info: (20230906 - Julian) Note 6 */}
            <h2 className="font-bold uppercase">6. Market price risk of cryptocurrencies</h2>
            <p>
              Our revenue model primarily hinges on transaction fees, which can be a flat fee or
              calculated as a percentage of the transaction value. The exact fee may fluctuate
              depending on the payment type and the transaction value.{' '}
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

export default ComprehensiveIncomeStatements;
