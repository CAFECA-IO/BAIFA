import {Dispatch, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {FaChevronDown} from 'react-icons/fa';

interface ISearchFilter {
  sortingOptions: string[];
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  isLinearBg?: boolean;
}

const SortingMenu = ({sortingOptions, sorting, setSorting, isLinearBg}: ISearchFilter) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20231101 - Julian) close sorting menu when click outer
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLUListElement>(false);

  const displayedOptions = sortingOptions.map((option, index) => {
    const clickHandler = () => {
      setSorting(option);
      setSortingVisible(false);
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

  return (
    <button
      onClick={() => setSortingVisible(!sortingVisible)}
      className={`relative flex w-full items-center space-x-4 rounded text-sm ${
        isLinearBg ? 'bg-purpleLinear' : 'bg-darkPurple'
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

      <ul
        ref={sortingRef}
        className={`absolute -top-6 right-0 z-10 grid w-full grid-cols-1 items-center overflow-hidden lg:w-160px ${
          sortingVisible
            ? 'visible translate-y-90px grid-rows-1 opacity-100'
            : 'invisible translate-y-12 grid-rows-0 opacity-0'
        } rounded bg-darkPurple2 text-left text-hoverWhite shadow-xl transition-all duration-300 ease-in-out`}
      >
        {/* Info: (20231101 - Julian) Sorting Options */}
        {displayedOptions}
      </ul>
    </button>
  );
};

export default SortingMenu;
