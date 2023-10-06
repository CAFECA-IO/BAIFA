import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import NavBar from '../../../components/nav_bar/nav_bar';
import BoltButton from '../../../components/bolt_button/bolt_button';
import Footer from '../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyBlockData, IBlock} from '../../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../interfaces/locale';
import {getChainIcon} from '../../../lib/common';

interface IBlockDetailPageProps {
  blockId: string;
  blockData: IBlock;
}

const AddressDetailPage = ({blockId, blockData}: IBlockDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} ${blockId} - BAIFA`;

  const router = useRouter();
  const backClickHandler = () => router.back();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-4/5 flex-1 flex-col items-center space-y-10 px-20 pb-10 pt-28">
            <div className="flex w-full items-center justify-start py-10">
              {/* Info: (20230912 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler}>
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20230912 -Julian) Address Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image
                  src={getChainIcon(blockData.chainId).src}
                  alt={getChainIcon(blockData.chainId).alt}
                  width={40}
                  height={40}
                />
                <h1 className="text-32px font-bold">
                  {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {blockId}</span>
                </h1>
              </div>
            </div>

            {/* Info: (20231006 - Julian) Back button */}
            <div className="pt-10">
              <BoltButton
                onClick={backClickHandler}
                className="px-12 py-4 font-bold"
                color="blue"
                style="hollow"
              >
                {t('COMMON.BACK')}
              </BoltButton>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyBlockData
    .flatMap(block => {
      return locales?.map(locale => ({params: {blockId: `${block.id}`}, locale}));
    })
    .filter((path): path is {params: {blockId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.blockId || typeof params.blockId !== 'string') {
    return {
      notFound: true,
    };
  }

  const blockData = dummyBlockData.find(block => `${block.id}` === params.blockId);

  if (!blockData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blockId: params.blockId,
      blockData: blockData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default AddressDetailPage;
