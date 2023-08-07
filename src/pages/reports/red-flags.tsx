import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import {BaifaReports} from '../../constants/baifa_reports';

const StatementOfRedFlags = () => {
  const contentList = ['Statements of Red Flags', 'Note To Statements of Red Flags'];

  return (
    <>
      <Head>
        <title>BAIFA - {BaifaReports.STATEMENTS_OF_RED_FLAGS}</title>
      </Head>

      <div className="flex w-screen flex-col items-center font-inter">
        {/* Info: (20230801 - Julian) Cover */}
        <ReportCover
          reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS}
          reportDateStart="2023-06-24"
          reportDateEnd="2023-07-24"
        />
        <hr />

        {/* Info: (20230804 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230804 - Julian) Page 1  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={1}>
          <h1 className="text-lg font-bold text-violet">Summary of Red Flag Analysis</h1>
          <ul className="my-4 ml-5 list-disc text-xs leading-5">
            <li>
              Transactions with Blacklisted Entities: Users who have dealings with entities on our
              blacklist may be involved in illicit activities.
            </li>
            <li>
              Involvement with Gambling Websites: Users who have operated or interacted with
              gambling websites may be engaging in risky or illegal activities.
            </li>
            <li>
              Frequent Large Transfers: Users making numerous large transfers could be indicative of
              money laundering or other fraudulent activities.
            </li>
            <li>
              High-Risk IP Addresses: Transactions originating from high-risk IP addresses could
              indicate potential fraudulent activities or cyber threats.
            </li>
            <li>
              Connections with Coin Mixers: Users associated with coin mixers could be attempting to
              obscure the origin of their crypto assets, which may suggest illicit activities.
            </li>
            <li>
              Multiple Transfers: Users making multiple transfers in a short period of time could be
              indicative of potential money laundering or other illicit activities.
            </li>
            <li>
              Involvement with the Dark Web: Users associated with the dark web may be involved in
              illegal activities.
            </li>
            <li>
              Large Withdrawals: Users making large withdrawals could be indicative of potential
              money laundering or other illicit activities.
            </li>
            <li>
              Multiple Deposits: Users making multiple deposits in a short period of time could be
              indicative of potential money laundering or other illicit activities.
            </li>
            <li>
              Multiple Transfers: Users making multiple transfers in a short period of time could be
              indicative of potential money laundering or other illicit activities.
            </li>
            <li>
              Multiple Withdrawals: Users making multiple withdrawals in a short period of time
              could be indicative of potential money laundering or other illicit activities.
            </li>
            <li>
              Large Deposits: Users making large deposits could be indicative of potential money
              laundering or other illicit activities.
            </li>
          </ul>
          <p className="my-4 text-xs leading-5">
            In light of these red flags, we are required to report any suspicious transactions to
            the relevant authorities to ensure the integrity and security of our platform and
            protect our users.
          </p>
        </ReportPageBody>
        <hr />

        {/* Info: (20230804 - Julian) Page 2  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={2}>
          <h1 className="text-32px font-bold text-violet">Statements of Red Flags</h1>
        </ReportPageBody>
        <hr />
      </div>
    </>
  );
};

export default StatementOfRedFlags;
