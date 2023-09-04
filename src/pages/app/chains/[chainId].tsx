import Head from 'next/head';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../components/nav_bar/nav_bar';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyChains} from '../../../constants/config';

const ChainDetailPage = ({
  chainId,
  chainData,
}: {
  chainId: string;
  chainData: {
    chainId: string;
    chainName: string;
    icon: string;
    blocks: number;
    transactions: number;
  };
}) => {
  const pageTitle = `BAIFA - ${chainData.chainName}`;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{pageTitle}</title>
      </Head>

      <NavBar />

      <main>
        <div className="pt-40">
          <h1>{chainData.chainName} Detail</h1>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  return {
    paths: [{params: {chainId: 'bolt'}}],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.chainId || typeof params.chainId !== 'string') {
    return {
      notFound: true,
    };
  }

  const chainData = dummyChains.find(chain => chain.chainId === params.chainId);
  console.log('chainData', chainData);

  if (!chainData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      chainId: params.chainId,
      chainData: chainData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ChainDetailPage;
