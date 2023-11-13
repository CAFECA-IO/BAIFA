import Head from 'next/head';
import NavBar from '../../components/nav_bar/nav_bar';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';

const BlackListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('BLACKLIST_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.BLACKLIST,
    },
  ];

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{t('BLACKLIST_PAGE.BREADCRUMB_TITLE')} - BAIFA</title>
      </Head>

      <NavBar />

      <main>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
            {/* Info: (20231113 -Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20231113 -Julian) Black List Title */}
            <div className="flex justify-center p-10">
              <h1 className="text-2xl font-bold lg:text-48px">
                <span className="text-lightRed">{t('BLACKLIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
                {t('BLACKLIST_PAGE.MAIN_TITLE')}
              </h1>
            </div>

            {/* Info: (20231113 - Julian) Black List */}
            <div className="w-full"></div>
          </div>
        </div>
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default BlackListPage;
