import {Dispatch, SetStateAction, useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {FaChevronDown} from 'react-icons/fa';
import {convertStringToSortingType, truncateText} from '../../lib/common';
import {DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';
import {SortingType} from '../../constants/api_request';
import {useRouter} from 'next/router';

interface ISearchFilter {
  sortingOptions: string[];
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  bgColor: string;
  sortingHandler?: ({order}: {order: SortingType}) => Promise<void>;
  loading?: boolean;
  sortPrefix?: string;
}

const SortingMenu = ({
  sortingOptions,
  sorting,
  setSorting,
  bgColor,
  sortingHandler,
  loading,
  sortPrefix = '',
}: ISearchFilter) => {
  const {t} = useTranslation('common');
  const router = useRouter();

  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLDivElement>(false);

  useEffect(() => {
    const sortingQueryParam = router.query[`${sortPrefix}_sorting`];
    if (
      sortingQueryParam &&
      sortingOptions.includes(sortingQueryParam as string) &&
      sorting !== sortingQueryParam
    ) {
      setSorting(sortingQueryParam as string);
      sortingHandler &&
        sortingHandler({order: convertStringToSortingType(sortingQueryParam as string)});
    }
  }, [router.query, sortingOptions, setSorting, sortingHandler, sortPrefix, sorting]);

  // useEffect(() => {
  //   // Ensure router.query exists and is accessible before attempting to use it
  //   if (router && router.query) {
  //     const sortingQueryParam = router.query[`${sortPrefix}_sorting`];
  //     if (
  //       sortingQueryParam &&
  //       sortingOptions.includes(sortingQueryParam as string) &&
  //       sorting !== sortingQueryParam
  //     ) {
  //       setSorting(sortingQueryParam as string);
  //       sortingHandler &&
  //         sortingHandler({order: convertStringToSortingType(sortingQueryParam as string)});
  //     }
  //   }
  // }, [router.query, sortingOptions, setSorting, sortingHandler, sortPrefix, sorting]);

  const handleSortingChange = async (option: string) => {
    if (option !== sorting) {
      // Only proceed if the option is different from the current sorting
      setSorting(option);
      setSortingVisible(false);
      if (sortingHandler) {
        await sortingHandler({order: convertStringToSortingType(option)});
      }
      // Update the URL with the new sorting option using the optional prefix
      const newQuery = {...router.query, [`${sortPrefix}_sorting`]: option};
      router.push({pathname: router.pathname, query: newQuery}, undefined, {shallow: true});
    }
  };

  const optionsUI = (
    <ul className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      {sortingOptions.map(option => (
        <li
          key={option}
          onClick={() => handleSortingChange(option)}
          className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
        >
          {truncateText(t(option), DEFAULT_TRUNCATE_LENGTH)}
        </li>
      ))}
    </ul>
  );

  const displayedOptions = <> {!loading ? optionsUI : null} </>;

  const menuOpenHandler = () => setSortingVisible(!sortingVisible);

  return (
    <button
      disabled={loading}
      onClick={menuOpenHandler}
      className={`relative flex w-full items-center space-x-4 rounded text-sm ${bgColor} p-4 text-hoverWhite lg:w-160px`}
    >
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
        {displayedOptions}
      </div>
    </button>
  );
};

export default SortingMenu;
