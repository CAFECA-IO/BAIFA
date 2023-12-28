import Image from 'next/image';
import Link from 'next/link';
import {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {BFAURL} from '../../constants/url';

const MainMenu = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {promotionData} = useContext(MarketContext);

  const mainMenuContent = [
    {
      icon: '/icons/chain.svg',
      title: 'HOME_PAGE.CHAINS_TITLE',
      description: promotionData.chains,
      link: BFAURL.CHAINS,
      alt: 'chain_icon',
    },
    {
      icon: '/icons/coin.svg',
      title: 'HOME_PAGE.CRYPTO_TITLE',
      description: promotionData.cryptoCurrencies,
      link: BFAURL.CURRENCIES,
      alt: 'coin_icon',
    },
    {
      icon: '/icons/black_list.svg',
      title: 'HOME_PAGE.BLACKLIST_TITLE',
      description: promotionData.blackList,
      link: BFAURL.BLACKLIST,
      alt: 'blacklist_icon',
    },
  ];

  const mainMenu = mainMenuContent.map(({icon, title, description, link, alt}) => {
    return (
      <Link href={link} key={title}>
        <div className="flex h-200px w-300px flex-col items-center justify-between rounded-lg border border-transparent bg-darkPurple p-6 text-center shadow-xl hover:border-primaryBlue">
          <Image src={icon} width={80} height={80} alt={alt} />
          <div className="flex text-3xl font-bold text-primaryBlue">{description}</div>
          <div className="text-sm font-medium text-white">{t(title)}</div>
        </div>
      </Link>
    );
  });

  return (
    <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-x-16 lg:space-y-0">
      {mainMenu}
    </div>
  );
};

export default MainMenu;
