import Head from 'next/head';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NavBar from '../../../components/nav_bar/nav_bar';
import RedFlagList from '../../../components/red_flag_list/red_flag_list';
import Footer from '../../../components/footer/footer';
import {ILocale, TranslateFunction} from '../../../interfaces/locale';
import {dummyAllRedFlags} from '../../../interfaces/red_flag';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import {BFAURL} from '../../../constants/url';

const RedFlagListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  //const redFlagData: IRedFlag[] = dummyAddressData.flatMap(addressData => addressData.flagging);
  const headTitle = `${t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE')} - BAIFA`;

  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('RED_FLAG_DETAIL_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.RED_FLAGS,
    },
  ];

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
            {/* Info: (20231109 -Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20231109 -Julian) Red Flag Title */}
            <div className="flex justify-center p-10">
              <h1 className="text-2xl font-bold lg:text-48px">
                <span className="text-lightRed">
                  {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE_HIGHLIGHT')}
                </span>
                {t('RED_FLAG_DETAIL_PAGE.MAIN_TITLE')}
              </h1>
            </div>

            {/* Info: (20231109 - Julian) Red Flag List */}
            <div className="w-full">
              <RedFlagList redFlagData={dummyAllRedFlags} />
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

export default RedFlagListPage;

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;
