import {useState, useCallback, createContext} from 'react';
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

  filterCurrency: string[];
  filterCurrencyHandler: (currencies: string[]) => void;

  visibleAddAddressPanel: boolean;
  visibleAddAddressPanelHandler: () => void;

  targetAddress: string;
  addAddressHandler: (address: string) => void;

  zoomScale: number;
  zoomScaleHandler: (scale: number) => void;
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

  filterCurrency: [],
  filterCurrencyHandler: () => null,

  visibleAddAddressPanel: false,
  visibleAddAddressPanelHandler: () => null,

  targetAddress: '',
  addAddressHandler: () => null,

  zoomScale: 1,
  zoomScaleHandler: () => null,
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
  const [filterCurrency, setFilterCurrency] = useState<string[]>([]);
  const filterCurrencyHandler = useCallback((currencies: string[]) => {
    setFilterCurrency(currencies);
  }, []);

  // Info: (20240326 - Julian) 新增地址面板是否顯示
  const [visibleAddAddressPanel, setVisibleAddAddressPanel] = useState<boolean>(false);
  const visibleAddAddressPanelHandler = useCallback(() => {
    setVisibleAddAddressPanel(prev => !prev);
  }, []);

  // Info: (20240327 - Julian) 選定的目標地址
  const [targetAddress, setTargetAddress] = useState<string>('');
  const addAddressHandler = useCallback((address: string) => {
    setTargetAddress(address);
  }, []);

  // Info: (20240329 - Julian) 縮放比例
  const [zoomScale, setZoomScale] = useState<number>(1);
  const zoomScaleHandler = useCallback((scale: number) => {
    setZoomScale(scale);
  }, []);

  const defaultValue = {
    targetTrackingType,
    targetTrackingTypeHandler,

    visibleFilterPanel,
    visibleFilterPanelHandler,

    filterDatePeriod,
    setFilterDatePeriod,

    filterBlockchains,
    filterBlockchainsHandler,

    filterCurrency,
    filterCurrencyHandler,

    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,

    targetAddress,
    addAddressHandler,

    zoomScale,
    zoomScaleHandler,
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
        filterCurrency={filterCurrency}
        filterCurrencyHandler={filterCurrencyHandler}
      />

      <AddAddressPanel
        modalVisible={visibleAddAddressPanel}
        modalClickHandler={visibleAddAddressPanelHandler}
        addAddressHandler={addAddressHandler}
      />
      {children}
    </TrackingContext.Provider>
  );
};