import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import {BaifaReports} from '../../constants/baifa_reports';

const StatementOfRedFlags = () => {
  const content = ['Balance Sheets', 'Note To Balance Sheets'];

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
        <ReportContent content={content} />
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
      </div>
    </>
  );
};

export default StatementOfRedFlags;
