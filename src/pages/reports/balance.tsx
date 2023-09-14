import {useEffect, useState} from 'react';
import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTable from '../../components/report_table/report_table';
import {BaifaReports} from '../../constants/baifa_reports';
import {RowType} from '../../constants/table_row_type';
import {APIURL} from '../../constants/api_request';
import {timestampToString, roundToDecimal, getReportTimeSpan} from '../../lib/common';
import {ITable} from '../../interfaces/report_table';
import {IResult} from '../../interfaces/result';
import {IBalanceSheet} from '../../interfaces/balance_sheet';
import {IAccountingDetail, defaultCryptoAssets} from '../../interfaces/accounting_detail';

const BalanceSheets = () => {
  const reportTitle = BaifaReports.BALANCE_SHEETS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];

  // Info: (20230913 - Julian) Get timespan of report
  const startDateStr = timestampToString(getReportTimeSpan().start);
  const endDateStr = timestampToString(getReportTimeSpan().end);

  const [startBalanceData, setStartBalanceData] = useState<IBalanceSheet>();
  const [endBalanceData, setEndBalanceData] = useState<IBalanceSheet>();

  const getBalanceSheet = async (date: string) => {
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

  useEffect(() => {
    getBalanceSheet(startDateStr.date).then(data => setStartBalanceData(data));
    getBalanceSheet(endDateStr.date).then(data => setEndBalanceData(data));
  }, []);

  const getBalanceSheetsData = (data: IBalanceSheet | undefined) => {
    if (!data)
      return {
        cashAndCashEquivalent: 0,
        cryptocurrency: 0,
        accountsReceivable: 0,
        totalCurrentAssets: 0,
        totalNonCurrentAssets: 0,
        totalAssets: 0,
        userDeposit: 0,
        accountsPayable: 0,
        totalLiabilities: 0,
        capital: 0,
        retainedEarnings: 0,
        totalStockholdersEquity: 0,
        totalLiabilitiesAndStockholders: 0,
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

  const startBalanceSheets = getBalanceSheetsData(startBalanceData);
  const endBalanceSheets = getBalanceSheetsData(endBalanceData);

  const balance_sheets_p3_1: ITable = {
    subThead: ['Balance Sheets - USD ($)', '', ''],
    thead: ['$ in Thousands', endDateStr.dateFormatForForm, startDateStr.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Assets', '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash and cash equivalents',
          `$ ${endBalanceSheets.cashAndCashEquivalent}`,
          `$ ${startBalanceSheets.cashAndCashEquivalent}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies',
          `${endBalanceSheets.cryptocurrency}`,
          `${startBalanceSheets.cryptocurrency}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Account receivable',
          `${endBalanceSheets.accountsReceivable}`,
          `${startBalanceSheets.accountsReceivable}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total current assets',
          `${endBalanceSheets.totalCurrentAssets}`,
          `${startBalanceSheets.totalCurrentAssets}`,
        ],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Total non-current assets',
          `${endBalanceSheets.totalNonCurrentAssets}`,
          `${startBalanceSheets.totalNonCurrentAssets}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total assets',
          `$ ${endBalanceSheets.totalAssets}`,
          `$ ${startBalanceSheets.totalAssets}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: [`Liabilities and Stockholders' Equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Current liabilities:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'User deposits',
          `${endBalanceSheets.userDeposit}`,
          `${startBalanceSheets.userDeposit}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Accounts payable',
          `${endBalanceSheets.accountsPayable}`,
          `${startBalanceSheets.accountsPayable}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liabilities',
          `${endBalanceSheets.totalLiabilities}`,
          `${startBalanceSheets.totalLiabilities}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Capital', `${endBalanceSheets.capital}`, `${startBalanceSheets.capital}`],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Retained earnings',
          `${endBalanceSheets.retainedEarnings}`,
          `${startBalanceSheets.retainedEarnings}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          `Total stockholders' equity`,
          `${endBalanceSheets.totalStockholdersEquity}`,
          `${startBalanceSheets.totalStockholdersEquity}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          `Total liabilities and stockholders' equity`,
          `$ ${endBalanceSheets.totalLiabilitiesAndStockholders}`,
          `$ ${startBalanceSheets.totalLiabilitiesAndStockholders}`,
        ],
      },
    ],
  };

  const getTotalUserDeposit = (userDeposit: IAccountingDetail | undefined) => {
    const defaultDepositData = {
      ...defaultCryptoAssets,
      percentage: 0,
    };

    if (!userDeposit) {
      return {
        btc: defaultDepositData,
        eth: defaultDepositData,
        usdt: defaultDepositData,
        total: defaultDepositData,
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
      btc: {
        name: 'Bitcoin',
        amount: roundToDecimal(+btc.amount, 2),
        fairValue: roundToDecimal(+btc.fairValue, 2),
        percentage: perBit,
      },
      eth: {
        name: 'Ethereum',
        amount: roundToDecimal(+eth.amount, 2),
        fairValue: roundToDecimal(+eth.fairValue, 2),
        percentage: perEth,
      },
      usdt: {
        name: 'USDT',
        amount: roundToDecimal(+usdt.amount, 2),
        fairValue: roundToDecimal(+usdt.fairValue, 2),
        percentage: perUsdt,
      },
      total: {
        name: 'Total',
        amount: '—',
        fairValue: roundToDecimal(+totalFairValue, 2),
        percentage: perTotal,
      },
    };
  };

  const startUserDeposit = getTotalUserDeposit(startBalanceData?.liabilities.details.userDeposit);
  const endUserDeposit = getTotalUserDeposit(endBalanceData?.liabilities.details.userDeposit);

  const balance_sheets_p6_1: ITable = {
    thead: [
      '',
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
          '',
          'Amount',
          'Fair Value',
          'Percentage of Total',
          'Amount',
          'Fair Value',
          'Percentage of Total',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Bitcoin',
          `${endUserDeposit.btc.amount}`,
          `$ ${endUserDeposit.btc.fairValue}`,
          `${endUserDeposit.btc.percentage}%`,
          `${startUserDeposit.btc.amount}`,
          `$ ${startUserDeposit.btc.fairValue}`,
          `${startUserDeposit.btc.percentage}%`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Ethereum',
          `${endUserDeposit.eth.amount}`,
          `${endUserDeposit.eth.fairValue}`,
          `${endUserDeposit.eth.percentage}%`,
          `${startUserDeposit.eth.amount}`,
          `${startUserDeposit.eth.fairValue}`,
          `${startUserDeposit.eth.percentage}%`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'USDT',
          `${endUserDeposit.usdt.amount}`,
          `${endUserDeposit.usdt.fairValue}`,
          `${endUserDeposit.usdt.percentage}%`,
          `${startUserDeposit.usdt.amount}`,
          `${startUserDeposit.usdt.fairValue}`,
          `${startUserDeposit.usdt.percentage}%`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total user deposits',
          `${endUserDeposit.total.amount}`,
          `$ ${endUserDeposit.total.fairValue}`,
          `${endUserDeposit.total.percentage}%`,
          `${startUserDeposit.total.amount}`,
          `$ ${startUserDeposit.total.fairValue}`,
          `${startUserDeposit.total.percentage}%`,
        ],
      },
    ],
  };

  const getFairValue = (data: IBalanceSheet | undefined) => {
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

  const endFairValue = getFairValue(endBalanceData);

  const balance_sheets_p7_1: ITable = {
    thead: ['', endDateStr.dateFormatForForm, '*-*', '*-*', '*-*'],
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '($ in thousands)', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash and cash equivalents',
          `$ ${endFairValue.cashAndCashEquivalents.weighted}`,
          '—',
          '—',
          `$ ${endFairValue.cashAndCashEquivalents.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency',
          `${endFairValue.cryptocurrency.weighted}`,
          '—',
          '—',
          `${endFairValue.cryptocurrency.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Account receivable',
          `${endFairValue.accountsReceivable.weighted}`,
          '—',
          '—',
          `${endFairValue.accountsReceivable.total}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total assets',
          `$ ${endFairValue.totalAssets.weighted}`,
          '—',
          '—',
          `$ ${endFairValue.totalAssets.total}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'User deposits',
          `$ ${endFairValue.userDeposit.weighted}`,
          '—',
          '—',
          `$ ${endFairValue.totalAssets.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Accounts payable',
          `${endFairValue.accountsPayable.weighted}`,
          '—',
          '—',
          `${endFairValue.accountsPayable.total}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liabilities',
          `$ ${endFairValue.totalLiabilities.weighted}`,
          '—',
          '—',
          `$ ${endFairValue.totalLiabilities.total}`,
        ],
      },
    ],
  };

  const startFairValue = getFairValue(startBalanceData);

  const balance_sheets_p7_2: ITable = {
    thead: ['', startDateStr.dateFormatForForm, '*-*', '*-*', '*-*'],
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '($ in thousands)', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cash and cash equivalents',
          `$ ${startFairValue.cashAndCashEquivalents.weighted}`,
          '—',
          '—',
          `$ ${startFairValue.cashAndCashEquivalents.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrency',
          `${startFairValue.cryptocurrency.weighted}`,
          '—',
          '—',
          `${startFairValue.cryptocurrency.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Account receivable',
          `${startFairValue.accountsReceivable.weighted}`,
          '—',
          '—',
          `${startFairValue.accountsReceivable.total}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total assets',
          `$ ${startFairValue.totalAssets.weighted}`,
          '—',
          '—',
          `$ ${startFairValue.totalAssets.total}`,
        ],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'User deposits',
          `$ ${startFairValue.userDeposit.weighted}`,
          '—',
          '—',
          `$ ${startFairValue.userDeposit.total}`,
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Accounts payable',
          `${startFairValue.accountsPayable.weighted}`,
          '—',
          '—',
          `${startFairValue.accountsPayable.total}`,
        ],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total liabilities',
          `$ ${startFairValue.totalLiabilities.weighted}`,
          '—',
          '—',
          `$ ${startFairValue.totalLiabilities.total}`,
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{reportTitle} - BAIFA</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230801 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startDateStr.date}
          reportDateEnd={endDateStr.date}
        />
        <hr />
        {/* Info: (20230802 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230807 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230802 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-12px py-16px leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTable tableData={balance_sheets_p3_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Notes to Balance Sheets</h1>
            {/* Info: (20230802 - Julian) Note 1 */}
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
            {/* Info: (20230802 - Julian) Note 2 */}
            <h2 className="font-bold uppercase">2. SUMMARY OF SIGNIFICANT ACCOUNTING POLICIES</h2>
            <p className="font-bold">Foundation for Presentation and Consolidation Principles</p>
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
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p>
              The creation of these financial statements in accordance with GAAP requires management
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
              under user deposits. As of
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>, the
              Company’s eligible liquid assets were greater than the aggregate amount of user
              deposits.
            </p>
            {/* Info: (20230802 - Julian) Note 3 */}
            <h2 className="font-bold uppercase">3. P3 TECHNOLOGY</h2>
            <p>
              TideBit DeFi employs a "P3 (Partial Private-Key Protection)" system of{' '}
              <span className="font-bold text-violet">BOLT</span> to safeguard the client's
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
              updates and initially recognizes the assets
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <p>
              and liabilities at the fair value of the cryptocurrencies safeguarded for our clients.
            </p>
            <p>
              During the
              <span className="font-bold text-violet">
                {' '}
                30 days ended {endDateStr.dateFormatInUS}
              </span>
              , no losses have been incurred in connection with customer cryptocurrencies.
            </p>
            <p>
              The following table sets forth the fair value of customer cryptocurrencies, as shown
              on the condensed consolidated balance sheets, as user deposits (in billions):
            </p>
            <ReportTable tableData={balance_sheets_p6_1} />
            {/* Info: (20230802 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. FAIR VALUE MEASUREMENTS</h2>
            <p>
              The following table sets forth by level, within the fair value hierarchy, the
              Company’s assets and liabilities measured and recorded at fair value on a recurring
              basis (in thousands):
            </p>
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            <ReportTable tableData={balance_sheets_p7_1} />
            <ReportTable tableData={balance_sheets_p7_2} />
            <p>
              Please note that the values are approximate and may vary slightly due to market
              fluctuations.
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
            {/* Info: (20230802 - Julian) Note 5 */}
            <h2 className="font-bold uppercase">5. Market price risk of cryptocurrencies</h2>
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

export default BalanceSheets;
