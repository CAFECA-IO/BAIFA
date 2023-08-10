import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
import ReportPageBody from '../../components/report_page_body/report_page_body';
import ReportTableNew from '../../components/report_table/report_table';
import {ITable} from '../../interfaces/report_table';
import {RowType} from '../../constants/table_row_type';
import {BaifaReports} from '../../constants/baifa_reports';
import {reportsDateSpan} from '../../constants/config';
import {timestampToString} from '../../lib/common';

const StatementOfRedFlags = () => {
  const reportTitle = BaifaReports.STATEMENTS_OF_RED_FLAGS;
  const contentList = ['Statements of Red Flags', 'Note To Statements of Red Flags'];
  const startDate = timestampToString(reportsDateSpan.start);
  const endDate = timestampToString(reportsDateSpan.end);

  const red_flags_p2_1: ITable = {
    thead: ['Self-Analysis', '', '', 'Total cases: 0'],
    tbody: [
      {
        rowType: RowType.content,
        rowData: ['Time', 'Txhash', 'Amount involved', 'Red Flag Type'],
      },
      {
        rowType: RowType.headline,
        rowData: ['Trading Partners-Analysis', '', '', 'Total cases: 0'],
      },
      {
        rowType: RowType.content,
        rowData: ['Address', 'Txhash', 'Trading Amount', 'Red Flag Amount'],
      },
    ],
  };

  const red_flags_p3_1: ITable = {
    thead: ['', endDate.dateFormatInUS, startDate.dateFormatInUS, '% Change'],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Red Flag Type:', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Transactions with Blacklisted Entities', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Involvement with Gambling Websites', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Frequent Large Transfers', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['High-Risk IP Addresses', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Connections with Coin Mixers', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Transfers', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Involvement with the Dark Web', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Large Withdrawals', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Large Deposits', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Deposits', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Transfers', '0', '0', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Withdrawals', '0', '0', '—'],
      },
    ],
  };

  const red_flags_p4_1: ITable = {
    subThead: ['', `30 Days Ended ${endDate.dateFormatForForm},`, '*-*', '*-*'],
    thead: ['*|*', endDate.year, startDate.lastYear, '% Change'],
    tbody: [
      {
        rowType: RowType.title,
        rowData: ['Red Flag Type:', '*-*', '*-*', '*-*'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Transactions with Blacklisted Entities', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Involvement with Gambling Websites', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Frequent Large Transfers', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['High-Risk IP Addresses', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Connections with Coin Mixers', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Transfers', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Involvement with the Dark Web', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Large Withdrawals', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Large Deposits', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Deposits', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Transfers', '0', '—', '—'],
      },
      {
        rowType: RowType.contentWithMainColumn,
        rowData: ['Multiple Withdrawals', '0', '—', '—'],
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

        {/* Info: (20230804 - Julian) Content */}
        <ReportContent content={contentList} />
        <hr />

        {/* Info: (20230809 - Julian) Page 1  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={1}>
          <div className="flex flex-col gap-y-16px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Summary of Red Flag Analysis</h1>
            <ul className="ml-5 list-disc">
              <li>
                Transactions with Blacklisted Entities: Users who have dealings with entities on our
                blacklist may be involved in illicit activities.
              </li>
              <li>
                Involvement with Gambling Websites: Users who have operated or interacted with
                gambling websites may be engaging in risky or illegal activities.
              </li>
              <li>
                Frequent Large Transfers: Users making numerous large transfers could be indicative
                of money laundering or other fraudulent activities.
              </li>
              <li>
                High-Risk IP Addresses: Transactions originating from high-risk IP addresses could
                indicate potential fraudulent activities or cyber threats.
              </li>
              <li>
                Connections with Coin Mixers: Users associated with coin mixers could be attempting
                to obscure the origin of their crypto assets, which may suggest illicit activities.
              </li>
              <li>
                Multiple Transfers: Users making multiple transfers in a short period of time could
                be indicative of potential money laundering or other illicit activities.
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
                Multiple Transfers: Users making multiple transfers in a short period of time could
                be indicative of potential money laundering or other illicit activities.
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
            <p>
              In light of these red flags, we are required to report any suspicious transactions to
              the relevant authorities to ensure the integrity and security of our platform and
              protect our users.
            </p>
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230809 - Julian) Page 2  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={2}>
          <div className="flex flex-col gap-y-16px py-16px text-xs leading-5">
            <h1 className="text-32px font-bold text-violet">{reportTitle}</h1>
            <ReportTableNew tableData={red_flags_p2_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230809 - Julian) Page 3  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={3}>
          <div className="flex flex-col gap-y-16px py-16px text-xs leading-5">
            <h1 className="text-lg font-bold text-violet">Note To Statements of Red Flags</h1>
            <p>
              As of<span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, and
              <span className="font-bold text-violet"> {startDate.dateFormatInUS}</span>, the
              statistics for the number of occurrences of separate red flag types were as follows:
            </p>
            <ReportTableNew tableData={red_flags_p3_1} />
          </div>
        </ReportPageBody>
        <hr />

        {/* Info: (20230809 - Julian) Page 4  */}
        <ReportPageBody reportTitle={BaifaReports.STATEMENTS_OF_RED_FLAGS} currentPage={4}>
          <div className="flex flex-col gap-y-16px py-16px text-xs leading-5">
            <p>
              As of<span className="font-bold text-violet"> {endDate.dateFormatInUS}</span>, and
              <span className="font-bold text-violet"> {endDate.lastYearDate}</span>, the statistics
              for the number of occurrences of separate red flag types were as follows:
            </p>
            <ReportTableNew tableData={red_flags_p4_1} />
          </div>
        </ReportPageBody>
        <hr />
      </div>
    </>
  );
};

export default StatementOfRedFlags;
