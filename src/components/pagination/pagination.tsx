import {Dispatch, SetStateAction, useState, useEffect} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({activePage, setActivePage, totalPages}: IPagination) => {
  const [url, setUrl] = useState<URL | null>(null);
  const [targetPage, setTargetPage] = useState<number>(1);

  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite hover:cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:border-transparent';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      setUrl(currentUrl);
    }
  }, []);

  const previousHandler = () => {
    setActivePage(activePage - 1);
    // Info: (20240115 - Julian) change url query
    if (url) {
      url.searchParams.set('page', `${activePage - 1}`);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const nextHandler = () => {
    setActivePage(activePage + 1);
    // Info: (20240115 - Julian) change url query
    if (url) {
      url.searchParams.set('page', `${activePage + 1}`);
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
      setActivePage(targetPage);
      // Info: (20240115 - Julian) change url query
      if (url) {
        url.searchParams.set('page', `${targetPage}`);
        window.history.replaceState({}, '', url.toString());
      }
    }
  };

  const previousBtn = (
    <button
      onClick={previousHandler}
      disabled={activePage === 1 || totalPages === 0 ? true : false}
      className={buttonStyle}
    >
      <RiArrowLeftSLine className="text-2xl" />
    </button>
  );

  const nextBtn = (
    <button
      onClick={nextHandler}
      disabled={activePage === totalPages || totalPages === 0 ? true : false}
      className={buttonStyle}
    >
      <RiArrowRightSLine className="text-2xl" />
    </button>
  );

  const pageInput = (
    <input
      name="page"
      type="number"
      placeholder={`${activePage}`}
      className="flex h-48px w-48px items-center justify-center rounded border border-hoverWhite bg-darkPurple p-3 text-center text-sm text-hoverWhite"
      onChange={pageChangeHandler}
      onKeyDown={handleKeyDown}
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
