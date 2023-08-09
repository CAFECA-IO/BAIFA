import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTableNew from '../../components/report_table/report_table';
import {BaifaReports} from '../../constants/baifa_reports';
import {RowType} from '../../constants/table_row_type';
import {reportsDateSpan} from '../../constants/config';
import {ITable} from '../../interfaces/report_table';
import {timestampToString} from '../../lib/common';

const BalanceSheets = () => {
  const reportTitle = BaifaReports.BALANCE_SHEETS;
  const contentList = ['Balance Sheets', 'Note To Balance Sheets'];
  const startDate = timestampToString(reportsDateSpan.start);
  const endDate = timestampToString(reportsDateSpan.end);

  const balance_sheets_p3_1: ITable = {
    thead: ['Balance Sheets - USD ($)', endDate.dateFormatForForm, startDate.dateFormatForForm],
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
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial funds', '$ 24278.30', '$ 24467.11'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['USDT', '349.09', '67.21'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Account receivable', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Assets pledged as collateral', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Total current assets', '24,627.39', '24,534.32'],
      },
      {
        rowType: RowType.subtitle,
        rowData: ['Non-current assets:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Crypto assets held', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total assets', '$ 24,627.39', '$ 24,534.32'],
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
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial cash liabilities', '$ 24278.3', '$ 24467.11'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Accounts payable', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liabilities', '$ 24,278.30', '$ 24,467.11'],
      },
      {
        rowType: RowType.title,
        rowData: [`Stockholders' equity`, '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Additional paid-in capital', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Accumulated other comprehensive income', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Retained earnings', '349.09', '67.21'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: [`Total stockholders' equity`, '349.09', '67.21'],
      },
      {
        rowType: RowType.foot,
        rowData: [`Total liabilities and stockholders' equity`, '$ 24,627.39', '$ 24,534.32'],
      },
    ],
  };

  const balance_sheets_p6_1: ITable = {
    thead: ['', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial funds', '$ 24278.3', '$ 24467.11'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total customer assets', '$ 24278.3', '$ 24467.11'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial cash liabilities', '$ 24278.3', '$ 24467.11'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total customer liaiblities', '$ 24278.3', '$ 24467.11'],
      },
    ],
  };

  const balance_sheets_p6_2: ITable = {
    thead: ['', endDate.dateFormatForForm, '*-*', startDate.dateFormatForForm, '*-*'],
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: ['', 'Fair Value', 'Percentage of Total', 'Fair Value', 'Percentage of Total'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Bitcoin', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Ethereum', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['USDT', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total customer crypto assets', '$ 24278.3', '100.0%', '$ 24467.11', '100.0%'],
      },
    ],
  };

  const balance_sheets_p7_1: ITable = {
    thead: ['', endDate.dateFormatForForm, '*-*', startDate.dateFormatForForm, '*-*'],
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: ['', 'Units', 'Fair Value', 'Units', 'Fair Value'],
      },
      {
        rowType: RowType.title,
        rowData: ['Assets Pledged as Collateral', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['USDT', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Bitcoin', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Ethereum', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total', '—', '—', '—', '—'],
      },
    ],
  };

  const balance_sheets_p7_2: ITable = {
    thead: ['', endDate.dateFormatForForm, '*-*', startDate.dateFormatForForm, '*-*'],
    tbody: [
      {
        rowType: RowType.stringRow,
        rowData: [
          'Crypto assets held for operating purposes:',
          'Cost(1)',
          'Fair Value(2)',
          'Cost(1)',
          'Fair Value(2)',
        ],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Bitcoin', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Ethereum', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Other', '—', '—', '—', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total crypto assets held for operating purposes', '—', '—', '—', '—'],
      },
    ],
  };

  const balance_sheets_p8_1: ITable = {
    thead: ['', endDate.dateFormatForForm, '*-*', '*-*', '*-*'],
    tbody: [
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial funds', '$24,278.30', '$ —', '$ —', '$24,278.30'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['USDT', '$349.09', '$ —', '$ —', '$349.09'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Account receivable', '0', '', '', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Assets pledged as collateral', '0', '—', '—', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Crypto assets held', '0', '—', '—', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total assets', '$24,627.39', '—', '—', '$24,627.39'],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities and Stockholders’ Equity', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial cash liabilities', '$24,278.30', '—', '—', '$24,278.30'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Accounts payable', '100', '—', '—', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liabilities', '$24,278.30', '—', '—', '$24,278.30'],
      },
    ],
  };

  const balance_sheets_p9_1: ITable = {
    thead: ['', startDate.dateFormatForForm, '*-*', '*-*', '*-*'],
    tbody: [
      {
        rowType: RowType.titleRow,
        rowData: ['Assets', 'Level 1', 'Level 2', 'Level 3', 'Total'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial funds', '$24,467.11', '$ —', '$ —', '$24,467.11'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['USDT', '$67.21', '$ —', '$ —', '$67.21'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Account receivable', '100', '', '', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Assets pledged as collateral', '500', '—', '—', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Crypto assets held', '2000', '—', '—', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total assets', '$24,534.32', '—', '—', '$24,534.32'],
      },
      {
        rowType: RowType.title,
        rowData: ['Liabilities and Stockholders’ Equity', '*-*', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Customer custodial cash liabilities', '$24467.11', '—', '—', '$24,467.11'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Accounts payable', '50', '—', '—', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liabilities', '$24,467.11', '—', '—', '$24,467.11'],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>BAIFA - {reportTitle}</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230801 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startDate.date}
          reportDateEnd={endDate.date}
        />
        <hr />

        {/* Info: (20230802 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230807 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230802 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-15px py-16px leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTableNew tableData={balance_sheets_p3_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Notes to Balance Sheets</h1>
            {/* Info: (20230802 - Julian) Note 1 */}
            <h2 className="font-bold uppercase"> 1. NATURE OF OPERATIONS</h2>
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
              ending <span className="font-bold text-violet">{endDate.dateFormatInUS}</span>, may
              not necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <p>
              The creation of these financial statements in accordance with GAAP requires management
              to make estimates and assumptions. Significant estimates and assumptions include the
              fair value of customer crypto assets and liabilities.
            </p>
            <p className="font-bold">
              Customer custodial funds and customer custodial cash liabilities
            </p>
            <p>
              Customer custodial funds represent restricted cash and cash equivalents maintained on
              <span className="font-bold text-violet"> BOLT VAULT</span> that are held for the
              exclusive benefit of customers and deposits in transit from payment processors and
              financial institutions. Under GAAP, the balance in these accounts that exceeds
              customer custodial cash liabilities is presented within cash and cash equivalents.
              Customer custodial cash liabilities represent the obligation to return crypto asset
              deposits held by customers on TideBit DeFi and unsettled crypto deposits and
              withdrawals. The Company restricts the use of the assets underlying the customer
              custodial funds to meet regulatory requirements and classifies the assets as current
              based on their purpose and availability to fulfill the Company’s direct obligation
              under customer custodial cash liabilities. As of
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, the
              Company’s eligible liquid assets were greater than the aggregate amount of customer
              custodial cash liabilities
            </p>
            {/* Info: (20230802 - Julian) Note 3 */}
            <h2 className="font-bold uppercase">3. CUSTOMER ASSETS AND LIABILITIES</h2>
            <p>
              TideBit DeFi employs a "P3 (Partial Private-Key Protection)" system of{' '}
              <span className="font-bold text-violet">BOLT</span> to safeguard the client's crypto
              assets, held in digital wallets, alongside essential fragments of cryptographic keys
              required for accessing these assets on our platform. 'P3 (Partial Private-Key
              Protection)' protocol allows us to safeguard the user's private key. In the event of a
              loss of the private key, through user authentication, a new set of authorized private
              key combinations can be reconstituted from other private key fragments, thereby
              ensuring the retrieval of the user's assets.
            </p>
            <p>
              These assets and keys are shielded from loss, theft, or any form of misuse. The Firm
              diligently records crypto assets owned by clients as well as corresponding client
              crypto liabilities, adhering to the recently enforced SAB 121. We keep track of all
              assets in digital wallets and parts or the entirety of private keys, including backup
              keys, managed on behalf of clients on our platform. Crypto assets for which the
              TideBit DeFi can't recover a
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <p>
              client's access to, are not recorded, as there is no related safeguarding obligation
              in accordance with SAB 121. TideBit DeFi regularly updates and initially recognizes
              the assets and liabilities at the fair value of the crypto assets safeguarded for our
              clients.
            </p>
            <p>
              During the
              <span className="font-bold text-violet"> 30 days ended {endDate.dateFormatInUS}</span>
              , no losses have been incurred in connection with customer crypto assets
            </p>
            <ReportTableNew tableData={balance_sheets_p6_1} />
            <p>
              The following table sets forth the fair value of customer crypto assets, as shown on
              the condensed consolidated balance sheets, as customer crypto assets and customer
              crypto liabilities (in billions):
            </p>
            <ReportTableNew tableData={balance_sheets_p6_2} />
            {/* Info: (20230802 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. ASSETS PLEDGED AS COLLATERAL</h2>
            <p>
              As of<span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, TideBit
              DeFi had pledged <span className="font-bold text-violet">USDT</span> that served
              exclusively as
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <p>
              collateralfor certain crypto asset borrowings with a fair value of at least 100% of
              the load amount outstanding.
            </p>
            <ReportTableNew tableData={balance_sheets_p7_1} />
            {/* Info: (20230802 - Julian) Note 5 */}
            <h2 className="font-bold uppercase">5. CRYPTO ASSETS HELD</h2>
            <p>
              As of<span className="font-bold text-violet"> {endDate.dateFormatForForm}</span> and
              <span className="font-bold text-violet"> {startDate.dateFormatForForm}</span>, the
              cost basis and fair value of our crypto assets held at impaired cost was as follows:
            </p>
            <ReportTableNew tableData={balance_sheets_p7_2} />
            <div className="-mt-10px flex flex-col text-xxs text-lilac">
              <p>(1) Cost amounts shown are net of impairment recognized.</p>
              <p>
                (2) The fair value of crypto assets held is based on quoted market prices for one
                unit of each crypto asset reported on our platform at 00:00 am Coordinated Universal
                Time (UTC) on the last day of the respective period multiplied by the quantity of
                each crypto asset held.
              </p>
            </div>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-32px py-16px text-xs leading-5">
            {/* Info: (20230802 - Julian) Note 6 */}
            <h2 className="font-bold uppercase">6. FAIR VALUE MEASUREMENTS</h2>
            <p>
              The following table sets forth by level, within the fair value hierarchy, the
              Company’s assets and liabilities measured and recorded at fair value on a recurring
              basis (in thousands):
            </p>
            <ReportTableNew tableData={balance_sheets_p8_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="mt-10px flex flex-col gap-y-20px py-16px text-xs leading-5">
            <ReportTableNew tableData={balance_sheets_p9_1} />
            {/* Info: (20230802 - Julian) Note 7 */}
            <h2 className="font-bold uppercase">7. Market price risk of crypto assets</h2>
            <p>
              Our revenue model primarily hinges on transaction fees, which can be a flat fee or
              calculated as a percentage of the transaction value. The exact fee may fluctuate
              depending on the payment type and the transaction value.
            </p>
            <p>
              However, it's important to be cognizant of the risks associated with crypto asset
              price volatility, which could negatively impact our operational results. Market prices
              of Bitcoin, Ethereum, and other crypto assets play a crucial role in determining our
              future profitability. These prices have shown significant fluctuation month over
              month, matching the pattern of our operational results, and there is no certainty that
              they will follow historical trends.
            </p>
            <p>
              A downturn in the market price of Bitcoin, Ethereum, and other crypto assets could
              negatively affect our earnings, the carrying value of our crypto assets, and our
              projected future cash flows. It could also pose a challenge to our liquidity and
              capability to fulfill
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 10 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={10}>
          <div className="flex flex-col gap-y-20px py-16px text-xs leading-5">
            <p> ongoing obligations.</p>
            <p>
              In terms of accounting procedures, we record impairment charges on our crypto assets
              when the market prices fall below the assets' carrying value.
            </p>
          </div>
        </ReportPageBody>
        <hr />
      </div>
    </>
  );
};

export default BalanceSheets;
