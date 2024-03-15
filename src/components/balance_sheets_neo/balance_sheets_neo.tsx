import {useEffect, useRef} from 'react';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {BaifaReports} from '../../constants/baifa_reports';
import {A4_SIZE} from '../../constants/config';
import {timestampToString} from '../../lib/common';
import useWindowSize from '../../lib/hooks/use_window_size';
import {
  createBalanceSheetsTable,
  createSummaryTable,
  createCryptocurrencyTable,
  createFairValueTable,
} from '../../lib/reports/balance_sheet_neo';
import ReportContent from '../report_content/report_content';
import ReportCover from '../report_cover/report_cover';
import ReportPageBody from '../report_page_body/report_page_body';
import ReportRiskPages from '../report_risk_pages/report_risk_pages';
import ReportTable from '../report_table/report_table';
import {IBalanceSheetsResponse} from '../../interfaces/balance_sheets_neo';
import {APIURL, HttpMethod} from '../../constants/api_request';

interface IBalanceSheetsNeoProps {
  chainId: string;
  evidenceId: string;
}

const BalanceSheetsNeo = ({chainId, evidenceId}: IBalanceSheetsNeoProps) => {
  const reportTitle = BaifaReports.BALANCE_SHEETS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];

  const {
    data: balanceSheetsResponse,
    isLoading: isBalanceSheetsLoading,
    error: balanceSheetsError,
  } = useAPIResponse<IBalanceSheetsResponse>(
    `${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}/balance_sheet`,
    {method: HttpMethod.GET}
  );

  const previousBalanceData = balanceSheetsResponse?.previousReport;
  const currentBalanceData = balanceSheetsResponse?.currentReport;

  const startDateStr = timestampToString(previousBalanceData?.reportEndTime);
  const endDateStr = timestampToString(currentBalanceData?.reportEndTime);

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

  const theadDate = [endDateStr.dateFormatForForm, startDateStr.dateFormatForForm];

  // Info: (20230923 - Julian) ------- Main Balance Sheets -------
  const balance_sheets_p3_1 = createBalanceSheetsTable(
    theadDate,
    currentBalanceData,
    previousBalanceData
  );

  // Info: (20231013 - Julian) ------- User Deposits -------
  // numero: 0. Total, 1. Bitcoin, 2. Ethereum, 3. USDT, 4. USD
  const numeroOfUserDeposit = ['A006', 'A044, A045', 'A042, A043', 'A007, A008', 'A040, A041'];
  const balance_sheets_p6_1 = createSummaryTable(
    'user deposits',
    theadDate,
    currentBalanceData?.liabilities.details.userDeposit,
    previousBalanceData?.liabilities.details.userDeposit,
    numeroOfUserDeposit
  );

  // Info: (20231011 - Julian) ------- Cryptocurrencies -------
  const numeroOfCryptocurrencies = ['A001', 'A046, A047', 'A015, A016', 'A002, A003', ''];
  const balance_sheets_p7_1 = createCryptocurrencyTable(
    'cryptocurrencies',
    theadDate,
    currentBalanceData?.assets.details.cryptocurrency,
    previousBalanceData?.assets.details.cryptocurrency,
    numeroOfCryptocurrencies
  );
  // Info: (20231011 - Julian) ------- Accounts Receivable -------
  const numeroOfAccountsReceivable = [
    'A020',
    'A027, A028',
    'A029, A030',
    'A025, A026',
    'A023, A024',
  ];
  const balance_sheets_p8_1 = createCryptocurrencyTable(
    'accounts receivable',
    theadDate,
    currentBalanceData?.assets.details.accountsReceivable,
    previousBalanceData?.assets.details.accountsReceivable,
    numeroOfAccountsReceivable
  );
  // Info: (20231011 - Julian) ------- Accounts Payable -------
  const numeroOfAccountsPayable = ['A031', 'A036, A037', 'A038, A039', 'A034, A035', 'A032, A033'];
  const balance_sheets_p9_1 = createSummaryTable(
    'accounts payable',
    theadDate,
    currentBalanceData?.liabilities.details.accountsPayable,
    previousBalanceData?.liabilities.details.accountsPayable,
    numeroOfAccountsPayable
  );

  // Info: (20231013 - Julian) ------- Retained Earnings -------
  const numeroOfRetainedEarnings = ['A010', 'A048, A049', 'A017, A018', 'A011, A012', 'A050, A051'];
  const balance_sheets_p10_1 = createSummaryTable(
    'retained earnings',
    theadDate,
    currentBalanceData?.equity.details.retainedEarning,
    previousBalanceData?.equity.details.retainedEarning,
    numeroOfRetainedEarnings
  );

  // Info: (20231129 - Julian) ------- Other Capital Reserve -------
  const numeroOfOtherCapitalReserve = [
    'A052',
    'A059, A060',
    'A057, A058',
    'A055, A056',
    'A053, A054',
  ];
  const balance_sheets_p11_1 = createSummaryTable(
    'other capital reserve',
    theadDate,
    currentBalanceData?.equity.details.otherCapitalReserve,
    previousBalanceData?.equity.details.otherCapitalReserve,
    numeroOfOtherCapitalReserve
  );

  // Info: (20230923 - Julian) ------- Fair Value Measurements -------
  const balance_sheets_p12_1 = createFairValueTable(
    endDateStr.dateFormatForForm,
    currentBalanceData
  );
  const balance_sheets_p13_1 = createFairValueTable(
    startDateStr.dateFormatForForm,
    previousBalanceData
  );

  const report = isBalanceSheetsLoading ? (
    // Info: (202340315 - Julian) Loading...
    <h1 className="p-4 text-center">Loading...</h1>
  ) : (
    <div className="flex h-1000px flex-col items-center a4:h-auto">
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
          <div className="flex flex-col gap-y-12px py-8px leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTable tableData={balance_sheets_p3_1} />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20230802 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
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
              Operating on a global scale, TideBit DeFi&apos;s platform allows users to trade a
              variety of digital assets in a secure and decentralized manner. This means that rather
              than relying on a central authority to facilitate transactions, trades are executed
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
              Accounting Principles (&quot;GAAP&quot;) in the same manner as the audited financial
              statements. In the management&apos;s view, they include all necessary adjustments,
              which are only regular, recurring adjustments, for a fair representation of the
              Company&apos;s financial statements for the periods shown. The non-audited operational
              results for the 30 days ending
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span>, may not
              necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
            <p>
              The creation of these financial statements in accordance with GAAP requires management
              to make estimates and assumptions. Significant estimates and assumptions include the
            </p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20230802 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p>fair value of customer cryptocurrencies and liabilities.</p>
            <p className="font-bold">User deposits</p>
            <p>
              User deposits represent cryptocurrencies maintained on
              <span className="font-bold text-violet"> BOLT VAULT</span> that are held for the
              exclusive benefit of customers and deposits in transit from payment processors and
              financial institutions. User deposits represent the obligation to return
              cryptocurrencies deposits held by customers on TideBit DeFi and unsettled crypto
              deposits and withdrawals. The Company restricts the use of the assets underlying the
              user deposits to meet regulatory requirements and classifies the assets as current
              based on their purpose and availability to fulfill the Company&apos;s direct
              obligation under user deposits. As of
              <span className="font-bold text-violet"> {endDateStr.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {startDateStr.dateFormatInUS}</span>, the
              Company&apos;s eligible liquid assets were greater than the aggregate amount of user
              deposits.
            </p>
            {/* Info: (20230802 - Julian) Note 3 */}
            <h2 className="font-bold uppercase">3. P3 TECHNOLOGY</h2>
            <p>
              TideBit DeFi employs a &quot;P3 (Partial Private-Key Protection)&quot; system of{' '}
              <span className="font-bold text-violet">BOLT</span> to safeguard the client&apos;s
              cryptocurrencies, held in digital wallets, alongside essential fragments of
              cryptographic keys required for accessing these assets on our platform. &apos;P3
              (Partial Private-Key Protection)&apos; protocol allows us to safeguard the user&apos;s
              private key. In the event of a loss of the private key, through user authentication, a
              new set of authorized private key combinations can be reconstituted from other private
              key fragments, thereby ensuring the retrieval of the user&apos;s assets.
            </p>
            <p>
              These assets and keys are shielded from loss, theft, or any form of misuse. The Firm
              diligently records cryptocurrencies owned by clients as well as corresponding client
              crypto liabilities, adhering to the recently enforced SAB 121. We keep track of all
              assets in digital wallets and parts or the entirety of private keys, including backup
              keys, managed on behalf of clients on our platform. Cryptocurrencies for which the
              TideBit DeFi can&apos;t recover a client&apos;s access to, are not recorded , as there
              is no related safeguarding obligation in accordance with SAB 121. TideBit DeFi
              regularly updates and initially recognizes the assets and liabilities at the fair
              value of the cryptocurrencies safeguarded for our clients.
            </p>
            <p>
              During the
              <span className="font-bold text-violet">
                {' '}
                30 days ended {endDateStr.dateFormatInUS}
              </span>
              , no losses have been incurred in connection with customer deposits.
            </p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20231013 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">User deposits</p>
            <p>
              The following table sets forth the fair value of user deposits, as shown on the
              condensed consolidated balance sheets (<span className="font-bold">in billions</span>
              ):
            </p>
            <ReportTable tableData={balance_sheets_p6_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20230802 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Cryptocurrencies</p>
            <p>
              The following table sets forth the fair value of cryptocurrencies, as shown on the
              condensed consolidated balance sheets (<span className="font-bold">in billions</span>
              ):
            </p>
            <ReportTable tableData={balance_sheets_p7_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20230802 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Accounts receivable</p>
            <p>
              The following table sets forth the fair value of accounts receivable, as shown on the
              condensed consolidated balance sheets (<span className="font-bold">in billions</span>
              ):
            </p>
            <ReportTable tableData={balance_sheets_p8_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20230802 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Accounts payable</p>
            <p>
              The following table sets forth the fair value of accounts payable, as shown on the
              condensed consolidated balance sheets (<span className="font-bold">in billions</span>
              ):
            </p>
            <ReportTable tableData={balance_sheets_p9_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20231013 - Julian) Page 10 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={10}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Retained earnings</p>
            <p>
              The following table sets forth the fair value of retained earnings, as shown on the
              condensed consolidated balance sheets (<span className="font-bold">in billions</span>
              ):
            </p>
            <ReportTable tableData={balance_sheets_p10_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20231013 - Julian) Page 11 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={11}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Other capital reserve</p>
            <p>
              The following table sets forth the fair value of other capital reserve, as shown on
              the condensed consolidated balance sheets (
              <span className="font-bold">in billions</span>):
            </p>
            <ReportTable tableData={balance_sheets_p11_1} />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20231013 - Julian) Page 12 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={12}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            {/* Info: (20230802 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. FAIR VALUE MEASUREMENTS</h2>
            <p>
              The following table sets forth by level, within the fair value hierarchy, the
              Company’s assets and liabilities measured and recorded at fair value on a recurring
              basis (<span className="font-bold">in thousands</span>):
            </p>
            <ReportTable tableData={balance_sheets_p12_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20231013 - Julian) Page 13 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={13}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <ReportTable tableData={balance_sheets_p13_1} />
            <p>
              Please note that the values are approximate and may vary slightly due to market
              fluctuations.
            </p>
            {/* Info: (20230802 - Julian) Note 5 */}
            <h2 className="font-bold uppercase">5. Market price risk of cryptocurrencies</h2>
            <p>
              Our revenue model primarily hinges on transaction fees, which can be a flat fee or
              calculated as a percentage of the transaction value. The exact fee may fluctuate
              depending on the payment type and the transaction value.
            </p>
            <p>
              However, it&apos;s important to be cognizant of the risks associated with
              cryptocurrency price volatility, which could negatively impact our operational
              results. Market prices of Bitcoin, Ethereum, and other cryptocurrencies play a crucial
              role in determining our future profitability. These prices have shown significant
              fluctuation month over month, matching the pattern of our operational results, and
              there is no certainty that they will follow historical trends.
            </p>
            <p>
              A downturn in the market price of Bitcoin, Ethereum, and other cryptocurrencies could
              negatively affect our earnings, the carrying value of ourcryptocurrencies, and our
              projected future cash flow. It could also pose a challenge to our liquidity and
              capability to
            </p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />
        {/* Info: (20231013 - Julian) Page 14 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={14}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p>fulfill ongoing obligations.</p>
            <p>
              In terms of accounting procedures, we record impairment charges on our
              cryptocurrencies when the market prices fall below the assets&apos; carrying value.
            </p>
          </div>
        </ReportPageBody>
      </div>
    </div>
  );

  const displayReport = balanceSheetsError ? (
    // Info: (202340315 - Julian) No balance sheets data
    <h1 className="p-4 text-center">No balance sheets data</h1>
  ) : (
    report
  );

  return <>{displayReport}</>;
};

export default BalanceSheetsNeo;
