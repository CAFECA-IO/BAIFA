import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {useState, useContext} from 'react';
import * as d3 from 'd3';
import {TrackingContext, TrackingType} from '../../contexts/tracking_context';
import {TranslateFunction} from '../../interfaces/locale';
import {HiPlus, HiMinus} from 'react-icons/hi';
import {FiDownload, FiUpload} from 'react-icons/fi';
import {FaRegBookmark} from 'react-icons/fa';
import {IoIosArrowUp} from 'react-icons/io';
import {STICKY_NOTE_SIZE, buttonStyle} from '../../constants/config';
import TrackingView from '../tracking_view/tracking_view';

const TrackingToolPanel = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    graphRef,
    targetAddress,
    targetTrackingType,
    targetTrackingTypeHandler,
    visibleFilterPanelHandler,
    visibleAddAddressPanelHandler,
    visibleRelationAnalysisPanelHandler,
    zoomScale,
    zoomScaleHandler,
    resetTrackingTool,
  } = useContext(TrackingContext);
  // Info: (20240325 - Julian) 工具列展開
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  // Info: (20240411 - Julian) 縮放
  const handleZoomIn = () => {
    if (zoomScale >= 2) return;
    zoomScaleHandler(zoomScale + 0.1);
  };
  const handleZoomOut = () => {
    if (zoomScale <= 1) return;
    zoomScaleHandler(zoomScale - 0.1);
  };

  const handleExpandToolbar = () => setIsToolbarExpanded(prev => !prev);

  // Info: (20240411 - Julian) 新增便條紙
  function addNote() {
    // Info: (20240411 - Julian) 取得圖表 svg
    const svg = d3.select(graphRef.current).select('svg');
    // Info: (20240411 - Julian) 便條紙拖曳方法
    const noteGroupDrag = d3.drag<SVGGElement, unknown>().on('drag', function (event) {
      d3.select(this).attr(
        'transform',
        // Info: (20240411 - Julian) 讓滑鼠拖曳時的位置在便條紙的中心點
        `translate(${event.x - STICKY_NOTE_SIZE / 2}, ${event.y - STICKY_NOTE_SIZE / 2})`
      );
    });

    // Info: (20240411 - Julian) 創建群組元素，包含便條紙、文字輸入框、刪除按鈕
    const noteGroup = svg
      .append('g')
      .classed('note', true)
      // Info: (20240411 - Julian) 讓便條紙的初始中心點在 (0, 0)
      .attr('transform', `translate(${-STICKY_NOTE_SIZE / 2}, ${-STICKY_NOTE_SIZE / 2})`)
      .call(noteGroupDrag);

    // Info: (20240411 - Julian) 創建便條紙
    const note = noteGroup
      .append('rect')
      .attr('width', STICKY_NOTE_SIZE)
      .attr('height', STICKY_NOTE_SIZE)
      .attr('fill', '#FFE5A6')
      .attr('filter', 'drop-shadow(0 0 5px #000000)'); // Info: (20240411 - Julian) 加上陰影

    // Info: (20240411 - Julian) 創建輸入框
    note.on('click', function () {
      noteGroup
        .append('foreignObject')
        .attr('width', STICKY_NOTE_SIZE - 20)
        .attr('height', 80)
        .attr('x', 10)
        .attr('y', STICKY_NOTE_SIZE / 2 - 40) // Info: (20240411 - Julian) 讓輸入框 y 座標在便條紙的中心點
        .append('xhtml:textarea')
        .style('resize', 'none') // Info: (20240411 - Julian) 禁止 textarea 的 resize
        .style('width', '100%')
        .style('height', '100%')
        .style('border', 'none')
        .style('padding', '5px')
        .style('background-color', 'transparent')
        .style('text-align', 'center')
        .style('font-size', '14px')
        .style('color', '#1F2243');
    });

    // Info: (20240411 - Julian) 創建刪除按鈕
    noteGroup
      .append('image')
      .classed('trash-button', true)
      .attr('xlink:href', '/tracking/trash.svg') // Info: (20240411 - Julian) 使用 svg 圖片
      .attr('x', STICKY_NOTE_SIZE - 30) // Info: (20240411 - Julian) 相對於群組元素的位置
      .attr('y', STICKY_NOTE_SIZE - 30)
      .attr('cursor', 'pointer')
      .attr('width', 24)
      .attr('height', 24)
      .on('click', function () {
        noteGroup.remove();
      });
  }

  // Info: (20240411 - Julian) 輸出圖表 ------------ 施工中：便條紙文字失蹤 ------------
  function exportSvg() {
    // Info: (20240411 - Julian) 檢查是否有圖表
    if (!graphRef.current) return window.alert('No graph found');

    // Info: (20240411 - Julian) 輸出圖檔之前，隱藏垃圾桶圖示
    d3.selectAll('.trash-button').style('display', 'none');
    // Info: (20240411 - Julian) 將 SVG 元素轉換為 SVG 字符串
    const svg = d3.select(graphRef.current).select('svg').node() as Element;
    const svgString = new XMLSerializer().serializeToString(svg);

    // Info: (20240411 - Julian) 創建 Blob 對象
    const blob = new Blob([svgString], {type: 'image/svg+xml'});

    // Info: (20240411 - Julian) 創建 URL 對象
    const url = URL.createObjectURL(blob);

    // Info: (20240411 - Julian) 創建連結元素
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportSVG.svg'; // Info: (20240411 - Julian) 設置下載文件名

    // Info: (20240411 - Julian) 模擬點擊連結元素，觸發下載動作
    link.click();

    // Info: (20240411 - Julian) 釋放 URL 對象
    URL.revokeObjectURL(url);

    // Info: (20240411 - Julian) 下載完成後，顯示垃圾桶圖示
    d3.selectAll('.trash-button').style('display', 'block');
  }

  // Info: (20240411 - Julian) 便條紙顯示開關
  function visibleNoteHandler() {
    // Info: (20240411 - Julian) 取得圖表 svg
    const svg = d3.select(graphRef.current).select('svg');
    // Info: (20240411 - Julian) 選擇所有的便條紙，並加上 hidden class；如果已經有 hidden class，則移除
    svg.selectAll('.note').classed('hidden', function () {
      return !d3.select(this).classed('hidden');
    });
  }

  const displayZoomScale = Math.round(zoomScale * 100);
  const disabledZoomIn = zoomScale >= 2;
  const disabledZoomOut = zoomScale <= 1;

  const switchStyle = `before:absolute before:h-48px before:rounded-full ${
    targetTrackingType === TrackingType.ADDRESS
      ? 'before:left-1 before:w-140px'
      : 'before:left-136px before:w-160px'
  } before:bg-purpleLinear before:transition-all before:duration-300 before:ease-out`;

  // Info: (20240325 - Julian) Input, Output & Notes
  const viewTools = (
    <div className="flex flex-col items-center gap-4 lg:flex-row">
      <p>{t('TRACKING_TOOL_PAGE.VIEW')}</p>
      {/* Info: (20240325 - Julian) Input button */}
      <button className={buttonStyle}>
        <FiDownload size={24} />
      </button>
      {/* Info: (20240325 - Julian) Output button */}
      <button className={buttonStyle}>
        <FiUpload size={24} />
      </button>
      {/* Info: (20240325 - Julian) Notes button */}
      <button className={buttonStyle} onClick={visibleNoteHandler}>
        <FaRegBookmark size={24} />
      </button>
    </div>
  );

  // Info: (20240325 - Julian) Address/Transaction Switch
  const viewSwitch = (
    <div
      className={`relative flex w-300px items-center justify-center rounded-full bg-darkPurple px-1 py-1 text-base font-bold ${switchStyle}`}
    >
      <button
        onClick={targetTrackingTypeHandler}
        className={`z-10 rounded-full px-8 py-3 ${
          targetTrackingType === TrackingType.ADDRESS ? 'text-hoverWhite' : 'text-lilac'
        } transition duration-300 ease-in-out`}
      >
        {t('TRACKING_TOOL_PAGE.ADDRESS')}
      </button>
      <button
        onClick={targetTrackingTypeHandler}
        className={`z-10 rounded-full px-8 py-3 ${
          targetTrackingType === TrackingType.TRANSACTION ? 'text-hoverWhite' : 'text-lilac'
        } transition duration-300 ease-in-out`}
      >
        {t('TRACKING_TOOL_PAGE.TRANSACTION')}
      </button>
    </div>
  );

  // Info: (20240325 - Julian) Zoom
  const viewZoom = (
    <div className="flex items-center space-x-4">
      {/* Info: (20240325 - Julian) Plus button */}
      <button onClick={handleZoomIn} disabled={disabledZoomIn} className={buttonStyle}>
        <HiPlus size={24} />
      </button>
      {/* Info: (20240325 - Julian) Zoom scale */}
      <p className="w-50px text-center text-base">{displayZoomScale} %</p>
      {/* Info: (20240325 - Julian) Minus button */}
      <button onClick={handleZoomOut} disabled={disabledZoomOut} className={buttonStyle}>
        <HiMinus size={24} />
      </button>
    </div>
  );

  const trackingSwitch = (
    <>
      <div className="absolute z-10 hidden w-full items-center justify-between px-10 py-6 lg:flex">
        {viewTools}
        {viewSwitch}
        {viewZoom}
      </div>
      {/* Info: (20240409 - Julian) Mobile view */}
      <div className="absolute left-4 top-4 z-10 block lg:hidden">{viewSwitch}</div>
      <div className="absolute left-4 top-24 z-10 block lg:hidden">{viewTools}</div>
    </>
  );

  const addButton =
    targetTrackingType === TrackingType.ADDRESS ? (
      <button
        onClick={visibleAddAddressPanelHandler}
        className="group flex w-120px flex-col items-center gap-2"
      >
        <Image
          src="/tracking/add_address.svg"
          width={50}
          height={50}
          alt="add_address_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.ADD_ADDRESS')}</p>
      </button>
    ) : (
      <button className="group flex w-120px flex-col items-center gap-2">
        <Image
          src="/tracking/add_address.svg"
          width={50}
          height={50}
          alt="add_transaction_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.ADD_TRANSACTION')}</p>
      </button>
    );

  const toolbarList = (
    <div className="grid grid-flow-row grid-cols-2 items-center gap-x-4 gap-y-6 p-2 text-sm lg:grid-flow-col lg:grid-rows-1">
      {/* Info: (20240325 - Julian) Filter button */}
      <button
        onClick={visibleFilterPanelHandler}
        className="group flex w-120px flex-col items-center gap-2"
      >
        <Image
          src="/tracking/filter.svg"
          width={50}
          height={50}
          alt="filter_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.FILTER')}</p>
      </button>

      {/* Info: (20240325 - Julian) Add Address/Transaction button */}
      {addButton}

      {/* Info: (20240325 - Julian) Find Connection button */}
      <button className="group flex w-120px flex-col items-center gap-2">
        <Image
          src="/tracking/find_connection.svg"
          width={50}
          height={50}
          alt="find_connection_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.FIND_CONNECTION')}</p>
      </button>

      {/* Info: (20240325 - Julian) Relation Analysis button */}
      <button
        onClick={visibleRelationAnalysisPanelHandler}
        className="group flex w-120px flex-col items-center gap-2"
      >
        <Image
          src="/tracking/relation_analysis.svg"
          width={50}
          height={50}
          alt="relation_analysis_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.RELATION_ANALYSIS')}</p>
      </button>

      {/* Info: (20240325 - Julian) Add Note button */}
      <button onClick={addNote} className="group flex w-120px flex-col items-center gap-2">
        <Image
          src="/tracking/add_note.svg"
          width={50}
          height={50}
          alt="add_note_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.ADD_NOTE')}</p>
      </button>

      {/* Info: (20240325 - Julian) Reset button */}
      <button
        onClick={resetTrackingTool}
        className="group flex w-120px flex-col items-center gap-2"
      >
        <Image
          src="/tracking/reset.svg"
          width={50}
          height={50}
          alt="reset_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.RESET')}</p>
      </button>

      {/* Info: (20240325 - Julian) Export Report button */}
      <button onClick={exportSvg} className="group flex w-120px flex-col items-center gap-2">
        <Image
          // ToDo: (20240325 - Julian) Add export report icon
          src="/tracking/add_note.svg"
          width={50}
          height={50}
          alt="export_report_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.EXPORT_REPORT')}</p>
      </button>
    </div>
  );

  const view = targetAddress ? <TrackingView /> : null;

  return (
    <div className="relative flex h-full min-h-680px w-full flex-col items-center overflow-hidden border border-darkPurple4 bg-darkPurple5 shadow-inner3xl">
      {/* Info: (20240325 - Julian) Tracking Switch */}
      {trackingSwitch}

      {/* Info: (20240325 - Julian) Tracking View */}
      <div className="relative flex h-full w-full items-center justify-center">{view}</div>

      {/* Info: (20240325 - Julian) Tracking Toolbar */}
      <div
        className={`absolute bottom-0 z-20 w-fit rounded-t-xl bg-darkPurple px-3 py-1 ${
          isToolbarExpanded ? 'translate-y-0' : 'translate-y-85'
        } transition-all duration-300 ease-out lg:translate-y-0`}
      >
        {/* Info: (20240325 - Julian) Expand button */}
        <button
          onClick={handleExpandToolbar}
          className={`mx-auto block p-4 lg:hidden ${
            isToolbarExpanded ? 'rotate-180' : ''
          } transition-all duration-300 ease-out`}
        >
          <IoIosArrowUp size={24} />
        </button>
        {toolbarList}
      </div>
    </div>
  );
};

export default TrackingToolPanel;
