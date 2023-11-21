import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticPaths, GetStaticProps} from 'next';
import NavBar from '../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../components/bolt_button/bolt_button';
import Footer from '../../../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {getChainIcon} from '../../../../lib/common';
import {TranslateFunction} from '../../../../interfaces/locale';
import {IRedFlag} from '../../../../interfaces/red_flag';
import RedFlagList from '../../../../components/red_flag_list/red_flag_list';
import {dummyCurrencyData} from '../../../../interfaces/currency';

interface IRedFlagOfCurrencyPageProps {
  currencyId: string;
  currencyName: string;
  redFlagData: IRedFlag[];
}

const RedFlagOfCurrencyPage = ({
  currencyId,
  currencyName,
  redFlagData,
}: IRedFlagOfCurrencyPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} ${t(
    'COMMON.OF'
  )} ${currencyName} - BAIFA`;
  const chainIcon = getChainIcon(currencyId);

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
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-32 lg:px-40 lg:pt-40">
            {/* Info: (20231109 - Julian) Header */}
            <div className="flex w-full items-start justify-start">
              {/* Info: (20231109 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231109 -Julian) Red Flag Title */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl font-bold lg:text-48px">
                  <span className="text-lightRed">
                    {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                  </span>
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
                </h1>
                <div className="flex items-center space-x-2">
                  <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
                  <p className="text-xl">{currencyName}</p>
                </div>
              </div>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">
              <RedFlagList redFlagData={redFlagData} />
            </div>

            {/* Info: (20231109 - Julian) Back button */}
            <div className="">
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

export default RedFlagOfCurrencyPage;

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyCurrencyData
    .flatMap(currency => {
      return locales?.map(locale => ({
        params: {currencyId: `${currency.currencyId}`},
        locale,
      }));
    })
    .filter((path): path is {params: {currencyId: string}; locale: string} => !!path);

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IRedFlagOfCurrencyPageProps> = async ({
  params,
  locale,
}) => {
  if (!params || !params.currencyId || typeof params.currencyId !== 'string') {
    return {
      notFound: true,
    };
  }

  const originCurrencyData = dummyCurrencyData.find(
    currency => `${currency.currencyId}` === params.currencyId
  );

  if (!originCurrencyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      currencyId: params.currencyId,
      currencyName: originCurrencyData.currencyName,
      redFlagData: originCurrencyData.flagging,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};
