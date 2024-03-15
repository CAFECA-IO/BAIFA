import useAPIResponse from '../../lib/hooks/use_api_response';
import {timestampToString, roundToDecimal} from '../../lib/common';
//import {IExchangeRatesResponse} from '../../interfaces/exchange_rates_neo';
import {HttpMethod} from '../../constants/api_request';
import {IExchangeRates} from '../../interfaces/exchange_rates';

interface IReportExchageRateFormNeoProps {
  startTimestamp: number;
  endTimestamp: number;
}

interface IExchangeRateAPIResponse {
  success: boolean;
  reason: string;
  data: IExchangeRates;
}

const ReportExchageRateFormNeo = ({
  startTimestamp,
  endTimestamp,
}: IReportExchageRateFormNeoProps) => {
  const colStyle = 'border-darkPurple3 border py-3px';

  const startDate = timestampToString(startTimestamp).date;
  const endDate = timestampToString(endTimestamp).date;

  const {
    data: exchangeRatesResponse,
    isLoading,
    error: exchangeRateError,
  } = useAPIResponse<IExchangeRateAPIResponse>(
    `https://api.tidebit-defi.com/api/v1/exchange-rates`,
    {method: HttpMethod.GET},
    {
      startDate: startDate,
      endDate: endDate,
    }
  );

  const exchangeRatesData = exchangeRatesResponse?.data;

  if (!!exchangeRateError || !exchangeRatesData) {
    return <p>Failed to load exchange rates</p>;
  }

  const btcData = exchangeRatesData.BTC ?? [];
  const ethData = exchangeRatesData.ETH ?? [];
  const usdtData = exchangeRatesData.USDT ?? [];

  // Info: (20240315 - Julian) BTC exchange rate
  const btcRate = btcData.map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 1),
      sell: roundToDecimal(sellPrice, 1),
    };
  });

  // Info: (20240315 - Julian) ETH exchange rate
  const ethRate = ethData.map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 2),
      sell: roundToDecimal(sellPrice, 2),
    };
  });

  // Info: (20240315 - Julian) USDT exchange rate
  const usdtRate = usdtData.map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 4),
      sell: roundToDecimal(sellPrice, 4),
    };
  });

  // Info: (20240315 - Julian) 取得起訖區間的所有日期
  const dates = Array.from(
    {length: (endTimestamp - startTimestamp) / 86400 + 1},
    (_, i) => startTimestamp + 86400 * i
  ).map(item => {
    return {
      date: timestampToString(item).date,
    };
  });

  // Info: (20240315 - Julian) 將資料整理成表格需要的格式
  const ratesData = dates.map((_, i) => {
    // Info: (20240315 - Julian) 若沒有取得當天的資料，則填入預設值
    const defaultData = {
      buy: 0,
      sell: 0,
    };
    return {
      date: dates[i].date,
      btc: btcRate[i] ?? defaultData,
      eth: ethRate[i] ?? defaultData,
      usdt: usdtRate[i] ?? defaultData,
    };
  });

  const displayContent = isLoading ? (
    // Info: (20240315 - Julian) 若正在載入中，則顯示 Loading...
    <p>Loading...</p>
  ) : (
    ratesData.map((item, index) => {
      return (
        <tr key={index}>
          <td className={`${colStyle} text-darkPurple3`}>{item.date}</td>
          <td className={`${colStyle} border-l-2 text-lightGreen2`}>{item.btc.buy}</td>
          <td className={`${colStyle} text-lightRed2`}>{item.btc.sell}</td>
          <td className={`${colStyle} border-l-2 text-lightGreen2`}>{item.eth.buy}</td>
          <td className={`${colStyle} text-lightRed2`}>{item.eth.sell}</td>
          <td className={`${colStyle} border-l-2 text-lightGreen2`}>{item.usdt.buy}</td>
          <td className={`${colStyle} text-lightRed2`}>{item.usdt.sell}</td>
        </tr>
      );
    })
  );

  return (
    <table className="text-center text-xxs">
      <thead className={`${colStyle}`}>
        <tr>
          <th className={`${colStyle}`}>Quoted Date</th>
          <th colSpan={2} className={`${colStyle}`}>
            BTC to USD
          </th>
          <th colSpan={2} className={`${colStyle}`}>
            ETH to USD
          </th>
          <th colSpan={2} className={`${colStyle}`}>
            USDT to USD
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="font-bold">
          <td className={`${colStyle} text-darkPurple3`}></td>
          <td className={`${colStyle} border-l-2 text-lightGreen`}>Buy</td>
          <td className={`${colStyle} text-lightRed`}>Sell</td>
          <td className={`${colStyle} border-l-2 text-lightGreen`}>Buy</td>
          <td className={`${colStyle} text-lightRed`}>Sell</td>
          <td className={`${colStyle} border-l-2 text-lightGreen`}>Buy</td>
          <td className={`${colStyle} text-lightRed`}>Sell</td>
        </tr>

        {displayContent}
      </tbody>
    </table>
  );
};

export default ReportExchageRateFormNeo;
