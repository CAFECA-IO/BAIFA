import Image from 'next/image';

interface ReportPageBodyProps {
  reportTitle: string;
  currentPage: number;
  children: React.ReactNode;
}

const ReportPageBody = ({reportTitle, currentPage, children}: ReportPageBodyProps) => {
  const displayPage = currentPage < 10 ? `0${currentPage}` : `${currentPage}`;

  return (
    <div className="flex h-a4-height w-a4-width flex-col bg-lightWhite bg-cover bg-no-repeat">
      {/* Info: (20230802 - Julian) Header */}
      <div className="flex h-80px w-full items-center justify-end bg-headerBg bg-contain bg-no-repeat">
        <p className="mr-10px text-xs text-lilac">{reportTitle}</p>
        <div className="h-5px w-130px bg-violet"></div>
      </div>
      {/* Info: (20230802 - Julian) Page Content */}
      <div className="flex flex-1 flex-col px-40px text-darkPurple3">{children}</div>
      {/* Info: (20230802 - Julian) Footer */}
      <div className="flex h-80px w-full items-center justify-between px-40px">
        {/* Info: (20230802 - Julian) Page Number */}
        <div className="flex items-center">
          <div className="flex h-40px w-40px items-center justify-center rounded-full bg-violet text-base font-bold">
            {displayPage}
          </div>
          <p className="ml-8px text-xxs text-lilac">Total 1294 records</p>
        </div>
        <div className="flex flex-col">
          <p className="mb-1 text-xxs text-lilac">Powered by</p>
          <Image src="/logo/baifa_logo_gray.svg" alt="baifa_logo" width={72} height={15} />
        </div>
      </div>
    </div>
  );
};

export default ReportPageBody;
