import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportRiskPages from '../../components/report_risk_pages/report_risk_pages';
import ReportTableNew from '../../components/report_table/report_table';
import ReportExchageRateForm from '../../components/report_exchage_rate_form/report_exchage_rate_form';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {reportsDateSpan, operationContent} from '../../constants/config';
import {timestampToString} from '../../lib/common';

const ComprehensiveIncomeStatements = () => {
  const reportTitle = BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];
  const startDate = timestampToString(reportsDateSpan.start);
  const endDate = timestampToString(reportsDateSpan.end);

  const income_statements_p3_1: ITable = {
    subThead: ['Income Statements - USD ($)', `30 Days Ended ${endDate.monthAndDay},`, '*-*'],
    thead: ['*|*', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revene:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Net revenue:', '$ 349.09', '$ 67.21'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', '349.09', '67.21'],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Transaction expense', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Total operating expenses', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Operating profit', '349.09', '67.21'],
      },
      {
        rowType: RowType.emptyRow,
        rowData: ['', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Interest expense', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Profit before income taxes', '349.09', '67.21'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', '$ 349.09', '$ 67.21'],
      },
    ],
  };

  const income_statements_p3_2: ITable = {
    subThead: [
      'Comprehensive Income Statements - USD ($)',
      `30 Days Ended ${endDate.monthAndDay},`,
      '*-*',
    ],
    thead: ['*|*', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Net profit', '$ 349.09', '—'],
      },
      {
        rowType: RowType.title,
        rowData: ['Other comprehensive income (loss), net of tax:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Foreign currency translation adjustments', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Total other comprehensive income', '0', '—'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Comprehensive income', '$ 349.09', '—'],
      },
    ],
  };

  const income_statements_p6_1: ITable = {
    thead: ['', endDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Net profit', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Transaction revenue', '$ 349.09'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', '$ 349.09'],
      },
    ],
  };

  const income_statements_p7_1: ITable = {
    subThead: ['Income Statements - USD ($)', `30 Days Ended ${endDate.monthAndDay},`, '*-*'],
    thead: ['*|*', endDate.dateFormatForForm, startDate.dateFormatForForm],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revenue:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Net revenue', '$ 349.09', '$ 67.21'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Total revenue', '349.09', '67.21'],
      },
      {
        rowType: RowType.title,
        rowData: ['Operating expenses:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Transaction expense', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Total operating expenses', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Operating profit', '349.09', '67.21'],
      },
      {
        rowType: RowType.emptyRow,
        rowData: ['', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Interest expense', '0', '0'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Profit before income taxes', '349.09', '67.21'],
      },
      {
        rowType: RowType.foot,
        rowData: ['Net profit', '$ 349.09', '$ 67.21'],
      },
    ],
  };

  const income_statements_p7_2: ITable = {
    subThead: ['', `30 Days Ended ${endDate.monthAndDay},`, '*-*', '*-*'],
    thead: ['*|*', endDate.year, endDate.lastYear, '% Change'],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Revenue:', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Net revenue', '$ 349.09', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Total revenue', '$ 349.09', '—', '—'],
      },
    ],
  };

  const displayOperations = (
    <>
      <h2 className="font-bold uppercase"> 1. {operationContent.title}</h2>
      {operationContent.content.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </>
  );

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
          <div className="flex flex-col gap-y-30px py-16px leading-5">
            <h1 className="text-2xl font-bold text-violet">{reportTitle}</h1>
            <ReportTableNew tableData={income_statements_p3_1} />

            <h1 className="text-2xl font-bold text-violet">Comprehensive Income Statements</h1>
            <ReportTableNew tableData={income_statements_p3_2} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">
              Note To Comprehensive Income Statements
            </h1>
            {displayOperations}
            <h2 className="font-bold uppercase"> 2. SUMMARY OF SIGNIFICANT ACCOUNTING POLICIES</h2>
            <p className="font-bold">Foundation for Presentation and Consolidation Principles </p>
            <p>
              The attached financial statements of the Company are not audited. These non-audited
              financial statements are prepared following the United States Generally Accepted
              Accounting Principles ("GAAP") in the same manner as the audited financial statements.
              In the management's view, they include all necessary adjustments, which are only
              regular, recurring adjustments, for a fair representation of the Company's financial
              statements for the periods shown. The non-audited operational results for the one
              month ending <span className="font-bold text-violet">{endDate.dateFormatInUS}</span>,
              may not necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 5 */}
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
            <h2 className="font-bold uppercase">3. REVENUE</h2>
            <p>Revenue recognition</p>
            <p>
              The organization establishes the process of acknowledging income from customer
              contracts through the subsequent stages:
            </p>
            <ul className="my-4 ml-5 list-disc text-xs leading-5">
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
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-15px py-16px text-xs leading-5">
            <p>
              over to the clients, in a quantity that mirrors the payment the organization
              anticipates to receive in return for those products or services. The organization
              primarily accumulates income through transaction fees levied on the platform.
            </p>

            <ReportTableNew tableData={income_statements_p6_1} />

            <p className="font-bold">Transaction revenue</p>
            <p>
              TideBit DeFi provides services centered around Contract for Differences (CFD) and
              deposit cryptocurrency services. A significant part of our revenue comes from
              transaction fees collected from customers. However, it's important to note that the
              price of crypto assets isn't set by the Exchange, as it's a market rate established by
              the users on the platform. Essentially, the Exchange plays the role of an agent,
              enabling one customer to purchase crypto assets from another.
            </p>
            <p>
              Our contracts with customers are generally open-ended and either party can terminate
              them without incurring a termination penalty. Therefore, these contracts are defined
              at the transaction level and do not extend beyond the service already provided.
            </p>
            <p>
              In certain instances, the transaction fee is collected in the form of crypto assets.
              In these cases, the revenue is measured based on the amount of crypto assets received
              and their fair value at the time of the transaction. Once a transaction is processed,
              TideBit DeFi considers its performance obligation fulfilled and accordingly recognizes
              the revenue.
            </p>
            <h2 className="font-bold uppercase">4. Operating expenses</h2>
            <p>Operating expenses consist of transaction expense.</p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230807 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-10px py-16px text-xs leading-5">
            <p className="font-bold">Transaction expense</p>
            <p>
              Transaction expense includes costs incurred to operate our platform and process crypto
              asset trades. These costs include miner fees to process transactions on blockchain
              networks, fees paid to other exchanges.
            </p>
            <h2 className="font-bold uppercase">5. Results of Operations</h2>
            <p>The following table summarizes the historical statement of operations data:</p>
            <ReportTableNew tableData={income_statements_p7_1} />
            <p>
              Comparison of the
              <span className="font-bold text-violet">
                {' '}
                30 days ended {endDate.dateFormatInUS} and {endDate.lastYear}
              </span>
            </p>
            <ReportTableNew tableData={income_statements_p7_2} />
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
