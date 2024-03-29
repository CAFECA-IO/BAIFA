import {useState, useCallback, createContext} from 'react';
import AddAddressPanel from '../components/add_address_panel/add_address_panel';

export interface ITrackingProvider {
  children: React.ReactNode;
}

export interface ITrackingContext {
  targetTrackingType: TrackingType;
  targetTrackingTypeHandler: () => void;

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

    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,

    targetAddress,
    addAddressHandler,

    zoomScale,
    zoomScaleHandler,
  };

  return (
    <TrackingContext.Provider value={defaultValue}>
      <AddAddressPanel
        modalVisible={visibleAddAddressPanel}
        modalClickHandler={visibleAddAddressPanelHandler}
        addAddressHandler={addAddressHandler}
      />
      {children}
    </TrackingContext.Provider>
  );
};
