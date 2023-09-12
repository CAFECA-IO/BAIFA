import {useState, useEffect} from 'react';
import Image from 'next/image';
import BoltButton from '../bolt_button/bolt_button';
import {timestampToString, getTimeString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlockData} from '../../interfaces/block_data';

interface IBlockDetailProps {
  blockData: IBlockData;
}

const BlockDetail = (blockData: IBlockDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {stabilityLevel, createdTimestamp, managementTeam, transactions, miner, reward, size} =
    blockData.blockData;
  const [sinceTime, setSinceTime] = useState(0);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      // Info: (20230912 - Julian) 算出 createdTimestamp 距離現在過了多少時間
      const now = Math.ceil(Date.now() / 1000);
      const timeSpan = now - createdTimestamp;
      setSinceTime(timeSpan);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sinceTime]);

  const displayStability =
    stabilityLevel === 'HIGH' ? (
      <div className="flex items-center text-hoverWhite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill="#3DD08C" />
        </svg>
        <p className="ml-2">{t('BLOCK_DETAIL_PAGE.STABILITY_HIGH')}</p>
      </div>
    ) : stabilityLevel === 'MEDIUM' ? (
      <div className="flex items-center text-hoverWhite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill="#FFA600" />
        </svg>
        <p className="ml-2">{t('BLOCK_DETAIL_PAGE.STABILITY_MEDIUM')}</p>
      </div>
    ) : (
      <div className="flex items-center text-hoverWhite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
        >
          <circle cx="7.5" cy="8.48853" r="7.5" fill="#FC8181" />
        </svg>
        <p className="ml-2">{t('BLOCK_DETAIL_PAGE.STABILITY_LOW')}</p>
      </div>
    );

  const displayTime = (
    <div className="flex items-center space-x-3">
      <p>{timestampToString(createdTimestamp).date}</p>
      <p>{timestampToString(createdTimestamp).time}</p>
      <p>
        {getTimeString(sinceTime)} {t('COMMON.AGO')}
      </p>
    </div>
  );

  const displayTeam = managementTeam.map((team, index) => {
    return (
      <BoltButton className="px-3 py-1" color="blue" style="solid" key={index}>
        {team}
      </BoltButton>
    );
  });

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230912 - Julian) Stability Level */}
      <div className="flex items-center px-3 py-4">
        <p className="w-190px font-bold text-lilac">{t('BLOCK_DETAIL_PAGE.STABILITY')}</p>
        {displayStability}
      </div>
      {/* Info: (20230912 - Julian) Created Time */}
      <div className="flex items-center px-3 py-4">
        <p className="w-190px font-bold text-lilac">{t('BLOCK_DETAIL_PAGE.TIME')}</p>
        {displayTime}
      </div>
      {/* Info: (20230912 - Julian) Management Team */}
      <div className="flex items-center px-3 py-4">
        <p className="w-190px font-bold text-lilac">{t('BLOCK_DETAIL_PAGE.MANAGEMENT')}</p>
        <div className="flex items-center space-x-2">{displayTeam}</div>
      </div>
      {/* Info: (20230912 - Julian) Content */}
      <div className="flex items-center px-3 py-4">
        <p className="w-190px font-bold text-lilac">{t('BLOCK_DETAIL_PAGE.CONTENT')}</p>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          10 transactions
        </BoltButton>
      </div>
    </div>
  );
};

export default BlockDetail;
