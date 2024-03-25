import {useTranslation} from 'next-i18next';
import {useState} from 'react';
import {TranslateFunction} from '../../interfaces/locale';
import {HiPlus, HiMinus} from 'react-icons/hi';
import {FiDownload, FiUpload} from 'react-icons/fi';
import {FaRegBookmark} from 'react-icons/fa';

enum TrackingType {
  ADDRESS = 'address',
  TRANSACTION = 'transaction',
}

const TrackingToolPanel = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // Info: (20240325 - Julian) 顯示切換
  const [targetTrackingType, setTargetTrackingType] = useState(TrackingType.ADDRESS);
  // Info: (20240325 - Julian) 縮放比例
  const [zoomPercentage, setZoomPercentage] = useState(100);

  const handleSwitchToAddress = () => setTargetTrackingType(TrackingType.ADDRESS);
  const handleSwitchToTransaction = () => setTargetTrackingType(TrackingType.TRANSACTION);

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
      <button className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75">
        <FiDownload size={24} />
      </button>
      {/* Info: (20240325 - Julian) Output button */}
      <button className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75">
        <FiUpload size={24} />
      </button>
      {/* Info: (20240325 - Julian) Notes button */}
      <button className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75">
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
        onClick={handleSwitchToAddress}
        className={`z-10 rounded-full px-8 py-3 ${
          targetTrackingType === TrackingType.ADDRESS ? 'text-hoverWhite' : 'text-lilac'
        } transition duration-300 ease-in-out`}
      >
        {t('TRACKING_TOOL_PAGE.ADDRESS')}
      </button>
      <button
        onClick={handleSwitchToTransaction}
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
      <button
        onClick={handleZoomIn}
        disabled={zoomPercentage >= 200}
        className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75 disabled:opacity-50"
      >
        <HiPlus size={24} />
      </button>
      {/* Info: (20240325 - Julian) Zoom percentage */}
      <p className="w-50px text-center text-base">{zoomPercentage} %</p>
      {/* Info: (20240325 - Julian) Minus button */}
      <button
        onClick={handleZoomOut}
        disabled={zoomPercentage <= 100}
        className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75 disabled:opacity-50"
      >
        <HiMinus size={24} />
      </button>
    </div>
  );

  const trackingSwitch = (
    <>
      <div className="absolute hidden w-full items-center justify-between px-10 py-6 lg:flex">
        {viewTools}
        {viewSwitch}
        {viewZoom}
      </div>
      <div className="absolute flex w-full flex-col items-start gap-10 px-4 py-6 lg:hidden">
        {viewSwitch}
        {viewTools}
      </div>
    </>
  );

  return (
    <div className="relative flex h-full min-h-680px w-full flex-col items-center border border-darkPurple4 bg-darkPurple5 shadow-inner3xl">
      {/* Info: (20240325 - Julian) Tracking Switch */}
      {trackingSwitch}
    </div>
  );
};

export default TrackingToolPanel;
