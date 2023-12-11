import {Dispatch, SetStateAction} from 'react';
import {RiSearchLine} from 'react-icons/ri';

interface ISearchBarProps {
  searchBarPlaceholder: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({searchBarPlaceholder, setSearch}: ISearchBarProps) => {
  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
  };

  return (
    <div className="relative w-full max-w-800px drop-shadow-xl">
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

export default SearchBar;
