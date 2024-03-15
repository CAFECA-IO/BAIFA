export interface IWebsiteReserve {
  [currency: string]: {
    currency: string;
    reserveRatio: number;
    usersHolding: string;
    tidebitReserve: string;
  };
}

export const dummyWebsiteReserve: IWebsiteReserve = {
  'USDT': {
    currency: 'USDT',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
  'ETH': {
    currency: 'ETH',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
  'BTC': {
    currency: 'BTC',
    reserveRatio: 0,
    usersHolding: 'N/A',
    tidebitReserve: 'N/A',
  },
};
