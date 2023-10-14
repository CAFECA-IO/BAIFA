import ReportPageBody from '../../components/report_page_body/report_page_body';

interface IReportRiskPagesProps {
  reportTitle: string;
}

const ReportRiskPages = ({reportTitle}: IReportRiskPagesProps) => {
  return (
    <>
      {/* Info: (20230807 - Julian) Page 1 */}
      <ReportPageBody reportTitle={reportTitle} currentPage={1}>
        <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
          <h1 className="text-lg font-bold text-violet">Summary of Risk Factors</h1>
          <p>
            Our business is subject to various risks and uncertainties, including those detailed
            below. The most significant risks include:
          </p>
          <ul className="ml-5 list-disc">
            <li>
              Our total revenue largely depends on the prices of cryptocurrencies and the volume of
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
              time-consuming, and if resolved adversely, could harm our business.
            </li>
          </ul>
        </div>
      </ReportPageBody>
      <hr className="break-before-page" />
      {/* Info: (20230807 - Julian) Page 2 */}
      <ReportPageBody reportTitle={reportTitle} currentPage={2}>
        <div className="flex flex-col gap-y-12px py-8px text-xs leading-5">
          <ul className="ml-5 list-disc">
            <li>
              If we can't keep pace with rapid industry changes to provide new and innovative
              products and services, our net revenue could decline, negatively impacting our
              business.
            </li>
            <li>
              The status of a particular cryptocurrency as a "security" is highly uncertain. If we
              incorrectly characterize a cryptocurrency, we may face regulatory scrutiny,
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
              Our failure to safeguard and manage our and our customers’ fiat currencies and
              cryptocurrencies could negatively impact our business.
            </li>
            <li>
              The theft, loss, or destruction of private keys required to access any
              cryptocurrencies held in custody for our own account or for our customers may be
              irreversible. If we are unable to access our private keys or if we experience a hack
              or other data loss, it could cause regulatory scrutiny, reputational harm, and other
              losses.
            </li>
          </ul>
        </div>
      </ReportPageBody>
      <hr className="break-before-page" />
    </>
  );
};

export default ReportRiskPages;
