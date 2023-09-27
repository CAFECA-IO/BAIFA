import {useEffect, useState} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '../../components/nav_bar/nav_bar';
import BoltButton from '../../components/bolt_button/bolt_button';
import ReserveCard from '../../components/reserve_card/reserve_card';
import {useTranslation} from 'next-i18next';
import {TranslateFunction, ILocale} from '../../interfaces/locale';
import {IResult} from '../../interfaces/result';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {timestampToString, getReportTimeSpan, getChainIcon} from '../../lib/common';
import {REPORT_PATH, BFAURL} from '../../constants/url';
import {pluginReportsList} from '../../constants/config';
import {APIURL} from '../../constants/api_request';
import {
  dummyWebsiteReserve,
  isIWebsiteReserve,
  IWebsiteReserve,
} from '../../interfaces/website_reserve';
import {BiLinkAlt} from 'react-icons/bi';
import {FiDownload} from 'react-icons/fi';

const BaifaPlugin = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const reportEndDate = timestampToString(getReportTimeSpan().end);
  const lastUpdatedText = `${t(reportEndDate.month)} ${reportEndDate.day}, ${reportEndDate.year}`;

  const [reserveRatio, setReserveRatio] = useState<IWebsiteReserve>();

  // Info: (20230923 - Julian) Get data from API
  const getWebsiteReserve = async () => {
    let reserveRatio;
    try {
      const response = await fetch(`${APIURL.WEBSITE_RESERVE}`, {
        method: 'GET',
      });
      const result: IResult = await response.json();
      if (result.success) {
        const vaild = isIWebsiteReserve(result.data);
        if (!vaild) {
          //console.error(`getWebsiteReserve invalid data interface`);
          reserveRatio = dummyWebsiteReserve;
        } else {
          reserveRatio = result.data as IWebsiteReserve;
        }
      }
    } catch (error) {
      // console.log('getWebsiteReserve error');
    }
    return reserveRatio;
  };

  useEffect(() => {
    getWebsiteReserve().then(websiteReserve => {
      setReserveRatio(websiteReserve);
    });
  });

  // ToDo: (20230927 - Julian) Replace with real data
  const projectId = 'tbd';
  const certificateImageSrc = '/certificate/3-v.png';

  const reportUrl = `${REPORT_PATH.REPORTS}/${projectId}`;
  const reserveData = reserveRatio ?? dummyWebsiteReserve;
  const {BTC, ETH, USDT} = reserveData;

  const displayReportsList = pluginReportsList.map((report, index) => {
    return (
      <Link
        key={index}
        locale={false}
        href={`${reportUrl}/${report.linkPath}`}
        target="_blank"
        className="flex h-130px w-130px flex-col items-center justify-center space-y-5 rounded-xl border border-transparent bg-darkPurple shadow-xl transition-all duration-150 ease-in-out hover:cursor-pointer hover:border-primaryBlue hover:bg-purpleLinear sm:h-150px sm:w-150px lg:h-200px lg:w-200px"
      >
        <Image
          className="mx-5 h-40px w-40px xs:h-50px xs:w-50px lg:h-80px lg:w-80px"
          src={report.imageSrc}
          width={80}
          height={80}
          alt={report.name}
        />
        <p className="text-center text-xs sm:text-base lg:text-lg">{t(report.name)}</p>
      </Link>
    );
  });

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Plugin - BAIFA</title>
      </Head>
      <NavBar />
      <div className="h-100px"></div>

      {/* Info: (20230927 - Julian) Latest reserve ratio of TideBit holdings */}
      <section className="py-10 font-inter">
        {/* Info: (20230927 - Julian) Reserve Ratio Title */}
        <div className="flex items-center justify-center text-2xl text-white xs:text-3xl sm:text-4xl lg:mb-10">
          <span className="my-auto h-px w-full rounded bg-white/50 xs:inline-block xl:mx-2"></span>
          <h1 className="mx-3 whitespace-nowrap text-center">
            Latest
            <span className="text-primaryBlue"> reserve ratio </span>
            of TideBit holdings
          </h1>
          <span className="my-auto h-px w-full rounded bg-white/50 xs:inline-block xl:mx-2"></span>
        </div>

        {/* Info: (20230927 - Julian) Report Download */}
        <Link
          locale={false}
          // TODO: Report updated from context (20230619 - Shirley)
          href={`https://www.tidebit-defi.com/whitepaper/tidebit_tech_whitepaper_v2.0.4_en.pdf`}
          download
          target="_blank"
          className="flex w-full justify-center space-x-2 transition-all duration-150 hover:text-primaryBlue lg:justify-end lg:pr-1/8 2xl:pr-1/5"
        >
          <p className="text-sm">Download Report</p>
          <FiDownload size={20} />
        </Link>

        <div className="mx-auto flex w-full flex-col items-center justify-center bg-center pb-20 lg:flex-row">
          <ReserveCard
            name="USDT"
            color="text-lightGreen3"
            ratio="100" //{usdtReserveRatio}
            icon={getChainIcon('usdt').src}
            link="/"
            userHoldings="100" //{usdtUserHolding}
            walletAssets="100" //{usdtReserve}
          />
        </div>
      </section>

      {/* Info: (20230927 - Julian) AI Supervision Reports */}
      <section className="py-10 font-inter">
        {/* Info: (20230927 - Julian) AI Title */}
        <div className="flex items-center justify-center text-2xl text-white xs:text-3xl sm:text-4xl lg:mb-10">
          <span className="my-auto h-px w-full rounded bg-white/50 xs:inline-block xl:mx-2"></span>
          <h1 className="mx-3 whitespace-nowrap text-center">
            <span className="text-primaryBlue">{t('PLUGIN.SMART')} </span>
            {t('PLUGIN.AUDITING_REPORTS')}
          </h1>
          <span className="my-auto h-px w-full rounded bg-white/50 xs:inline-block xl:mx-2"></span>
        </div>

        {/* Info: (20230927 - Julian) AI Content */}
        <div className="lg:mx-20">
          <div className="my-5 flex w-full justify-center text-lilac lg:mb-10">
            {t('PLUGIN.LAST_UPDATED')}{' '}
            <span className="ml-2 text-lightWhite">{lastUpdatedText}</span>
          </div>

          {/* Info: (20230927 - Julian) Certificate Image */}
          <div className="mb-5 flex w-full justify-center lg:-mt-20 lg:mb-10 lg:justify-end">
            <Image src={certificateImageSrc} alt="certificate_image" width={80} height={80} />
          </div>

          {/* Info: (20230927 - Julian) Reports Link */}
          <div className="flex w-full justify-around">
            <div className="mx-auto grid grid-cols-2 items-center justify-center gap-5 lg:flex lg:w-full lg:flex-row lg:space-x-12">
              {displayReportsList}
            </div>
          </div>

          {/* Info: (20230927 - Julian) Powered By BAIFA */}
          <div className="flex w-full flex-col items-center justify-center space-x-3 space-y-2 pt-10 lg:flex-row lg:space-y-0">
            <p> {t('PLUGIN.POWERED_BY')}</p>
            <BoltButton
              style="solid"
              color="purple"
              className="rounded-full px-4 py-1 text-sm font-bold transition-all duration-300"
            >
              <Link href={BFAURL.HOME} target="_blank" className="flex space-x-2 whitespace-nowrap">
                <p>BAIFA</p>
                <BiLinkAlt size={20} />
              </Link>
            </BoltButton>
          </div>
        </div>
      </section>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default BaifaPlugin;
