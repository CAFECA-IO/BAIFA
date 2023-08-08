import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTableNew, {RowType} from '../../components/report_table/report_table_new';
import ReportExchageRateForm from '../../components/report_exchage_rate_form/report_exchage_rate_form';
import {BaifaReports} from '../../constants/baifa_reports';
import {reportsDateSpanJul} from '../../constants/config';
import {timestampToString} from '../../lib/common';

const cash_flows_p3_1 = {
  subThead: ['', '30 Days Ended Jul. 30,', '*-*'],
  thead: ['Statements of Cash Flows - USD ($)', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      rowType: RowType.title,
      rowData: ['Cash flows from operating activities:', '*-*', '*-*'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net profit', '$ 349.09', '$ 67.21'],
    },
    {
      rowType: RowType.title,
      rowData: ['Changes in operating assets and liabilities:', '*-*', '*-*'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['USDT', '349.09', '67.21'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Other current and non-current assets', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Other current and non-current liabilities', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash provided by operating activities', '349.09', '67.21'],
    },
    {
      rowType: RowType.title,
      rowData: ['Cash flows from investing activities', '*-*', '*-*'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Purchase of crypto assets held', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Disposal of crypto assets held', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash used in investing activities', '0', '0'],
    },
    {
      rowType: RowType.title,
      rowData: ['Cash flows from financing activities', '*-*', '*-*'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Customer custodial cash liabilities', '10,300', '14,500'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash used in financing activities', '10,300', '14,500'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: [
        'Net increase in cash, cash equivalents, and restricted cash',
        '10,649.09',
        '14,567.21',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: [
        'Effect of exchange rates on cash, cash equivalents, and restricted cash',
        '0',
        '0',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Cash, cash equivalents, and restricted cash, beginning of period', '1,000', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: [
        'Cash, cash equivalents, and restricted cash, end of period',
        '$ 25,216.30',
        '$ 14,567.21',
      ],
    },
  ],
};

const cash_flows_p4_1 = {
  tbody: [
    {
      rowType: RowType.title,
      rowData: [
        'Cash, cash equivalents, and restricted cash consisted of the following:',
        '*-*',
        '*-*',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Cash and cash equivalents', '$ 25,216.30', '$ 14,567.21'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Restricted cash', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Customer custodial cash', '24,278.3', '24,467.11'],
    },
    {
      rowType: RowType.foot,
      rowData: ['Total cash, cash equivalents, and restricted cash', '$ 49,494.60', '$ 39,034.32'],
    },
    {
      rowType: RowType.title,
      rowData: [
        'Supplemental schedule of non-cash investing and financing activities',
        '*-*',
        '*-*',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: [
        'Purchase of crypto assets and investments with non-cash consideration',
        '$ 0',
        '$ 0',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Disposal of crypto assets for non-cash consideration', '0', '0'],
    },
  ],
};

const cash_flows_p6_1 = {
  subThead: ['', '30 Days Ended Jul. 30,', '*-*'],
  thead: ['', '2023', '2022'],
  tbody: [
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash provided by operating activities', '$ 349.09', '$ 67.21'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash used in investing activities', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Net cash used in financing activities', '10,300', '14,500'],
    },
    {
      rowType: RowType.foot,
      rowData: [
        'Net increase in cash, cash equivalents, and restricted cash',
        '$ 10,649.09',
        '$ 14,567.21',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: [
        'Effect of exchange rates on cash, cash equivalents, and restricted cash',
        '0',
        '0',
      ],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Customer custodial cash', '$ 24,278.3', '$ 24,467.11'],
    },
  ],
};

const cash_flows_p7_1 = {
  thead: ['', 'Jul. 30, 2023', 'Jul. 1, 2023'],
  tbody: [
    {
      rowType: RowType.title,
      rowData: ['Cash and cash equivalents:', '*-*', '*-*'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Cash and cash equivalents (1)', '$ 25,216.3', '$ 14,567.21'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Restricted cash (2)', '0', '0'],
    },
    {
      rowType: RowType.contentWithMainColumn,
      rowData: ['Customer custodial cash', '24,278.3', '24,467.11'],
    },
    {
      rowType: RowType.foot,
      rowData: ['Total cash, cash equivalents, and restricted cash', '$ 49,494.6', '$ 39,034.32'],
    },
  ],
};

const StatementsOfCashFlows = () => {
  const reportTitle = BaifaReports.STATEMENTS_OF_CASH_FLOWS;
  const contentList = ['Statements of Cash Flows', 'Note To Statements of Cash Flows'];
  const startDate = timestampToString(reportsDateSpanJul.start);
  const endDate = timestampToString(reportsDateSpanJul.end);

  return (
    <>
      <Head>
        <title>BAIFA - {reportTitle}</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230808 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startDate.date}
          reportDateEnd={endDate.date}
        />
        <hr />

        {/* Info: (20230808 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230808 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230807 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-30px py-16px leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTableNew
              theadSubLineData={cash_flows_p3_1.subThead}
              theadData={cash_flows_p3_1.thead}
              tbodyData={cash_flows_p3_1.tbody}
            />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="py-16px">
            <ReportTableNew tbodyData={cash_flows_p4_1.tbody} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Note To Statements of Cash Flows</h1>
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
            <h2 className="font-bold uppercase"> 2. SUMMARY OF SIGNIFICANT ACCOUNTING POLICIES</h2>
            <p className="font-bold">Foundation for Presentation and Consolidation Principles </p>
            <p>
              The attached financial statements of the Company are not audited. These non-audited
              financial statements are prepared following the United States Generally Accepted
              Accounting Principles ("GAAP") in the same manner as the audited financial statements.
              In the management's view, they include all necessary adjustments, which are only
              regular, recurring adjustments, for a fair representation of the Company's financial
              statements for the periods shown. The non-audited operational results for the 30 days
              ending<span className="font-bold text-violet"> July 30, 2023</span>, may not
              necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
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
              <span className="font-bold text-violet"> July 30, 2023</span> and
              <span className="font-bold text-violet"> July 1, 2023</span>, the Company’s eligible
              liquid assets were greater than the aggregate amount of customer custodial cash
              liabilities
            </p>
            <h2 className="font-bold uppercase">3. Cash flows</h2>
            <ReportTableNew
              theadSubLineData={cash_flows_p6_1.subThead}
              theadData={cash_flows_p6_1.thead}
              tbodyData={cash_flows_p6_1.tbody}
            />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <h2 className="font-bold uppercase">4. Liquidity and Capital Resources</h2>
            <ReportTableNew theadData={cash_flows_p7_1.thead} tbodyData={cash_flows_p7_1.tbody} />
            <div className="-mt-10px flex flex-col text-xxs text-lilac">
              <p>
                (1) Cash equivalents consists of USDT and money market funds denominated in U.S.
                dollars.
              </p>
              <p>
                (2) Restricted cash consists primarily of amounts held in restricted bank accounts
                at certain third-party banks as security deposits or pledged as collateral to secure
                letters of credit.
              </p>
            </div>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-10px leading-5">
            <h1 className="text-lg font-bold text-violet">Exchange rate</h1>
            <ul className="ml-5 list-disc text-xxs text-lilac">
              <li>
                The table represents the exchange rates at 00:00 in the UTC+0 time zone. The
                exchange rates are used in revenue recognization.
              </li>
              <li>
                Please note that the values are approximate and may vary slightly due to market
                fluctuations.
              </li>
            </ul>

            <ReportExchageRateForm />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="flex flex-col gap-y-10px py-16px text-xs leading-5">
            <h2 className="font-bold uppercase">5. Market price risk of crypto assets</h2>
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
              capability to fulfill ongoing obligations.
            </p>
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

export default StatementsOfCashFlows;
