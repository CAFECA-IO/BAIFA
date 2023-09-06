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

const ComprehensiveIncomeStatements = () => {
  const reportTitle = BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];
  const startDate = timestampToString(reportsDateSpan.start);
  const endDate = timestampToString(reportsDateSpan.end);

  const income_statements_p3_1: ITable = {
    subThead: ['Income Statements - USD ($)', `30 Days Ended ${endDate.monthAndDay},`, '*-*'],
    thead: ['$ in Thousands', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Trading fee', '10', '5'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Spread Fee', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Withdrawal fee', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Deposit fee', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Liquidation fee', '10', '8'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Guaranteed stop loss fee', '10', '2'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', '$30', '$15'],
      },
      {
        rowType: RowType.title,
        rowData: ['Cost:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Technical supplier costs', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Market data supplier costs', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['New coin listing cost', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total cost', '$0', '$0'],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Employee salaries', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rent', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Marketing', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Rebate expenses', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total operating expenses', '$ 0', '$ 0'],
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
        rowData: ['Interest expense', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency forex losses', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Fiat to cryptocurrency conversion losses', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency to fiat conversion losses', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Fiat to fiat conversion losses', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total financial costs', '$ 0', '$ 0'],
      },
      {
        rowType: RowType.title,
        rowData: ['Total other gains/losses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Investment gains', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Forex gains', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Cryptocurrency gains', '0', '0'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Total other gains', '0', '0'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', '$ 30', '$ 15'],
      },
    ],
  };

  const income_statements_p7_1: ITable = {
    thead: [
      'Trading fee',
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
        rowData: ['USD', '10', '$ 10', '100%', '$ 5', '$ 5', '100%'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
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
        rowData: ['Total trading fee', '—', '$ 10', '100%', '—', '$ 5', '100%'],
      },
    ],
  };

  const income_statements_p7_2: ITable = {
    thead: [
      'Spread fee',
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
        rowData: ['USD', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
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
        rowData: ['Total spread fee', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
    ],
  };

  const income_statements_p8_1: ITable = {
    thead: [
      'Withdrawal fee',
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
        rowData: ['USD', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
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
        rowData: ['Total withdrawal fee', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
    ],
  };

  const income_statements_p8_2: ITable = {
    thead: [
      'Deposit fee',
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
        rowData: ['USD', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
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
        rowData: ['Total deposit fee', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
    ],
  };

  const income_statements_p9_1: ITable = {
    thead: [
      'Liquidation fee',
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
        rowData: ['USD', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Ethereum', '0', '0', '—', '0', '0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['USDT', '10', '10', '100%', '8', '8', '100%'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total liquidation fee', '0', '$ 10', '100%', '0', '$ 8', '100%'],
      },
    ],
  };

  const income_statements_p10_1: ITable = {
    thead: [
      'Guaranteed stop loss fee',
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
        rowData: ['USD', '0', '$ 0', '—', '0', '$ 0', '—'],
      },
      {
        rowType: RowType.bookkeeping,
        rowData: ['Bitcoin', '0', '0', '—', '0', '0', '—'],
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
        rowData: ['Total guaranteed stop loss fee', '0', '$ 0', '—', '0', '$ 0', '—'],
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
          reportDateStart={startDate.date}
          reportDateEnd={endDate.date}
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
              ending <span className="font-bold text-violet">{endDate.dateFormatInUS}</span>, may
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, showcasing
              the amount, cost value, and percentage of total fees for each currency.
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, showcasing
              the amount, cost value, and percentage of total fees for each currency.
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, to that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p8_1} />
            <p className="font-bold">Deposit fee</p>
            <p>
              Here, we present a comprehensive overview of the fees collected from customer
              deposits. The table contrasts the figures from
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with those
              from<span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, to that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>,
              highlighting the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p9_1} />
            <p className="italic text-lilac">Next Page</p>
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
              <span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, with that of
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p10_1} />
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
          <div className="flex flex-col gap-y-16px py-16px text-xs leading-5">
            <h2 className="font-bold uppercase">6. Market price risk of crypto assets</h2>
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

export default ComprehensiveIncomeStatements;
