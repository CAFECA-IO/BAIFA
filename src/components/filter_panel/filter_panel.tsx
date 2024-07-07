import {ChangeEvent, Dispatch, SetStateAction, useState, useEffect} from 'react';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import {ImCross} from 'react-icons/im';
import {FaAngleRight, FaArrowLeft} from 'react-icons/fa';
import {HttpMethod} from '@/constants/api_request';
import {IChainDetail} from '@/interfaces/chain';
import {IDatePeriod} from '@/interfaces/date_period';
import {ICurrencyListPage} from '@/interfaces/currency';
import useAPIResponse from '@/lib/hooks/use_api_response';
import BoltButton from '@/components/bolt_button/bolt_button';
import DatePicker from '@/components/date_picker/date_picker';

interface IFilterPanelProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  filterDatePeriod: IDatePeriod;
  setFilterDatePeriod: Dispatch<SetStateAction<IDatePeriod>>;
  filterBlockchains: string[];
  filterBlockchainsHandler: (blockchains: string[]) => void;
  filterCurrencies: string[];
  filterCurrenciesHandler: (currencies: string[]) => void;
}

const FilterPanel = ({
  modalVisible,
  modalClickHandler,
  filterDatePeriod,
  setFilterDatePeriod,
  filterBlockchains,
  filterBlockchainsHandler,
  filterCurrencies,
  filterCurrenciesHandler,
}: IFilterPanelProps) => {
  // Info: (20240401 - Julian) 是否顯示篩選區塊鏈
  const [visibleFilterChain, setVisibleFilterChain] = useState(false);
  // Info: (20240401 - Julian) 搜尋區塊鏈輸入框的值
  const [chainInputValue, setChainInputValue] = useState<string>('');
  // Info: (20240402 - Julian) 選到的區塊鏈列表
  const [selectChains, setSelectChains] = useState<string[]>([]);
  // Info: (20240402 - Julian) 是否顯示區塊鏈的搜尋建議
  const [visibleChainSuggestion, setVisibleChainSuggestion] = useState(false);

  // Info: (20240401 - Julian) 是否顯示篩選幣種
  const [visibleFilterCurrency, setVisibleFilterCurrency] = useState(false);
  // Info: (20240401 - Julian) 搜尋幣種輸入框的值
  const [currencyInputValue, setCurrencyInputValue] = useState<string>('');
  // Info: (20240402 - Julian) 選到的幣種列表
  const [selectCurrencies, setSelectCurrencies] = useState<string[]>([]);
  // Info: (20240402 - Julian) 是否顯示幣種的搜尋建議
  const [visibleCurrencySuggestion, setVisibleCurrencySuggestion] = useState(false);

  // Info: (20240402 - Julian) 送出 Filter 前的狀態
  const [preDatePeriod, setPreDatePeriod] = useState<IDatePeriod>(filterDatePeriod);
  const [preBlockchains, setPreBlockchains] = useState<string[]>(filterBlockchains);
  const [preCurrencies, setPreCurrencies] = useState<string[]>(filterCurrencies);

  // Info: (20240401 - Julian) 從 API 取得的區塊鏈資料
  const {data: blockchainData} = useAPIResponse<IChainDetail[]>(`/api/v1/app/chains`, {
    method: HttpMethod.GET,
  });
  // Info: (20240402 - Julian) 從 API 取得的區塊鏈的搜尋建議
  const {data: chainSuggestion} = useAPIResponse<string[]>(
    `/api/v1/app/tracking_tool/filter/chain_suggestion`,
    {method: HttpMethod.GET},
    {search_input: chainInputValue}
  );

  // Info: (20240401 - Julian) 從 API 取得的幣種資料
  const {data: currencyData} = useAPIResponse<ICurrencyListPage>(`/api/v1/app/currencies`, {
    method: HttpMethod.GET,
  });
  // Info: (20240402 - Julian) 從 API 取得的幣種的搜尋建議
  const {data: currencySuggestion} = useAPIResponse<string[]>(
    `/api/v1/app/tracking_tool/filter/currency_suggestion`,
    {method: HttpMethod.GET},
    {search_input: currencyInputValue}
  );

  const blockchainList = blockchainData?.map(blockchain => blockchain.chainName) || [];
  const currencyList = currencyData?.currencies.map(currency => currency.currencyName) || [];

  // Info: (20240401 - Julian) 篩選鏈版面的開關
  const visibleFilterChainHandler = () => setVisibleFilterChain(prev => !prev);
  // Info: (20240401 - Julian) 全選區塊鏈
  const selectAllChainsHandler = () => setSelectChains(blockchainList);
  // Info: (20240402 - Julian) focus 搜尋欄位時，顯示搜尋建議
  const handleChainInputFocus = () => setVisibleChainSuggestion(true);
  // Info: (20240402 - Julian) 改變搜尋欄位的值
  const handleChainInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChainInputValue(e.target.value);
    setVisibleChainSuggestion(true);
  };
  // Info: (20240401 - Julian) 儲存 filterBlockchains，並關閉篩選區塊鏈
  const saveChainsHandler = () => {
    setPreBlockchains(selectChains);
    setVisibleFilterChain(false);
  };

  // Info: (20240401 - Julian) 篩選幣版面的開關
  const visibleFilterCurrencyHandler = () => setVisibleFilterCurrency(prev => !prev);
  // Info: (20240401 - Julian) 全選幣種
  const selectAllCurrencyHandler = () => setSelectCurrencies(currencyList);
  // Info: (20240402 - Julian) focus 搜尋欄位時，顯示搜尋建議
  const handleCurrencyInputFocus = () => setVisibleCurrencySuggestion(true);
  // Info: (20240402 - Julian) 改變搜尋欄位的值
  const handleCurrencyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrencyInputValue(e.target.value);
    setVisibleCurrencySuggestion(true);
  };
  // Info: (20240401 - Julian) 儲存 filterBlockchains，並關閉篩選區塊鏈
  const saveCurrenciesHandler = () => {
    setPreCurrencies(selectCurrencies);
    setVisibleFilterCurrency(false);
  };

  // Info: (20240402 - Julian) 重置 Filter
  const resetFilterHandler = () => {
    setPreDatePeriod({startTimeStamp: 0, endTimeStamp: 0});
    setSelectChains([]);
    setSelectCurrencies([]);
    setPreBlockchains([]);
    setPreCurrencies([]);
  };

  // Info: (20240402 - Julian) 送出 Filter 設定到 TrackingCtx 中，並關閉 Panel
  const saveFilterHandler = () => {
    filterBlockchainsHandler(preBlockchains);
    filterCurrenciesHandler(preCurrencies);
    setFilterDatePeriod(preDatePeriod);
    modalClickHandler();
  };

  useEffect(() => {
    // Info: (20240402 - Julian) 讓 Filter Chains 重開後，重置設定
    if (!visibleFilterChain) setChainInputValue('');
    setSelectChains(preBlockchains);
  }, [preBlockchains, visibleFilterChain]);

  useEffect(() => {
    // Info: (20240402 - Julian) 讓 Filter Currencies 重開後，重置設定
    if (!visibleFilterCurrency) setCurrencyInputValue('');
    setSelectCurrencies(preCurrencies);
  }, [preCurrencies, visibleFilterCurrency]);

  // Info: (20240401 - Julian) 顯示已選擇的區塊鏈
  const displayBlockchains = preBlockchains
    ? preBlockchains.map(blockchain => blockchain).join(', ')
    : null;

  const displayCurrencies = preCurrencies
    ? preCurrencies.map(blockchain => blockchain).join(', ')
    : null;

  // Info: (20240402 - Julian) ----------- Blockchain Filter Panel -----------
  // Info: (20240402 - Julian) 列出已選擇的區塊鏈
  const displaySelectChains =
    selectChains.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        {selectChains.map((chain, index) => {
          // Info: (20240401 - Julian) 將選擇從 selectChains 中刪除
          const deleteChainHandler = () =>
            setSelectChains(selectChains.filter(item => item !== chain));
          return (
            <button
              key={index}
              className="flex items-center gap-1 rounded-full border border-hoverWhite bg-purpleLinear px-2 py-1 text-sm"
              onClick={deleteChainHandler}
            >
              <p>{chain}</p>
              <ImCross size={8} />
            </button>
          );
        })}
      </div>
    ) : null;

  // Info: (20240402 - Julian) 區塊鏈搜尋建議列表
  const displayChainSuggestion = visibleChainSuggestion
    ? chainSuggestion?.map((suggestion, index) => {
        const addChainHandler = () => {
          // Info: (20240402 - Julian) 清空搜尋欄位的值，並收起搜尋建議
          setChainInputValue('');
          setVisibleChainSuggestion(false);

          // Info: (20240402 - Julian) 如果已經在選擇的 Chains 中，則不再新增
          if (selectChains.includes(suggestion)) return;
          setSelectChains([...selectChains, suggestion]);
        };
        return (
          <div
            key={index}
            onClick={addChainHandler}
            className="w-full cursor-pointer px-4 py-2 text-hoverWhite hover:bg-purpleLinear"
          >
            {suggestion}
          </div>
        );
      })
    : null;

  // Info: (20240401 - Julian) Blockchain Filter Main Panel
  const isShowFilterChainPanel = visibleFilterChain ? (
    <div className="absolute z-80 flex w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple2 p-10 lg:w-400px">
      {/* Info: (20240401 - Julian) Back button */}
      <button
        onClick={visibleFilterChainHandler}
        className="absolute left-6 top-6 hover:opacity-75"
      >
        <FaArrowLeft size={24} />
      </button>
      {/* Info: (20240401 - Julian) Title */}
      <h2 className="text-xl font-semibold">Blockchain Filter</h2>
      {/* Info: (20240401 - Julian) Content */}
      <div className="flex w-full flex-col gap-4">
        {/* Info: (20240401 - Julian) Input */}
        <div className="relative flex w-full items-center">
          <input
            type="text"
            className="h-40px w-full bg-purpleLinear px-4 py-2 text-hoverWhite placeholder:text-lilac focus:outline-none"
            placeholder="Search for chains"
            value={chainInputValue}
            onChange={handleChainInputChange}
            onFocus={handleChainInputFocus}
          />
          {/* Info: (20240401 - Julian) Search suggestion */}
          <div className="absolute top-40px flex w-full flex-col items-start bg-darkPurple4 shadow-lg">
            {displayChainSuggestion}
          </div>
        </div>
        {/* Info: (20240401 - Julian) Blockchain List */}
        <div className="flex h-150px flex-wrap items-start gap-2 overflow-y-auto overflow-x-hidden bg-darkPurple p-2">
          {displaySelectChains}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        {/* Info: (20240401 - Julian) Select All */}
        <BoltButton
          onClick={selectAllChainsHandler}
          style="hollow"
          color="blue"
          className="px-4 py-2"
        >
          Select All
        </BoltButton>
        {/* Info: (20240401 - Julian) Save Button */}
        <BoltButton
          onClick={saveChainsHandler}
          style="solid"
          color="blue"
          className="grow px-4 py-2"
        >
          Save
        </BoltButton>
      </div>
    </div>
  ) : null;

  // Info: (20240401 - Julian) ----------- Currency Filter Panel -----------
  // Info: (20240401 - Julian) 列出已選擇的幣種
  const displaySelectCurrencies =
    selectCurrencies.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        {selectCurrencies.map((curr, index) => {
          // Info: (20240401 - Julian) 將選擇從 selectCurrencies 中刪除
          const deleteCurrencyHandler = () =>
            setSelectCurrencies(selectCurrencies.filter(item => item !== curr));
          return (
            <button
              key={index}
              className="flex items-center gap-1 rounded-full border border-hoverWhite bg-purpleLinear px-2 py-1 text-sm"
              onClick={deleteCurrencyHandler}
            >
              <p>{curr}</p>
              <ImCross size={8} />
            </button>
          );
        })}
      </div>
    ) : null;

  const displayCurrencySuggestion = visibleCurrencySuggestion
    ? currencySuggestion?.map((suggestion, index) => {
        const addCurrencyHandler = () => {
          // Info: (20240402 - Julian) 清空搜尋欄位的值，並收起搜尋建議
          setChainInputValue('');
          setVisibleCurrencySuggestion(false);

          // Info: (20240402 - Julian) 如果已經在選擇的 Currencies 中，則不再新增
          if (selectCurrencies.includes(suggestion)) return;
          setSelectCurrencies([...selectCurrencies, suggestion]);
        };
        return (
          <div
            key={index}
            onClick={addCurrencyHandler}
            className="w-full cursor-pointer px-4 py-2 text-hoverWhite hover:bg-purpleLinear"
          >
            {suggestion}
          </div>
        );
      })
    : null;

  // Info: (20240401 - Julian) Currency Filter Main Panel
  const isShowFilterCurrencyPanel = visibleFilterCurrency ? (
    <div className="absolute z-80 flex w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple2 p-10 lg:w-400px">
      {/* Info: (20240401 - Julian) Back button */}
      <button
        onClick={visibleFilterCurrencyHandler}
        className="absolute left-6 top-6 hover:opacity-75"
      >
        <FaArrowLeft size={24} />
      </button>
      {/* Info: (20240401 - Julian) Title */}
      <h2 className="text-xl font-semibold">Currency Filter</h2>
      {/* Info: (20240401 - Julian) Content */}
      <div className="flex w-full flex-col gap-4">
        {/* Info: (20240401 - Julian) Input */}
        <div className="relative flex w-full items-center">
          <input
            type="text"
            className="h-40px w-full bg-purpleLinear px-4 py-2 text-hoverWhite placeholder:text-lilac focus:outline-none"
            placeholder="Search for currencies"
            value={currencyInputValue}
            onChange={handleCurrencyInputChange}
            onFocus={handleCurrencyInputFocus}
          />
          {/* Info: (20240401 - Julian) Search suggestion */}
          <div className="absolute top-40px flex w-full flex-col items-start bg-darkPurple4 shadow-lg">
            {displayCurrencySuggestion}
          </div>
        </div>
        {/* Info: (20240401 - Julian) Blockchain List */}
        <div className="flex h-150px flex-wrap items-start gap-2 overflow-y-auto overflow-x-hidden bg-darkPurple p-2">
          {displaySelectCurrencies}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        {/* Info: (20240401 - Julian) Select All */}
        <BoltButton
          onClick={selectAllCurrencyHandler}
          style="hollow"
          color="blue"
          className="px-4 py-2"
        >
          Select All
        </BoltButton>
        {/* Info: (20240401 - Julian) Save Button */}
        <BoltButton
          onClick={saveCurrenciesHandler}
          style="solid"
          color="blue"
          className="grow px-4 py-2"
        >
          Save
        </BoltButton>
      </div>
    </div>
  ) : null;

  // Info: (20240401 - Julian) ----------- Original Panel -----------
  const isShowPanel = modalVisible ? (
    <div className="fixed z-60 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/25 backdrop-blur-sm">
      <div
        id="filter-panel"
        className="relative z-70 flex h-fit w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple2 p-10 lg:w-400px"
      >
        {/* Info: (20240401 - Julian) Close button */}
        <button onClick={modalClickHandler} className="absolute right-6 top-6 hover:opacity-75">
          <IoIosCloseCircleOutline size={30} />
        </button>
        {/* Info: (20240401 - Julian) Title */}
        <h2 className="text-xl font-semibold">Filter</h2>
        <div className="flex w-full flex-col items-center gap-8">
          {/* Info: (20240401 - Julian) Date picker */}
          <DatePicker period={preDatePeriod} setFilteredPeriod={setPreDatePeriod} />
          {/* Info: (20240401 - Julian) Filter Blockchains */}
          <button
            onClick={visibleFilterChainHandler}
            className="flex w-full items-center justify-between py-2"
          >
            <p>Blockchain</p>
            <div className="w-200px overflow-hidden text-ellipsis whitespace-nowrap text-lilac">
              {displayBlockchains}
            </div>
            <FaAngleRight />
          </button>
          {/* Info: (20240401 - Julian) Filter Currencies */}
          <button
            onClick={visibleFilterCurrencyHandler}
            className="flex w-full items-center justify-between py-2"
          >
            <p>Currency</p>
            <div className="w-200px overflow-hidden text-ellipsis whitespace-nowrap text-lilac">
              {displayCurrencies}
            </div>

            <FaAngleRight />
          </button>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          {/* Info: (20240402 - Julian) Reset Button */}
          <BoltButton
            onClick={resetFilterHandler}
            style="hollow"
            color="blue"
            className="px-4 py-2"
          >
            Reset
          </BoltButton>
          {/* Info: (20240402 - Julian) OK Button */}
          <BoltButton
            onClick={saveFilterHandler}
            style="solid"
            color="blue"
            className="grow px-4 py-2"
          >
            Save
          </BoltButton>
        </div>
      </div>
      {isShowFilterChainPanel}
      {isShowFilterCurrencyPanel}
    </div>
  ) : null;

  return <>{isShowPanel}</>;
};

export default FilterPanel;
