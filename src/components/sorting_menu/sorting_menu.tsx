import {Dispatch, SetStateAction} from 'react';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {FaChevronDown} from 'react-icons/fa';
import {
  convertSortingTypeToString,
  convertStringToSortingType,
  truncateText,
} from '../../lib/common';
import {DEFAULT_TRUNCATE_LENGTH, sortOldAndNewOptions} from '../../constants/config';
import {IPaginationOptions, SortingType} from '../../constants/api_request';

interface ISearchFilter {
  sortingOptions: string[];
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  bgColor: string;
  sortingHandler?: ({order}: {order: SortingType}) => Promise<void>;
  loading?: boolean;
}

const SortingMenu = ({
  sortingOptions,
  sorting,
  setSorting,
  bgColor,
  sortingHandler,
  loading,
}: ISearchFilter) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20231101 - Julian) close sorting menu when click outer
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLDivElement>(false);

  /* Deprecated: (20240220 - Shirley) to fix the issue of disabling sorting options and `Warning: Each child in a list should have a unique "key" prop.` React error
  const optionsUI = sortingOptions.map((option, index) => {
    const clickHandler = async () => {
      console.log('option in displayedOptions', option);
      setSorting(option);
      setSortingVisible(false);

      sortingHandler && (await sortingHandler({order: convertStringToSortingType(option)}));
    };
    return (
      <>
        {' '}
        <ul className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
          <li
            key={option}
            onClick={clickHandler}
            className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
          >
            {truncateText(t(option), DEFAULT_TRUNCATE_LENGTH)}
          </li>{' '}
        </ul>
      </>
    );
  });
  */

  const optionsUI = (
    <ul className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      {sortingOptions.map(option => {
        const clickHandler = async () => {
          setSorting(option);
          setSortingVisible(false);

          if (sortingHandler) {
            await sortingHandler({order: convertStringToSortingType(option)});
          }
        };
        return (
          <li
            key={option} // This ensures each child in the list has a unique "key" prop.
            onClick={clickHandler}
            className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
          >
            {/* Info: (20240124 - Julian) 將選項字數限制在 10 個字 */}

            {truncateText(t(option), DEFAULT_TRUNCATE_LENGTH)}
          </li>
        );
      })}
    </ul>
  );

  const displayedOptions = <> {!loading ? optionsUI : null}</>;

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
        {displayedOptions}
      </div>
    </button>
  );
};

export default SortingMenu;
