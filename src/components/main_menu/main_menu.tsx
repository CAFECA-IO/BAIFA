import Image from 'next/image';
import Link from 'next/link';
import {mainMenuContent} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const MainMenu = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const mainMenu = mainMenuContent.map(({icon, title, description, mark, link, alt}) => {
    return (
      <Link href={link} key={title}>
        <div className="flex h-200px w-300px flex-col items-center justify-between rounded-lg border border-transparent bg-darkPurple p-6 text-center shadow-xl hover:border-primaryBlue">
          <Image src={icon} width={80} height={80} alt={alt} />
          <div className="flex text-3xl font-bold text-primaryBlue">
            {description}
            <span className="self-start text-sm">{mark}</span>
          </div>
          <div className="text-sm font-medium text-white">{t(title)}</div>
        </div>
      </Link>
    );
  });

  return (
    // ToDo: (20230711 - Julian) link to other pages
    <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-x-16 lg:space-y-0">
      {mainMenu}
    </div>
  );
};

export default MainMenu;
