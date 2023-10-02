import {useEffect, useState, useRef} from 'react';
import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import ReportCover from '../../../components/report_cover/report_cover';
import ReportContent from '../../../components/report_content/report_content';
import ReportPageBody from '../../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../../components/report_risk_pages/report_risk_pages';
import ReportTable from '../../../components/report_table/report_table';
import useWindowSize from '../../../lib/hooks/use_window_size';
import {BaifaReports} from '../../../constants/baifa_reports';
import {timestampToString, getReportTimeSpan} from '../../../lib/common';
import {IBalanceSheet} from '../../../interfaces/balance_sheet';
import {
  createBalanceSheetsTable,
  createUserDepositTable,
  createFairValueTable,
} from '../../../lib/reports/balance_sheet';
import {IResult} from '../../../interfaces/result';
import {APIURL} from '../../../constants/api_request';
import {A4_SIZE} from '../../../constants/config';

interface IBalanceSheetsProps {
  projectId: string;
}

const BalanceSheets = ({projectId}: IBalanceSheetsProps) => {
  const reportTitle = BaifaReports.BALANCE_SHEETS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];
  const projectName = projectId;

  // Info: (20231002 - Julian) Set scale for mobile view
  const pageRef = useRef<HTMLDivElement>(null);
  const {width: windowWidth} = useWindowSize();

  useEffect(() => {
    if (pageRef.current && windowWidth < A4_SIZE.WIDTH) {
      pageRef.current.style.transform = `scale(.55)`;
    } else if (pageRef.current && windowWidth >= A4_SIZE.WIDTH) {
      pageRef.current.style.transform = `scale(1)`;
    }
  }, [windowWidth]);

  // Info: (20230913 - Julian) Get timespan of report
  const startDateStr = timestampToString(getReportTimeSpan().start);
  const endDateStr = timestampToString(getReportTimeSpan().end);

  const [startBalanceData, setStartBalanceData] = useState<IBalanceSheet>();
  const [endBalanceData, setEndBalanceData] = useState<IBalanceSheet>();

  // Info: (20230923 - Julian) Get data from API
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

  const theadDate = [endDateStr.dateFormatForForm, startDateStr.dateFormatForForm];

  // Info: (20230923 - Julian) ------- Main Balance Sheets -------
  const balance_sheets_p3_1 = createBalanceSheetsTable(theadDate, endBalanceData, startBalanceData);

  // Info: (20230923 - Julian) ------- User Deposits -------
  const balance_sheets_p6_1 = createUserDepositTable(
    theadDate,
    endBalanceData?.liabilities.details.userDeposit,
    startBalanceData?.liabilities.details.userDeposit
  );

  // Info: (20230923 - Julian) ------- Fair Value Measurements -------
  const balance_sheets_p7_1 = createFairValueTable(endDateStr.dateFormatForForm, endBalanceData);
  const balance_sheets_p7_2 = createFairValueTable(
    startDateStr.dateFormatForForm,
    startBalanceData
  );

  return (
    <>
      <Head>
        <title>
          {reportTitle} of {projectName} - BAIFA
        </title>
      </Head>

      <div className="flex h-balance-mobile flex-col items-center a4:h-auto">
        <div ref={pageRef} className="flex w-full origin-top flex-col items-center font-inter">
          {/* Info: (20230801 - Julian) Cover */}
          <ReportCover
            reportTitle={reportTitle}
            reportDateStart={startDateStr.date}
            reportDateEnd={endDateStr.date}
          />
          <hr className="break-before-page" />
          {/* Info: (20230802 - Julian) Content */}
          <ReportContent content={contentList} />
          <hr className="break-before-page" />
          {/* Info: (20230807 - Julian) Page 1 & 2 */}
          <ReportRiskPages reportTitle={reportTitle} />
          {/* Info: (20230802 - Julian) Page 3 */}
          <ReportPageBody reportTitle={reportTitle} currentPage={3}>
            <div className="flex flex-col gap-y-12px py-16px leading-5">
              <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
              <ReportTable tableData={balance_sheets_p3_1} />
            </div>
          </ReportPageBody>
          <hr className="break-before-page" />
          {/* Info: (20230802 - Julian) Page 4 */}
          <ReportPageBody reportTitle={reportTitle} currentPage={4}>
            <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
              <h1 className="text-lg font-bold text-violet">Notes to Balance Sheets</h1>
              {/* Info: (20230802 - Julian) Note 1 */}
              <h2 className="font-bold uppercase"> 1. Nature of Operations</h2>
              <p>
                TideBit DeFi is a decentralized financial exchange that provides accessible
                financial services to a broad range of users. As a part of the burgeoning
                decentralized finance (DeFi) sector, TideBit DeFi leverages blockchain technology to
                offer financial services that are open, transparent, and free from the control of
                traditional financial intermediaries like banks and brokerages.
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
                Accounting Principles ("GAAP") in the same manner as the audited financial
                statements. In the management's view, they include all necessary adjustments, which
                are only regular, recurring adjustments, for a fair representation of the Company's
                financial statements for the periods shown. The non-audited operational results for
                the 30 days ending
                <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, may not
                necessarily predict the results for the full year or any other period.
              </p>
              <p className="font-bold">Use of estimates</p>
            </div>
          </ReportPageBody>
          <hr className="break-before-page" />
          {/* Info: (20230802 - Julian) Page 5 */}
          <ReportPageBody reportTitle={reportTitle} currentPage={5}>
            <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
              <p>
                The creation of these financial statements in accordance with GAAP requires
                management to make estimates and assumptions. Significant estimates and assumptions
                include the fair value of customer cryptocurrencies and liabilities.
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
                assets in digital wallets and parts or the entirety of private keys, including
                backup keys, managed on behalf of clients on our platform. Cryptocurrencies for
                which the TideBit DeFi can't recover a client's access to, are not recorded , as
                there is no related safeguarding obligation in accordance with SAB 121. TideBit DeFi
                regularly updates and initially recognizes the assets
              </p>
            </div>
          </ReportPageBody>
          <hr className="break-before-page" />
          {/* Info: (20230802 - Julian) Page 6 */}
          <ReportPageBody reportTitle={reportTitle} currentPage={6}>
            <div className="flex flex-col gap-y-12px py-16px text-xs leading-5">
              <p>
                and liabilities at the fair value of the cryptocurrencies safeguarded for our
                clients.
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
          <hr className="break-before-page" />
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
          <hr className="break-before-page" />
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
                price volatility, which could negatively impact our operational results. Market
                prices of Bitcoin, Ethereum, and other cryptocurrencies play a crucial role in
                determining our future profitability. These prices have shown significant
                fluctuation month over month, matching the pattern of our operational results, and
                there is no certainty that they will follow historical trends.
              </p>
              <p>
                A downturn in the market price of Bitcoin, Ethereum, and other cryptocurrencies
                could negatively affect our earnings, the carrying value of our cryptocurrencies,
                and our projected future cash flow. It could also pose a challenge to our liquidity
                and capability to fulfill ongoing obligations.
              </p>
              <p>
                In terms of accounting procedures, we record impairment charges on our
                cryptocurrencies when the market prices fall below the assets' carrying value.
              </p>
            </div>
          </ReportPageBody>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {projectId: '1'},
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!params || !params.projectId || typeof params.projectId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      projectId: params.projectId,
    },
  };
};

export default BalanceSheets;
