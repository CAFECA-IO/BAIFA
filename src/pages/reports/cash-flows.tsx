import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTable from '../../components/report_table/report_table';
import ReportExchageRateForm from '../../components/report_exchage_rate_form/report_exchage_rate_form';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {reportsDateSpan} from '../../constants/config';
import {timestampToString} from '../../lib/common';

const StatementsOfCashFlows = () => {
  const reportTitle = BaifaReports.STATEMENTS_OF_CASH_FLOWS;
  const contentList = ['Statements of Cash Flows', 'Note To Statements of Cash Flows'];
  const startDate = timestampToString(reportsDateSpan.start);
  const endDate = timestampToString(reportsDateSpan.end);

  const cash_flows_p3_1: ITable = {
    subThead: [
      'Statements of Cash Flows - USD ($)',
      `30 Days Ended ${endDate.monthAndDay},`,
      '*-*',
    ],
    thead: ['$ in Thousands', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Cash flows from operating activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash deposited by customers', '$ 0', '$ 0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash withdrawn by customers', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Purchase of cryptocurrencies', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Disposal of cryptocurrencies', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash received from customers as transaction fee', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash received from customers for liquidation in CFD trading', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash paid to customers as rebates for transaction fees', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash paid to suppliers for expenses', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash paid to customers for CFD trading profits', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash provided by operating activities', '0', '0'],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from investing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash provided by investing activities', '0', '0'],
      },
      {
        rowType: RowType.title,
        rowData: ['Cash flows from financing activities', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash used in financing activities', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net increase in cash, cash equivalents, and restricted cash', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cash, cash equivalents, and restricted cash, beginning of period', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Cash, cash equivalents, and restricted cash, end of period', '$ 0', '$ 0'],
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
        rowData: ['Cryptocurrencies deposited by customers', '$ 30', '$ 50'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrencies withdrawn by customers', '(70)', '(20)'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency inflows', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency outflows', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrencies received from customers as transaction fees', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: [
          'Cryptocurrencies received from customers for liquidation in CFD trading',
          '1000',
          '10',
        ],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrencies paid to customers for CFD trading profits', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Purchase of cryptocurrencies with non-cash consideration', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Disposal of cryptocurrencies for non-cash consideration', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net increase in non-cash operating activities', '1000', '20'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrencies, beginning of period', '50', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Cryptocurrencies, end of period', '$ 1000', '$ 50'],
      },
    ],
  };

  const cash_flows_p8_1: ITable = {
    subThead: ['', `30 Days Ended ${endDate.monthAndDay},`, '*-*'],
    thead: ['*|*', endDate.year, endDate.lastYear],
    tbody: [
      {
        rowType: RowType.headline,
        rowData: ['', '(in thousands)', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash provided by operating activities', '$ 0', '$ 0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash used in investing activities', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net cash used in financing activities', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net increase in cash, cash equivalents, and restricted cash', '$ 0', '$ 0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Net increase in non-cash operating activities', '$ 1000', '$ 1000'],
      },
    ],
  };

  const cash_flows_p9_1: ITable = {
    thead: [
      'Cryptocurrencies deposited by customers',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
        rowData: ['Bitcoin', '2', '$ 10', '33.3%', '5', '$ 10', '50%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '5', '10', '33.3%', '3.9', '5', '25%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '10000', '10', '33.3%', '33000', '5', '25%'],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies deposited by customers',
          '—',
          '$ 30',
          '99.9%',
          '—',
          '$ 20',
          '100.0%',
        ],
      },
    ],
  };

  const cash_flows_p9_2: ITable = {
    thead: [
      'Cryptocurrencies withdrawn by customers',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
        rowData: ['Bitcoin', '2', '$ 20', '28.6%', '5', '$ 10', '16.4%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '5', '20', '28.6%', '3.9', '20', '34.2%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '10000', '30', '42.8%', '33000', '20', '49.3%'],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies withdrawn by customers',
          '—',
          '$ 70',
          '100%',
          '—',
          '$ 50',
          '100.0%',
        ],
      },
    ],
  };

  const cash_flows_p10_1: ITable = {
    thead: [
      'Cryptocurrency inflows',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
        rowData: ['Total cryptocurrency inflows', '—', '$ 0', '—', '—', '$ 0', '—'],
      },
    ],
  };

  const cash_flows_p10_2: ITable = {
    thead: [
      'Cryptocurrency outflows',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
        rowData: ['Total cryptocurrency outflows', '—', '$ 0', '—', '—', '$ 0', '—'],
      },
    ],
  };

  const cash_flows_p11_1: ITable = {
    thead: [
      'Cryptocurrencies received from customers as transaction fees',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
          'Total cryptocurrencies received from customers as transaction fees',
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

  const cash_flows_p12_1: ITable = {
    thead: [
      'Cryptocurrencies received from customers for liquidation in CFD trading',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
        rowData: ['Bitcoin', '2', '$ 3000', '30.0%', '0.2', '$ 3', '30.0%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '5', '2000', '20.0%', '2.1', '2', '20.0%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '5000000', '5000', '50.0%', '5000', '5', '50.0%'],
      },
      {
        rowType: RowType.foot,
        rowData: [
          'Total cryptocurrencies received from customers for liquidation in CFD trading',
          '—',
          '$ 1000',
          '100.0%',
          '—',
          '$ 10',
          '100.0%',
        ],
      },
    ],
  };

  const cash_flows_p13_1: ITable = {
    thead: [
      'Cryptocurrencies paid to customers for CFD trading profits',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
          'Total cryptocurrencies paid to customers for CFD trading profits',
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

  const cash_flows_p14_1: ITable = {
    thead: [
      'Purchase of cryptocurrencies with non-cash consideration',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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

  const cash_flows_p15_1: ITable = {
    thead: [
      'Disposal of cryptocurrencies for non-cash consideration',
      endDate.dateFormatForForm,
      '*-*',
      '*-*',
      startDate.dateFormatForForm,
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
              ending<span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, may
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span> and
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, the
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
                {endDate.monthFullName} {endDate.day}
              </span>{' '}
              in both
              <span className="font-bold text-violet"> {endDate.year}</span> and
              <span className="font-bold text-violet"> {endDate.lastYear}</span>. This table
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, to that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, showcasing
              the amount, cost value, and percentage of total deposits for each cryptocurrency.
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with those
              from<span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>,
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, to that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p10_1} />
            <p className="font-bold">Cryptocurrency outflows</p>
            <p>
              This table depicts the decreases of cryptocurrencies. It provides a comparison between
              the data from
              <span className="font-bold text-violet">
                {' '}
                {endDate.dateFormatInUS}, and {startDate.dateFormatInUS}
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, is compared
              with that of<span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>
              .
            </p>
            <ReportTable tableData={cash_flows_p11_1} />
            <p className="italic text-lilac">Next Page</p>
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with those
              from<span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p12_1} />
            <p className="italic text-lilac">Next Page</p>
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, is
              juxtaposed with that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p13_1} />
            <p className="italic text-lilac">Next Page</p>
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, to that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p14_1} />
            <p className="italic text-lilac">Next Page</p>
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with those
              from<span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={cash_flows_p15_1} />
            <p className="italic text-lilac">Next Page</p>
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
