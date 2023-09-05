import {Dispatch, SetStateAction} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';

interface IPagination {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({activePage, setActivePage, totalPages}: IPagination) => {
  const buttonStyle =
    'flex h-48px w-48px items-center justify-center rounded border border-transparent bg-purpleLinear p-3 transition-all duration-300 ease-in-out hover:border-hoverWhite';

  const pageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setActivePage(1);
    } else if (parseInt(event.target.value) > totalPages) {
      setActivePage(totalPages);
    } else {
      setActivePage(parseInt(event.target.value));
    }
  };

  const previousBtn = (
    <button
      onClick={() => setActivePage(activePage - 1)}
      disabled={activePage === 1 ? true : false}
      className={buttonStyle}
    >
      <RiArrowLeftSLine className="text-2xl" />
    </button>
  );

  const nextBtn = (
    <button
      onClick={() => setActivePage(activePage + 1)}
      disabled={activePage === totalPages ? true : false}
      className={buttonStyle}
    >
      <RiArrowRightSLine className="text-2xl" />
    </button>
  );

  const pageInput = (
    <input
      type="number"
      className="flex h-48px w-48px items-center justify-center rounded border border-hoverWhite bg-darkPurple p-3 text-center text-sm text-hoverWhite"
      value={activePage}
      onChange={pageChangeHandler}
    />
  );

  return (
    <ul className="mb-2 flex items-center justify-center gap-1 text-sm font-medium">
      <li>{previousBtn}</li>
      <li>{pageInput}</li>
      <li>{nextBtn}</li>
    </ul>
  );
};

export default Pagination;
