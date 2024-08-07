import {Dispatch, SetStateAction} from 'react';
import {FaChevronDown} from 'react-icons/fa';
import {useTranslation} from 'next-i18next';
import {DEFAULT_TRUNCATE_LENGTH, DEFAULT_PAGE} from '@/constants/config';
import {TimeSortingType} from '@/constants/api_request';
import {TranslateFunction} from '@/interfaces/locale';
import {convertStringToSortingType, truncateText} from '@/lib/common';
import useOuterClick from '@/lib/hooks/use_outer_click';

interface ISearchFilter {
  sortingOptions: string[];
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  bgColor: string;
  sortingHandler?: ({order}: {order: TimeSortingType}) => Promise<void>;
  loading?: boolean;
  sortPrefix?: string;
  setActivePage?: Dispatch<SetStateAction<number>>;
}

const SortingMenu = ({
  sortingOptions,
  sorting,
  setSorting,
  bgColor,
  sortingHandler,
  loading,
  setActivePage,
}: //sortPrefix = '', // TODO: URL query prefix (20240219 - Shirley)
ISearchFilter) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20231101 - Julian) close sorting menu when click outer
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLDivElement>(false);

  // Info: (20240207 - Liz) Remove duplicate options
  const uniqueOptions = Array.from(new Set(sortingOptions));

  const displayedOptions = uniqueOptions.map((option, index) => {
    const clickHandler = async () => {
      setSorting(option);
      setSortingVisible(false);
      if (sortingHandler) {
        await sortingHandler({order: convertStringToSortingType(option)});
      }
      setActivePage && setActivePage(DEFAULT_PAGE);
    };
    return (
      <li
        key={index}
        onClick={clickHandler}
        className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
      >
        {/* Info: (20240124 - Julian) 將選項字數限制在 10 個字 */}
        {truncateText(t(option), DEFAULT_TRUNCATE_LENGTH)}
      </li>
    );
  });

  const menuOpenHandler = () => setSortingVisible(!sortingVisible);

  return (
    <button
      disabled={loading}
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
        {truncateText(t(sorting), DEFAULT_TRUNCATE_LENGTH)}
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
        <ul className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden whitespace-nowrap">
          {displayedOptions}
        </ul>
      </div>
    </button>
  );
};

export default SortingMenu;
