import {useRef, useState, useEffect} from 'react';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {massiveDataContent, servicesContent, whyUsContent} from '@/constants/config';
import {TranslateFunction} from '@/interfaces/locale';
import LandingFooter from '@/components/landing_footer/landing_footer';

const LandingPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const scrl = useRef<HTMLDivElement>(null);
  const [isAtScrollStart, setIsAtScrollStart] = useState(true);
  const [isAtScrollEnd, setIsAtScrollEnd] = useState(false);

  const checkScrollPosition = () => {
    if (!scrl.current) return;

    /* Info: (20240301 - Shirley)
    `scroll.current.scrollWidth` 是整個 scroll bar 的寬度，元素的總滾動寬度，包括看不見的部分。
    `scroll.current.scrollLeft` 是目前捲軸的位置，當前元素的水平滾動偏移量，表示元素滾動條的左邊距離元素左邊的距離。改變這個值可以使元素水平滾動。
    `scroll.current.clientWidth` 個屬性表示元素內部可視區域的寬度，不包括滾動條、邊框和外邊距的寬度。 
    */
    const isAtEnd = scrl.current.scrollWidth - scrl.current.scrollLeft <= scrl.current.clientWidth;
    const isAtStart = scrl.current.scrollLeft === 0;
    setIsAtScrollEnd(isAtEnd);
    setIsAtScrollStart(isAtStart);
  };

  const slide = (shift: number) => {
    if (scrl.current) {
      scrl.current.scrollLeft += shift;
      checkScrollPosition();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      checkScrollPosition();
    };

    // Info: 因為 scrl 可能在 useEffect 的 cleanup function 執行後改變，所以複製 scrl.current 為 currentScrl，並用 currentScrl 來設定監聽事件 (20240301 - Shirley)
    const currentScrl = scrl.current;
    currentScrl?.addEventListener('scroll', handleScroll);

    return () => currentScrl?.removeEventListener('scroll', handleScroll);
  }, []);

  // Deprecated: 用 `isAtScrollStart` 和 `isAtScrollEnd` 來判斷是否到達左右邊界 (20240301 - Shirley)
  // useEffect(() => {
  //   if (!!!scrl.current) return;
  //   /* Info:(20230815 - Julian) 設定監聽事件，將捲軸位置更新到 scrollLeft */
  //   const scrollLeft = scrl.current.scrollLeft;
  //   const onScroll = () => setScrollLeft(scrollLeft);
  //   scrl.current.addEventListener('scroll', onScroll);
  //   const currentScrl = scrl.current;

  //   return () => {
  //     if (currentScrl) currentScrl.removeEventListener('scroll', onScroll);
  //   };
  // }, [scrollLeft]);

  /* Info:(20230815 - Julian) Slide Function */
  const slideLeft = () => slide(-200);
  const slideRight = () => slide(200);

  const massiveDataList = massiveDataContent.map(({icon, text, alt}, index) => {
    return (
      <div key={index} className="flex flex-col items-center space-y-4 px-4">
        <div className="relative h-50px w-50px">
          <Image src={icon} alt={alt} fill style={{objectFit: 'contain'}} />
        </div>
        <p className="text-base font-normal lg:text-lg">{t(text)}</p>
      </div>
    );
  });

  const servicesList = servicesContent.map(({image, alt, description}, index) => {
    return (
      <div
        key={index}
        className="relative flex flex-col items-center rounded-2xl bg-purpleLinear p-10 drop-shadow-101"
      >
        {/* Info:(20230815 - Julian) Image */}
        <div className="absolute -top-20 h-220px w-220px">
          <Image
            src={image}
            alt={alt}
            fill
            style={{objectFit: 'cover', objectPosition: 'center bottom'}}
          />
        </div>
        {/* Info:(20230815 - Julian) placeholder */}
        <div className="h-130px"></div>
        {/* Info:(20230815 - Julian) Description */}
        <p className="w-220px text-center text-xl">{t(description)}</p>
      </div>
    );
  });

  const whyUsList = whyUsContent.map(({image, alt, description}, index) => {
    return (
      <div key={index} className="flex flex-col items-center space-y-6 text-center">
        <div className="relative h-80px w-80px">
          <Image src={image} alt={alt} fill style={{objectFit: 'contain'}} />
        </div>

        <p>{t(description)}</p>
      </div>
    );
  });

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden font-inter">
      {/* Info:(20230815 - Julian) Pipe Background Image */}
      <div className="relative flex h-120vh w-full flex-col items-center bg-pipe bg-auto bg-right bg-no-repeat lg:bg-cover lg:bg-top-4">
        {/* Info:(20230711 - Julian) Main Title Block */}
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-10 px-4 py-12 text-center">
          <h6 className="font-roboto text-6xl font-bold tracking-wider lg:text-7xl">
            {t('LANDING_PAGE.MAIN_TITLE')}
          </h6>
          <h1 className="text-2xl font-bold tracking-wide text-hoverWhite lg:text-6xl">
            {t('LANDING_PAGE.MAIN_SUBTITLE')}
          </h1>
          {/* Info:(20230711 - Julian) Arrow */}
          <Link href="#baifa_101" scroll={false} className="absolute bottom-80 lg:bottom-20">
            <Image src="/animations/arrow_down.gif" alt="scroll arrow" width={50} height={50} />
          </Link>
        </div>
      </div>

      <div className="flex h-fit w-full flex-col items-center bg-lightBalls bg-cover bg-top bg-no-repeat lg:pb-52">
        {/* Info:(20230815 - Julian) Baifa 101 Block */}
        <div id="baifa_101" className="w-full px-4 py-12 lg:px-20 lg:py-120px">
          <div className="flex flex-col items-center space-y-10 rounded-2xl bg-101 bg-cover bg-center bg-no-repeat px-4 py-12 drop-shadow-101 lg:flex-row lg:space-x-20 lg:space-y-0 lg:p-20">
            <div className="flex h-full flex-col items-center space-y-10 whitespace-nowrap lg:w-1/2 lg:items-start">
              <h2 className="text-32px font-bold lg:text-6xl">
                {t('LANDING_PAGE.BAIFA_101_TITLE')}:
              </h2>
              <div className="w-fit rounded-xl bg-darkPurple3 px-5 py-10px text-lg">
                {t('LANDING_PAGE.BAIFA_101_SUBTITLE')}
              </div>
            </div>
            <div className="lg:w-2/3">
              <p className="text-base lg:text-xl">{t('LANDING_PAGE.BAIFA_101_CONTENT')}</p>
            </div>
          </div>
        </div>

        {/* Info:(20230711 - Julian) Features Block */}
        <div className="flex flex-col items-center space-y-16 px-4 py-20 text-center font-roboto lg:h-450px lg:px-20">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-primaryBlue">
              {t('LANDING_PAGE.FEATURES_SUBTITLE')}
            </h3>
            <h2 className="text-2xl font-bold lg:text-5xl">{t('LANDING_PAGE.FEATURES_TITLE')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">{massiveDataList}</div>
        </div>
      </div>

      <div className="flex h-fit w-full flex-col items-center bg-lightBallsReverse bg-cover bg-top bg-no-repeat pb-100px">
        {/* Info:(20230815 - Julian) Services Block */}
        <div className="relative flex w-full flex-col space-y-20 py-20">
          <div className="flex items-center justify-center space-x-20 px-20">
            {/* Info:(20230711 - Julian) Services Title */}
            <h2 className="text-center text-2xl font-bold leading-loose lg:text-6xl">
              {t('LANDING_PAGE.SERVICES_TITLE_1')}
              <span className="text-primaryBlue">{t('LANDING_PAGE.SERVICES_TITLE_HIGHLIGHT')}</span>
              {t('LANDING_PAGE.SERVICES_TITLE_2')}
            </h2>
            {/* Info:(20230711 - Julian) Arrow button, only show on desktop */}
            <div className="hidden items-center space-x-6 lg:flex">
              <button
                disabled={isAtScrollStart}
                onClick={slideLeft}
                className="rounded border border-hoverWhite p-3 text-hoverWhite transition-all duration-150 ease-in-out hover:border-primaryBlue hover:text-primaryBlue disabled:opacity-50 disabled:hover:border-hoverWhite disabled:hover:text-hoverWhite"
              >
                <AiOutlineLeft className="text-2xl" />
              </button>
              <button
                disabled={isAtScrollEnd}
                onClick={slideRight}
                className="rounded border border-hoverWhite p-3 text-hoverWhite transition-all duration-150 ease-in-out hover:border-primaryBlue hover:text-primaryBlue disabled:opacity-50 disabled:hover:border-hoverWhite disabled:hover:text-hoverWhite"
              >
                <AiOutlineRight className="text-2xl" />
              </button>
            </div>
          </div>
          {/* Info:(20230815 - Julian) horizontal scroll part */}
          <div
            ref={scrl}
            className="flex flex-col items-center space-y-28 scroll-smooth px-4 lg:flex-row lg:space-x-10 lg:space-y-0 lg:overflow-x-auto lg:px-40 lg:py-20"
          >
            {servicesList}
            {/* Info:(20230815 - Julian) pink background */}
            <div className="absolute -right-20 top-60 -z-10 hidden h-255px w-700px rounded-2xl bg-101 bg-cover bg-no-repeat lg:block"></div>
          </div>
        </div>

        {/* Info:(20230815 - Julian) Why BAIFA Block */}
        <div className="flex w-full flex-col items-center py-100px lg:flex-row lg:pl-20">
          {/* Info:(20230815 - Julian) Mobile Why BAIFA Title */}
          <div className="mb-20 flex w-full flex-col items-center space-y-10 lg:hidden">
            <h2 className="text-2xl font-bold">
              {t('LANDING_PAGE.WHY_BAIFA_TITLE')}
              <span className="text-primaryBlue">
                {t('LANDING_PAGE.WHY_BAIFA_TITLE_HIGHLIGHT')}
              </span>
            </h2>
            <div className="relative h-150px w-400px">
              <Image
                src={'/elements/robot_hand.png'}
                alt="a robot hand"
                fill
                style={{objectFit: 'contain', objectPosition: 'right center'}}
              />
            </div>
          </div>
          {/* Info:(20230815 - Julian) Why BAIFA List */}
          <div className="mx-auto grid grid-cols-1 gap-10 lg:flex-1 lg:grid-cols-2">
            {whyUsList}
          </div>
          {/* Info:(20230815 - Julian) Desktop Why BAIFA Title */}
          <div className="ml-20 hidden flex-col space-y-10 lg:flex">
            <h2 className="text-6xl font-bold">
              {t('LANDING_PAGE.WHY_BAIFA_TITLE')}
              <span className="text-primaryBlue">
                {t('LANDING_PAGE.WHY_BAIFA_TITLE_HIGHLIGHT')}
              </span>
            </h2>
            <Image src={'/elements/robot_hand.png'} alt="a robot hand" width={500} height={500} />
          </div>
        </div>
      </div>

      {/* Info:(20230711 - Julian) Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPageBody;
