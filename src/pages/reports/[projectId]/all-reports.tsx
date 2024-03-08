import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
//import BalanceSheets from '../../../components/balance_sheets/balance_sheets';
import BalanceSheetsNeo from '../../../components/balance_sheets_neo/balance_sheets_neo';
//import ComprehensiveIncomeStatements from '../../../components/comprehensive_income_statements/comprehensive_income_statements';
import StatementsOfCashFlow from '../../../components/statements_of_cash_flow/statements_of_cash_flow';
import ComprehensiveIncomeStatementsNeo from '../../../components/comprehensive_income_statements_neo/comprehensive_income_statements_neo';

interface IAllReportsPageProps {
  projectId: string;
}

const AllReportsPage = ({projectId}: IAllReportsPageProps) => {
  const reportTitle = 'All Reports';
  const projectName = projectId;
  const headTitle = `${reportTitle} of ${projectName} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240202 - Julian) Balance Sheets */}
        {/* <BalanceSheets projectId={projectId} /> */}
        <BalanceSheetsNeo />
        {/* Info: (20240202 - Julian) Income Statements */}
        {/* <ComprehensiveIncomeStatements projectId={projectId} /> */}
        <ComprehensiveIncomeStatementsNeo />
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

export default AllReportsPage;
