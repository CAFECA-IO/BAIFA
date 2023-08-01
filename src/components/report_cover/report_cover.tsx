import Image from 'next/image';
import {BaifaReports} from '../../constants/baifa_reports';

interface ReportCoverProps {
  reportTitle: string;
  reportDateStart: string;
  reportDateEnd: string;
}

const ReportCover = ({reportTitle, reportDateStart, reportDateEnd}: ReportCoverProps) => {
  const reportTitleSrc =
    reportTitle === BaifaReports.BALANCE_SHEETS
      ? '/documents/balance_title.svg'
      : reportTitle === BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS
      ? '/documents/income_title.svg'
      : reportTitle === BaifaReports.STATEMENTS_OF_CASH_FLOWS
      ? '/documents/cashFlow_title.svg'
      : reportTitle === BaifaReports.STATEMENTS_OF_RED_FLAGS
      ? '/documents/redFlag_title.svg'
      : '';

  return (
    <div className="flex h-a4-height w-a4-width bg-reportCover bg-cover bg-no-repeat">
      <div className="flex flex-col items-start px-40px py-200px">
        <div className="flex items-center space-x-2 text-sm font-bold">
          <p>Powered by</p>
          <Image src="/logo/baifaaa_logo.svg" alt="baifaaa_logo" width={72} height={15} />
        </div>
        {/* Info: (20230801 - Julian) Title */}
        {/* ToDo: (20230801 - Julian) Image size */}
        <div className="relative my-16px">
          <Image src={reportTitleSrc} alt={reportTitle} width={513} height={46} />
        </div>
        <h2 className="border-t-3px border-primaryBlue pt-8px text-base font-bold">
          From <span className="text-primaryBlue">{reportDateStart}</span> To{' '}
          <span className="text-primaryBlue">{reportDateEnd}</span>
        </h2>
      </div>
    </div>
  );
};

export default ReportCover;
