interface ReportContentProps {
  content: string[];
}

const ReportContent = ({content}: ReportContentProps) => {
  const displatList = content.map((item, index) => (
    <li key={index} className="mb-30px">
      {item}
    </li>
  ));

  return (
    <div className="flex h-a4-height w-a4-width bg-contentBg bg-contain bg-right-bottom bg-no-repeat">
      <div className="flex h-full w-full px-40px pt-160px">
        {/* Info: (20230801 - Julian) Content Title & Border Line */}
        <div className="relative block w-110px bg-purpleLinear">
          <h1 className="absolute -left-24 top-28 -rotate-90 text-6xl font-bold text-violet">
            CONTENT
          </h1>
          <div className="h-full w-105px bg-hoverWhite"></div>
        </div>
        <ul className="list-decimal px-40px text-base font-bold text-darkPurple3">{displatList}</ul>
      </div>
    </div>
  );
};

export default ReportContent;
