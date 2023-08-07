const ReportExchageRateForm = () => {
  const colStyle = 'border-darkPurple3 border py-3px';

  const data = [
    {
      date: '2023-07-01',
      btc: {buy: 29382.2, sell: 29382.2},
      eth: {buy: 1863.81, sell: 1863.81},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-02',
      btc: {buy: 29382.2, sell: 29382.2},
      eth: {buy: 1863.81, sell: 1863.81},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-03',
      btc: {buy: 29382.3, sell: 29382.3},
      eth: {buy: 1863.81, sell: 1863.81},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-04',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-05',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-06',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-07',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-08',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-09',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-10',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.61, sell: 1866.61},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-11',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-12',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-13',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-14',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-15',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-16',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-17',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-18',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-19',
      btc: {buy: 29390.7, sell: 29390.7},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-20',
      btc: {buy: 29406, sell: 29406},
      eth: {buy: 1864.8, sell: 1864.8},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-21',
      btc: {buy: 29390.8, sell: 29390.8},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-22',
      btc: {buy: 29390.8, sell: 29390.8},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-23',
      btc: {buy: 29390.8, sell: 29390.8},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-24',
      btc: {buy: 29390.8, sell: 29390.8},
      eth: {buy: 1866.71, sell: 1866.71},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-25',
      btc: {buy: 29399.8, sell: 32618.5},
      eth: {buy: 1876.26, sell: 1876.26},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-26',
      btc: {buy: 29409.5, sell: 29399.8},
      eth: {buy: 1876.26, sell: 1876.26},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-27',
      btc: {buy: 29391.9, sell: 29409.5},
      eth: {buy: 1875, sell: 1875},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-28',
      btc: {buy: 29409.9, sell: 29409.9},
      eth: {buy: 1864.87, sell: 1864.87},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-29',
      btc: {buy: 29391.4, sell: 29391.4},
      eth: {buy: 1875.31, sell: 1875.31},
      usdt: {buy: 1, sell: 1},
    },
    {
      date: '2023-07-30',
      btc: {buy: 29296.3, sell: 29296.3},
      eth: {buy: 1872.69, sell: 1872.69},
      usdt: {buy: 1, sell: 1},
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
