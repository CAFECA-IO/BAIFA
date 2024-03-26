import {useState, useCallback, createContext} from 'react';
import AddAddressPanel from '../components/add_address_panel/add_address_panel';

export interface IGlobalProvider {
  children: React.ReactNode;
}

export interface IGlobalContext {
  visibleAddAddressPanel: boolean;
  visibleAddAddressPanelHandler: () => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  visibleAddAddressPanel: false,
  visibleAddAddressPanelHandler: () => null,
});

export const GlobalProvider = ({children}: IGlobalProvider) => {
  const [visibleAddAddressPanel, setVisibleAddAddressPanel] = useState<boolean>(false);

  const visibleAddAddressPanelHandler = useCallback(() => {
    setVisibleAddAddressPanel(prev => !prev);
  }, []);

  const defaultValue = {
    visibleAddAddressPanel,
    visibleAddAddressPanelHandler,
  };

  return (
    <GlobalContext.Provider value={defaultValue}>
      <AddAddressPanel
        modalVisible={visibleAddAddressPanel}
        modalClickHandler={visibleAddAddressPanelHandler}
      />
      {children}
    </GlobalContext.Provider>
  );
};
