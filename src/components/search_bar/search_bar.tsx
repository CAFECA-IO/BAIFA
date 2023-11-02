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
    <div className="relative w-full drop-shadow-xl">
      <input
        type="search"
        className="w-full items-center rounded-full bg-purpleLinear px-6 py-3 text-base"
        placeholder={searchBarPlaceholder}
        onChange={searchChangeHandler}
      />
      <div className="absolute right-4 top-3 text-2xl font-bold hover:cursor-pointer">
        <RiSearchLine />
      </div>
    </div>
  );
};

export default SearchBar;