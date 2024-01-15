import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {FaChevronDown} from 'react-icons/fa';

interface ISearchFilter {
  sortingType: string; // Info: (20240115 - Julian) query string
  sortingOptions: string[];
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  bgColor: string;
}

const SortingMenu = ({
  sortingType,
  sortingOptions,
  sorting,
  setSorting,
  bgColor,
}: ISearchFilter) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [url, setUrl] = useState<URL | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      setUrl(currentUrl);
    }
  }, []);

  // Info: (20231101 - Julian) close sorting menu when click outer
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const displayedOptions = sortingOptions.map((option, index) => {
    const clickHandler = () => {
      setSorting(option);
      setSortingVisible(false);
      // Info: (20240115 - Julian) change url query
      if (url) {
        url.searchParams.set(sortingType, option);
        window.history.replaceState({}, '', url.toString());
      }
    };
    return (
      <li
        key={index}
        onClick={clickHandler}
        className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
      >
        {t(option)}
      </li>
    );
  });

  const menuOpenHandler = () => setSortingVisible(!sortingVisible);

  return (
    <button
      onClick={menuOpenHandler}
      className={`relative flex w-full items-center space-x-4 rounded text-sm ${
        bgColor //? 'bg-purpleLinear' : 'bg-darkPurple'
      } p-4 text-hoverWhite lg:w-160px`}
    >
      {/* Info: (20231101 - Julian) Sorting Button */}
      <p
        className={`flex-1 text-left lg:w-100px ${
          sortingVisible ? 'opacity-0' : 'opacity-100'
        } transition-all duration-300 ease-in-out`}
      >
        {t(sorting)}
      </p>
      <FaChevronDown />

      <div
        ref={sortingRef}
        className={`absolute -top-6 right-0 z-10 grid max-h-320px w-full items-center lg:w-160px ${
          sortingVisible
            ? 'visible translate-y-90px grid-rows-1 opacity-100'
            : 'invisible translate-y-12 grid-rows-0 opacity-0'
        } rounded bg-darkPurple2 text-left text-hoverWhite shadow-xl transition-all duration-300 ease-in-out`}
      >
        {/* Info: (20231101 - Julian) Sorting Options */}
        <ul className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
          {displayedOptions}
        </ul>
      </div>
    </button>
  );
};

export default SortingMenu;
