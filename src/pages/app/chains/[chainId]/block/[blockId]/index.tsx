import Head from 'next/head';
import Image from 'next/image';
import {useState, useEffect, useContext} from 'react';
import {AppContext} from '../../../../../../contexts/app_context';
import {MarketContext} from '../../../../../../contexts/market_context';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import BlockDetail from '../../../../../../components/block_detail/block_detail';
import Footer from '../../../../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {IBlockDetail} from '../../../../../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {getDynamicUrl} from '../../../../../../constants/url';
import {getChainIcon} from '../../../../../../lib/common';

interface IBlockDetailPageProps {
  blockId: string;
  chainId: string;
}

const BlockDetailPage = ({blockId, chainId}: IBlockDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const {getBlockDetail} = useContext(MarketContext);
  const router = useRouter();

  const headTitle = `${t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} ${blockId} - BAIFA`;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blockData, setBlockData] = useState<IBlockDetail>({} as IBlockDetail);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }

    const getBlockData = async (chainId: string, blockId: string) => {
      try {
        const data = await getBlockDetail(chainId, blockId);
        setBlockData(data);
      } catch (error) {
        //console.log('getBlockDetail error', error);
      }
    };

    getBlockData(chainId, blockId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockId, chainId]);

  useEffect(() => {
    if (blockData) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [blockData]);

  const {previousBlockId, nextBlockId} = blockData;

  const previousLink = getDynamicUrl(chainId, `${previousBlockId}`).BLOCK;
  const nextLink = getDynamicUrl(chainId, `${nextBlockId}`).BLOCK;

  const backClickHandler = () => router.back();
  const previousHandler = () => router.push(previousLink);
  const nextHandler = () => router.push(nextLink);

  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

  // Info: (20231213 - Julian) To check if the previousBlock or nextBlock exist
  const previousId = previousBlockId ? previousBlockId : undefined;
  const nextId = nextBlockId ? nextBlockId : undefined;

  const chainIcon = getChainIcon(chainId);

  const displayTitle = isLoading ? (
    <div className="flex flex-1 items-center justify-center space-x-2">
      <div className="h-40px w-40px animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-40px w-240px animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center space-x-2">
      <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
      <h1 className="text-2xl font-bold lg:text-32px">
        {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')}
        <span className="ml-2 text-primaryBlue"> {blockId}</span>
      </h1>
    </div>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-28 lg:px-40 lg:pt-40">
            {/* Info: (20231017 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20230912 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20230912 -Julian) Block Title */}
              {displayTitle}
            </div>

            {/* Info: (20231017 - Julian) Next & Previous Button */}
            <div className="mt-4 flex items-center space-x-4">
              {/* Info: (20231017 - Julian) Previous Button */}
              <button onClick={previousHandler} className={buttonStyle} disabled={!!!previousId}>
                <RiArrowLeftSLine className="text-2xl" />
              </button>
              {/* Info: (20231017 - Julian) Next Button */}
              <button onClick={nextHandler} className={buttonStyle} disabled={!!!nextId}>
                <RiArrowRightSLine className="text-2xl" />
              </button>
            </div>

            {/* Info: (20230912 - Julian) Block Detail */}
            <div className="my-10 w-full">
              <BlockDetail blockData={blockData} />
            </div>

            {/* Info: (20231017 - Julian) Back Button */}
            <div className="mt-10">
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

export const getStaticPaths: GetStaticPaths = async () => {
  // ToDo: (20231213 - Julian) Add dynamic paths
  const paths = [
    {
      params: {chainId: 'isun', blockId: '1'},
      locale: 'en',
    },
  ];

  return {paths, fallback: 'blocking'};
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.blockId || typeof params.blockId !== 'string') {
    return {
      notFound: true,
    };
  }

  const blockId = params.blockId;
  const chainId = params.chainId;

  if (!blockId || !chainId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blockId,
      chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default BlockDetailPage;
