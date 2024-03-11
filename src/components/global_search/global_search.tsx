import Image from 'next/image';
import {useEffect, ChangeEvent, KeyboardEvent} from 'react';
import {useRouter} from 'next/router';
import {BFAURL} from '../../constants/url';
import {FiSearch} from 'react-icons/fi';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ISuggestions} from '../../interfaces/suggestions';
import useOuterClick from '../../lib/hooks/use_outer_click';
import useStateRef from 'react-usestateref';
import {APIURL, HttpMethod} from '../../constants/api_request';
import useAPIResponse from '../../lib/hooks/use_api_response';

interface IGlobalSearchProps {
  coverShowed?: boolean;
  getInputValue?: (value: string) => void;
  inputValueFromParent?: string;
}

const GlobalSearch = ({
  coverShowed = true,
  getInputValue,
  inputValueFromParent,
}: IGlobalSearchProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();

  // Info: (20231212 - Julian) 搜尋欄位的值
  const [inputValue, setInputValue, inputValueRef] = useStateRef<string>(
    inputValueFromParent ? inputValueFromParent : ''
  );

  // Info: (20231212 - Julian) 點擊搜尋欄位外的地方，隱藏搜尋建議
  const {
    targetRef: searchRef,
    componentVisible: suggestionVisible,
    setComponentVisible: setSuggestionVisible,
  } = useOuterClick<HTMLInputElement>(false);

  const {data, isLoading, error} = useAPIResponse<ISuggestions>(
    `${APIURL.SEARCH_SUGGESTIONS}`,
    HttpMethod.GET,
    null,
    {
      search_input: inputValueRef.current,
    },
    true
  );

  // Info: (20231212 - Julian) focus 搜尋欄位時，顯示搜尋建議
  const handleInputFocus = () => setSuggestionVisible(true);
  // Info: (20231212 - Julian) 改變搜尋欄位的值
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSuggestionVisible(true);
  };
  // Info: (20231212 - Julian) 搜尋欄位的按鈕事件
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Info: (20231115 - Julian) 按下 Enter 後，導向搜尋結果頁面
      e.preventDefault();
      getInputValue && getInputValue(inputValueRef.current);
      setSuggestionVisible(false);
      router.push(`${BFAURL.SEARCHING_RESULT}?search=${inputValueRef.current}`);
    }
  };

  useEffect(() => {
    if (!!inputValueFromParent) {
      setInputValue(inputValueFromParent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValueFromParent]);

  // Info: (20231212 - Julian) 點擊搜尋建議後，導向搜尋結果頁面
  const clickSuggestionHandler = (suggestion: string) => {
    getInputValue && getInputValue(suggestion);
    setInputValue(suggestion);
    setSuggestionVisible(false);
    router.push(`${BFAURL.SEARCHING_RESULT}?search=${suggestion}`);
  };

  const suggestionList =
    !data || (!!data && data?.suggestions?.length === 0)
      ? null
      : !!data &&
        data?.suggestions?.map((suggestion, i) => (
          <li
            key={i}
            className="px-4 py-3 text-sm text-white hover:cursor-pointer hover:bg-purpleLinear"
            onClick={() => clickSuggestionHandler(suggestion)}
          >
            {suggestion}
          </li>
        ));

  const coverImage = coverShowed ? (
    <>
      {/* Info: (20230712 - Julian) Desktop Image */}
      <div className="hidden p-10 mix-blend-screen lg:block">
        <Image src="/elements/main_pic_1.svg" width={250} height={250} alt="global" />
      </div>

      {/* Info: (20230712 - Julian) Mobile Image */}
      <div className="block p-10 mix-blend-screen lg:hidden">
        <Image src="/elements/main_pic_1.svg" width={150} height={150} alt="global" />
      </div>
    </>
  ) : null;

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {coverImage}

      <div className="relative z-50 flex flex-col items-center drop-shadow-xl">
        <input
          ref={searchRef}
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          className="block w-80vw rounded-full bg-purpleLinear p-3 pl-4 text-xs text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500 lg:w-800px lg:text-sm"
          placeholder={t('HOME_PAGE.SEARCH_PLACEHOLDER')}
        />
        <FiSearch className="absolute right-4 top-2 text-2xl text-hoverWhite" />
        <ul
          className={`absolute top-12 w-95% flex-col rounded-sm bg-purpleLinear ${
            suggestionVisible ? 'flex' : 'hidden'
          } hideScrollbar z-10 max-h-300px overflow-y-auto opacity-90 lg:max-h-500px`}
        >
          {suggestionList}
        </ul>
      </div>
    </div>
  );
};

export default GlobalSearch;
