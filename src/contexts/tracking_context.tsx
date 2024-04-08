import {useState, useCallback, createContext} from 'react';
import useStateRef from 'react-usestateref';
import AddAddressPanel from '../components/add_address_panel/add_address_panel';
import FilterPanel from '../components/filter_panel/filter_panel';
import {IDatePeriod} from '../interfaces/date_period';
import {default30DayPeriod} from '../constants/config';

export interface ITrackingProvider {
  children: React.ReactNode;
}

export interface ITrackingContext {
  targetTrackingType: TrackingType;
  targetTrackingTypeHandler: () => void;

  visibleFilterPanel: boolean;
  visibleFilterPanelHandler: () => void;

  filterDatePeriod: IDatePeriod;
  setFilterDatePeriod: (period: IDatePeriod) => void;

  filterBlockchains: string[];
  filterBlockchainsHandler: (blockchains: string[]) => void;

  filterCurrencies: string[];
  filterCurrenciesHandler: (currencies: string[]) => void;

  visibleAddAddressPanel: boolean;
  visibleAddAddressPanelHandler: () => void;

  targetAddress: string;
  addAddressHandler: (address: string) => void;

  zoomScale: number;
  zoomScaleHandler: (scale: number) => void;

  resetTrackingTool: () => void;

  selectedItems: string[];
  selectedItemsHandler: (item: string) => void;
}

export enum TrackingType {
  ADDRESS = 'address',
  TRANSACTION = 'transaction',
}

export const TrackingContext = createContext<ITrackingContext>({
  targetTrackingType: TrackingType.ADDRESS,
  targetTrackingTypeHandler: () => null,

  visibleFilterPanel: false,
  visibleFilterPanelHandler: () => null,

  filterDatePeriod: default30DayPeriod,
  setFilterDatePeriod: () => null,

  filterBlockchains: [],
  filterBlockchainsHandler: () => null,

  filterCurrencies: [],
  filterCurrenciesHandler: () => null,

  visibleAddAddressPanel: false,
  visibleAddAddressPanelHandler: () => null,

  targetAddress: '',
  addAddressHandler: () => null,

  zoomScale: 1,
  zoomScaleHandler: () => null,

  resetTrackingTool: () => null,

  selectedItems: [],
  selectedItemsHandler: () => null,
});

export const TrackingProvider = ({children}: ITrackingProvider) => {
  // Info: (20240326 - Julian) 選擇追蹤的類型 (Address/Transaction)
  const [targetTrackingType, setTargetTrackingType] = useState(TrackingType.ADDRESS);
  const targetTrackingTypeHandler = useCallback(() => {
    setTargetTrackingType(prev =>
      prev === TrackingType.ADDRESS ? TrackingType.TRANSACTION : TrackingType.ADDRESS
    );
  }, []);

  // Info: (20240401 - Julian) 篩選面板是否顯示
  const [visibleFilterPanel, setVisibleFilterPanel] = useState<boolean>(false);
  const visibleFilterPanelHandler = useCallback(() => {
    setVisibleFilterPanel(prev => !prev);
  }, []);

  // Info: (20240401 - Julian) 篩選的日期區間
  const [filterDatePeriod, setFilterDatePeriod] = useState<IDatePeriod>(default30DayPeriod);
  // Info: (20240401 - Julian) 篩選的區塊鏈
  const [filterBlockchains, setFilterBlockchains] = useState<string[]>([]);
  const filterBlockchainsHandler = useCallback((blockchains: string[]) => {
    setFilterBlockchains(blockchains);
  }, []);
  // Info: (20240401 - Julian) 篩選的幣種
  const [filterCurrencies, setFilterCurrencies] = useState<string[]>([]);
  const filterCurrenciesHandler = useCallback((currencies: string[]) => {
    setFilterCurrencies(currencies);
  }, []);

  // Info: (20240326 - Julian) 新增地址面板是否顯示
  const [visibleAddAddressPanel, setVisibleAddAddressPanel] = useState<boolean>(false);
  const visibleAddAddressPanelHandler = useCallback(() => {
    setVisibleAddAddressPanel(prev => !prev);
  }, []);

  // Info: (20240329 - Julian) 縮放比例
  const [zoomScale, setZoomScale] = useState<number>(1);
  const zoomScaleHandler = useCallback((scale: number) => {
    setZoomScale(scale);
  }, []);

  // Info: (20240403 - Julian) 選取的地址/交易
  const [selectedItems, setSelectedItems, selectedItemsRef] = useStateRef<string[]>([]);
  const selectedItemsHandler = useCallback(
    (item: string) => {
      const newSelectedItems = [...selectedItemsRef.current]; // Info: (20240403 - Julian) 存取目前的項目
      const index = newSelectedItems.indexOf(item); // Info: (20240403 - Julian) 檢查是否已經選取

      if (index === -1) {
        // Info: (20240408 - Julian) 如果沒有選取，則新增
        newSelectedItems.push(item);
      } else {
        // Info: (20240408 - Julian) 如果已經選取，則移除
        newSelectedItems.splice(index, 1);
      }
      // Info: (20240408 - Julian) 取最後兩項
      if (newSelectedItems.length > 2) {
        newSelectedItems.splice(0, newSelectedItems.length - 2);
      }
      setSelectedItems(newSelectedItems);
    },
    [selectedItemsRef.current]
  );

  // Info: (20240327 - Julian) 追蹤的目標地址
  const [targetAddress, setTargetAddress] = useState<string>('');
  const addAddressHandler = useCallback((address: string) => {
    setTargetAddress(address);
    setSelectedItems([]);
  }, []);

  // Info: (20240403 - Julian) 重置所有設定
  const resetTrackingTool = () => {
    setFilterBlockchains([]);
    setFilterCurrencies([]);
    setFilterDatePeriod(default30DayPeriod);
    setTargetAddress('');
  };

  const defaultValue = {
    targetTrackingType,
    targetTrackingTypeHandler,

    visibleFilterPanel,
    visibleFilterPanelHandler,

    filterDatePeriod,
    setFilterDatePeriod,

    filterBlockchains,
    filterBlockchainsHandler,

    filterCurrencies,
    filterCurrenciesHandler,

    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,

    targetAddress,
    addAddressHandler,

    zoomScale,
    zoomScaleHandler,

    resetTrackingTool,

    selectedItems: selectedItemsRef.current,
    selectedItemsHandler,
  };

  return (
    <TrackingContext.Provider value={defaultValue}>
      <FilterPanel
        modalVisible={visibleFilterPanel}
        modalClickHandler={visibleFilterPanelHandler}
        filterDatePeriod={filterDatePeriod}
        setFilterDatePeriod={setFilterDatePeriod}
        filterBlockchains={filterBlockchains}
        filterBlockchainsHandler={filterBlockchainsHandler}
        filterCurrencies={filterCurrencies}
        filterCurrenciesHandler={filterCurrenciesHandler}
      />

      <AddAddressPanel
        modalVisible={visibleAddAddressPanel}
        modalClickHandler={visibleAddAddressPanelHandler}
        targetAddress={targetAddress}
        addAddressHandler={addAddressHandler}
      />
      {children}
    </TrackingContext.Provider>
  );
};
