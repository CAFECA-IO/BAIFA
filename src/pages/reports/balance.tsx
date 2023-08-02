import Head from 'next/head';
import Image from 'next/image';
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
        <div className="flex h-a4-height w-a4-width flex-col bg-lightWhite bg-cover bg-no-repeat">
          {/* Info: (20230802 - Julian) Header */}
          <div className="flex h-80px w-full items-center justify-end bg-headerBg bg-contain bg-no-repeat">
            <p className="mr-10px text-xs text-lilac">{BaifaReports.BALANCE_SHEETS}</p>
            <div className="h-5px w-130px bg-violet"></div>
          </div>
          {/* Info: (20230802 - Julian) Page Content */}
          <div className="flex flex-1 flex-col px-40px py-16px"></div>
          {/* Info: (20230802 - Julian) Footer */}
          <div className="flex h-80px w-full items-center justify-between px-40px">
            {/* Info: (20230802 - Julian) Page Number */}
            <div className="flex items-center">
              <div className="flex h-40px w-40px items-center justify-center rounded-full bg-violet text-base font-bold">
                01
              </div>
              <p className="ml-8px text-xxs text-lilac">Total 1294 records</p>
            </div>
            <div className="flex flex-col">
              <p className="mb-1 text-xxs text-lilac">Powered by</p>
              <Image src="/logo/baifa_logo_gray.svg" alt="baifa_logo" width={72} height={15} />
            </div>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

export default StatementOfRedFlags;
