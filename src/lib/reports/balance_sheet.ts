import {IResult} from '../../interfaces/result';
import {APIURL} from '../../constants/api_request';
import {IBalanceSheet, IBalanceAccountingDetail} from '../../interfaces/balance_sheet';
import {roundToDecimal} from '../../lib/common';
import {defaultCurrencyDetail} from '../../interfaces/currency_detail';

export const getBalanceSheet = async (date: string) => {
  let reportData;
  try {
    const response = await fetch(`${APIURL.BALANCE_SHEET}?date=${date}`, {
      method: 'GET',
    });
    const result: IResult = await response.json();
    if (result.success) {
      reportData = result.data as IBalanceSheet;
    }
  } catch (error) {
    // console.log('Get balance sheet error');
  }
  return reportData;
};

export const getBalanceSheetsTable = (data: IBalanceSheet | undefined) => {
  if (!data)
    return {
      cashAndCashEquivalent: '0',
      cryptocurrency: '0',
      accountsReceivable: '0',
      totalCurrentAssets: '0',
      totalNonCurrentAssets: '0',
      totalAssets: '0',
      userDeposit: '0',
      accountsPayable: '0',
      totalLiabilities: '0',
      capital: '0',
      retainedEarnings: '0',
      totalStockholdersEquity: '0',
      totalLiabilitiesAndStockholders: '0',
    };

  // Info: (20230913 - Julian) ------------- Assets -------------
  const cashAndCashEquivalent = roundToDecimal(
    +data.assets.details.cashAndCashEquivalent.totalAmountFairValue ?? 0,
    2
  );
  const cryptocurrency = roundToDecimal(
    +data.assets.details.cryptocurrency.totalAmountFairValue ?? 0,
    2
  );
  const accountsReceivable = roundToDecimal(
    +data.assets.details.accountsReceivable.totalAmountFairValue ?? 0,
    2
  );
  const totalCurrentAssets = roundToDecimal(+data.assets.totalAmountFairValue ?? 0, 2);
  const totalNonCurrentAssets = roundToDecimal(+data.nonAssets.totalAmountFairValue ?? 0, 2);
  const totalAssets = roundToDecimal(+totalCurrentAssets + +totalNonCurrentAssets, 2);

  // Info: (20230913 - Julian) ------------- Liability -------------
  const userDeposit = roundToDecimal(
    +data.liabilities.details.userDeposit.totalAmountFairValue ?? 0,
    2
  );
  const accountsPayable = roundToDecimal(
    +data.liabilities.details.accountsPayable.totalAmountFairValue ?? 0,
    2
  );
  const totalLiabilities = roundToDecimal(+data.liabilities.totalAmountFairValue ?? 0, 2);

  // Info: (20230913 - Julian) ------------- Stockholders' Equity -------------
  const capital = roundToDecimal(+data.equity.details.capital.totalAmountFairValue ?? 0, 2);
  const retainedEarnings = roundToDecimal(
    +data.equity.details.retainedEarnings.totalAmountFairValue ?? 0,
    2
  );
  const totalStockholdersEquity = roundToDecimal(+data.equity.totalAmountFairValue ?? 0, 2);
  const totalLiabilitiesAndStockholders = roundToDecimal(
    +totalLiabilities + +totalStockholdersEquity,
    2
  );

  return {
    cashAndCashEquivalent,
    cryptocurrency,
    accountsReceivable,
    totalCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,
    userDeposit,
    accountsPayable,
    totalLiabilities,
    capital,
    retainedEarnings,
    totalStockholdersEquity,
    totalLiabilitiesAndStockholders,
  };
};

export const getTotalUserDeposit = (userDeposit: IBalanceAccountingDetail | undefined) => {
  const defaultDepositData = {
    percentage: 0,
    ...defaultCurrencyDetail,
  };

  if (!userDeposit) {
    return {
      btcAmount: '—',
      btcFairValue: '—',
      btcPercentage: '—',
      ethAmount: '—',
      ethFairValue: '—',
      ethPercentage: '—',
      usdtAmount: '—',
      usdtFairValue: '—',
      usdtPercentage: '—',
      totalAmount: '—',
      totalFairValue: '—',
      totalPercentage: '—',
    };
  }

  const btc = userDeposit.breakdown.BTC ?? defaultDepositData;
  const eth = userDeposit.breakdown.ETH ?? defaultDepositData;
  const usdt = userDeposit.breakdown.USDT ?? defaultDepositData;
  const totalFairValue = userDeposit.totalAmountFairValue;

  const perBit = roundToDecimal((btc.fairValue / totalFairValue) * 100, 1);
  const perEth = roundToDecimal((eth.fairValue / totalFairValue) * 100, 1);
  const perUsdt = roundToDecimal((usdt.fairValue / totalFairValue) * 100, 1);
  const perTotal = roundToDecimal(
    ((+btc.fairValue + +eth.fairValue + +usdt.fairValue) / totalFairValue) * 100,
    1
  );

  return {
    btcAmount: roundToDecimal(+btc.amount, 2),
    btcFairValue: roundToDecimal(+btc.fairValue, 2),
    btcPercentage: perBit,
    ethAmount: roundToDecimal(+eth.amount, 2),
    ethFairValue: roundToDecimal(+eth.fairValue, 2),
    ethPercentage: perEth,
    usdtAmount: roundToDecimal(+usdt.amount, 2),
    usdtFairValue: roundToDecimal(+usdt.fairValue, 2),
    usdtPercentage: perUsdt,
    totalAmount: '—',
    totalFairValue: roundToDecimal(+totalFairValue, 2),
    totalPercentage: perTotal,
  };
};

export const getFairValue = (data: IBalanceSheet | undefined) => {
  const defaultData = {
    total: '0',
    weighted: '0',
  };

  if (!data)
    return {
      cashAndCashEquivalents: defaultData,
      cryptocurrency: defaultData,
      accountsReceivable: defaultData,
      totalAssets: defaultData,
      userDeposit: defaultData,
      accountsPayable: defaultData,
      totalLiabilities: defaultData,
    };

  // Info: (20230914 - Julian) ------------- Assets -------------
  const cashAndCashEquivalents = {
    total: roundToDecimal(+data.assets.details.cashAndCashEquivalent.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.assets.details.cashAndCashEquivalent.weightedAverageCost, 2),
  };
  const cryptocurrency = {
    total: roundToDecimal(+data.assets.details.cryptocurrency.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.assets.details.cryptocurrency.weightedAverageCost, 2),
  };
  const accountsReceivable = {
    total: roundToDecimal(+data.assets.details.accountsReceivable.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.assets.details.accountsReceivable.weightedAverageCost, 2),
  };
  const totalAssets = {
    total: roundToDecimal(+data.assets.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.assets.weightedAverageCost, 2),
  };

  // Info: (20230914 - Julian) ------------- Liabilities -------------
  const userDeposit = {
    total: roundToDecimal(+data.liabilities.details.userDeposit.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.liabilities.details.userDeposit.weightedAverageCost, 2),
  };
  const accountsPayable = {
    total: roundToDecimal(+data.liabilities.details.accountsPayable.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.liabilities.details.accountsPayable.weightedAverageCost, 2),
  };
  const totalLiabilities = {
    total: roundToDecimal(+data.liabilities.totalAmountFairValue, 2),
    weighted: roundToDecimal(+data.liabilities.weightedAverageCost, 2),
  };

  return {
    cashAndCashEquivalents,
    cryptocurrency,
    accountsReceivable,
    totalAssets,
    userDeposit,
    accountsPayable,
    totalLiabilities,
  };
};
