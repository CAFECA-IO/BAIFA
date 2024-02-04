import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import BalanceSheets from '../../../components/balance_sheets/balance_sheets';
import ComprehensiveIncomeStatements from '../../../components/comprehensive_income_statements/comprehensive_income_statements';
import StatementsOfCashFlow from '../../../components/statements_of_cash_flow/statements_of_cash_flow';
import {BaifaReports} from '../../../constants/baifa_reports';

interface IBalanceSheetsProps {
  projectId: string;
}

const BalanceSheetsPage = ({projectId}: IBalanceSheetsProps) => {
  const reportTitle = BaifaReports.BALANCE_SHEETS;
  const projectName = projectId;
  const headTitle = `${reportTitle} of ${projectName} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240202 - Julian) Balance Sheets */}
        <BalanceSheets projectId={projectId} />
        {/* Info: (20240202 - Julian) Income Statements */}
        <ComprehensiveIncomeStatements projectId={projectId} />
        {/* Info: (20240202 - Julian) Statements of Cash Flow */}
        <StatementsOfCashFlow projectId={projectId} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {projectId: '1'},
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!params || !params.projectId || typeof params.projectId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      projectId: params.projectId,
    },
  };
};

export default BalanceSheetsPage;
