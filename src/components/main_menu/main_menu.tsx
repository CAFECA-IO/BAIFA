import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {dummyChains} from '../../interfaces/chain';
import {dummyCurrencyData} from '../../interfaces/currency';
import {BFAURL} from '../../constants/url';

const MainMenu = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const mainMenuContent = [
    {
      icon: '/icons/chain.svg',
      title: 'HOME_PAGE.CHAINS_TITLE',
      description: dummyChains.length,
      link: BFAURL.CHAINS,
      alt: 'chain_icon',
    },
    {
      icon: '/icons/coin.svg',
      title: 'HOME_PAGE.CRYPTO_TITLE',
      description: dummyCurrencyData.length,
      link: BFAURL.CURRENCIES,
      alt: 'coin_icon',
    },
    {
      icon: '/icons/black_list.svg',
      title: 'HOME_PAGE.BLACKLIST_TITLE',
      description: '200',
      link: BFAURL.COMING_SOON,
      alt: 'blacklist_icon',
    },
  ];

  const mainMenu = mainMenuContent.map(({icon, title, description, link, alt}) => {
    return (
      /* ToDo: (20230727 - Julian) page link */
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
