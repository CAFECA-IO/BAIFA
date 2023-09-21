import {useEffect, useState} from 'react';
import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTable from '../../components/report_table/report_table';
import ReportExchageRateForm from '../../components/report_exchage_rate_form/report_exchage_rate_form';
import {ITable, ITableRows} from '../../interfaces/report_table';
import {
  IComprehensiveIncomeStatements,
  IIncomeAccountingDetail,
} from '../../interfaces/comprehensive_income_statements';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {timestampToString, getReportTimeSpan, roundToDecimal} from '../../lib/common';
import {
  getComprehensiveIncomeStatements,
  getCISData,
  getRevenue,
  getRevenueChange,
} from '../../lib/reports/comprehensive_income';

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

  useEffect(() => {
    getComprehensiveIncomeStatements(startDateStr.date).then(data => setStartIncomeData(data));
    getComprehensiveIncomeStatements(endDateStr.date).then(data => setEndIncomeData(data));
    getComprehensiveIncomeStatements(endDateStr.dateOfLastYear).then(data =>
      setHistoricalIncomeData(data)
    );
  }, []);

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

  // Info: (20230915 - Julian) Trading Fee
  const startTradingFee = getRevenue(startIncomeData?.income.details.transactionFee);
  const endTradingFee = getRevenue(endIncomeData?.income.details.transactionFee);

  // ToDo: (20230919 - Julian) 縮減程式碼

  /*   const income_statements_p7_1: ITable = {
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
          `${endTradingFee.usdAmount}`,
          `$ ${endTradingFee.usdCostValue}`,
          `${endTradingFee.usdPercentage} %`,
          `${startTradingFee.usdAmount}`,
          `$ ${startTradingFee.usdCostValue}`,
          `${startTradingFee.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endTradingFee.bitAmount}`,
          `${endTradingFee.bitCostValue}`,
          `${endTradingFee.bitPercentage} %`,
          `${startTradingFee.bitAmount}`,
          `${startTradingFee.bitCostValue}`,
          `${startTradingFee.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endTradingFee.ethAmount}`,
          `${endTradingFee.ethCostValue}`,
          `${endTradingFee.ethPercentage} %`,
          `${startTradingFee.ethAmount}`,
          `${startTradingFee.ethCostValue}`,
          `${startTradingFee.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endTradingFee.usdtAmount}`,
          `${endTradingFee.usdtCostValue}`,
          `${endTradingFee.usdtPercentage} %`,
          `${startTradingFee.usdtAmount}`,
          `${startTradingFee.usdtCostValue}`,
          `${startTradingFee.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total trading fee',
          `${endTradingFee.totalAmount}`,
          `$ ${endTradingFee.totalCostValue}`,
          `${endTradingFee.totalPercentage} %`,
          `${startTradingFee.totalAmount}`,
          `$ ${startTradingFee.totalCostValue}`,
          `${startTradingFee.totalPercentage} %`,
        ],
      },
    ],
  }; */

  // Info: (20230915 - Julian) Spread Fee
  const startSpreadFee = getRevenue(startIncomeData?.income.details.spreadFee);
  const endSpreadFee = getRevenue(endIncomeData?.income.details.spreadFee);

  interface ITableForm {
    usdAmount: string;
    usdCostValue: string;
    usdPercentage: string;
    bitAmount: string;
    bitCostValue: string;
    bitPercentage: string;
    ethAmount: string;
    ethCostValue: string;
    ethPercentage: string;
    usdtAmount: string;
    usdtCostValue: string;
    usdtPercentage: string;
    totalAmount: string;
    totalCostValue: string;
    totalPercentage: string;
  }

  const createRevenueTable = (
    title: string,
    endData: IIncomeAccountingDetail | undefined,
    startData: IIncomeAccountingDetail | undefined
  ) => {
    const thead = [
      `${title}`,
      endDateStr.dateFormatForForm,
      '*-*',
      '*-*',
      startDateStr.dateFormatForForm,
      '*-*',
      '*-*',
    ];

    if (!endData || !startData)
      return {
        thead,
        // Info: (20230915 - Julian) Default table
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
            rowData: [`USD`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
          },
          {
            rowType: RowType.bookkeeping,
            rowData: [`Bitcoin`, `—`, `—`, `— %`, `—`, `—`, `— %`],
          },
          {
            rowType: RowType.bookkeeping,
            rowData: [`Ethereum`, `—`, `—`, `— %`, `—`, `—`, `— %`],
          },
          {
            rowType: RowType.bookkeeping,
            rowData: [`USDT`, `—`, `—`, `— %`, `—`, `—`, `— %`],
          },
          {
            rowType: RowType.foot,
            rowData: [`Total ${title}`, `—`, `$ —`, `— %`, `—`, `$ —`, `— %`],
          },
        ],
      };

    // Info: (20230921 - Julian) USD
    const endUsd = endData.breakdown.USD;
    const startUsd = startData.breakdown.USD;

    // Info: (20230921 - Julian) Bitcoin
    const endBit = endData.breakdown.BTC;
    const startBit = startData.breakdown.BTC;

    // Info: (20230921 - Julian) Ethereum
    const endEth = endData.breakdown.ETH;
    const startEth = startData.breakdown.ETH;

    // Info: (20230921 - Julian) USDT
    const endUsdt = endData.breakdown.USDT;
    const startUsdt = startData.breakdown.USDT;

    // Info: (20230921 - Julian) Total
    const totalAmount = '—';
    const endTotalCost = endData.weightedAverageCost;
    const startTotalCost = startData.weightedAverageCost;

    // Info: (20230921 - Julian) Percentage
    const endUsdPercentage = (endUsd.weightedAverageCost / endTotalCost) * 100;
    const startUsdPercentage = (startUsd.weightedAverageCost / startTotalCost) * 100;

    const endBitPercentage = (endBit.weightedAverageCost / endTotalCost) * 100;
    const startBitPercentage = (startBit.weightedAverageCost / startTotalCost) * 100;

    const endEthPercentage = (endEth.weightedAverageCost / endTotalCost) * 100;
    const startEthPercentage = (startEth.weightedAverageCost / startTotalCost) * 100;

    const endUsdtPercentage = (endUsdt.weightedAverageCost / endTotalCost) * 100;
    const startUsdtPercentage = (startUsdt.weightedAverageCost / startTotalCost) * 100;

    const endTotalPercentage =
      endUsdPercentage + endBitPercentage + endEthPercentage + endUsdtPercentage;
    const startTotalPercentage =
      startUsdPercentage + startBitPercentage + startEthPercentage + startUsdtPercentage;

    const tbody = [
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
          `USD`,
          `${roundToDecimal(endUsd.amount, 2)}`,
          `$ ${roundToDecimal(endUsd.weightedAverageCost, 2)}`,
          `${roundToDecimal(endUsdPercentage, 1)} %`,
          `${roundToDecimal(startUsd.amount, 2)}`,
          `$ ${roundToDecimal(startUsd.weightedAverageCost, 2)}`,
          `${roundToDecimal(startUsdPercentage, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Bitcoin`,
          `${roundToDecimal(endBit.amount, 2)}`,
          `${roundToDecimal(endBit.weightedAverageCost, 2)}`,
          `${roundToDecimal(endBitPercentage, 1)} %`,
          `${roundToDecimal(startBit.amount, 2)}`,
          `${roundToDecimal(startBit.weightedAverageCost, 2)}`,
          `${roundToDecimal(startBitPercentage, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Ethereum`,
          `${roundToDecimal(endEth.amount, 2)}`,
          `${roundToDecimal(endEth.weightedAverageCost, 2)}`,
          `${roundToDecimal(endEthPercentage, 1)} %`,
          `${roundToDecimal(startEth.amount, 2)}`,
          `${roundToDecimal(startEth.weightedAverageCost, 2)}`,
          `${roundToDecimal(startEthPercentage, 1)} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `USDT`,
          `${roundToDecimal(endUsdt.amount, 2)}`,
          `${roundToDecimal(endUsdt.weightedAverageCost, 2)}`,
          `${roundToDecimal(endUsdtPercentage, 1)} %`,
          `${roundToDecimal(startUsdt.amount, 2)}`,
          `${roundToDecimal(startUsdt.weightedAverageCost, 2)}`,
          `${roundToDecimal(startUsdtPercentage, 1)} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `Total ${title}`,
          `${totalAmount}`,
          `$ ${roundToDecimal(endTotalCost, 2)}`,
          `${roundToDecimal(endTotalPercentage, 1)} %`,
          `${totalAmount}`,
          `$ ${roundToDecimal(startTotalCost, 2)}`,
          `${roundToDecimal(startTotalPercentage, 1)} %`,
        ],
      },
    ];

    const result: ITable = {
      thead,
      tbody,
    };
    return result;
  };

  const income_statements_p7_1 = createRevenueTable(
    'Trading fee',
    endIncomeData?.income.details.transactionFee,
    startIncomeData?.income.details.transactionFee
  );

  const income_statements_p7_2 = createRevenueTable(
    'Spread fee',
    endIncomeData?.income.details.spreadFee,
    startIncomeData?.income.details.spreadFee
  );

  // const income_statements_p7_2: ITable = {
  //   thead: [
  //     'Spread fee',
  //     endDateStr.dateFormatForForm,
  //     '*-*',
  //     '*-*',
  //     startDateStr.dateFormatForForm,
  //     '*-*',
  //     '*-*',
  //   ],
  //   tbody: [
  //     {
  //       rowType: RowType.stringRow,
  //       rowData: [
  //         '(Cost Value in thousands)',
  //         'Amount',
  //         'Cost Value',
  //         'Percentage of Total',
  //         'Amount',
  //         'Cost Value',
  //         'Percentage of Total',
  //       ],
  //     },
  //     {
  //       rowType: RowType.bookkeeping,
  //       rowData: [
  //         'USD',
  //         `${endSpreadFee.usdAmount}`,
  //         `$ ${endSpreadFee.usdCostValue}`,
  //         `${endSpreadFee.usdPercentage} %`,
  //         `${startSpreadFee.usdAmount}`,
  //         `$ ${startSpreadFee.usdCostValue}`,
  //         `${startSpreadFee.usdPercentage} %`,
  //       ],
  //     },
  //     {
  //       rowType: RowType.bookkeeping,
  //       rowData: [
  //         'Bitcoin',
  //         `${endSpreadFee.bitAmount}`,
  //         `${endSpreadFee.bitCostValue}`,
  //         `${endSpreadFee.bitPercentage} %`,
  //         `${startSpreadFee.bitAmount}`,
  //         `${startSpreadFee.bitCostValue}`,
  //         `${startSpreadFee.bitPercentage} %`,
  //       ],
  //     },
  //     {
  //       rowType: RowType.bookkeeping,
  //       rowData: [
  //         'Ethereum',
  //         `${endSpreadFee.ethAmount}`,
  //         `${endSpreadFee.ethCostValue}`,
  //         `${endSpreadFee.ethPercentage} %`,
  //         `${startSpreadFee.ethAmount}`,
  //         `${startSpreadFee.ethCostValue}`,
  //         `${startSpreadFee.ethPercentage} %`,
  //       ],
  //     },
  //     {
  //       rowType: RowType.bookkeeping,
  //       rowData: [
  //         'USDT',
  //         `${endSpreadFee.usdtAmount}`,
  //         `${endSpreadFee.usdtCostValue}`,
  //         `${endSpreadFee.usdtPercentage} %`,
  //         `${startSpreadFee.usdtAmount}`,
  //         `${startSpreadFee.usdtCostValue}`,
  //         `${startSpreadFee.usdtPercentage} %`,
  //       ],
  //     },
  //     {
  //       rowType: RowType.foot,
  //       rowData: [
  //         'Total spread fee',
  //         `${endSpreadFee.totalAmount}`,
  //         `$ ${endSpreadFee.totalCostValue}`,
  //         `${endSpreadFee.totalPercentage} %`,
  //         `${startSpreadFee.totalAmount}`,
  //         `$ ${startSpreadFee.totalCostValue}`,
  //         `${startSpreadFee.totalPercentage} %`,
  //       ],
  //     },
  //   ],
  // };

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
          `${endWithdrawalFee.usdAmount}`,
          `$ ${endWithdrawalFee.usdCostValue}`,
          `${endWithdrawalFee.usdPercentage} %`,
          `${startWithdrawalFee.usdAmount}`,
          `$ ${startWithdrawalFee.usdCostValue}`,
          `${startWithdrawalFee.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endWithdrawalFee.bitAmount}`,
          `${endWithdrawalFee.bitCostValue}`,
          `${endWithdrawalFee.bitPercentage} %`,
          `${startWithdrawalFee.bitAmount}`,
          `${startWithdrawalFee.bitCostValue}`,
          `${startWithdrawalFee.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endWithdrawalFee.ethAmount}`,
          `${endWithdrawalFee.ethCostValue}`,
          `${endWithdrawalFee.ethPercentage} %`,
          `${startWithdrawalFee.ethAmount}`,
          `${startWithdrawalFee.ethCostValue}`,
          `${startWithdrawalFee.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endWithdrawalFee.usdtAmount}`,
          `${endWithdrawalFee.usdtCostValue}`,
          `${endWithdrawalFee.usdtPercentage} %`,
          `${startWithdrawalFee.usdtAmount}`,
          `${startWithdrawalFee.usdtCostValue}`,
          `${startWithdrawalFee.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total withdrawal fee',
          `${endWithdrawalFee.totalAmount}`,
          `$ ${endWithdrawalFee.totalCostValue}`,
          `${endWithdrawalFee.totalPercentage} %`,
          `${startWithdrawalFee.totalAmount}`,
          `$ ${startWithdrawalFee.totalCostValue}`,
          `${startWithdrawalFee.totalPercentage} %`,
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
          `${endDepositFee.usdAmount}`,
          `$ ${endDepositFee.usdCostValue}`,
          `${endDepositFee.usdPercentage} %`,
          `${startDepositFee.usdAmount}`,
          `$ ${startDepositFee.usdCostValue}`,
          `${startDepositFee.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endDepositFee.bitAmount}`,
          `${endDepositFee.bitCostValue}`,
          `${endDepositFee.bitPercentage} %`,
          `${startDepositFee.bitAmount}`,
          `${startDepositFee.bitCostValue}`,
          `${startDepositFee.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endDepositFee.ethAmount}`,
          `${endDepositFee.ethCostValue}`,
          `${endDepositFee.ethPercentage} %`,
          `${startDepositFee.ethAmount}`,
          `${startDepositFee.ethCostValue}`,
          `${startDepositFee.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endDepositFee.usdtAmount}`,
          `${endDepositFee.usdtCostValue}`,
          `${endDepositFee.usdtPercentage} %`,
          `${startDepositFee.usdtAmount}`,
          `${startDepositFee.usdtCostValue}`,
          `${startDepositFee.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total deposit fee',
          `${endDepositFee.totalAmount}`,
          `$ ${endDepositFee.totalCostValue}`,
          `${endDepositFee.totalPercentage} %`,
          `${startDepositFee.totalAmount}`,
          `$ ${startDepositFee.totalCostValue}`,
          `${startDepositFee.totalPercentage} %`,
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
          `${endLiquidationFee.usdAmount}`,
          `$ ${endLiquidationFee.usdCostValue}`,
          `${endLiquidationFee.usdPercentage} %`,
          `${startLiquidationFee.usdAmount}`,
          `$ ${startLiquidationFee.usdCostValue}`,
          `${startLiquidationFee.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endLiquidationFee.bitAmount}`,
          `${endLiquidationFee.bitCostValue}`,
          `${endLiquidationFee.bitPercentage} %`,
          `${startLiquidationFee.bitAmount}`,
          `${startLiquidationFee.bitCostValue}`,
          `${startLiquidationFee.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endLiquidationFee.ethAmount}`,
          `${endLiquidationFee.ethCostValue}`,
          `${endLiquidationFee.ethPercentage} %`,
          `${startLiquidationFee.ethAmount}`,
          `${startLiquidationFee.ethCostValue}`,
          `${startLiquidationFee.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endLiquidationFee.usdtAmount}`,
          `${endLiquidationFee.usdtCostValue}`,
          `${endLiquidationFee.usdtPercentage} %`,
          `${startLiquidationFee.usdtAmount}`,
          `${startLiquidationFee.usdtCostValue}`,
          `${startLiquidationFee.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liquidation fee',
          `${endLiquidationFee.totalAmount}`,
          `$ ${endLiquidationFee.totalCostValue}`,
          `${endLiquidationFee.totalPercentage} %`,
          `${startLiquidationFee.totalAmount}`,
          `$ ${startLiquidationFee.totalCostValue}`,
          `${startLiquidationFee.totalPercentage} %`,
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
          `${endGuaranteedStopFee.usdAmount}`,
          `$ ${endGuaranteedStopFee.usdCostValue}`,
          `${endGuaranteedStopFee.usdPercentage} %`,
          `${startGuaranteedStopFee.usdAmount}`,
          `$ ${startGuaranteedStopFee.usdCostValue}`,
          `${startGuaranteedStopFee.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endGuaranteedStopFee.bitAmount}`,
          `${endGuaranteedStopFee.bitCostValue}`,
          `${endGuaranteedStopFee.bitPercentage} %`,
          `${startGuaranteedStopFee.bitAmount}`,
          `${startGuaranteedStopFee.bitCostValue}`,
          `${startGuaranteedStopFee.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endGuaranteedStopFee.ethAmount}`,
          `${endGuaranteedStopFee.ethCostValue}`,
          `${endGuaranteedStopFee.ethPercentage} %`,
          `${startGuaranteedStopFee.ethAmount}`,
          `${startGuaranteedStopFee.ethCostValue}`,
          `${startGuaranteedStopFee.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endGuaranteedStopFee.usdtAmount}`,
          `${endGuaranteedStopFee.usdtCostValue}`,
          `${endGuaranteedStopFee.usdtPercentage} %`,
          `${startGuaranteedStopFee.usdtAmount}`,
          `${startGuaranteedStopFee.usdtCostValue}`,
          `${startGuaranteedStopFee.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total guaranteed stop loss fee',
          `${endGuaranteedStopFee.totalAmount}`,
          `$ ${endGuaranteedStopFee.totalCostValue}`,
          `${endGuaranteedStopFee.totalPercentage} %`,
          `${startGuaranteedStopFee.totalAmount}`,
          `$ ${startGuaranteedStopFee.totalCostValue}`,
          `${startGuaranteedStopFee.totalPercentage} %`,
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
          `${endRebateExpenses.usdAmount}`,
          `$ ${endRebateExpenses.usdCostValue}`,
          `${endRebateExpenses.usdPercentage} %`,
          `${startRebateExpenses.usdAmount}`,
          `$ ${startRebateExpenses.usdCostValue}`,
          `${startRebateExpenses.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endRebateExpenses.bitAmount}`,
          `${endRebateExpenses.bitCostValue}`,
          `${endRebateExpenses.bitPercentage} %`,
          `${startRebateExpenses.bitAmount}`,
          `${startRebateExpenses.bitCostValue}`,
          `${startRebateExpenses.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endRebateExpenses.ethAmount}`,
          `${endRebateExpenses.ethCostValue}`,
          `${endRebateExpenses.ethPercentage} %`,
          `${startRebateExpenses.ethAmount}`,
          `${startRebateExpenses.ethCostValue}`,
          `${startRebateExpenses.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endRebateExpenses.usdtAmount}`,
          `${endRebateExpenses.usdtCostValue}`,
          `${endRebateExpenses.usdtPercentage} %`,
          `${startRebateExpenses.usdtAmount}`,
          `${startRebateExpenses.usdtCostValue}`,
          `${startRebateExpenses.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total rebate expenses',
          `${endRebateExpenses.totalAmount}`,
          `$ ${endRebateExpenses.totalCostValue}`,
          `${endRebateExpenses.totalPercentage} %`,
          `${startRebateExpenses.totalAmount}`,
          `$ ${startRebateExpenses.totalCostValue}`,
          `${startRebateExpenses.totalPercentage} %`,
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
          `${endForexLosses.usdAmount}`,
          `$ ${endForexLosses.usdCostValue}`,
          `${endForexLosses.usdPercentage} %`,
          `${startForexLosses.usdAmount}`,
          `$ ${startForexLosses.usdCostValue}`,
          `${startForexLosses.usdPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endForexLosses.bitAmount}`,
          `${endForexLosses.bitCostValue}`,
          `${endForexLosses.bitPercentage} %`,
          `${startForexLosses.bitAmount}`,
          `${startForexLosses.bitCostValue}`,
          `${startForexLosses.bitPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endForexLosses.ethAmount}`,
          `${endForexLosses.ethCostValue}`,
          `${endForexLosses.ethPercentage} %`,
          `${startForexLosses.ethAmount}`,
          `${startForexLosses.ethCostValue}`,
          `${startForexLosses.ethPercentage} %`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endForexLosses.usdtAmount}`,
          `${endForexLosses.usdtCostValue}`,
          `${endForexLosses.usdtPercentage} %`,
          `${startForexLosses.usdtAmount}`,
          `${startForexLosses.usdtCostValue}`,
          `${startForexLosses.usdtPercentage} %`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrency forex losses',
          `${endForexLosses.totalAmount}`,
          `$ ${endForexLosses.totalCostValue}`,
          `${endForexLosses.totalPercentage} %`,
          `${startForexLosses.totalAmount}`,
          `$ ${startForexLosses.totalCostValue}`,
          `${startForexLosses.totalPercentage} %`,
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
              projected future cash flow. It could also pose a challenge to our liquidity and
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
