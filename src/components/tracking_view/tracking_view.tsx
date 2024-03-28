import {useContext, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {TrackingContext} from '../../contexts/tracking_context';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {HttpMethod} from '../../constants/api_request';
import {truncateText} from '../../lib/common';

const TrackingView = () => {
  const {targetAddress} = useContext(TrackingContext);

  // ToDo: (20240327 - Julian) Should get IAddressBrief
  const {data: interactionAddresses, isLoading} = useAPIResponse<string[]>(
    `/api/v1/app/tracking_tool/interaction_list`,
    {method: HttpMethod.GET},
    {address_id: targetAddress}
  );

  const interactions = interactionAddresses ?? [];

  // Info: (20240327 - Julian) Dummy data
  const data = {
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* 
  function runForceGraph(container: HTMLDivElement) {
    const links = data.links.map(Object.create);
    const nodes = data.nodes.map(Object.create);

    const containerRect = container.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

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
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 3);

    // Info: (20240328 - Julian) 點
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', (d: any) => (d.group === 'target' ? 'target' : 'interactions'));

    node
      .attr('stroke', 'url(#redOrangeLinear)')
      .attr('stroke-width', 10)
      .attr('r', 50)
      .attr('fill', '#161830');

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
      .text(d => truncateText(d.id, 10));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id)
      )
      .alphaTarget(0.3)
      //.velocityDecay(0.1)
      .force('charge', d3.forceManyBody().strength(-5000))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', () => {
        //update link positions
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        // update node positions
        node.attr('cx', d => d.x).attr('cy', d => d.y);

        // update label positions
        text.attr('x', d => d.x).attr('y', d => d.y);
      });

    return {
      destroy: () => {
        simulation.stop();
      },
      nodes: () => {
        return svg.node();
      },
    };
  }

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyFn;
    if (contentRef.current) {
      const {destroy} = runForceGraph(contentRef.current);
      destroyFn = destroy;
    }

    return destroyFn;
  }, [data]); */

  const width = 1000;
  const height = 600;

  //const links = data.links.map(Object.create);
  const nodes = data.nodes.map(Object.create);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');

    if (!context) return;

    function ticked() {
      context!.clearRect(0, 0, width, height);

      context!.save();
      context!.translate(width / 2, height / 2);

      // Info: (20240328 - Julian) 點
      nodes.forEach(d => {
        context!.beginPath();
        context!.arc(d.x, d.y, 64, 0, 9 * Math.PI);
        context!.fillStyle = color(d.group);
        context!.fill();
      });

      // Info: (20240328 - Julian) 文字
      nodes.forEach(d => {
        context!.fillStyle = '#F0F0F0';
        context!.font = '16px inter';
        context!.fillText(truncateText(d.id, 10), d.x - 45, d.y + 20, 90);
      });

      context!.restore();
    }

    d3.forceSimulation(nodes)
      .alphaTarget(0.3)
      .velocityDecay(0.1)
      .force('x', d3.forceX().strength(0.01))
      .force('y', d3.forceY().strength(0.01))
      .force('collide', d3.forceCollide().radius(5).iterations(2))
      .force('charge', d3.forceManyBody().strength(-80))
      .on('tick', ticked);
  }, [isLoading, targetAddress]);

  const isShowGraph =
    targetAddress && !isLoading ? (
      <canvas id="container" ref={canvasRef} width={width} height={height}></canvas>
    ) : /* <div ref={contentRef} className="h-full min-h-600px w-full"></div>*/
    null;

  return <>{isShowGraph}</>;
};

export default TrackingView;
