import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import {timestampToString, getTimeString, getChainIcon} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IBlock} from '../../interfaces/block';
import {BFAURL} from '../../constants/url';

interface IBlockDetailProps {
  blockData: IBlock;
}

const BlockDetail = (blockData: IBlockDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    id: blockId,
    stabilityLevel,
    createdTimestamp,
    chainId,
    managementTeam,
    transactions,
    miner,
    reward,
    size,
  } = blockData.blockData;
  const [sinceTime, setSinceTime] = useState(0);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    // Info: (20230912 - Julian) 算出 createdTimestamp 距離現在過了多少時間
    const now = Math.ceil(Date.now() / 1000);
    const timeSpan = now - createdTimestamp;
    setSinceTime(timeSpan);

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
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
      <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
      <p className="mr-2">
        {getTimeString(sinceTime)} {t('COMMON.AGO')}
      </p>
    </div>
  );

  const displayTeam = managementTeam.map((team, index) => {
    return (
      <Link href={BFAURL.COMING_SOON}>
        <BoltButton className="px-3 py-1" color="blue" style="solid" key={index}>
          {team}
        </BoltButton>
      </Link>
    );
  });

  const displayMinerAndReward = (
    <div className="flex items-center space-x-3">
      {/* Info: (20230912 - Julian) Miner */}
      <Link href={BFAURL.COMING_SOON}>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {miner}
        </BoltButton>
      </Link>
      <p>+</p>
      {/* Info: (20230912 - Julian) Reward */}
      <div className="flex items-center space-x-2">
        <Image
          src={getChainIcon(chainId).src}
          alt={getChainIcon(chainId).alt}
          width={24}
          height={24}
        />
        <p>
          {reward} {/* ToDo:(20230912 - Julian) unit */}
          <span> {chainId}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230912 - Julian) Stability Level */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.STABILITY')}
        </p>
        {displayStability}
      </div>
      {/* Info: (20230912 - Julian) Created Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.TIME')}
        </p>
        {displayTime}
      </div>
      {/* Info: (20230912 - Julian) Management Team */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.MANAGEMENT')}
        </p>
        <div className="flex flex-wrap items-center space-x-3">{displayTeam}</div>
      </div>
      {/* Info: (20230912 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.CONTENT')}
        </p>
        <Link href={`${BFAURL.TRANSACTION_LIST}/${blockId}`}>
          <BoltButton className="px-3 py-1" color="blue" style="solid">
            {transactions.length} {t('BLOCK_DETAIL_PAGE.TRANSACTIONS_COUNT')}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20230912 - Julian) Miner & Reward */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.MINER_REWARD')}
        </p>
        {displayMinerAndReward}
      </div>
      {/* Info: (20230912 - Julian) Size */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-190px lg:text-base">
          {t('BLOCK_DETAIL_PAGE.SIZE')}
        </p>
        <p>
          {size} {/* ToDo: (20230912 - Julian) uint */}
          <span> gb</span>
        </p>
      </div>
    </div>
  );
};

export default BlockDetail;
