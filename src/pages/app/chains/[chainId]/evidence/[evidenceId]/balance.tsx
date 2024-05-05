import Head from 'next/head';
import {GetServerSideProps} from 'next';
import BalanceSheetsNeo from '../../../../../../components/balance_sheets_neo/balance_sheets_neo';

interface IAllReportsPageProps {
  chainId: string;
  evidenceId: string;
}

const AllReportsPage = ({chainId, evidenceId}: IAllReportsPageProps) => {
  const reportTitle = 'Balance Sheet';
  const headTitle = `${reportTitle} of ${evidenceId} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        {/* Info: (20240502 - Shirley) Balance Sheets */}
        <BalanceSheetsNeo chainId={chainId} evidenceId={evidenceId} />
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
