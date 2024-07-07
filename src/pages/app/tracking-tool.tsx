import Head from 'next/head';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {BFAURL} from '@/constants/url';
import {ILocale, TranslateFunction} from '@/interfaces/locale';
import {TrackingProvider} from '@/contexts/tracking_context';
import Footer from '@/components/footer/footer';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import NavBar from '@/components/nav_bar/nav_bar';
import TrackingToolPanel from '@/components/tracking_tool_panel/tracking_tool_panel';

const TrackingToolPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // Info: (20240325 - Julian) head title and breadcrumb
  const headTitle = `${t('TRACKING_TOOL_PAGE.BREADCRUMB_TITLE')} - BAIFA`;
  const crumbs = [
    {
      label: t('HOME_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.APP,
    },
    {
      label: t('TRACKING_TOOL_PAGE.BREADCRUMB_TITLE'),
      path: BFAURL.TRACKING_TOOL,
    },
  ];

  return (
    <TrackingProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col overflow-hidden">
          <div className="flex w-full flex-1 flex-col px-5 pt-28 lg:px-20">
            {/* Info: (20240325 - Julian) Breadcrumb */}
            <div className="">
              <Breadcrumb crumbs={crumbs} />
            </div>

            {/* Info: (20240325 - Julian) Tracking Tool */}
            <div className="py-10">
              <TrackingToolPanel />
            </div>
          </div>
        </div>
      </main>
      <div className="mt-12">
        <Footer />
      </div>
    </TrackingProvider>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default TrackingToolPage;
