import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import {BaifaReports} from '@/constants/baifa_reports';
import BalanceSheets from '@/components/balance_sheets/balance_sheets';

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
        <BalanceSheets projectId={projectId} />
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
