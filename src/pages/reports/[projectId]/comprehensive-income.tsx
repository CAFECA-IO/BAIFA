import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BaifaReports} from '@/constants/baifa_reports';
import ComprehensiveIncomeStatements from '@/components/comprehensive_income_statements/comprehensive_income_statements';

interface IComprehensiveIncomeStatementsProps {
  projectId: string;
}

const ComprehensiveIncomeStatementsPage = ({projectId}: IComprehensiveIncomeStatementsProps) => {
  const reportTitle = BaifaReports.COMPREHENSIVE_INCOME_STATEMENTS;
  const projectName = projectId;
  const headTitle = `${reportTitle} of ${projectName} - BAIFA`;

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>

      <div>
        <ComprehensiveIncomeStatements projectId={projectId} />
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

export default ComprehensiveIncomeStatementsPage;
