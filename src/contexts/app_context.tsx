import React, {useContext, createContext} from 'react';
import useState from 'react-usestateref';
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
  const [isInit, setIsInit, isInitRef] = useState<boolean>(false);

  const init = async () => {
    if (!isInitRef.current) {
      await marketCtx.init();
      setIsInit(true);
    }
    return;
  };

  const defaultValue = {
    isInit: isInitRef.current,
    init,
  };

  return <AppContext.Provider value={defaultValue}>{children}</AppContext.Provider>;
};
