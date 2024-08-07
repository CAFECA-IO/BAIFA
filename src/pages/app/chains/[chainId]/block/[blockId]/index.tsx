import {useEffect, useContext} from 'react';
import {BsArrowLeftShort} from 'react-icons/bs';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import {GetServerSideProps} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {DEFAULT_CHAIN_ICON, buttonStyle} from '@/constants/config';
import {BFAURL, getDynamicUrl} from '@/constants/url';
import {APIURL, HttpMethod} from '@/constants/api_request';
import {TranslateFunction} from '@/interfaces/locale';
import {IBlockDetail, dummyBlockDetail} from '@/interfaces/block';
import {getChainIcon} from '@/lib/common';
import UseAPIResponse from '@/lib/hooks/use_api_response';
import {AppContext} from '@/contexts/app_context';
import NavBar from '@/components/nav_bar/nav_bar';
import BoltButton from '@/components/bolt_button/bolt_button';
import BlockDetail from '@/components/block_detail/block_detail';
import Footer from '@/components/footer/footer';
import DataNotFound from '@/components/data_not_found/data_not_found';

interface IBlockDetailPageProps {
  blockId: string;
  chainId: string;
}

const BlockDetailPage = ({blockId, chainId}: IBlockDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const headTitle = `${t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} ${blockId} - BAIFA`;

  const {
    data: blockData,
    isLoading: isBlockLoading,
    error: blockError,
  } = UseAPIResponse<IBlockDetail>(`${APIURL.CHAINS}/${chainId}/block/${blockId}`, {
    method: HttpMethod.GET,
  });

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previousLink = getDynamicUrl(chainId, `${blockData?.previousBlockId}`).BLOCK;
  const nextLink = getDynamicUrl(chainId, `${blockData?.nextBlockId}`).BLOCK;

  const backClickHandler = () => router.push(`${BFAURL.CHAINS}/${chainId}`);
  const previousHandler = () => router.push(previousLink);
  const nextHandler = () => router.push(nextLink);

  // Info: (20231213 - Julian) To check if the previousBlock or nextBlock exist
  const previousId = blockData?.previousBlockId ? blockData?.previousBlockId : undefined;
  const nextId = blockData?.nextBlockId ? blockData?.nextBlockId : undefined;

  const chainIcon = getChainIcon(chainId);

  const displayTitle = (
    <div className="flex flex-1 items-center justify-center space-x-2">
      <Image
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={40}
        height={40}
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
      />
      <h1 className="text-2xl font-bold lg:text-32px">
        {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')}
        <span className="ml-2 text-primaryBlue"> {blockId}</span>
      </h1>
    </div>
  );

  const isBlockData = !blockError ? (
    <BlockDetail isLoading={isBlockLoading} blockData={blockData ?? dummyBlockDetail} />
  ) : (
    <DataNotFound />
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
            <div className="my-10 w-full">{isBlockData}</div>

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

export const getServerSideProps: GetServerSideProps = async ({params, locale}) => {
  if (
    !params ||
    !params.blockId ||
    typeof params.blockId !== 'string' ||
    !params.chainId ||
    typeof params.chainId !== 'string'
  ) {
    return {
      notFound: true,
    };
  }

  const {blockId, chainId} = params;

  return {
    props: {
      blockId,
      chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default BlockDetailPage;
