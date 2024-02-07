import {Dispatch, SetStateAction, useState, useEffect} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import {IAddressHistoryQuery, IPaginationOptions, SortingType} from '../../constants/api_request';
import {ITEM_PER_PAGE} from '../../constants/config';
import useStateRef from 'react-usestateref';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  getActivePage?: (page: number) => void;
  paginationClickHandler?: ({page, offset}: {page: number; offset: number}) => Promise<void>;
  loading?: boolean;
  pagePrefix?: string;
}

const Pagination = ({
  activePage,
  setActivePage,
  getActivePage,
  totalPages,
  paginationClickHandler,
  loading,
  pagePrefix,
}: IPagination) => {
  const [url, setUrl] = useState<URL | null>(null);
  const [targetPage, setTargetPage, targetPageRef] = useStateRef<number>(1);

  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      setUrl(currentUrl);
    }
  }, []);

  const previousHandler = async () => {
    const present = activePage - 1;
    getActivePage && getActivePage(present);
    setTargetPage(present);
    setActivePage(present);
    // Info: (20240115 - Julian) change url query
    if (url) {
      paginationClickHandler &&
        (await paginationClickHandler({
          // order: SortingType.DESC,
          page: present,
          offset: ITEM_PER_PAGE,
          // begin: url.searchParams.get('begin') || 0,
          // end: url.searchParams.get('end') || 0,
          // query: url.searchParams.get('query') || 0,
        }));
      url.searchParams.set(`${pagePrefix ? `${pagePrefix}_page` : `page`}`, `${present}`);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const nextHandler = async () => {
    const present = activePage + 1;
    getActivePage && getActivePage(present);
    setTargetPage(present);
    setActivePage(present);
    // Info: (20240115 - Julian) change url query
    if (url) {
      paginationClickHandler &&
        (await paginationClickHandler({
          page: present,
          offset: ITEM_PER_PAGE,
        }));
      url.searchParams.set(`${pagePrefix ? `${pagePrefix}_page` : `page`}`, `${present}`);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Info: (20230907 - Julian) 將在 input 輸入的數字放入 targetPage
  const pageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = +event.target.value;
    if (value > totalPages) {
      setTargetPage(totalPages);
    } else if (value < 1) {
      setTargetPage(1);
    } else {
      setTargetPage(value);
    }
  };

  // Info: (20230907 - Julian) 按下 Enter 後，將 targetPage 設定給 activePage
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setActivePage(targetPageRef.current);
      // Info: (20240115 - Julian) change url query
      if (url) {
        paginationClickHandler &&
          paginationClickHandler({
            page: targetPageRef.current,
            offset: ITEM_PER_PAGE,
          });
        url.searchParams.set(
          `${pagePrefix ? `${pagePrefix}_page` : `page`}`,
          `${targetPageRef.current}`
        );
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const previousBtn = (
    <button
      onClick={previousHandler}
      disabled={loading || activePage === 1 || totalPages === 0 ? true : false}
      className={buttonStyle}
    >
      <RiArrowLeftSLine className="text-2xl" />
    </button>
  );

  const nextBtn = (
    <button
      onClick={nextHandler}
      disabled={loading || activePage === totalPages || totalPages === 0 ? true : false}
      className={buttonStyle}
    >
      <RiArrowRightSLine className="text-2xl" />
    </button>
  );

  const pageInput = (
    <input
      disabled={loading}
      name="page"
      type="number"
      placeholder={`${activePage}`}
      className="flex h-48px w-48px items-center justify-center rounded border border-hoverWhite bg-darkPurple p-3 text-center text-sm text-hoverWhite disabled:border-gray-500"
      onChange={pageChangeHandler}
      onKeyDown={handleKeyDown}
      value={targetPageRef.current}
      min={1}
      max={totalPages}
    />
  );

  return (
    <div className="flex flex-col items-center">
      {/* Info: (20230907 - Julian) Selector */}
      <ul className="mb-2 flex w-fit items-center justify-center gap-1 text-sm font-medium">
        <li>{previousBtn}</li>
        <li>{pageInput}</li>
        <li>{nextBtn}</li>
      </ul>

      {/* Info: (20230907 - Julian) activePage of totalPage */}
      <div className="inline-flex w-150px items-center">
        <span className="w-full border-b border-lilac"></span>
        <p className="whitespace-nowrap px-2 text-sm text-lilac">
          {activePage} of {totalPages}
        </p>
        <span className="w-full border-b border-lilac"></span>
      </div>
    </div>
  );
};

export default Pagination;
