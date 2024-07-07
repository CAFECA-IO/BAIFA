import {Dispatch, SetStateAction, KeyboardEvent, useState, ChangeEvent} from 'react';
import {RiSearchLine} from 'react-icons/ri';
import useStateRef from 'react-usestateref';
import {DEFAULT_PAGE} from '@/constants/config';
import useOuterClick from '@/lib/hooks/use_outer_click';

interface ISearchBarProps {
  searchBarPlaceholder: string;
  setSearch: Dispatch<SetStateAction<string>>;
  suggestions?: string[];
  getSearch?: (input: string) => void;
  setActivePage: Dispatch<SetStateAction<number>>;
}

interface ISearchBarWithSuggestionsProps extends ISearchBarProps {
  suggestions: string[];
  getSearch: (input: string) => void;
}

/**
 * Info: Basic Search Bar component without suggestions (20240314 - Shirley)
 *
 * This component renders a simple search input field. It updates the search state on change.
 * Ideal for scenarios where suggestions are not required or when a simpler UI is preferred.
 *
 * @param {ISearchBarProps} props - The props object containing the search bar configuration.
 * @param {string} props.searchBarPlaceholder - The placeholder text for the search input.
 * @param {Dispatch<SetStateAction<string>>} props.setSearch - The function to update the search state.
 */
const SearchBar = ({searchBarPlaceholder, setSearch, setActivePage}: ISearchBarProps) => {
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
  };

  return (
    <div className="relative w-full drop-shadow-xl">
      <input
        type="search"
        className="w-full items-center rounded-full bg-purpleLinear px-6 py-3 text-base placeholder:text-sm placeholder:lg:text-base"
        placeholder={searchBarPlaceholder}
        onChange={searchChangeHandler}
      />
      <div className="absolute right-5 top-3 text-2xl">
        <RiSearchLine />
      </div>
    </div>
  );
};

/**
 * Info: Search Bar with 'Enter' key detection (20240314 - Shirley)
 *
 * Enhances the basic search bar by triggering the search action when the 'Enter' key is pressed.
 * Useful for users who prefer to initiate searches using the keyboard.
 *
 * @param {ISearchBarProps} props - The props object containing the search bar configuration.
 * @param {string} props.searchBarPlaceholder - The placeholder text for the search input.
 * @param {Dispatch<SetStateAction<string>>} props.setSearch - The function to update the search state.
 */
export const SearchBarWithKeyDown = ({
  searchBarPlaceholder,
  setSearch,
  setActivePage,
}: ISearchBarProps) => {
  // Info: (20240318 - Julian) 定義一個通用函數，用於修改 search state
  const handleSetSearch = (value: string) => setSearch(value);

  // Info: (20240222 - Julian) 按下 Enter 鍵時，修改 search state 並觸發搜尋
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSetSearch(e.currentTarget.value);
      setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
    }
  };

  // Info: (20240318 - Julian) 點擊搜尋按鈕時，修改 search state 並觸發搜尋
  const handleSearchClick = () => {
    // Info: (20240318 - Julian) 取得 input 內容
    const input = document.querySelector('input[type="search"]') as HTMLInputElement;
    handleSetSearch(input.value);
    setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
  };

  return (
    <div className="relative w-full drop-shadow-xl">
      <input
        type="search"
        className="w-full items-center rounded-full bg-purpleLinear px-6 py-3 text-base placeholder:text-sm placeholder:lg:text-base"
        placeholder={searchBarPlaceholder}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearchClick}
        className="absolute right-3 top-3 z-10 bg-purpleLinear px-2 text-2xl"
      >
        <RiSearchLine />
      </button>
    </div>
  );
};

/**
 * Info: Search Bar with suggestions and keyboard navigation (20240314 - Shirley)
 *
 * This component extends the basic search bar with a suggestions dropdown. It supports keyboard navigation
 * (Arrow Up/Down) to browse through suggestions, and 'Enter' to select. It provides a dynamic user experience
 * by filtering and displaying suggestions based on the user's input.
 *
 * @param {ISearchBarWithSuggestionsProps} props - The props object containing the search bar and suggestions configuration.
 * @param {string[]} props.suggestions - The list of suggestions to display.
 * @param {(input: string) => void} props.getSearch - The function to call when a search is triggered.
 */
export const SearchBarWithSuggestions = ({
  searchBarPlaceholder,
  setSearch,
  suggestions = [],
  getSearch,
  setActivePage,
}: ISearchBarWithSuggestionsProps) => {
  const [inputValue, setInputValue, inputValueRef] = useStateRef<string>('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const {
    targetRef: searchRef,
    componentVisible: suggestionVisible,
    setComponentVisible: setSuggestionVisible,
  } = useOuterClick<HTMLInputElement>(false);

  const handleInputFocus = () => {
    suggestions.length > 0 && setSuggestionVisible(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSuggestionVisible(true);
    setSelectedSuggestionIndex(-1);
    setInputValue(e.target.value);

    getSearch && getSearch(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex !== -1) {
        setSearch(suggestions[selectedSuggestionIndex]);
        setInputValue(suggestions[selectedSuggestionIndex]);
        setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
      } else {
        // Info: 按下 Enter 鍵時，修改 search state 並觸發搜尋 (20240313 - Shirley)
        setSearch(e.currentTarget.value);
        setInputValue(e.currentTarget.value);
        setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
      }
      setSuggestionVisible(false);
      e.currentTarget.blur(); // Info: remove focus after enter (20240313 - Shirley)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : -1
      );
    }
  };

  const handleSearchClick = () => {
    setSearch(inputValueRef.current);
    setSuggestionVisible(false);
    setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
  };

  const clickSuggestionHandler = (suggestion: string, index: number) => {
    setSearch(suggestion);
    setInputValue(suggestion);
    setSuggestionVisible(false);
    setSelectedSuggestionIndex(index);
    setActivePage(DEFAULT_PAGE); // Info: (20240402 - Liz) 搜尋時，重設頁數
  };

  const suggestionList =
    suggestionVisible && suggestions.length > 0 ? (
      suggestions.map((suggestion, i) => (
        <li
          key={i}
          className={`px-4 py-3 text-sm ${i === selectedSuggestionIndex ? 'bg-purpleLinear' : ''}`}
          onMouseEnter={() => setSelectedSuggestionIndex(i)}
          onMouseDown={() => clickSuggestionHandler(suggestion, i)}
        >
          {suggestion}
        </li>
      ))
    ) : (
      <></>
    );

  return (
    <div className="relative w-full drop-shadow-xl">
      <input
        ref={searchRef}
        type="search"
        className="w-full items-center rounded-full bg-purpleLinear px-6 py-3 text-base text-white placeholder:text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:lg:text-base"
        placeholder={searchBarPlaceholder}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        value={inputValue}
      />
      <div className="absolute right-5 top-3 text-2xl">
        <button onClick={handleSearchClick}>
          <RiSearchLine />
        </button>
      </div>
      <ul
        className={`absolute left-2 top-14 w-95% flex-col rounded-sm bg-purpleLinear lg:left-6 ${
          suggestionVisible ? 'flex' : 'hidden'
        } hideScrollbar z-10 max-h-200px overflow-y-auto opacity-90 lg:max-h-300px`}
      >
        {suggestionList}
      </ul>
    </div>
  );
};

export default SearchBar;
