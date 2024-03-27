import Image from 'next/image';
import {useContext, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {TrackingContext} from '../../contexts/tracking_context';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {HttpMethod} from '../../constants/api_request';
import {IInteractionList} from '../../interfaces/interaction_item';

const TrackingView = () => {
  const {targetAddress} = useContext(TrackingContext);

  // ToDo: (20240327 - Julian) Should get IAddressBrief
  const {data: interactionAddresses, isLoading} = useAPIResponse<IInteractionList>(
    `/api/v1/app/chains/8017/addresses/${targetAddress}/interactions`,
    {method: HttpMethod.GET}
  );

  const interactions = interactionAddresses?.interactedData ?? [];

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

  const width = 1000;
  const height = 600;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  //const links = data.links.map(Object.create);
  const nodes = data.nodes.map(Object.create);

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');

    if (!context) return;

    function ticked() {
      context!.clearRect(0, 0, width, height);

      context!.save();
      context!.translate(width / 2, height / 2);

      nodes.forEach(d => {
        context!.beginPath();
        context!.arc(d.x, d.y, 48, 0, 9 * Math.PI);
        context!.fillStyle = color(d.group);
        context!.fill();
      });

      context!.restore();
    }

    const simulation = d3
      .forceSimulation(nodes)
      .alphaTarget(0.3)
      .velocityDecay(0.1)
      .force('x', d3.forceX().strength(0.01))
      .force('y', d3.forceY().strength(0.01))
      //.force('collide', d3.forceCollide().radius(5).iterations(2))
      .force('charge', d3.forceManyBody().strength(-80))
      .on('tick', ticked);
  }, [isLoading, targetAddress]);

  //   const showGraph = targetAddress ? (
  //     <div className="flex h-100px w-100px flex-col items-center justify-center gap-2 rounded-full border-4 border-primaryBlue">
  //       <Image src="/icons/address_icon.svg" width={24} height={24} alt="address_icon" />
  //       <p className="text-xs">{truncateText(targetAddress, 10)}</p>
  //     </div>
  //   ) : null;

  // var svg = d3.select('svg');

  //   [
  //     {height: 100, width: 100},
  //     {height: 200, width: 200},
  //     {height: 300, width: 300},
  //   ];

  // svg.append('rect').attr('width', 100).attr('height', 100).style('fill', 'red');

  //   useEffect(() => {
  //     d3.select('#content') // 選擇 id 為 content 的元素
  //       .selectAll('div') // 選擇所有 div 元素
  //       .data([4, 8, 15, 16, 23, 42]) // 綁定資料
  //       .enter() // 進入選取的元素
  //       .append('div') // 新增 div 元素
  //       .text((d, i) => i); // 設定文字
  //   }, []);

  const isShowGraph =
    targetAddress && !isLoading ? (
      <div className="relative my-auto flex h-full w-full items-center justify-center">
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      </div>
    ) : null;

  return <>{isShowGraph}</>;
};

export default TrackingView;
