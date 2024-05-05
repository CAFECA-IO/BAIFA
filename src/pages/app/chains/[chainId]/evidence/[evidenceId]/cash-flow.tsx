import Head from 'next/head';
import {GetServerSideProps} from 'next';
import StatementsOfCashFlowNeo from '../../../../../../components/statements_of_cash_flow_neo/statements_of_cash_flow_neo';

interface IAllReportsPageProps {
  chainId: string;
  evidenceId: string;
}

const AllReportsPage = ({chainId, evidenceId}: IAllReportsPageProps) => {
  const reportTitle = 'Statement of Cash Flow';
  const headTitle = `${reportTitle} of ${evidenceId} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240505 - Shirley) Statement of Cash Flow */}
        <StatementsOfCashFlowNeo chainId={chainId} evidenceId={evidenceId} />
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
