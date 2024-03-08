import {useEffect, useState} from 'react';
import {timestampToString, roundToDecimal} from '../../lib/common';
import {IExchangeRatesResponse} from '../../interfaces/exchange_rates_neo';

interface IReportExchageRateFormNeoProps {
  chainId: string;
  evidenceId: string;
}

const ReportExchageRateFormNeo = ({chainId, evidenceId}: IReportExchageRateFormNeoProps) => {
  const colStyle = 'border-darkPurple3 border py-3px';
  const [exchangeRatesData, setExchangeRatesData] = useState<IExchangeRatesResponse>();

  const getExchangeRate = async () => {
    let reportData: IExchangeRatesResponse;
    try {
      const response = await fetch(
        `/api/v1/app/chains/${chainId}/evidence/${evidenceId}/exchange-rates`,
        {
          method: 'GET',
        }
      );
      reportData = await response.json();
      setExchangeRatesData(reportData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Get exchange rate error');
    }
  };

  useEffect(() => {
    getExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTime = exchangeRatesData?.reportStartTime ?? 0;
  const endTime = exchangeRatesData?.reportEndTime ?? 0;

  const btcData = exchangeRatesData?.exchangeRates.BTC ?? [];
  const ethData = exchangeRatesData?.exchangeRates.ETH ?? [];
  const usdtData = exchangeRatesData?.exchangeRates.USDT ?? [];
  const usdcData = exchangeRatesData?.exchangeRates.USDC ?? [];

  const usdcDataNum = usdcData.map(({buyPrice, sellPrice}) => {
    return {
      buy: parseInt(buyPrice),
      sell: parseInt(sellPrice),
    };
  });

  // Info: (20230919  - Julian) BTC exchange rate
  const btcRate = btcData.map(({buyPrice, sellPrice}, index) => {
    const buyNum = parseInt(buyPrice);
    const sellNum = parseInt(sellPrice);

    // Info: (20240307  - Julian) calculate BTC to USDC exchange rate
    const btcToUsdcBuy = roundToDecimal(buyNum / usdcDataNum[index].buy, 1);
    const btcToUsdcSell = roundToDecimal(sellNum / usdcDataNum[index].sell, 1);

    return {
      buy: btcToUsdcBuy,
      sell: btcToUsdcSell,
    };
  });

  // Info: (20230919  - Julian) ETH exchange rate
  const ethRate = ethData.map(({buyPrice, sellPrice}, index) => {
    const buyNum = parseInt(buyPrice);
    const sellNum = parseInt(sellPrice);

    // Info: (20240307  - Julian) calculate ETH to USDC exchange rate
    const ethToUsdcBuy = roundToDecimal(buyNum / usdcDataNum[index].buy, 2);
    const ethToUsdcSell = roundToDecimal(sellNum / usdcDataNum[index].sell, 2);

    return {
      buy: ethToUsdcBuy,
      sell: ethToUsdcSell,
    };
  });

  // Info: (20230919  - Julian) USDT exchange rate
  const usdtRate = usdtData.map(({buyPrice, sellPrice}, index) => {
    const buyNum = parseInt(buyPrice);
    const sellNum = parseInt(sellPrice);

    // Info: (20240307  - Julian) calculate USDT to USDC exchange rate
    const usdtToUsdcBuy = roundToDecimal(buyNum / usdcDataNum[index].buy, 4);
    const usdtToUsdcSell = roundToDecimal(sellNum / usdcDataNum[index].sell, 4);

    return {
      buy: usdtToUsdcBuy,
      sell: usdtToUsdcSell,
    };
  });

  // Info: (20230919  - Julian) 取得起訖區間的所有日期
  const dates = Array.from(
    {length: (endTime - startTime) / 86400 + 1},
    (_, i) => startTime + 86400 * i
  ).map(item => {
    return {
      date: timestampToString(item).date,
    };
  });

  // Info: (20230919  - Julian) 將資料整理成表格需要的格式
  const ratesData = dates.map((_, i) => {
    // Info: (20230919  - Julian) 若沒有取得當天的資料，則填入預設值
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

  const displayContent = ratesData.map((item, index) => {
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
  });

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
