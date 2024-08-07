import {useState, useCallback, useRef, createContext} from 'react';
import useStateRef from 'react-usestateref';
import {default30DayPeriod} from '@/constants/config';
import {IDatePeriod} from '@/interfaces/date_period';
import AddAddressPanel from '@/components/add_address_panel/add_address_panel';
import FilterPanel from '@/components/filter_panel/filter_panel';
import RelationAnalysisPanel from '@/components/relation_analysis_panel/relation_analysis_panel';

export interface ITrackingProvider {
  children: React.ReactNode;
}

export interface ITrackingContext {
  graphRef: React.RefObject<HTMLDivElement>;

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

  visibleRelationAnalysisPanel: boolean;
  visibleRelationAnalysisPanelHandler: () => void;

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
  graphRef: {current: null},

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

  visibleRelationAnalysisPanel: false,
  visibleRelationAnalysisPanelHandler: () => null,

  targetAddress: '',
  addAddressHandler: () => null,

  zoomScale: 1,
  zoomScaleHandler: () => null,

  resetTrackingTool: () => null,

  selectedItems: [],
  selectedItemsHandler: () => null,
});

export const TrackingProvider = ({children}: ITrackingProvider) => {
  // Info: (20240411 - Julian) 圖表
  const graphRef = useRef(null);

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
    [selectedItemsRef, setSelectedItems]
  );

  // Info: (20240327 - Julian) 追蹤的目標地址
  const [targetAddress, setTargetAddress] = useState<string>('');
  const addAddressHandler = useCallback(
    (address: string) => {
      setTargetAddress(address);
      setSelectedItems([]);
    },
    [setTargetAddress, setSelectedItems]
  );

  // Info: (20240408 - Julian) 關聯分析面板是否顯示
  const [visibleRelationAnalysisPanel, setVisibleRelationAnalysisPanel] = useState<boolean>(false);
  const visibleRelationAnalysisPanelHandler = useCallback(() => {
    setVisibleRelationAnalysisPanel(prev => !prev);
  }, []);

  // Info: (20240326 - Julian) 選擇追蹤的類型 (Address/Transaction)
  const [targetTrackingType, setTargetTrackingType] = useState(TrackingType.ADDRESS);
  const targetTrackingTypeHandler = useCallback(() => {
    setTargetTrackingType(prev =>
      prev === TrackingType.ADDRESS ? TrackingType.TRANSACTION : TrackingType.ADDRESS
    );
    setTargetAddress('');
    setSelectedItems([]);
  }, [setTargetTrackingType, setTargetAddress, setSelectedItems]);

  // Info: (20240403 - Julian) 重置所有設定
  const resetTrackingTool = () => {
    // Info: (20240408 - Julian) 篩選條件
    setFilterBlockchains([]);
    setFilterCurrencies([]);
    setFilterDatePeriod(default30DayPeriod);

    setTargetAddress('');

    setSelectedItems([]);
  };

  const defaultValue = {
    graphRef,

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

    visibleRelationAnalysisPanel,
    visibleRelationAnalysisPanelHandler,

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

      <RelationAnalysisPanel
        modalVisible={visibleRelationAnalysisPanel}
        modalClickHandler={visibleRelationAnalysisPanelHandler}
        analysisItems={selectedItems}
      />
      {children}
    </TrackingContext.Provider>
  );
};
