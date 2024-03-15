import Image from 'next/image';
import {BaifaReports} from '../../constants/baifa_reports';

interface ReportCoverProps {
  reportTitle: string;
  reportDateStart: string;
  reportDateEnd: string;
}

const ReportCover = ({reportTitle, reportDateStart, reportDateEnd}: ReportCoverProps) => {
  const reportTitleImage =
    reportTitle === BaifaReports.BALANCE_SHEETS ? (
      <div className="relative my-16px flex h-80px w-full">
        <Image
          src={'/documents/balance.svg'}
          alt={reportTitle}
          fill
          style={{objectFit: 'contain', objectPosition: 'left'}}
        />
      </div>
    ) : reportTitle === BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS ? (
      <div className="relative my-16px flex h-56px w-full">
        <Image
          src={'/documents/comprehensive.svg'}
          alt={reportTitle}
          fill
          style={{objectFit: 'contain', objectPosition: 'left'}}
        />
      </div>
    ) : reportTitle === BaifaReports.STATEMENTS_OF_CASH_FLOWS ? (
      <div className="relative my-12px flex h-70px w-full">
        <Image
          src={'/documents/cash_flow.svg'}
          alt={reportTitle}
          fill
          style={{objectFit: 'contain', objectPosition: 'left'}}
        />
      </div>
    ) : reportTitle === BaifaReports.STATEMENTS_OF_RED_FLAGS ? (
      <div className="relative my-12px flex h-70px w-full">
        <Image
          src={'/documents/red_flags.svg'}
          alt={reportTitle}
          fill
          style={{objectFit: 'contain', objectPosition: 'left'}}
        />
      </div>
    ) : (
      <></>
    );

  return (
    <div className="flex h-a4-height w-a4-width bg-reportCover bg-cover bg-no-repeat">
      <div className="flex h-full w-full flex-col items-start px-40px pt-200px">
        <div className="flex items-center space-x-2 text-sm font-bold">
          <p>Powered by</p>
          <Image src="/logo/baifaaa_logo.svg" alt="baifaaa_logo" width={72} height={15} />
        </div>
        {/* Info: (20230801 - Julian) Title Image */}
        {reportTitleImage}
        <h2 className="border-t-3px border-primaryBlue pt-8px text-base font-bold">
          From <span className="text-primaryBlue">{reportDateStart}</span> To{' '}
          <span className="text-primaryBlue">{reportDateEnd}</span>
        </h2>
      </div>
    </div>
  );
};

export default ReportCover;
