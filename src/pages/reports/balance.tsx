import Head from 'next/head';
import ReportCover from '../../components/report_cover/report_cover';
import ReportContent from '../../components/report_content/report_content';
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
        {/* <ReportCover
          reportTitle={BaifaReports.BALANCE_SHEETS}
          reportDateStart="2023-06-24"
          reportDateEnd="2023-07-24"
        />
        <hr /> */}

        {/* Info: (20230802 - Julian) Content */}
        {/* <ReportContent content={content} />
        <hr /> */}

        {/* Info: (20230802 - Julian) Page 1 */}
        <div className="bg-page1 flex h-a4-height w-a4-width bg-lightWhite bg-cover bg-no-repeat">
          <div className="h-80px"></div>
        </div>
      </div>
    </>
  );
};

export default StatementOfRedFlags;
