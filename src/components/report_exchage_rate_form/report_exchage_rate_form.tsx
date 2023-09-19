import {useEffect, useState} from 'react';
import {timestampToString, getReportTimeSpan, roundToDecimal} from '../../lib/common';
import {APIURL} from '../../constants/api_request';
import {IResult} from '../../interfaces/result';
import {IExchangeRates} from '../../interfaces/exchange_rates';

const ReportExchageRateForm = () => {
  const colStyle = 'border-darkPurple3 border py-3px';
  const [exchangeRatesData, setExchangeRatesData] = useState<IExchangeRates>();
  // Info: (20230913 - Julian) Get timespan of report
  const startDate = timestampToString(getReportTimeSpan().start).date;
  const endDate = timestampToString(getReportTimeSpan().end).date;

  const getExchangeRate = async () => {
    let reportData;
    try {
      const response = await fetch(
        `${APIURL.EXCHANGE_RATES}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
        }
      );
      const result: IResult = await response.json();
      if (result.success) {
        reportData = result.data as IExchangeRates;
      }
    } catch (error) {
      // console.log('Get balance sheet error');
    }
    return reportData;
  };

  useEffect(() => {
    //getExchangeRate().then(data => setExchangeRatesData(data));
  }, []);

  const data = [
    {
      date: '2023-07-01',
      btc: {buy: 31228.7, sell: 31293.7},
      eth: {buy: 1892.41, sell: 1897.39},
      usdt: {buy: 0.9999, sell: 1.0001},
    },
    {
      date: '2023-07-02',
      btc: {buy: 31283.6, sell: 31348.9},
      eth: {buy: 1897.74, sell: 1902.77},
      usdt: {buy: 0.9998, sell: 0.9999},
    },
    {
      date: '2023-07-03',
      btc: {buy: 31338.4, sell: 31404.1},
      eth: {buy: 1903.07, sell: 1908.15},
      usdt: {buy: 0.9998, sell: 0.9999},
    },
    {
      date: '2023-07-04',
      btc: {buy: 31393.2, sell: 31459.3},
      eth: {buy: 1908.04, sell: 1913.53},
      usdt: {buy: 0.9998, sell: 0.9999},
    },
    {
      date: '2023-07-05',
      btc: {buy: 31448, sell: 31514.5},
      eth: {buy: 1913.72, sell: 1918.91},
      usdt: {buy: 0.9995, sell: 0.9996},
    },
    {
      date: '2023-07-06',
      btc: {buy: 31502.8, sell: 31569.7},
      eth: {buy: 1919.04, sell: 1924.29},
      usdt: {buy: 0.9998, sell: 0.9999},
    },
    {
      date: '2023-07-07',
      btc: {buy: 31557.6, sell: 31624.9},
      eth: {buy: 1924.37, sell: 1929.67},
      usdt: {buy: 1.0001, sell: 1.0002},
    },
    {
      date: '2023-07-08',
      btc: {buy: 31612.4, sell: 31680.1},
      eth: {buy: 1929.7, sell: 1935.05},
      usdt: {buy: 1.0001, sell: 1.0002},
    },
    {
      date: '2023-07-09',
      btc: {buy: 31667.2, sell: 31735.3},
      eth: {buy: 1935.03, sell: 1940.43},
      usdt: {buy: 1.0001, sell: 1.0002},
    },
    {
      date: '2023-07-10',
      btc: {buy: 31722, sell: 31790.5},
      eth: {buy: 1940.36, sell: 1945.81},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-11',
      btc: {buy: 31776.8, sell: 31845.7},
      eth: {buy: 1945.68, sell: 1951.19},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-12',
      btc: {buy: 31831.6, sell: 31900.9},
      eth: {buy: 1951, sell: 1956.57},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-13',
      btc: {buy: 31886.4, sell: 31956.1},
      eth: {buy: 1956.33, sell: 1961.95},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-14',
      btc: {buy: 31941.2, sell: 32011.3},
      eth: {buy: 1961.66, sell: 1967.33},
      usdt: {buy: 1.0004, sell: 1.0005},
    },
    {
      date: '2023-07-15',
      btc: {buy: 31996, sell: 32066.5},
      eth: {buy: 1966.98, sell: 1972.71},
      usdt: {buy: 1, sell: 1.0001},
    },
    {
      date: '2023-07-16',
      btc: {buy: 32050.8, sell: 32121.7},
      eth: {buy: 1972.3, sell: 1978.09},
      usdt: {buy: 1, sell: 1.0001},
    },
    {
      date: '2023-07-17',
      btc: {buy: 32105.6, sell: 32176.9},
      eth: {buy: 1977.63, sell: 1983.47},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-18',
      btc: {buy: 32160.4, sell: 32232.1},
      eth: {buy: 1982.96, sell: 1988.85},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-19',
      btc: {buy: 32215.2, sell: 32287.3},
      eth: {buy: 1988.28, sell: 1994.23},
      usdt: {buy: 0.9998, sell: 0.9999},
    },
    {
      date: '2023-07-20',
      btc: {buy: 32270, sell: 32342.5},
      eth: {buy: 1993.61, sell: 1999.61},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-21',
      btc: {buy: 32324.8, sell: 32397.7},
      eth: {buy: 1998.94, sell: 2005},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-22',
      btc: {buy: 32379.6, sell: 32452.9},
      eth: {buy: 2004.27, sell: 2010.38},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-23',
      btc: {buy: 32434.4, sell: 32508.1},
      eth: {buy: 2009.6, sell: 2015.76},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-24',
      btc: {buy: 32489.2, sell: 32563.3},
      eth: {buy: 2014.93, sell: 2021.14},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-25',
      btc: {buy: 32544, sell: 32618.5},
      eth: {buy: 2020.26, sell: 2026.52},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-26',
      btc: {buy: 32598.8, sell: 32673.7},
      eth: {buy: 2025.59, sell: 2031.9},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-27',
      btc: {buy: 32652.6, sell: 32728.9},
      eth: {buy: 2030.92, sell: 2037.28},
      usdt: {buy: 0, sell: 1},
    },
    {
      date: '2023-07-28',
      btc: {buy: 32744.1, sell: 32784.1},
      eth: {buy: 2030.5, sell: 2042.66},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-29',
      btc: {buy: 32829.3, sell: 32839.3},
      eth: {buy: 2040.2, sell: 2048.04},
      usdt: {buy: 0.9999, sell: 1},
    },
    {
      date: '2023-07-30',
      btc: {buy: 32885.5, sell: 35894.5},
      eth: {buy: 2030.4, sell: 2053.42},
      usdt: {buy: 0.9999, sell: 1},
    },
  ];

  const displayContent = data.map((item, index) => {
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
