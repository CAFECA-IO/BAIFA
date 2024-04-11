import {useContext, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {TrackingContext} from '../../contexts/tracking_context';
import {truncateText} from '../../lib/common';

interface INode {
  id: string;
  group: string;
}
interface ILink {
  source: string;
  target: string;
}

interface IGraphData {
  nodes: INode[];
  links: ILink[];
}

const TrackingView = () => {
  const {
    targetAddress,
    filterBlockchains,
    filterCurrencies,
    filterDatePeriod,
    selectedItems,
    selectedItemsHandler,
  } = useContext(TrackingContext);

  const blockchainQueryStr = filterBlockchains.length > 0 ? filterBlockchains.join(',') : '';
  const currencyQueryStr = filterCurrencies.length > 0 ? filterCurrencies.join(',') : '';

  const [graphData, setGraphData] = useState<IGraphData>({
    nodes: [],
    links: [],
  });

  const [isOpenFirstLayer, setIsOpenFirstLayer] = useState<boolean>(false);
  const [firstLayerInteractions, setFirstLayerInteractions] = useState<string[]>([]);

  const [isOpenSecondLayer, setIsOpenSecondLayer] = useState<boolean>(false);
  const [secondLayerInteractions, setSecondLayerInteractions] = useState<string[]>([]);

  const [firstLayerSelectedAddress, setFirstLayerSelectedAddress] = useState<string>('');

  const openFirstLayerHandler = () => setIsOpenFirstLayer(!isOpenFirstLayer);
  const openSecondLayerHandler = () => setIsOpenSecondLayer(!isOpenSecondLayer);

  const getInteractions = async (address: string) => {
    let interactions;
    try {
      const response = await fetch(
        `/api/v1/app/tracking_tool/interaction_list?address_id=${address}&blockchains=${blockchainQueryStr}&currencies=${currencyQueryStr}&start_date=${
          filterDatePeriod.startTimeStamp === 0 ? '' : filterDatePeriod.startTimeStamp
        }&end_date=${filterDatePeriod.endTimeStamp === 0 ? '' : filterDatePeriod.endTimeStamp}
      `,
        {
          method: 'GET',
        }
      );
      interactions = await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    return interactions;
  };

  useEffect(() => {
    // Info: (20240410 - Julian) 如果 targetAddress 改變，則關閉第一層
    setIsOpenFirstLayer(false);
  }, [targetAddress]);

  useEffect(() => {
    if (isOpenFirstLayer) {
      getInteractions(targetAddress).then(interactions => {
        setFirstLayerInteractions(interactions);
      });
    } else {
      setFirstLayerInteractions([]);
    }

    if (isOpenSecondLayer) {
      getInteractions(firstLayerSelectedAddress).then(interactions => {
        setSecondLayerInteractions(interactions);
      });
    } else {
      setSecondLayerInteractions([]);
    }
  }, [filterBlockchains, filterCurrencies, filterDatePeriod, isOpenFirstLayer, isOpenSecondLayer]);

  useEffect(() => {
    // Info: (20240410 - Julian) graph data
    const graph = {
      nodes: [
        // {id: '0000', group: 'target'},
        // {id: '1001', group: 'firstLayerInteractions'},
        // {id: '1002', group: 'firstLayerInteractions'},
        // {id: '1003', group: 'firstLayerInteractions'},
        // {id: '2009', group: 'secondLayerInteractions'},
        {id: targetAddress, group: 'target'},
        ...firstLayerInteractions.map(address => {
          return {id: address, group: 'firstLayerInteractions'};
        }),
        ...secondLayerInteractions
          // Info: (20240410 - Julian) 過濾掉 targetAddress
          .filter(address => address !== targetAddress)
          .map(address => {
            return {id: address, group: 'secondLayerInteractions'};
          }),
      ],
      links: [
        // {source: '0000', target: '1001'},
        // {source: '0000', target: '1002'},
        // {source: '0000', target: '1003'},
        // {source: '1001', target: '2009'},
        {source: targetAddress, target: targetAddress},
        ...firstLayerInteractions.map(address => {
          return {source: address, target: targetAddress};
        }),
        ...secondLayerInteractions
          // Info: (20240410 - Julian) 過濾掉 targetAddress
          .filter(address => address !== targetAddress)
          .map(address => {
            return {source: address, target: firstLayerSelectedAddress};
          }),
      ],
    };

    setGraphData(graph);
  }, [firstLayerInteractions, secondLayerInteractions]);

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links = graphData.links.map(Object.create);
    const nodes = graphData.nodes.map(Object.create);

    // Info: (20240327 - Julian) 圖表的直徑
    const DIAMETER_OF_MAP = 200;
    // Info: (20240410 - Julian) 第一層和第二層節點的數量
    const firstLayerLength = nodes.filter(node => node.group === 'firstLayerInteractions').length;
    const secondLayerLength = nodes.filter(node => node.group === 'secondLayerInteractions').length;

    // Info: (20240410 - Julian) firstSelectedAddress 的 X 座標
    const firstAddressX =
      DIAMETER_OF_MAP *
      Math.cos(
        ((nodes.indexOf(nodes.find(node => node.id === firstLayerSelectedAddress)) - 1) *
          (2 * Math.PI)) /
          firstLayerLength
      );
    // Info: (20240410 - Julian) firstSelectedAddress 的 Y 座標
    const firstAddressY =
      DIAMETER_OF_MAP *
      Math.sin(
        ((nodes.indexOf(nodes.find(node => node.id === firstLayerSelectedAddress)) - 1) *
          (2 * Math.PI)) /
          firstLayerLength
      );

    // Info: (20240329 - Julian) 計算節點圓心的 x 座標
    const getCircleCenterX = (i: number) => {
      // Info: (20240410 - Julian) i = 0 代表 target address，也就是圓心，所以直接回傳 0
      return i === 0
        ? 0
        : // Info: (20240410 - Julian) 如果 i > firstLayerLength，代表是 secondLayerInteractions
        // 以 125為半徑，偏移量 = firstSelectedAddress 的 x 座標
        i > firstLayerLength
        ? 125 * Math.cos(((i - 1) * (2 * Math.PI)) / secondLayerLength) + firstAddressX
        : // Info: (20240410 - Julian) 其他的 i 代表 firstLayerInteractions，以 360 度平均分配，順時針排列
          DIAMETER_OF_MAP * Math.cos(((i - 1) * (2 * Math.PI)) / firstLayerLength);
    };

    // Info: (20240329 - Julian) 計算節點圓心的 y 座標
    const getCircleCenterY = (i: number) => {
      // Info: (20240410 - Julian) i = 0 代表 target address，也就是圓心，所以直接回傳 0
      return i === 0
        ? 0
        : // Info: (20240410 - Julian) 如果 i > firstLayerLength，代表是 secondLayerInteractions
        // 以 125為半徑，偏移量 = firstSelectedAddress 的 y 座標
        i > firstLayerLength
        ? 125 * Math.sin(((i - 1) * (2 * Math.PI)) / secondLayerLength) + firstAddressY
        : // Info: (20240410 - Julian) 其他的 i 代表 firstLayerInteractions，以 360 度平均分配，順時針排列
          DIAMETER_OF_MAP * Math.sin(((i - 1) * (2 * Math.PI)) / firstLayerLength);
    };

    if (!mapRef.current) return;

    // Info: (20240329 - Julian) 清除舊的 SVG 元素
    d3.select(mapRef.current).selectAll('svg').remove();

    const containerRect = mapRef.current.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;

    // Info: (20240329 - Julian) 計算縮放比例
    const viewBoxScale = [-width / 2, -height / 2, width, height];

    // Info: (20240329 - Julian) SVG 初始化
    const svg = d3.select(mapRef.current).append('svg').attr('viewBox', viewBoxScale);

    // Info: (20240328 - Julian) 定義漸變色
    const linear1 = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'bluePurpleLinear') // Info: (20240328 - Julian) 藍紫漸變色
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%'); // Info: (20240328 - Julian) 0% 100% 0% 0% 代表從上到下漸變
    linear1
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#7B70FF')
      .style('stop-opacity', 1); // Info: (20240328 - Julian) 起始色
    linear1
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#61BDFF') // Info: (20240328 - Julian) 結束色
      .style('stop-opacity', 1);

    const linear2 = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'redOrangeLinear') // Info: (20240328 - Julian) 紅橙漸變色
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%'); // Info: (20240328 - Julian) 0% 100% 0% 0% 代表從上到下漸變
    linear2
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#FF0F7B')
      .style('stop-opacity', 1); // Info: (20240328 - Julian) 起始色
    linear2
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#F89B29') // Info: (20240328 - Julian) 結束色
      .style('stop-opacity', 1);

    const linear3 = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'blueGreenLinear') // Info: (20240410 - Julian) 藍綠漸變色
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%'); // Info: (20240410 - Julian) 0% 100% 0% 0% 代表從上到下漸變
    linear3
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#00C7FF')
      .style('stop-opacity', 1); // Info: (20240410 - Julian) 起始色
    linear3
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#00FFA3') // Info: (20240410 - Julian) 結束色
      .style('stop-opacity', 1);

    // Info: (20240328 - Julian) 連線
    const link = svg
      .append('g')
      .attr('stroke', '#F0F0F0')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 3)
      .style('stop-opacity', 1);

    // Info: (20240328 - Julian) 點
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', d => d.group) // Info: (20240329 - Julian) 賦予各個點不同的 class
      .attr('stroke-width', 5)
      .attr('r', 40)
      .attr('fill', function (d) {
        // Info: (20240403 - Julian) 如果沒有被選到，則顯示黑色
        if (d.id !== selectedItems[0] && d.id !== selectedItems[1]) return '#161830';
        // Info: (20240403 - Julian) 根據 class 來決定顏色
        return d3.select(this).classed('target')
          ? 'url(#bluePurpleLinear)'
          : d3.select(this).classed('firstLayerInteractions')
          ? 'url(#redOrangeLinear)'
          : 'url(#blueGreenLinear)';
      })
      .style('stroke', function () {
        // Info: (20240329 - Julian) 根據 class 來決定顏色
        return d3.select(this).classed('target')
          ? 'url(#bluePurpleLinear)'
          : d3.select(this).classed('firstLayerInteractions')
          ? 'url(#redOrangeLinear)'
          : 'url(#blueGreenLinear)';
      })
      // Info: (20240410 - Julian) 雙擊時，展開該點的資訊
      .on('dblclick', function (_, d) {
        if (d.group === 'target') {
          openFirstLayerHandler();
        } else if (d.group === 'firstLayerInteractions') {
          setFirstLayerSelectedAddress(d.id);
          openSecondLayerHandler();
        }
      })
      // Info: (20240403 - Julian) 點擊時，將 id 寫入 selectedItems
      .on('click', function (_, d) {
        selectedItemsHandler(d.id);
      })
      // Info: (20240329 - Julian) hover 時加上光暈
      .on('mouseenter', function () {
        d3.select(this)
          .attr('filter', function () {
            // Info: (20240329 - Julian) 根據 class 來決定光暈的顏色
            return d3.select(this).classed('target')
              ? 'drop-shadow(0 0 24px #561AFF)'
              : 'drop-shadow(0 0 24px #FF7278)';
          })
          // Info: (20240329 - Julian) 滑鼠移入時改變 cursor
          .attr('cursor', 'pointer');
        // Info: (20240329 - Julian) 滑鼠離開時移除光暈
      })
      .on('mouseleave', function () {
        d3.select(this).attr('filter', null);
      });

    // Info: (20240328 - Julian) 文字
    const text = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#F0F0F0')
      .text(d => truncateText(d.id, 7));

    const getStartX = (i: number) => {
      // 第二層的起點為 firstSelectedAddress 的圓心
      return i > firstLayerLength
        ? getCircleCenterX(firstLayerInteractions.indexOf(firstLayerSelectedAddress) + 1)
        : 0;
    };
    const getStartY = (i: number) => {
      // 第二層的起點為 firstSelectedAddress 的圓心
      return i > firstLayerLength
        ? getCircleCenterY(firstLayerInteractions.indexOf(firstLayerSelectedAddress) + 1)
        : 0;
    };

    const simulation = d3
      .forceSimulation(nodes)
      // Info: (20240329 - Julian) 連結的引力
      .force(
        'link',
        d3.forceLink(graphData.links).id((d: any) => d.id)
      )
      // Info: (20240329 - Julian) alphaTarget 代表模擬的 alpha 值，alpha 值越高，模擬的速度越快
      .alphaTarget(0.1)
      // Info: (20240329 - Julian) 點之間的引力
      .force('charge', d3.forceManyBody().strength(-1600))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', () => {
        link
          .attr('x1', (_, i) => getStartX(i)) // 起點的 x 座標
          .attr('y1', (_, i) => getStartY(i)) // 起點的 y 座標
          .attr('x2', (_, i) => getCircleCenterX(i)) // 終點的 x 座標
          .attr('y2', (_, i) => getCircleCenterY(i)); // 終點的 y 座標
        // .attr('x1', d => d.source.x)
        // .attr('y1', d => d.source.y)
        // .attr('x2', d => d.target.x)
        // .attr('y2', d => d.target.y);

        node.attr('cx', (_, i) => getCircleCenterX(i)).attr('cy', (_, i) => getCircleCenterY(i));
        //node.attr('cx', d => d.x).attr('cy', d => d.y);

        text.attr('x', (_, i) => getCircleCenterX(i)).attr('y', (_, i) => getCircleCenterY(i) + 20);
        //text.attr('x', d => d.x).attr('y', d => d.y + 20);
      });

    return () => {
      simulation.stop();
    };
  }, [graphData, selectedItems]);

  const isShowGraph = targetAddress ? (
    <div id="container" ref={mapRef} className="h-600px w-1000px"></div>
  ) : null;

  return <>{isShowGraph}</>;
};

export default TrackingView;
