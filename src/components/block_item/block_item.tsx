import Link from 'next/link';
import Image from 'next/image';
import {getChainIcon, timestampToString} from '../../lib/common';
import {IBlockBrief} from '../../interfaces/block';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {getDynamicUrl} from '../../constants/url';
import {StabilityLevel} from '../../constants/stability_level';
import BoltButton from '../bolt_button/bolt_button';
import {DEFAULT_CHAIN_ICON} from '../../constants/config';

export interface IBlockItemProps {
  block: IBlockBrief;
}

const BlockItem = ({block}: IBlockItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {id, chainId, createdTimestamp, stability, miner, reward, unit} = block;

  const stabilityColor =
    stability === StabilityLevel.LOW
      ? '#FC8181'
      : stability === StabilityLevel.MEDIUM
      ? '#FFA600'
      : '#3DD08C';

  const minerLink = `${getDynamicUrl(chainId, miner).ADDRESS}`;
  const chainIcon = getChainIcon(chainId);

  const createdStr = timestampToString(createdTimestamp);
  // Info: (20230905 - Julian) If month is longer than 3 letters, slice it and add a dot
  const monthStr =
    t(createdStr.month).length > 3 ? `${t(createdStr.month).slice(0, 3)}.` : t(createdStr.month);

  const blockLink = getDynamicUrl(chainId, `${id}`).BLOCK;

  const displayedChainIcon = (
    <>
      <Image
        className="hidden lg:block"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={24}
        height={24}
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
      />
      <Image
        className="block lg:hidden"
        src={chainIcon.src}
        alt={chainIcon.alt}
        width={16}
        height={16}
        onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
      />
    </>
  );

  return (
    <div className="flex h-60px w-full items-center">
      {/* Info: (20230907 - Julian) Create Time square */}
      <div className="flex w-60px flex-col items-center justify-center border-b border-darkPurple bg-darkPurple">
        <p className="text-xl">{createdStr.day}</p>
        <p className="text-xs">{monthStr}</p>
        <p className="text-xs text-lilac">{createdStr.time}</p>
      </div>
      <div className="flex h-full flex-1 items-center space-x-4 border-b border-darkPurple4 pl-2 lg:pl-8">
        {/* Info: (20230907 - Julian) Block ID */}
        <Link
          href={blockLink}
          className="inline-flex flex-1 items-baseline space-x-2 text-primaryBlue"
        >
          <h2
            title={id}
            className="w-100px grow overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:w-400px lg:text-xl"
          >
            <span className=" text-hoverWhite">{t('CHAIN_DETAIL_PAGE.BLOCKS_TAB')}</span> {id}
          </h2>
        </Link>
        {/* Info: (20240318 - Julian) Miner & Reward */}
        <div className="flex flex-col items-center space-y-1 lg:flex-row lg:space-x-2 lg:space-y-0">
          {/* Info: (20230912 - Julian) Miner */}
          <Link href={minerLink} title={miner}>
            <BoltButton
              className="w-100px overflow-hidden text-ellipsis px-3 py-1 text-xs lg:w-150px lg:text-sm"
              color="blue"
              style="solid"
            >
              {miner}
            </BoltButton>
          </Link>
          {/* Info: (20230912 - Julian) Reward */}
          <div className="flex items-center space-x-2 text-xs lg:text-sm">
            <p>+</p>
            {displayedChainIcon}
            <p className="whitespace-nowrap">
              {reward}
              <span> {unit}</span>
            </p>
          </div>
        </div>
        {/* Info: (20230907 - Julian) Stability */}
        <div className="hidden items-center space-x-2 whitespace-nowrap lg:flex">
          <p className="text-xs lg:text-sm">{t('CHAIN_DETAIL_PAGE.STABILITY')} :</p>
          {/* Info: (20230907 - Julian) The circle svg */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <circle cx="7.5" cy="8.48853" r="7.5" fill={stabilityColor} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BlockItem;
