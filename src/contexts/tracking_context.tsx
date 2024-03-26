import {useState, useCallback, createContext} from 'react';
import AddAddressPanel from '../components/add_address_panel/add_address_panel';

export interface ITrackingProvider {
  children: React.ReactNode;
}

export interface ITrackingContext {
  visibleAddAddressPanel: boolean;
  visibleAddAddressPanelHandler: () => void;
}

export const TrackingContext = createContext<ITrackingContext>({
  visibleAddAddressPanel: false,
  visibleAddAddressPanelHandler: () => null,
});

export const TrackingProvider = ({children}: ITrackingProvider) => {
  const [visibleAddAddressPanel, setVisibleAddAddressPanel] = useState<boolean>(false);

  const visibleAddAddressPanelHandler = useCallback(() => {
    setVisibleAddAddressPanel(prev => !prev);
  }, []);

  const defaultValue = {
    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,
  };

  return (
    <TrackingContext.Provider value={defaultValue}>
      <AddAddressPanel
        modalVisible={visibleAddAddressPanel}
        modalClickHandler={visibleAddAddressPanelHandler}
      />
      {children}
    </TrackingContext.Provider>
  );
};
