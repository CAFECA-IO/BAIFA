import Head from 'next/head';
import {GetServerSideProps} from 'next';
import ComprehensiveIncomeStatementsNeo from '../../../../../../components/comprehensive_income_statements_neo/comprehensive_income_statements_neo';

interface IAllReportsPageProps {
  chainId: string;
  evidenceId: string;
}

const AllReportsPage = ({chainId, evidenceId}: IAllReportsPageProps) => {
  const reportTitle = 'Comprehensive Income Statement';
  const headTitle = `${reportTitle} of ${evidenceId} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240202 - Julian) Income Statements */}
        <ComprehensiveIncomeStatementsNeo chainId={chainId} evidenceId={evidenceId} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const {params} = context;

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
