import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportTable from '../../components/report_table/report_table';
import {BaifaReports} from '../../constants/baifa_reports';
import {
  //balance_sheets_p3_1,
  balance_sheets_p6_1,
  balance_sheets_p6_2,
  balance_sheets_p7_1,
} from '../../constants/report_table_data';

const StatementOfRedFlags = () => {
  const contentList = ['Balance Sheets', 'Note To Balance Sheets'];

  return (
    <>
      <Head>
        <title>BAIFA - {BaifaReports.BALANCE_SHEETS}</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230801 - Julian) Cover */}
        <ReportCover
          reportTitle={BaifaReports.BALANCE_SHEETS}
          reportDateStart="2023-06-24"
          reportDateEnd="2023-07-24"
        />
        <hr />

        {/* Info: (20230802 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230802 - Julian) Page 1 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={1}>
          <h1 className="text-lg font-bold text-violet">Summary of Risk Factors</h1>
          <p className="my-4 text-xs leading-5">
            Our business is subject to various risks and uncertainties, including those detailed
            below. The most significant risks include:
          </p>
          <ul className="my-4 ml-5 list-disc text-xs leading-5">
            <li>
              Our total revenue largely depends on the prices of crypto assets and the volume of
              transactions on our platform. A decline in these could negatively affect our business,
              operating results, and financial condition.
            </li>
            <li>
              Our net revenue may be concentrated in a few areas. A significant portion comes from
              transactions in Bitcoin and Ethereum and interest income from USDT. If these revenue
              sources decline and are not replaced by new demand, our business could be negatively
              affected.
            </li>
            <li>
              We have formed, and may form in the future, partnerships or strategic alliances with
              third parties. If these relationships are unsuccessful or these third parties fail to
              deliver certain services, our business could be negatively affected.
            </li>
            <li>Fluctuations in interest rates could have a negative impact on us.</li>
            <li>
              The future growth of cryptocurrency is subject to unpredictable factors. If crypto
              doesn't grow as we expect, our business could be negatively affected.
            </li>
            <li>
              Cyberattacks and security breaches could harm our brand and reputation and negatively
              affect our business.
            </li>
            <li>
              We operate in a complex and uncertain regulatory landscape. Any adverse changes or
              failure to comply with laws and regulations could negatively affect our business.
            </li>
            <li>
              We operate in a highly competitive industry and compete against unregulated companies
              and companies with greater resources. If we can't effectively respond to our
              competitors, our business could be negatively affected.
            </li>
            <li>
              We compete against a growing number of decentralized and noncustodial platforms.
              Failure to compete effectively against them could negatively affect our business.
            </li>
            <li>
              As we expand internationally, our obligations to comply with various jurisdictions'
              laws will increase, and we may be subject to inquiries, investigations, and
              enforcement actions.
            </li>
            <li>
              We are subject to material litigation, including individual and class action lawsuits,
              as well as investigations and enforcement actions. These matters can be expensive and
            </li>
          </ul>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 2 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={2}>
          <ul className="my-4 ml-5 list-disc text-xs leading-5">
            <p>time-consuming, and if resolved adversely, could harm our business.</p>
            <li>
              If we can't keep pace with rapid industry changes to provide new and innovative
              products and services, our net revenue could decline, negatively impacting our
              business.
            </li>
            <li>
              The status of a particular crypto asset as a "security" is highly uncertain. If we
              incorrectly characterize a crypto asset, we may face regulatory scrutiny,
              investigations, fines, and other penalties.
            </li>
            <li>
              We rely on third-party service providers for certain operations. Any service
              interruptions from these third parties may impair our ability to support our
              customers.
            </li>
            <li>
              Loss of a critical banking or insurance relationship could negatively affect our
              business.
            </li>
            <li>
              Any significant disruption in our products, services, IT systems, or any of the
              blockchain networks we support could result in a loss of customers or funds and
              negatively impact our brand and reputation.
            </li>
            <li>
              Our failure to safeguard and manage our and our customers’ fiat currencies and crypto
              assets could negatively impact our business.
            </li>
            <li>
              The theft, loss, or destruction of private keys required to access any crypto assets
              held in custody for our own account or for our customers may be irreversible. If we
              are unable to access our private keys or if we experience a hack or other data loss,
              it could cause regulatory scrutiny, reputational harm, and other losses.
            </li>
          </ul>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 3 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={3}>
          <h1 className="mb-16px text-32px font-bold text-violet">{BaifaReports.BALANCE_SHEETS}</h1>
          <table className="text-xs">
            <thead className="border border-violet bg-violet font-bold text-white">
              <tr className="py-5px">
                <th>
                  <p>Balance Sheets - USD ($)</p>
                  <p>$ in Thousands</p>
                </th>
                <th>Jul. 30, 2023</th>
                <th>Jul. 1, 2023</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-x border-b border-black font-bold text-violet">
                <td colSpan={3} className="p-5px">
                  Assets
                </td>
              </tr>
              {/* Info: (20230802 - Julian) Current assets */}
              <tr className="border-x border-b border-black font-bold text-darkPurple3">
                <td colSpan={3} className="p-5px">
                  Current assets:
                </td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Customer custodial funds</td>
                <td className="border-l border-black p-5px text-right">$ 1,000</td>
                <td className="border-l border-black p-5px text-right">$ 1,000</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">USDT</td>
                <td className="border-l border-black p-5px text-right">800</td>
                <td className="border-l border-black p-5px text-right">1,400</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Account receivable</td>
                <td className="border-l border-black p-5px text-right">200</td>
                <td className="border-l border-black p-5px text-right">100</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Assets pledged as collateral</td>
                <td className="border-l border-black p-5px text-right">1,000</td>
                <td className="border-l border-black p-5px text-right">500</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Total current assets</td>
                <td className="border-l border-black p-5px text-right">3,000</td>
                <td className="border-l border-black p-5px text-right">3,000</td>
              </tr>
              {/* Info: (20230802 - Julian) Non-current assets */}
              <tr className="border-x border-b border-black font-bold text-darkPurple3">
                <td colSpan={3} className="p-5px">
                  Non-current assets:
                </td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Crypto assets held</td>
                <td className="border-l border-black p-5px text-right">2,000</td>
                <td className="border-l border-black p-5px text-right">2,000</td>
              </tr>
              {/* Info: (20230802 - Julian) Total assets */}
              <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                <td className="p-5px">Total assets:</td>
                <td className="border-l border-black p-5px text-right">$5,000</td>
                <td className="border-l border-black p-5px text-right">$5,000</td>
              </tr>
              {/* Info: (20230802 - Julian) Liabilities and Stockholders' Equity */}
              <tr className="border-x border-b border-black font-bold text-violet">
                <td colSpan={3} className="p-5px">
                  Liabilities and Stockholders' Equity
                </td>
              </tr>
              {/* Info: (20230802 - Julian) Current liabilities */}
              <tr className="border-x border-b border-black font-bold text-darkPurple3">
                <td colSpan={3} className="p-5px">
                  Current liabilities:
                </td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Customer custodial cash liabilities</td>
                <td className="border-l border-black p-5px text-right">$ 1,900</td>
                <td className="border-l border-black p-5px text-right">$ 1,950</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Accounts payable</td>
                <td className="border-l border-black p-5px text-right">100</td>
                <td className="border-l border-black p-5px text-right">50</td>
              </tr>
              {/* Info: (20230802 - Julian) Total liabilities */}
              <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                <td className="p-5px">Total liabilities</td>
                <td className="border-l border-black p-5px text-right">2,000</td>
                <td className="border-l border-black p-5px text-right">2,000</td>
              </tr>
              {/* Info: (20230802 - Julian) Stockholders' equity */}
              <tr className="border-x border-b border-black font-bold text-violet">
                <td colSpan={3} className="p-5px">
                  Stockholders' equity
                </td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Additional paid-in capital</td>
                <td className="border-l border-black p-5px text-right">1,900</td>
                <td className="border-l border-black p-5px text-right">2,000</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Accumulated other comprehensive income</td>
                <td className="border-l border-black p-5px text-right">100</td>
                <td className="border-l border-black p-5px text-right">0</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Retained earnings</td>
                <td className="border-l border-black p-5px text-right">1,000</td>
                <td className="border-l border-black p-5px text-right">1,000</td>
              </tr>
              <tr className="border-x border-b border-black text-darkPurple3">
                <td className="p-5px text-lilac">Total stockholders' equity</td>
                <td className="border-l border-black p-5px text-right">3,000</td>
                <td className="border-l border-black p-5px text-right">3,000</td>
              </tr>
              {/* Info: (20230802 - Julian) Total liabilities and stockholders' equity */}
              <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                <td className="p-5px">Total liabilities and stockholders' equity</td>
                <td className="border-l border-black p-5px text-right">$5,000</td>
                <td className="border-l border-black p-5px text-right">$5,000</td>
              </tr>
            </tbody>
          </table>
        </ReportPageBody>
        <hr />

        {/*         <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={0}>
          <ReportTable tableData={balance_sheets_p3_1} />
        </ReportPageBody> */}
        <hr />

        {/* Info: (20230802 - Julian) Page 4 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={4}>
          <div className="flex flex-col gap-y-15px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Notes to Balance Sheets</h1>
            {/* Info: (20230802 - Julian) Note 1 */}
            <h2 className="font-bold"> 1. NATURE OF OPERATIONS</h2>
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
            <h2 className="font-bold"> 2. SUMMARY OF SIGNIFICANT ACCOUNTING POLICIES</h2>
            <p className="font-bold">Foundation for Presentation and Consolidation Principles</p>
            <p>
              The attached financial statements of the Company are not audited. These non-audited
              financial statements are prepared following the United States Generally Accepted
              Accounting Principles ("GAAP") in the same manner as the audited financial statements.
              In the management's view, they include all necessary adjustments, which are only
              regular, recurring adjustments, for a fair representation of the Company's financial
              statements for the periods shown. The non-audited operational results for the 30 days
              ending <span className="font-bold text-violet">July 30, 2023</span>, may not
              necessarily predict the results for the full year or any other period.
            </p>
            <p className="font-bold">Use of estimates</p>
            <p>
              The creation of these financial statements in accordance with GAAP requires management
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 5 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={5}>
          <div className="flex flex-col gap-y-15px text-xs leading-5">
            <p>
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
              under customer custodial cash liabilities. As of{' '}
              <span className="font-bold text-violet">July 30, 2023</span> and{' '}
              <span className="font-bold text-violet">July 1, 2023</span>, the Company’s eligible
              liquid assets were greater than the aggregate amount of customer custodial cash
              liabilities
            </p>
            {/* Info: (20230802 - Julian) Note 3 */}
            <h2 className="font-bold"> 3. CUSTOMER ASSETS AND LIABILITIES</h2>
            <p>
              TideBit DeFi employs a "P3 (Partial Private-Key Protection)" system of BOLT to
              safeguard the client's crypto assets, held in digital wallets, alongside essential
              fragments of cryptographic keys required for accessing these assets on our platform.
              'P3 (Partial Private-Key Protection)' protocol allows us to safeguard the user's
              private key. In the event of a loss of the private key, through user authentication, a
              new set of authorized private key combinations can be reconstituted from other private
              key fragments, thereby ensuring the retrieval of the user's assets.
            </p>
            <p>
              These assets and keys are shielded from loss, theft, or any form of misuse. The Firm
              diligently records crypto assets owned by clients as well as corresponding client
              crypto liabilities, adhering to the recently enforced SAB 121. We keep track of all
              assets in digital wallets and parts or the entirety of private keys, including backup
              keys, managed on behalf of clients on our platform. Crypto assets for which the
              TideBit DeFi can't recover a client's access to, are not recorded, as there is no
              related safeguarding obligation in
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 6 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={6}>
          <div className="flex flex-col gap-y-15px text-xs leading-5">
            <p>
              accordance with SAB 121. TideBit DeFi regularly updates and initially recognizes the
              assets and liabilities at the fair value of the crypto assets safeguarded for our
              clients.
            </p>
            <p>
              During the <span className="font-bold text-violet">30 days ended July 30, 2023</span>,
              no losses have been incurred in connection with customer crypto assets
            </p>
            <ReportTable tableData={balance_sheets_p6_1} />
            {/* Till: (20230824 - Julian) old table */}
            {/* <table className="my-5px text-xs">
              <thead className="border border-violet bg-violet font-bold text-white">
                <tr>
                  <th className="py-10px">$ in Thousands</th>
                  <th>Jul. 30, 2023</th>
                  <th>Jul. 1, 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Customer custodial funds</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                </tr>
                <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                  <td className="p-5px">Total customer assets</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Customer custodial cash liabilities</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                </tr>
                <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                  <td className="p-5px">Total customer liaiblities</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                  <td className="border-l border-black p-5px text-right">$ 1,000</td>
                </tr>
              </tbody>
            </table> */}
            <p>
              The following table sets forth the fair value of customer crypto assets, as shown on
              the condensed consolidated balance sheets, as customer crypto assets and customer
              crypto liabilities (in billions):
            </p>
            <ReportTable tableData={balance_sheets_p6_2} />
            {/* Till: (20230824 - Julian) old table */}
            {/* <table className="my-5px text-xs">
              <thead className="border border-violet bg-violet font-bold text-white">
                <tr>
                  <th className="py-10px">$ in Thousands</th>
                  <th colSpan={2}>Jul. 30, 2023</th>
                  <th colSpan={2}>Jul. 1, 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac"></td>
                  <td className="w-80px border-l border-black p-5px text-center text-lilac">
                    Fair Value
                  </td>
                  <td className="w-80px border-l border-black p-5px text-center text-lilac">
                    Percentage of Total
                  </td>
                  <td className="w-80px border-l border-black p-5px text-center text-lilac">
                    Fair Value
                  </td>
                  <td className="w-80px border-l border-black p-5px text-center text-lilac">
                    Percentage of Total
                  </td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Bitcoin</td>
                  <td className="border-l border-black p-5px text-right">$ 40.2</td>
                  <td className="border-l border-black p-5px text-right">49.8%</td>
                  <td className="border-l border-black p-5px text-right">$ 10.0</td>
                  <td className="border-l border-black p-5px text-right">16.4%</td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Ethereum</td>
                  <td className="border-l border-black p-5px text-right">29.5</td>
                  <td className="border-l border-black p-5px text-right">36.5%</td>
                  <td className="border-l border-black p-5px text-right">20.8</td>
                  <td className="border-l border-black p-5px text-right">34.2%</td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">USDT</td>
                  <td className="border-l border-black p-5px text-right">11.1</td>
                  <td className="border-l border-black p-5px text-right">13.7%</td>
                  <td className="border-l border-black p-5px text-right">30.0</td>
                  <td className="border-l border-black p-5px text-right">49.3%</td>
                </tr>
                <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                  <td className="p-5px">Total customer crypto assets</td>
                  <td className="border-l border-black p-5px text-right">80.8</td>
                  <td className="border-l border-black p-5px text-right">100.0%</td>
                  <td className="border-l border-black p-5px text-right">60.8</td>
                  <td className="border-l border-black p-5px text-right">100.0%</td>
                </tr>
              </tbody>
            </table> */}
            {/* Info: (20230802 - Julian) Note 4 */}
            <h2 className="font-bold"> 4. ASSETS PLEDGED AS COLLATERAL</h2>
            <p>
              As of <span className="font-bold text-violet">July 30, 2023</span>, TideBit DeFi had
              pledged <span className="font-bold text-violet">USDT</span> that served exclusively as
              collateralfor certain crypto asset borrowings with a fair value of at least 100% of
              the
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230802 - Julian) Page 7 */}
        <ReportPageBody reportTitle={BaifaReports.BALANCE_SHEETS} currentPage={7}>
          <div className="flex flex-col gap-y-15px text-xs leading-5">
            <p>load amount outstanding.</p>
            <ReportTable tableData={balance_sheets_p7_1} />
            {/* Till: (20230824 - Julian) old table */}
            {/*<table className="my-5px text-xs">
              <thead className="border border-violet bg-violet font-bold text-white">
                <tr>
                  <th className="py-10px">$ in Thousands</th>
                  <th colSpan={2}>Jul. 30, 2023</th>
                  <th colSpan={2}>Jul. 1, 2023</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac"></td>
                  <td className="border-l border-black p-5px text-center text-lilac">Units</td>
                  <td className="border-l border-black p-5px text-center text-lilac">Fair Value</td>
                  <td className="border-l border-black p-5px text-center text-lilac">Units</td>
                  <td className="border-l border-black p-5px text-center text-lilac">Fair Value</td>
                </tr>
                <tr className="border-x border-b border-black font-bold text-violet">
                  <td colSpan={5} className="p-5px">
                    Assets Pledged as Collateral
                  </td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">USDT</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Bitcoin</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                </tr>
                <tr className="border-x border-b border-black text-darkPurple3">
                  <td className="p-5px text-lilac">Ethereum</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                </tr>
                <tr className="border-x border-b border-black bg-lilac2 font-bold text-darkPurple3">
                  <td className="p-5px">Total</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                  <td className="border-l border-black p-5px text-right">—</td>
                </tr>
              </tbody>
            </table> */}
            {/* Info: (20230802 - Julian) Note 5 */}
            <h2 className="font-bold"> 5. CRYPTO ASSETS HELD</h2>
            <p>
              As of <span className="font-bold text-violet">July 30, 2023</span> and{' '}
              <span className="font-bold text-violet">July 1, 2023</span>, the cost basis and fair
              value of our crypto assets held at impaired cost was as follows:
            </p>
          </div>
        </ReportPageBody>
        <hr />
      </div>
    </>
  );
};

export default StatementOfRedFlags;
