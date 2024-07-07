import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import BoltButton from '@/components/bolt_button/bolt_button';
import Tooltip from '@/components/tooltip/tooltip';
import Skeleton from '@/components/skeleton/skeleton';
import {timestampToString, getTimeString, truncateText, getChainIcon} from '@/lib/common';
import {TranslateFunction} from '@/interfaces/locale';
import {getDynamicUrl} from '@/constants/url';
import {StabilityLevel} from '@/constants/stability_level';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '@/constants/config';
import {IBlockDetail} from '@/interfaces/block';

interface IBlockDetailProps {
  blockData: IBlockDetail;
  isLoading: boolean;
}

const BlockDetail = ({blockData, isLoading}: IBlockDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    id: blockId,
    stability,
    createdTimestamp,
    chainId,
    transactionCount,
    miner,
    reward,
    unit,
    size,
    extraData,
  } = blockData;

  const [sinceTime, setSinceTime] = useState(0);
  const now = Math.ceil(Date.now() / 1000);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    // Info: (20230912 - Julian) 算出 createdTimestamp 距離現在過了多少時間
    const timeSpan = now - createdTimestamp;
    setSinceTime(timeSpan);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const chainIcon = getChainIcon(chainId);
  const transactionsLink = `${getDynamicUrl(chainId, blockId).TRANSACTIONS_IN_BLOCK}`;
  const minerLink = `${getDynamicUrl(chainId, miner).ADDRESS}`;

  const stabilityLayout =
    stability === StabilityLevel.HIGH ? (
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
    ) : stability === StabilityLevel.MEDIUM ? (
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

  const displayStability = !isLoading ? (
    stabilityLayout
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-1">
      <Skeleton height={24} width={24} rounded />
      <Skeleton height={24} width={80} />
    </div>
  );

  const displayTime = !isLoading ? (
    <div className="flex flex-wrap items-center">
      <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
      <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
      <p className="mr-2">
        {getTimeString(sinceTime)} {t('COMMON.AGO')}
      </p>
    </div>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-3">
      <Skeleton height={24} width={80} />
      <Skeleton height={24} width={80} />
    </div>
  );

  const displayContent = !isLoading ? (
    typeof transactionCount === 'number' ? (
      <Link href={transactionsLink}>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {transactionCount} {t('COMMON.TRANSACTIONS')}
        </BoltButton>
      </Link>
    ) : null
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <Skeleton height={24} width={150} />
  );

  const displayMinerAndReward = !isLoading ? (
    <div className="flex flex-wrap items-center gap-3">
      {/* Info: (20230912 - Julian) Miner */}
      <Link href={minerLink} title={miner}>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {truncateText(miner, DEFAULT_TRUNCATE_LENGTH)}
        </BoltButton>
      </Link>
      <p>+</p>
      {/* Info: (20230912 - Julian) Reward */}
      <div className="flex items-center space-x-2">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={24}
          height={24}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <p>
          {reward}
          <span> {unit}</span>
        </p>
      </div>
    </div>
  ) : (
    // Info: (20240206 - Julian) Loading Animation
    <div className="flex items-center space-x-3">
      <Skeleton height={24} width={80} />
      <Skeleton height={24} width={70} />
    </div>
  );

  const extraDataText = extraData ? (
    <p>{extraData}</p>
  ) : (
    // Info: (20231213 - Julian) If there is no management team
    <p>{t('COMMON.NONE')}</p>
  );
  const displayExtraData = !isLoading ? extraDataText : <Skeleton height={24} width={80} />;

  const displaySize = !isLoading ? (
    <p>
      {size}
      <span> bytes</span>
    </p>
  ) : (
    <Skeleton height={24} width={80} />
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230912 - Julian) Stability Level */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.STABILITY')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.STABILITY_TOOLTIP')}</Tooltip>
        </div>
        {displayStability}
      </div>
      {/* Info: (20230912 - Julian) Created Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.TIME')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.TIME_TOOLTIP')}</Tooltip>
        </div>
        {displayTime}
      </div>
      {/* Info: (20230912 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.CONTENT_TOOLTIP')}</Tooltip>
        </div>
        {displayContent}
      </div>
      {/* Info: (20230912 - Julian) Miner & Reward */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.MINER_REWARD')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.MINER_REWARD_TOOLTIP')}</Tooltip>
        </div>
        {displayMinerAndReward}
      </div>
      {/* Info: (20240205 - Julian) Extra Data */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.EXTRA_DATA')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.EXTRA_DATA_TOOLTIP')}</Tooltip>
        </div>
        <div className="flex items-center">{displayExtraData}</div>
      </div>
      {/* Info: (20230912 - Julian) Size */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('BLOCK_DETAIL_PAGE.SIZE')}</p>
          <Tooltip>{t('BLOCK_DETAIL_PAGE.SIZE_TOOLTIP')}</Tooltip>
        </div>
        {displaySize}
      </div>
    </div>
  );
};

export default BlockDetail;
