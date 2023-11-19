import Image from 'next/image';
import {useState, ChangeEvent, KeyboardEvent} from 'react';
import {useRouter} from 'next/router';
import {BFAURL} from '../../constants/url';
import {FiSearch} from 'react-icons/fi';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

const GlobalSearch = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Info: (20231115 - Julian) 按下 Enter 後，導向搜尋結果頁面
      e.preventDefault();
      router.push(`${BFAURL.SEARCHING_RESULT}?search=${inputValue}`);
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {/* Info: (20230712 - Julian) Desktop Image */}
      <div className="hidden p-10 lg:block">
        <Image src="/elements/main_pic_1.svg" width={250} height={250} alt="global" />
      </div>

      {/* Info: (20230712 - Julian) Mobile Image */}
      <div className="block p-10 lg:hidden">
        <Image src="/elements/main_pic_1.svg" width={150} height={150} alt="global" />
      </div>

      <div className="relative flex items-center drop-shadow-xl">
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="block w-80vw rounded-full bg-purpleLinear p-3 pl-4 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 lg:w-800px lg:text-sm"
          placeholder={t('HOME_PAGE.SEARCH_PLACEHOLDER')}
        />
        <FiSearch className="absolute right-4 text-2xl text-hoverWhite" />
      </div>
    </div>
  );
};

export default GlobalSearch;
