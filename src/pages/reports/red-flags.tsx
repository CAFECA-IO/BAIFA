import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import {BaifaReports} from '../../constants/baifa_reports';

const StatementOfRedFlags = () => {
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
      </div>
    </>
  );
};

export default StatementOfRedFlags;
