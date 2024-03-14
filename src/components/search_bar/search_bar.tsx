import {Dispatch, SetStateAction, KeyboardEvent, useState, ChangeEvent} from 'react';
import {RiSearchLine} from 'react-icons/ri';
import useStateRef from 'react-usestateref';
import useOuterClick from '../../lib/hooks/use_outer_click';

interface ISearchBarProps {
  searchBarPlaceholder: string;
  setSearch: Dispatch<SetStateAction<string>>;
  suggestions?: string[];
  getSearch?: (input: string) => void;
}

interface ISearchBarWithSuggestionsProps extends ISearchBarProps {
  suggestions: string[];
  getSearch: (input: string) => void;
}

const SearchBar = ({searchBarPlaceholder, setSearch}: ISearchBarProps) => {
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
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

export const SearchBarWithKeyDown = ({
  searchBarPlaceholder,
  setSearch,
  suggestions = [],
  getSearch,
}: ISearchBarProps) => {
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
      } else {
        // Info: 按下 Enter 鍵時，修改 search state 並觸發搜尋 (20240313 - Shirley)
        setSearch(e.currentTarget.value);
        setInputValue(e.currentTarget.value);
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
  };

  const clickSuggestionHandler = (suggestion: string, index: number) => {
    // eslint-disable-next-line no-console
    // console.log('clickSuggestionHandler, suggestion:', suggestion, index);
    setSearch(suggestion);
    setInputValue(suggestion);
    setSuggestionVisible(false);
    // setSelectedSuggestionIndex(index);

    // getSearch && getSearch(suggestion);
  };

  const suggestionList =
    suggestionVisible && suggestions.length > 0 ? (
      suggestions.map((suggestion, i) => (
        <li
          key={i}
          className={`px-4 py-3 text-sm ${i === selectedSuggestionIndex ? 'bg-purpleLinear' : ''}`}
          // onClick={() => clickSuggestionHandler(suggestion, i)}
          onMouseEnter={() => setSelectedSuggestionIndex(i)}
          onMouseDown={() => clickSuggestionHandler(suggestion, i)}
        >
          {suggestion}
        </li>
      ))
    ) : (
      <></>
    );

  // eslint-disable-next-line no-console
  // console.log(
  //   'SearchBarWithKeyDown, suggestions in SearchBarWithKeyDown:',
  //   suggestions,
  //   'suggestionVisible',
  //   suggestionVisible
  // );

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
          suggestionVisible ? 'flex' : 'flex'
        } hideScrollbar z-10 max-h-200px overflow-y-auto opacity-90 lg:max-h-300px`}
      >
        {suggestionList}
      </ul>
    </div>
  );
};

export const SearchBarWithSuggestions = ({
  searchBarPlaceholder,
  setSearch,
  suggestions = [],
  getSearch,
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
      } else {
        // Info: 按下 Enter 鍵時，修改 search state 並觸發搜尋 (20240313 - Shirley)
        setSearch(e.currentTarget.value);
        setInputValue(e.currentTarget.value);
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
  };

  const clickSuggestionHandler = (suggestion: string, index: number) => {
    setSearch(suggestion);
    setInputValue(suggestion);
    setSuggestionVisible(false);
    setSelectedSuggestionIndex(index);
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
          suggestionVisible ? 'flex' : 'flex'
        } hideScrollbar z-10 max-h-200px overflow-y-auto opacity-90 lg:max-h-300px`}
      >
        {suggestionList}
      </ul>
    </div>
  );
};

export default SearchBar;
