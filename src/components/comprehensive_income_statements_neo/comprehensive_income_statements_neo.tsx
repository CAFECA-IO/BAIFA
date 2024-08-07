import {useEffect, useRef} from 'react';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {BaifaReports} from '@/constants/baifa_reports';
import {A4_SIZE} from '@/constants/config';
import {IComprehensiveIncomeResponse} from '@/interfaces/comprehensive_income_neo';
import useAPIResponse from '@/lib/hooks/use_api_response';
import {timestampToString} from '@/lib/common';
import useWindowSize from '@/lib/hooks/use_window_size';
import {
  createCISFirstPart,
  createCISLastPart,
  createRevenueTable,
  createRevenueChangeTable,
} from '@/lib/reports/comprehensive_income_neo';
import ReportContent from '@/components/report_content/report_content';
import ReportCover from '@/components/report_cover/report_cover';
import ReportPageBody from '@/components/report_page_body/report_page_body';
import ReportRiskPages from '@/components/report_risk_pages/report_risk_pages';
import ReportTable from '@/components/report_table/report_table';
import ReportExchageRateFormNeo from '@/components/report_exchage_rate_form_neo/report_exchage_rate_form_neo';

interface IComprehensiveIncomeStatementsNeoProps {
  chainId: string;
  evidenceId: string;
}

const ComprehensiveIncomeStatementsNeo = ({
  chainId,
  evidenceId,
}: IComprehensiveIncomeStatementsNeoProps) => {
  const reportTitle = BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS;
  const contentList = [reportTitle, `Note To ${reportTitle}`];

  const {
    data: comprehensiveIncomeResponse,
    isLoading: isReportLoading,
    error: reportError,
  } = useAPIResponse<IComprehensiveIncomeResponse>(
    `${APIURL.CHAINS}/${chainId}/evidence/${evidenceId}/comprehensive_income`,
    {method: HttpMethod.GET}
  );

  const previousIncomeData = comprehensiveIncomeResponse?.previousReport;
  const currentIncomeData = comprehensiveIncomeResponse?.currentReport;
  const historicalIncomeData = comprehensiveIncomeResponse?.lastYearReport;

  const startIncomeDate = timestampToString(previousIncomeData?.reportEndTime);
  const endIncomeDate = timestampToString(currentIncomeData?.reportEndTime);

  // Info: (20240315 - Julian) 匯率表區間
  const exchangeRatePeriod = {
    startTimestamp: currentIncomeData?.reportStartTime ?? 0,
    endTimestamp: (currentIncomeData?.reportEndTime ?? 0) + 86400 * 30,
  };

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

  // Info: (20230922 - Julian) ------------ Comprehensive Income Statements Data ------------
  const mainTableThead = [
    '$ in Thousands',
    endIncomeDate.dateFormatForForm,
    startIncomeDate.dateFormatForForm,
  ];
  const cisEndedDate = `${endIncomeDate.monthAndDay}`;

  const income_statements_p3_1 = createCISFirstPart(
    mainTableThead,
    cisEndedDate,
    currentIncomeData,
    previousIncomeData
  );
  const income_statements_p4_1 = createCISLastPart(currentIncomeData, previousIncomeData);

  // Info: (20230921 - Julian) ------------ Revenue Table Data ------------
  const revenueDate = [
    `${endIncomeDate.dateFormatForForm}`,
    `${startIncomeDate.dateFormatForForm}`,
  ];

  // Info: (20230921 - Julian) Trading Fee
  // numero: 0. Total, 1. Bitcoin, 2. Ethereum, 3. USDT, 4. USD
  const numeroOfTradingFee = ['B011', 'B048, B049', 'B046, B047', 'B050, B051', 'B052, B053'];
  const income_statements_p7_1 = createRevenueTable(
    'Trading fee',
    revenueDate,
    currentIncomeData?.income.details.tradingFee,
    previousIncomeData?.income.details.tradingFee,
    numeroOfTradingFee
  );

  // Info: (20231013 - Julian) Spread Fee
  const numeroOfSpreadFee = ['B012', 'B056, B057', 'B054, B055', 'B058, B059', 'B060, B061'];
  const income_statements_p8_1 = createRevenueTable(
    'Spread fee',
    revenueDate,
    currentIncomeData?.income.details.spreadFee,
    previousIncomeData?.income.details.spreadFee,
    numeroOfSpreadFee
  );

  // Info: (20231013 - Julian) Withdrawal Fee
  const numeroOfWithdrawalFee = ['B005', 'B042, B043', 'B040, B041', 'B006, B007', 'B044, B045'];
  const income_statements_p9_1 = createRevenueTable(
    'Withdrawal fee',
    revenueDate,
    currentIncomeData?.income.details.withdrawalFee,
    previousIncomeData?.income.details.withdrawalFee,
    numeroOfWithdrawalFee
  );

  // Info: (20231013 - Julian) Deposit Fee
  const numeroOfDepositFee = ['B001', 'B036, B037', 'B034, B035', 'B002, B003', 'B038, B039'];
  const income_statements_p10_1 = createRevenueTable(
    'Deposit fee',
    revenueDate,
    currentIncomeData?.income.details.depositFee,
    previousIncomeData?.income.details.depositFee,
    numeroOfDepositFee
  );

  // Info: (20231013 - Julian) Liquidation Fee
  const numeroOfLiquidationFee = ['B013', 'B064, B065', 'B062, B063', 'B066, B067', 'B068, B069'];
  const income_statements_p11_1 = createRevenueTable(
    'Liquidation fee',
    revenueDate,
    currentIncomeData?.income.details.liquidationFee,
    previousIncomeData?.income.details.liquidationFee,
    numeroOfLiquidationFee
  );

  // Info: (20230921 - Julian) Guaranteed Stop Loss Fee
  const numeroOfGuaranteedStopLossFee = [
    'B014',
    'B072, B073',
    'B070, B071',
    'B074, B075',
    'B076, B077',
  ];
  const income_statements_p12_1 = createRevenueTable(
    'Guaranteed stop-loss fee',
    revenueDate,
    currentIncomeData?.income.details.guaranteedStopLossFee,
    previousIncomeData?.income.details.guaranteedStopLossFee,
    numeroOfGuaranteedStopLossFee
  );

  // Info: (20230921 - Julian) Rebate Expenses
  const numeroOfRebateExpenses = ['B020', 'B080, B081', 'B078, B079', 'B082, B083', 'B084, B085'];
  const income_statements_p13_1 = createRevenueTable(
    'Rebate expenses',
    revenueDate,
    currentIncomeData?.operatingExpenses.details.rebateExpenses,
    previousIncomeData?.operatingExpenses.details.rebateExpenses,
    numeroOfRebateExpenses
  );

  // Info: (20230921 - Julian) Cryptocurrency Forex Losses
  const numeroOfCryptocurrencyForexLosses = [
    'B022',
    'B088, B089',
    'B086, B087',
    'B090, B091',
    'B092, B093',
  ];
  const income_statements_p14_1 = createRevenueTable(
    'Cryptocurrency forex losses',
    revenueDate,
    currentIncomeData?.otherGainLosses.details.cryptocurrencyGains,
    previousIncomeData?.otherGainLosses.details.cryptocurrencyGains,
    numeroOfCryptocurrencyForexLosses
  );

  // Info: (20231013 - Julian) Technical Supplier Costs
  const numeroOfTechnicalSupplierCosts = [
    'B008',
    'B094, B095',
    'B009, B010',
    'B096, B097',
    'B098, B099',
  ];
  const income_statements_p15_1 = createRevenueTable(
    'Technical supplier costs',
    revenueDate,
    currentIncomeData?.costs.details.technicalProviderFee,
    previousIncomeData?.costs.details.technicalProviderFee,
    numeroOfTechnicalSupplierCosts
  );

  // Info: (20231116 - Julian) Cryptocurrency Gains
  const numeroOfCryptocurrencyGains = [
    'B028',
    'B104, B105',
    'B102, B103',
    'B100, B101',
    'B106, B107',
  ];
  const income_statements_p16_1 = createRevenueTable(
    'Cryptocurrency gains',
    revenueDate,
    currentIncomeData?.otherGainLosses.details.cryptocurrencyGains,
    previousIncomeData?.otherGainLosses.details.cryptocurrencyGains,
    numeroOfCryptocurrencyGains
  );

  // Info: (20230922 - Julian) ------------ Comprehensive Income Statements(this year vs last year) Data ------------
  const historicalTableThead = [
    'shares in Thousands, $ in Thousands',
    endIncomeDate.year,
    endIncomeDate.lastYear,
  ];

  const income_statements_p17_1 = createCISFirstPart(
    historicalTableThead,
    cisEndedDate,
    currentIncomeData,
    historicalIncomeData
  );

  const income_statements_p18_1 = createCISLastPart(currentIncomeData, historicalIncomeData);

  // Info: (20230922 - Julian) ------------ Revenue Change Table Data ------------
  const income_statements_p18_2 = createRevenueChangeTable(
    endIncomeDate.monthAndDay,
    [endIncomeDate.year, endIncomeDate.lastYear],
    currentIncomeData,
    historicalIncomeData
  );

  const report = isReportLoading ? ( // Info: (202340315 - Julian) Loading...
    <h1 className="p-4 text-center">Loading...</h1>
  ) : (
    <div className="flex h-1000px flex-col items-center a4:h-auto">
      <div ref={pageRef} className="flex w-full origin-top flex-col items-center font-inter">
        {/* Info: (20230807 - Julian) Cover */}
        <ReportCover
          reportTitle={reportTitle}
          reportDateStart={startIncomeDate.date}
          reportDateEnd={endIncomeDate.date}
        />
        <hr className="break-before-page" />

        {/* Info: (20230807 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr className="break-before-page" />

        {/* Info: (20230807 - Julian) Page 1 & 2 */}
        <ReportRiskPages reportTitle={reportTitle} />

        {/* Info: (20230807 - Julian) Page 3 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={3}>
          <div className="flex flex-col gap-y-12px py-8px leading-5">
            <h1 className="text-2xl font-bold text-violet">{reportTitle}</h1>
            <ReportTable tableData={income_statements_p3_1} />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 4 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={4}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <ReportTable tableData={income_statements_p4_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 5 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={5}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
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
              {`Operating on a global scale, TideBit DeFi's platform allows users to trade a variety of digital assets in a secure and decentralized manner. This means that rather than relying on a central authority to facilitate transactions, trades are executed directly between users through smart contracts on the blockchain. This not only enhances security but also increases transaction speed and reduces costs.`}
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
              {`The attached financial statements of the Company are not audited. These non-audited financial statements are prepared following the United States Generally Accepted Accounting Principles ("GAAP") in the same manner as the audited financial statements. In the management's view, they include all necessary adjustments, which are only regular, recurring adjustments, for a fair representation of the Company's financial statements for the periods shown. The non-audited operational results for
            the 30 days ending `}
              <span className="font-bold text-violet">{endIncomeDate.dateFormatInUS}</span>
              {`, may not
            necessarily predict the results for the full year or any other period.`}
            </p>
            <p className="font-bold">Use of estimates</p>
            <p>
              The creation of these financial statements in accordance with GAAP requires management
              to make estimates and assumptions. Significant estimates and assumptions include the
            </p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 6 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={6}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p>fair value of customer cryptocurrencies and liabilities.</p>
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
              {`It is essential to provide our investors with a granular view of our financial activities. By breaking down each revenue and cost category associated with fiat currencies and cryptocurrencies, we aim to offer a comprehensive understanding of our operations and financial health. This detailed approach ensures that our stakeholders can make informed decisions based on a thorough analysis of our income streams and expenditures. Below, you'll find specific breakdowns for each category:`}
            </p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 7 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={7}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Trading fee</p>
            <p>
              The table below provides a detailed breakdown of the trading fees we have collected.
              It contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p7_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 8 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={8}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Spread fee</p>
            <p>
              The table below provides a detailed breakdown of the spread fees we have collected. It
              contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p8_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 9 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={9}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Withdrawal fee</p>
            <p>
              This section offers insights into the fees associated with customer withdrawals. The
              table compares the withdrawal fee data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, to
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p9_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 10 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={10}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Deposit fee</p>
            <p>
              Here, we present a comprehensive overview of the fees collected from customer
              deposits. The table contrasts the figures from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p10_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 11 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={11}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Liquidation fee</p>
            <p>
              This table provides a detailed view of the fees collected from liquidation activities.
              It compares the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, to
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              highlighting the amount, cost value, and percentage of total fees for each currency.
            </p>
            <ReportTable tableData={income_statements_p11_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 12 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={12}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Guaranteed stop loss fee</p>
            <p>
              Below is a representation of the fees associated with the guaranteed stop loss
              feature. The table contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p12_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 13 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={13}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Rebate expenses</p>
            <p>
              This section offers a comprehensive view of the expenses related to rebates provided
              to our customers. The table contrasts the figures from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              those from
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>.
            </p>
            <ReportTable tableData={income_statements_p13_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 14 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={14}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Cryptocurrency forex losses</p>
            <p>
              The table below provides insights into the losses incurred from cryptocurrency forex
              activities. It contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total losses for each currency.
            </p>
            <ReportTable tableData={income_statements_p14_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 15 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={15}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Technical supplier costs</p>
            <p>
              The table below provides insights into the losses incurred from technical supplier
              costs. It contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total losses for each currency.
            </p>
            <ReportTable tableData={income_statements_p15_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 16 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={16}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p className="font-bold">Cryptocurrency gains</p>
            <p>
              The table below provides insights into the gains incurred from cryptocurrency. It
              contrasts the data from
              <span className="font-bold text-violet"> {endIncomeDate.dateFormatInUS}</span>, with
              that of
              <span className="font-bold text-violet"> {startIncomeDate.dateFormatInUS}</span>,
              showcasing the amount, cost value, and percentage of total losses for each currency.
            </p>
            <ReportTable tableData={income_statements_p16_1} />
            <p className="italic text-lilac">Next Page</p>
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 17 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={17}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 4 */}
            <h2 className="font-bold uppercase">4. Results of Operations</h2>
            <p>The following table summarizes the historical statement of income data:</p>
            <ReportTable tableData={income_statements_p17_1} />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 18 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={18}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <ReportTable tableData={income_statements_p18_1} />
            <p>
              Comparison of the
              <span className="font-bold text-violet"> 30 days ended July 30, 2023 and 2022</span>
            </p>
            <ReportTable tableData={income_statements_p18_2} />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 19 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={19}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            {/* Info: (20230906 - Julian) Note 5 */}
            <h2 className="font-bold uppercase">5. Exchange rate</h2>
            <p>
              The table represents the exchange rates at 00:00 in the UTC+0 time zone. The exchange
              rates are used in revenue recognization.
            </p>
            <ReportExchageRateFormNeo
              startTimestamp={exchangeRatePeriod.startTimestamp}
              endTimestamp={exchangeRatePeriod.endTimestamp}
            />
          </div>
        </ReportPageBody>
        <hr className="break-before-page" />

        {/* Info: (20230906 - Julian) Page 20 */}
        <ReportPageBody reportTitle={reportTitle} currentPage={20}>
          <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
            <p>
              Please note that the values are approximate and may vary slightly due to market
              fluctuations.
            </p>
            {/* Info: (20230906 - Julian) Note 6 */}
            <h2 className="font-bold uppercase">6. Market price risk of cryptocurrencies</h2>
            <p>
              {`Our revenue model primarily hinges on transaction fees, which can be a flat fee or calculated as a percentage of the transaction value. The exact fee may fluctuate depending on the payment type and the transaction value.`}
            </p>
            <p>
              {`However, it's important to be cognizant of the risks associated with cryptocurrency price volatility, which could negatively impact our operational results. Market prices of Bitcoin, Ethereum, and other cryptocurrencies play a crucial role in determining our future profitability. These prices have shown significant fluctuation month over month, matching the pattern of our operational results, and there is no certainty that they will follow historical trends.`}
            </p>
            <p>
              {`A downturn in the market price of Bitcoin, Ethereum, and other cryptocurrencies could negatively affect our earnings, the carrying value of our cryptocurrencies, and our projected future cash flows. It could also pose a challenge to our liquidity and capability to fulfill ongoing obligations.`}
            </p>
            <p>
              {`In terms of accounting procedures, we record impairment charges on our cryptocurrencies when the market prices fall below the assets' carrying value.`}
            </p>
          </div>
        </ReportPageBody>
      </div>
    </div>
  );

  const displayReport = reportError ? (
    // Info: (202340315 - Julian) No comprehensive income statements data
    <h1 className="p-4 text-center">No comprehensive income statements data</h1>
  ) : (
    report
  );

  return <>{displayReport}</>;
};

export default ComprehensiveIncomeStatementsNeo;
