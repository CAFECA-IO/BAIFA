import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {useState, useContext} from 'react';
import {TrackingContext, TrackingType} from '../../contexts/tracking_context';
import {TranslateFunction} from '../../interfaces/locale';
import {HiPlus, HiMinus} from 'react-icons/hi';
import {FiDownload, FiUpload} from 'react-icons/fi';
import {FaRegBookmark} from 'react-icons/fa';
import {IoIosArrowUp} from 'react-icons/io';
import {buttonStyle} from '../../constants/config';
import TrackingView from '../tracking_view/tracking_view';

const TrackingToolPanel = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {targetTrackingType, targetTrackingTypeHandler, visibleAddAddressPanelHandler} =
    useContext(TrackingContext);

  // Info: (20240325 - Julian) 縮放比例
  const [zoomPercentage, setZoomPercentage] = useState(100);
  // Info: (20240325 - Julian) 工具列展開
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);

  const handleZoomIn = () =>
    setZoomPercentage(prev => {
      if (prev >= 200) {
        return 200;
      }
      return prev + 10;
    });

  const handleZoomOut = () =>
    setZoomPercentage(prev => {
      if (prev <= 100) {
        return 100;
      }
      return prev - 10;
    });

  const handleExpandToolbar = () => setIsToolbarExpanded(prev => !prev);

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
      <button className={buttonStyle}>
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
      <button onClick={handleZoomIn} disabled={zoomPercentage >= 200} className={buttonStyle}>
        <HiPlus size={24} />
      </button>
      {/* Info: (20240325 - Julian) Zoom percentage */}
      <p className="w-50px text-center text-base">{zoomPercentage} %</p>
      {/* Info: (20240325 - Julian) Minus button */}
      <button onClick={handleZoomOut} disabled={zoomPercentage <= 100} className={buttonStyle}>
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
      <div className="absolute z-10 flex w-full flex-col items-start gap-10 px-4 py-6 lg:hidden">
        {viewSwitch}
        {viewTools}
      </div>
    </>
  );

  const toolbarList = (
    <div className="grid grid-flow-row grid-cols-2 items-center gap-x-4 gap-y-6 p-2 text-sm lg:grid-flow-col lg:grid-rows-1">
      {/* Info: (20240325 - Julian) Filter button */}
      <button className="group flex w-120px flex-col items-center gap-2">
        <Image
          src="/tracking/filter.svg"
          width={50}
          height={50}
          alt="filter_icon"
          className="relative top-0 transition-all duration-300 ease-out group-hover:-top-4"
        />
        <p>{t('TRACKING_TOOL_PAGE.FILTER')}</p>
      </button>

      {/* Info: (20240325 - Julian) Add Address button */}
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
      <button className="group flex w-120px flex-col items-center gap-2">
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
      <button className="group flex w-120px flex-col items-center gap-2">
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
      <button className="group flex w-120px flex-col items-center gap-2">
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
      <button className="group flex w-120px flex-col items-center gap-2">
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

  return (
    <div className="relative flex h-full min-h-680px w-full flex-col items-center overflow-hidden border border-darkPurple4 bg-darkPurple5 shadow-inner3xl">
      {/* Info: (20240325 - Julian) Tracking Switch */}
      {trackingSwitch}

      {/* Info: (20240325 - Julian) Tracking View */}
      <div className="relative flex h-full w-full items-center justify-center">
        <TrackingView />
      </div>

      {/* Info: (20240325 - Julian) Tracking Toolbar */}
      <div
        className={`absolute bottom-0 w-fit rounded-t-xl bg-darkPurple px-3 py-1 ${
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
