import {useEffect, useState} from 'react';
import {timestampToString, getReportTimeSpan, roundToDecimal} from '../../lib/common';
import {IResult} from '../../interfaces/result';
import {IExchangeRates} from '../../interfaces/exchange_rates';
import {CLOSING_TIME} from '../../constants/config';
import {getApiRoute} from '../../constants/project_api_route';

interface IReportExchageRateFormProps {
  projectId: string;
}

const ReportExchageRateForm = ({projectId}: IReportExchageRateFormProps) => {
  const colStyle = 'border-darkPurple3 border py-3px';
  const [exchangeRatesData, setExchangeRatesData] = useState<IExchangeRates>();
  // Info: (20230913 - Julian) Get timespan of report
  const startDateStr = timestampToString(getReportTimeSpan().start);
  const endDateStr = timestampToString(getReportTimeSpan().end);

  // Info: (20240115 - Julian) Get API URL
  const apiURL = getApiRoute(projectId).EXCHANGE_RATES;

  const getExchangeRate = async () => {
    let reportData;
    try {
      const response = await fetch(
        `${apiURL}?startDate=${startDateStr.date}&endDate=${endDateStr.date}`,
        {
          method: 'GET',
        }
      );
      const result: IResult = await response.json();
      if (result.success) {
        reportData = result.data as IExchangeRates;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Get exchange rate error');
    }
    return reportData;
  };

  useEffect(() => {
    getExchangeRate().then(data => setExchangeRatesData(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Info: (20230919  - Julian) BTC exchange rate
  const btcRate = exchangeRatesData?.BTC.filter(item => {
    // Info: (20230919  - Julian) 取得每天 16:00:00 的收盤價
    return (item.timestamp - CLOSING_TIME) % 86400 === 0;
  }).map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 1),
      sell: roundToDecimal(sellPrice, 1),
    };
  });

  // Info: (20230919  - Julian) ETH exchange rate
  const ethData = exchangeRatesData?.ETH.filter(item => {
    // Info: (20230919  - Julian) 取得每天 16:00:00 的收盤價
    return (item.timestamp - CLOSING_TIME) % 86400 === 0;
  }).map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 2),
      sell: roundToDecimal(sellPrice, 2),
    };
  });

  // Info: (20230919  - Julian) USDT exchange rate
  const usdtRate = exchangeRatesData?.USDT.filter(item => {
    // Info: (20230919  - Julian) 取得每天 16:00:00 的收盤價
    return (item.timestamp - CLOSING_TIME) % 86400 === 0;
  }).map(({buyPrice, sellPrice}) => {
    return {
      buy: roundToDecimal(buyPrice, 4),
      sell: roundToDecimal(sellPrice, 4),
    };
  });

  // Info: (20230919  - Julian) 取得起訖區間的所有日期
  const dates = Array.from(
    {length: (getReportTimeSpan().end - getReportTimeSpan().start) / 86400 + 1},
    (_, i) => getReportTimeSpan().start + 86400 * i
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
      btc: btcRate?.[i] ?? defaultData,
      eth: ethData?.[i] ?? defaultData,
      usdt: usdtRate?.[i] ?? defaultData,
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

export default ReportExchageRateForm;
