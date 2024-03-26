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

  addAddress: string;
  addAddressHandler: (address: string) => void;
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

  addAddress: '',
  addAddressHandler: () => null,
});

export const TrackingProvider = ({children}: ITrackingProvider) => {
  // Info: (20240326 - Julian) 選擇追蹤的類型 (Address/Transaction)
  const [targetTrackingType, setTargetTrackingType] = useState(TrackingType.ADDRESS);
  const targetTrackingTypeHandler = useCallback(() => {
    setTargetTrackingType(prev =>
      prev === TrackingType.ADDRESS ? TrackingType.TRANSACTION : TrackingType.ADDRESS
    );
  }, []);

  // Info: (20240326 - Julian) 新增地址面板
  const [visibleAddAddressPanel, setVisibleAddAddressPanel] = useState<boolean>(false);
  const visibleAddAddressPanelHandler = useCallback(() => {
    setVisibleAddAddressPanel(prev => !prev);
  }, []);

  const [addAddress, setAddAddress] = useState<string>('');
  const addAddressHandler = useCallback((address: string) => {
    setAddAddress(address);
  }, []);

  const defaultValue = {
    targetTrackingType,
    targetTrackingTypeHandler,

    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,

    addAddress,
    addAddressHandler,
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
