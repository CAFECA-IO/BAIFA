import {Dispatch, SetStateAction, useCallback, useEffect} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import {DEFAULT_PAGE, ITEM_PER_PAGE, buttonStyle} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {useRouter} from 'next/router';
import {IAddressHistoryQuery} from '../../constants/api_request';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  getActivePage?: (page: number) => void;
  paginationClickHandler?: ({page, offset}: {page: number; offset: number}) => Promise<void>;
  loading?: boolean;
  pagePrefix?: string;
  pageInit?: (
    chainId?: string,
    addressId?: string,
    options?: IAddressHistoryQuery
  ) => Promise<void>;
}

const Pagination = ({
  activePage,
  setActivePage,
  getActivePage,
  totalPages,
  paginationClickHandler,
  loading,
  pagePrefix,
  pageInit,
}: IPagination) => {
  /* Deprecated: 直接拿 window.location.href 來做 url，避免重複 (20240229 - Shirley)
  // const [url, setUrl] = useState<URL | null>(null);
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [targetPage, setTargetPage, targetPageRef] = useStateRef<number>(activePage);

  const router = useRouter();
  const {query} = router;

  // Info: (20240403 - Liz) 當 query 改變時，檢查是否有 page 參數，並將其轉換為整數，然後設置為當前頁碼
  useEffect(() => {
    const queryPage = query[`${pagePrefix ? `${pagePrefix}_page` : 'page'}`];
    if (query && queryPage) {
      if (!isNaN(parseInt(queryPage as string, 10))) {
        const page = parseInt(query[`${pagePrefix ? `${pagePrefix}_page` : 'page'}`] as string, 10);
        const abs = Math.abs(page);
        changePage(abs);
      }
    } else {
      pageInit && pageInit();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleUrlChange = () => {
      const url = new URL(window.location.href);
      const pageParam = url.searchParams.get(pagePrefix ? `${pagePrefix}_page` : 'page');
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      if (!isNaN(page) && page !== activePage) {
        setActivePage(page);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [activePage, setActivePage, pagePrefix]);

  const updateUrl = useCallback(
    (newPage: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set(`${pagePrefix ? `${pagePrefix}_page` : 'page'}`, `${newPage}`);
      window.history.pushState({}, '', url.toString());
    },
    [pagePrefix]
  );

  // Info: (20240403 - Liz) 當 activePage 改變時，更新目標頁碼和 URL
  useEffect(() => {
    setTargetPage(activePage);
    updateUrl(activePage);
  }, [activePage, setTargetPage, updateUrl]);

  const changePage = async (newPage: number) => {
    setActivePage(newPage);
    getActivePage && getActivePage(newPage);
    if (paginationClickHandler) {
      await paginationClickHandler({page: newPage, offset: ITEM_PER_PAGE});
    }
    updateUrl(newPage);
    setTargetPage(newPage);
  };

  const previousHandler = () => {
    let newPage = DEFAULT_PAGE;
    if (activePage > totalPages) {
      newPage = totalPages;
    } else if (activePage > 1) {
      newPage = activePage - 1;
    } else {
      newPage = DEFAULT_PAGE;
    }
    changePage(newPage);
  };

  const nextHandler = () => {
    let newPage = totalPages;
    if (activePage < 1) {
      newPage = DEFAULT_PAGE;
    } else if (activePage < totalPages) {
      newPage = activePage + 1;
    } else {
      newPage = totalPages;
    }
    changePage(newPage);
  };

  // Info: (20240403 - Liz) pageChangeHandler 接收一個事件物件作為參數，預期的是 React 中 <input> 元素的變化事件 ChangeEvent。
  const pageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Info: (20240403 - Liz) 從事件中獲取輸入框的值，並將其轉換為整數，Math.min 和 Math.max 函數用於確保頁碼的值在合法範圍內（1 到 totalPages 之間）
    const value = Math.min(Math.max(1, parseInt(event.target.value, 10)), totalPages);

    // Info: (20240403 - Liz) 如果轉換後的值是有效數字，設為目標頁碼
    if (!isNaN(value)) {
      setTargetPage(value);
    }
  };

  // Info: (20240403 - Liz) 按下 Enter 鍵時，將目標頁碼設置為當前頁碼
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && targetPageRef.current !== activePage) {
      changePage(targetPageRef.current);
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
      disabled={
        loading || activePage === totalPages || activePage > totalPages || totalPages === 0
          ? true
          : false
      }
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
