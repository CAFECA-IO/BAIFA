import React, {useContext, createContext, useState} from 'react';
import {MarketContext} from './market_context';

interface IAppProvider {
  children: React.ReactNode;
}

interface IAppContext {
  isInit: boolean;
  init: () => Promise<void>;
}

export const AppContext = createContext<IAppContext>({
  isInit: false,
  init: () => Promise.resolve(),
});

export const AppProvider = ({children}: IAppProvider) => {
  const marketCtx = useContext(MarketContext);
  const [isInit, setIsInit] = useState<boolean>(false);

  const init = async () => {
    if (!isInit) {
      await marketCtx.init();
      setIsInit(true);
    }
    return;
  };

  const defaultValue = {
    isInit: isInit,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};
