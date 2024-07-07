import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import {BaifaReports} from '@/constants/baifa_reports';
import StatementsOfCashFlow from '@/components/statements_of_cash_flow/statements_of_cash_flow';

interface IStatementsOfCashFlowProps {
  projectId: string;
}

const StatementsOfCashFlowPage = ({projectId}: IStatementsOfCashFlowProps) => {
  const reportTitle = BaifaReports.STATEMENTS_OF_CASH_FLOWS;
  const projectName = projectId;
  const headTitle = `${reportTitle} of ${projectName} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
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

export default StatementsOfCashFlowPage;
