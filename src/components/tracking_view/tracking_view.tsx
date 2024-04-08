import {useContext, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {TrackingContext} from '../../contexts/tracking_context';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {HttpMethod} from '../../constants/api_request';
import {truncateText} from '../../lib/common';

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

  const {data: interactionAddresses, isLoading} = useAPIResponse<string[]>(
    `/api/v1/app/tracking_tool/interaction_list`,
    {method: HttpMethod.GET},
    {
      address_id: targetAddress,
      blockchains: blockchainQueryStr,
      currencies: currencyQueryStr,
      start_date: filterDatePeriod.startTimeStamp === 0 ? '' : filterDatePeriod.startTimeStamp,
      end_date: filterDatePeriod.endTimeStamp === 0 ? '' : filterDatePeriod.endTimeStamp,
    }
  );

  const interactions = interactionAddresses ?? [];

  interface INode {
    id: string;
    group: string;
  }
  interface ILink {
    source: string;
    target: string;
  }

  // Info: (20240327 - Julian) Dummy data
  const data: {
    nodes: INode[];
    links: ILink[];
  } = {
    nodes: [
      {id: targetAddress, group: 'target'},
      ...interactions.map(address => {
        return {id: address, group: 'interactions'};
      }),
    ],
    links: [
      {source: targetAddress, target: targetAddress},
      ...interactions.map(address => {
        return {source: address, target: targetAddress};
      }),
    ],
  };

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links = data.links.map(Object.create);
    const nodes = data.nodes.map(Object.create);

    // Info: (20240327 - Julian) 圖表的直徑
    const DIAMETER_OF_MAP = 200;

    // Info: (20240329 - Julian) 點的半徑會隨著點的數量變動
    const nodeRadius = 500 / nodes.length > 64 ? 64 : 500 / nodes.length; // Info: (20240329 - Julian) 點的半徑最大為 64
    const strokeWidth = 100 / nodes.length > 10 ? 10 : 100 / nodes.length; // Info: (20240329 - Julian) 輪廓的寬度最大為 10

    // Info: (20240329 - Julian) 計算圓心的 x 座標
    const getCircleCenterX = (i: number) => {
      // i = 0 代表 target address，也就是圓心，所以直接回傳 0
      // 其他的 i 代表 interactions，以 360 度平均分配，順時針排列
      return i === 0
        ? 0
        : DIAMETER_OF_MAP * Math.cos(((i - 1) * (2 * Math.PI)) / (nodes.length - 1));
    };

    // Info: (20240329 - Julian) 計算圓心的 y 座標
    const getCircleCenterY = (i: number) => {
      // i = 0 代表 target address，也就是圓心，所以直接回傳 0
      // 其他的 i 代表 interactions，以 360 度平均分配，順時針排列
      return i === 0
        ? 0
        : DIAMETER_OF_MAP * Math.sin(((i - 1) * (2 * Math.PI)) / (nodes.length - 1));
    };

    // Info: (20240329 - Julian) 點之間的引力
    const forceStrength = nodes.length * -1000;

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
      .attr('class', d => (d.group === 'target' ? 'target' : 'interactions')) // Info: (20240329 - Julian) 賦予 target address 和 interactions 不同的 class
      .attr('stroke-width', strokeWidth)
      .attr('r', nodeRadius)
      .attr('fill', function (d) {
        // Info: (20240403 - Julian) 如果沒有被選到，則顯示黑色
        if (d.id !== selectedItems[0] && d.id !== selectedItems[1]) return '#161830';
        // Info: (20240403 - Julian) 根據 class 來決定顏色
        return d3.select(this).classed('target')
          ? 'url(#bluePurpleLinear)'
          : 'url(#redOrangeLinear)';
      })
      .style('stroke', function () {
        // Info: (20240329 - Julian) 根據 class 來決定顏色
        return d3.select(this).classed('target')
          ? 'url(#bluePurpleLinear)'
          : 'url(#redOrangeLinear)';
      })
      // Info: (20240403 - Julian) 點擊時觸發事件
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

    const simulation = d3
      .forceSimulation(nodes)
      // Info: (20240329 - Julian) 連結的引力
      .force(
        'link',
        d3.forceLink(data.links).id((d: any) => d.id)
      )
      // Info: (20240329 - Julian) alphaTarget 代表模擬的 alpha 值，alpha 值越高，模擬的速度越快
      .alphaTarget(0.3)
      // Info: (20240329 - Julian) 點之間的引力
      .force('charge', d3.forceManyBody().strength(forceStrength))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', () => {
        link
          .attr('x1', () => 0) // x1 起點 = 圓心的 x 座標 = 0
          .attr('y1', () => 0) // y1 起點 = 圓心的 y 座標 = 0
          .attr('x2', (_, i) => getCircleCenterX(i)) // x2 終點 = interactions 的 x 座標
          .attr('y2', (_, i) => getCircleCenterY(i)); // y2 終點 = interactions 的 y 座標

        node.attr('cx', (_, i) => getCircleCenterX(i)).attr('cy', (_, i) => getCircleCenterY(i));

        text.attr('x', (_, i) => getCircleCenterX(i)).attr('y', (_, i) => getCircleCenterY(i) + 20);
      });

    return () => {
      simulation.stop();
    };
  }, [targetAddress, isLoading, selectedItems]);

  const isShowGraph =
    targetAddress && !isLoading ? (
      <div id="container" ref={mapRef} className="h-600px w-1000px"></div>
    ) : null;

  return <>{isShowGraph}</>;
};

export default TrackingView;
