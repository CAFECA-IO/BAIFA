import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import BalanceSheetsNeo from '../../../../../../components/balance_sheets_neo/balance_sheets_neo';
import ComprehensiveIncomeStatementsNeo from '../../../../../../components/comprehensive_income_statements_neo/comprehensive_income_statements_neo';
import StatementsOfCashFlowNeo from '../../../../../../components/statements_of_cash_flow_neo/statements_of_cash_flow_neo';

interface IAllReportsPageProps {
  chainId: string;
  evidenceId: string;
}

const AllReportsPage = ({chainId, evidenceId}: IAllReportsPageProps) => {
  const reportTitle = 'All Reports';
  const headTitle = `${reportTitle} of ${evidenceId} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240202 - Julian) Balance Sheets */}
        <BalanceSheetsNeo chainId={chainId} evidenceId={evidenceId} />
        {/* Info: (20240202 - Julian) Income Statements */}
        <ComprehensiveIncomeStatementsNeo chainId={chainId} evidenceId={evidenceId} />
        {/* Info: (20240202 - Julian) Statements of Cash Flow */}
        <StatementsOfCashFlowNeo chainId={chainId} evidenceId={evidenceId} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {chainId: 'isun', evidenceId: '1'},
      },
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!params || !params.evidenceId || typeof params.evidenceId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chainId: params.chainId,
      evidenceId: params.evidenceId,
    },
  };
};

export default AllReportsPage;
