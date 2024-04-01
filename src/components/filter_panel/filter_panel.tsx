import {ChangeEvent, Dispatch, SetStateAction, useState, useEffect} from 'react';
import Image from 'next/image';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import {ImCross} from 'react-icons/im';
import {FaAngleRight, FaArrowLeft} from 'react-icons/fa';
import DatePicker from '../date_picker/date_picker';
import {IDatePeriod} from '../../interfaces/date_period';
import {DEFAULT_CHAIN_ICON} from '../../constants/config';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {HttpMethod} from '../../constants/api_request';
import {IChainDetail} from '../../interfaces/chain';
import {getChainIcon, getCurrencyIcon} from '../../lib/common';
import {ICurrencyListPage} from '../../interfaces/currency';

interface IFilterPanelProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  filterDatePeriod: IDatePeriod;
  setFilterDatePeriod: Dispatch<SetStateAction<IDatePeriod>>;
  filterBlockchains: string[];
  filterBlockchainsHandler: (blockchains: string[]) => void;
  filterCurrency: string[];
  filterCurrencyHandler: (currencies: string[]) => void;
}

const FilterPanel = ({
  modalVisible,
  modalClickHandler,
  filterDatePeriod,
  setFilterDatePeriod,
  filterBlockchains,
  filterBlockchainsHandler,
  filterCurrency,
  filterCurrencyHandler,
}: IFilterPanelProps) => {
  // Info: (20240401 - Julian) call API to get blockchain data
  const {data: blockchainData, isLoading: isBlockchainData} = useAPIResponse<IChainDetail[]>(
    `/api/v1/app/chains`,
    {method: HttpMethod.GET}
  );

  // Info: (20240401 - Julian) call API to get currency data
  const {data: currencyData, isLoading: isCurrencyData} = useAPIResponse<ICurrencyListPage>(
    `/api/v1/app/currencies`,
    {method: HttpMethod.GET}
  );

  const blockchainList = blockchainData?.map(blockchain => blockchain.chainName) || [];
  const currencyList = currencyData?.currencies.map(currency => currency.currencyName) || [];

  // Info: (20240401 - Julian) 是否顯示 Filter Chain
  const [visibleFilterChain, setVisibleFilterChain] = useState(false);
  // Info: (20240401 - Julian) 選擇的 Blockchains
  const [selectChains, setSelectChains] = useState<string[]>([]);
  // Info: (20240401 - Julian) 輸入框的值
  //const [chainInputValue, setChainInputValue] = useState<string>('');

  // Info: (20240401 - Julian) 顯示 Filter Currency
  const [visibleFilterCurrency, setVisibleFilterCurrency] = useState(false);
  // Info: (20240401 - Julian) 選擇的 Currencies
  const [selectCurrencies, setSelectCurrencies] = useState<string[]>([]);
  // Info: (20240401 - Julian) 輸入框的值
  //const [currencyInputValue, setCurrencyInputValue] = useState<string>('');

  // Info: (20240401 - Julian) Filter Chain 開關
  const visibleFilterChainHandler = () => setVisibleFilterChain(prev => !prev);
  // Info: (20240401 - Julian) Filter Currency 開關
  const visibleFilterCurrencyHandler = () => setVisibleFilterCurrency(prev => !prev);

  // Info: (20240401 - Julian) 全選 Blockchains
  const selectAllChainsHandler = () => setSelectChains(blockchainList);
  // Info: (20240401 - Julian) 全選 Currencies
  const selectAllCurrencyHandler = () => setSelectCurrencies(currencyList);

  useEffect(() => {
    // Info: (20240401 - Julian) 如果 selectChains 改變，則更新 filterBlockchains
    filterBlockchainsHandler(selectChains);
  }, [selectChains, filterBlockchainsHandler]);

  useEffect(() => {
    // Info: (20240401 - Julian) 如果 selectCurrencies 改變，則更新 filterCurrency
    filterCurrencyHandler(selectCurrencies);
  }, [selectCurrencies, filterCurrencyHandler]);

  const displayFilterBlockchains = filterBlockchains
    ? filterBlockchains.map(blockchain => blockchain).join(', ')
    : null;

  const displayBlockchainList = !isBlockchainData ? (
    blockchainData?.map((blockchain, index) => {
      const addChainHandler = () => {
        // Info: (20240401 - Julian) 如果已經在選擇的 Blockchains 中，則不再新增
        if (selectChains.includes(blockchain.chainName)) return;
        setSelectChains([...selectChains, blockchain.chainName]);
      };

      const chainIcon = getChainIcon(blockchain.chainId);

      return (
        <button
          key={index}
          onClick={addChainHandler}
          className="flex items-center gap-2 rounded-full border border-hoverWhite bg-purpleLinear px-4 py-2 text-sm"
        >
          <Image
            src={chainIcon.src}
            width={20}
            height={20}
            alt={chainIcon.alt}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
          <p>{blockchain.chainName}</p>
        </button>
      );
    })
  ) : (
    <div>Loading...</div>
  );

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

  const displayFilterCurrencies = filterCurrency
    ? filterCurrency.map(blockchain => blockchain).join(', ')
    : null;

  const displayCurrencyList = !isCurrencyData ? (
    currencyData?.currencies?.map((currency, index) => {
      const addChainHandler = () => {
        // Info: (20240401 - Julian) 如果已經在選擇的 Currencies 中，則不再新增
        if (selectCurrencies.includes(currency.currencyName)) return;
        setSelectCurrencies([...selectCurrencies, currency.currencyName]);
      };

      const currencyIcon = getCurrencyIcon(currency.currencyId);

      return (
        <button
          key={index}
          onClick={addChainHandler}
          className="flex items-center gap-2 rounded-full border border-hoverWhite bg-purpleLinear px-4 py-2 text-sm"
        >
          <Image
            src={currencyIcon.src}
            width={20}
            height={20}
            alt={currencyIcon.alt}
            onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
          />
          <p>{currency.currencyName}</p>
        </button>
      );
    })
  ) : (
    <div>Loading...</div>
  );

  const displaySelectCurrencies =
    selectCurrencies.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        {selectCurrencies.map((chain, index) => {
          // Info: (20240401 - Julian) 將選擇從 selectCurrencies 中刪除
          const deleteCurrencyHandler = () =>
            setSelectCurrencies(selectCurrencies.filter(item => item !== chain));
          return (
            <button
              key={index}
              className="flex items-center gap-1 rounded-full border border-hoverWhite bg-purpleLinear px-2 py-1 text-sm"
              onClick={deleteCurrencyHandler}
            >
              <p>{chain}</p>
              <ImCross size={8} />
            </button>
          );
        })}
      </div>
    ) : null;

  // Info: (20240401 - Julian) ----------- Blockchain Filter Panel -----------
  const isShowFilterChainPanel = visibleFilterChain ? (
    <div className="absolute z-80 flex min-h-350px w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple2 p-10 lg:w-400px">
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
      <div className="flex w-full flex-col gap-2">
        {/* Info: (20240401 - Julian) Input */}
        <div className="flex min-h-55px w-full flex-wrap items-center gap-2 bg-purpleLinear px-4 py-2">
          {/* Info: (20240401 - Julian) Filter Blockchains */}
          {displaySelectChains}
          <input
            type="text"
            className="w-full bg-transparent text-hoverWhite placeholder:text-lilac"
            placeholder="Search for chains"
          />
        </div>

        {/* Info: (20240401 - Julian) Select All */}
        <button
          onClick={selectAllChainsHandler}
          className="ml-auto text-primaryBlue underline underline-offset-2"
        >
          Select All
        </button>
        {/* Info: (20240401 - Julian) Blockchain List */}
        <div className="flex flex-wrap gap-2 overflow-y-auto overflow-x-hidden bg-darkPurple p-2">
          {displayBlockchainList}
        </div>
      </div>
    </div>
  ) : null;

  // Info: (20240401 - Julian) ----------- Currency Filter Panel -----------
  const isShowFilterCurrencyPanel = visibleFilterCurrency ? (
    <div className="absolute z-80 flex min-h-350px w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple2 p-10 lg:w-400px">
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
      <div className="flex w-full flex-col gap-2">
        {/* Info: (20240401 - Julian) Input */}
        <div className="flex min-h-55px w-full flex-wrap items-center gap-2 bg-purpleLinear px-4 py-2">
          {/* Info: (20240401 - Julian) Filter Currencies */}
          {displaySelectCurrencies}
          <input
            type="text"
            className="w-full bg-transparent text-hoverWhite placeholder:text-lilac"
            placeholder="Search for currencies"
          />
        </div>

        {/* Info: (20240401 - Julian) Select All */}
        <button
          onClick={selectAllCurrencyHandler}
          className="ml-auto text-primaryBlue underline underline-offset-2"
        >
          Select All
        </button>
        {/* Info: (20240401 - Julian) Currency List */}
        <div className="flex flex-wrap gap-2 overflow-y-auto overflow-x-hidden bg-darkPurple p-2">
          {displayCurrencyList}
        </div>
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
          <DatePicker period={filterDatePeriod} setFilteredPeriod={setFilterDatePeriod} />
          {/* Info: (20240401 - Julian) Filter Blockchains */}
          <button
            onClick={visibleFilterChainHandler}
            className="flex w-full items-center justify-between py-2"
          >
            <p>Blockchain</p>
            <div className="w-200px overflow-hidden text-ellipsis whitespace-nowrap text-lilac">
              {displayFilterBlockchains}
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
              {displayFilterCurrencies}
            </div>

            <FaAngleRight />
          </button>
        </div>
      </div>
      {isShowFilterChainPanel}
      {isShowFilterCurrencyPanel}
    </div>
  ) : null;

  return <>{isShowPanel}</>;
};

export default FilterPanel;
