import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import NavBar from '../../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../../components/bolt_button/bolt_button';
import BlockDetail from '../../../../../../components/block_detail/block_detail';
import Footer from '../../../../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyBlockData, IBlock} from '../../../../../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../../interfaces/locale';
import {getChainIcon} from '../../../../../../lib/common';
import {getDynamicUrl} from '../../../../../../constants/url';

interface IBlockDetailPageProps {
  blockId: string;
  blockData: IBlock;
  previousBlockId?: number;
  nextBlockId?: number;
  chainId: string;
  blocksOfChain: IBlock[];
}

const BlockDetailPage = ({
  blockId,
  blockData,
  previousBlockId,
  nextBlockId,
  chainId,
}: IBlockDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} ${blockId} - BAIFA`;
  const router = useRouter();

  const previousLink = getDynamicUrl(chainId, `${previousBlockId}`).BLOCK;
  const nextLink = getDynamicUrl(chainId, `${nextBlockId}`).BLOCK;

  const backClickHandler = () => router.back();
  const previousHandler = () => router.push(previousLink);
  const nextHandler = () => router.push(nextLink);

  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

  const previousId = previousBlockId ? previousBlockId : undefined;
  const nextId = nextBlockId ? nextBlockId : undefined;

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
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image
                  src={getChainIcon(blockData.chainId).src}
                  alt={getChainIcon(blockData.chainId).alt}
                  width={40}
                  height={40}
                />
                <h1 className="text-2xl font-bold lg:text-32px">
                  {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue"> {blockId}</span>
                </h1>
              </div>
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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyBlockData
    .flatMap(block => {
      return locales?.map(locale => ({
        params: {chainId: block.chainId, blockId: `${block.id}`},
        locale,
      }));
    })
    .filter((path): path is {params: {chainId: string; blockId: string}; locale: string} => !!path);

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

  // Info: (20231018 - Julian) Get block data in the same chain
  const blocksOfChain = dummyBlockData.filter(block => block.chainId === params.chainId);

  const blockData = blocksOfChain.find(block => `${block.id}` === params.blockId);
  const chainId = blockData?.chainId ?? null;

  const blockIndex = blocksOfChain.findIndex(block => `${block.id}` === params.blockId);
  const previousBlockId = blocksOfChain[blockIndex - 1]?.id ?? null;
  const nextBlockId = blocksOfChain[blockIndex + 1]?.id ?? null;

  if (!blockData || !chainId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      blockId: params.blockId,
      blockData: blockData,
      previousBlockId: previousBlockId,
      nextBlockId: nextBlockId,
      chainId: chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default BlockDetailPage;