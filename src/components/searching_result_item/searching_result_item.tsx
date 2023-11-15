import Link from 'next/link';
import Image from 'next/image';
import Tooltip from '../../components/tooltip/tooltip';
import {SearchType} from '../../constants/search_type';
import {getChainIcon, timestampToString} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import {ISearchResult} from '../../interfaces/search_result';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IAddress} from '../../interfaces/address';
import {IBlock} from '../../interfaces/block';
import {StabilityLevel} from '../../constants/stability_level';
import {IContract} from '../../interfaces/contract';
import {IEvidence} from '../../interfaces/evidence';
import {ITransaction} from '../../interfaces/transaction';
import {IRedFlag} from '../../interfaces/red_flag';

interface ISearchingResultItemProps {
  searchResult: ISearchResult;
}

const SearchingResultItem = ({searchResult}: ISearchingResultItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {type, data} = searchResult;

  const dynamicUrl = getDynamicUrl(data.chainId, data.id);
  const chainIcon = getChainIcon(data.chainId);

  // Info: (20231115 - Julian) 第一行要放的資料內容
  const getContent = () => {
    const {createdTimestamp} = data;
    const displayedTime = (
      <div className="flex flex-wrap items-center">
        <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
        <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
      </div>
    );

    switch (type) {
      // Info: (20231115 - Julian) ----------------- BLOCK -----------------
      case SearchType.BLOCK:
        const {stabilityLevel} = data as IBlock;

        const blockStability =
          stabilityLevel === StabilityLevel.HIGH ? (
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
          ) : stabilityLevel === StabilityLevel.MEDIUM ? (
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

        return {
          LINE_1: blockStability,
          LINE_2: displayedTime,
          LINK: dynamicUrl.BLOCK,
        };
      // Info: (20231115 - Julian) ----------------- ADDRESS -----------------
      case SearchType.ADDRESS:
        const {addressHash, flagging, riskLevel} = data as IAddress;

        const riskColor =
          riskLevel === RiskLevel.HIGH_RISK
            ? '#FC8181'
            : riskLevel === RiskLevel.MEDIUM_RISK
            ? '#FFA600'
            : '#3DD08C';
        const riskText =
          riskLevel === RiskLevel.HIGH_RISK
            ? t('COMMON.RISK_HIGH')
            : riskLevel === RiskLevel.MEDIUM_RISK
            ? t('COMMON.RISK_MEDIUM')
            : t('COMMON.RISK_LOW');

        const addressFlagging = (
          <div className="flex items-center space-x-4">
            {/* Info: (20231017 - Julian) Flagging */}
            <div className="flex items-center whitespace-nowrap">
              <span className="mr-2 text-primaryBlue">{flagging.length}</span> {t('COMMON.TIMES')}
            </div>
            {/* Info: (20231017 - Julian) Risk */}
            <div className="flex items-center space-x-2 px-2">
              {/* Info: (20231017 - Julian) The circle svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
              >
                <circle cx="7.5" cy="8.48853" r="7.5" fill={riskColor} />
              </svg>
              <p className="text-sm">{riskText}</p>
            </div>
          </div>
        );

        return {
          LINE_1: <p className="text-base">{addressHash}</p>,
          LINE_2: addressFlagging,
          LINK: dynamicUrl.ADDRESS,
        };
      // Info: (20231115 - Julian) ----------------- CONTRACT -----------------
      case SearchType.CONTRACT:
        const {contractAddess} = data as IContract;
        return {
          LINE_1: <p className="text-base">{contractAddess}</p>,
          LINE_2: displayedTime,
          LINK: dynamicUrl.CONTRACT,
        };
      // Info: (20231115 - Julian) ----------------- EVIDENCE -----------------
      case SearchType.EVIDENCE:
        const {evidenceAddess} = data as IEvidence;
        return {
          LINE_1: <p className="text-base">{evidenceAddess}</p>,
          LINE_2: displayedTime,
          LINK: dynamicUrl.EVIDENCE,
        };
      // Info: (20231115 - Julian) ----------------- TRANSACTION -----------------
      case SearchType.TRANSACTION:
        const {hash} = data as ITransaction;
        return {
          LINE_1: <p className="text-base">{hash}</p>,
          LINE_2: displayedTime,
          LINK: dynamicUrl.TRANSACTION,
        };
      // Info: (20231115 - Julian) ----------------- RED FLAG -----------------
      case SearchType.RED_FLAG:
        const {addressHash: redFlagAddressHash, redFlagType} = data as IRedFlag;
        const displayedRedFlagType = (
          <div className="flex items-center gap-2">
            <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
            <p>{t(redFlagType)}</p>
          </div>
        );

        return {
          LINE_1: <p className="text-base">{redFlagAddressHash}</p>,
          LINE_2: displayedRedFlagType,
          LINK: dynamicUrl.RED_FLAG,
        };
      // Info: (20231115 - Julian) ----------------- BLACK LIST -----------------
      case SearchType.BLACK_LIST:
        const {addressHash: blackListAddressHash, publicTag} = data as IAddress;
        const displayedPublicTag = (
          <div className="whitespace-nowrap rounded-lg border-violet bg-violet px-3 py-2 text-sm text-hoverWhite">
            {t(publicTag[0])}
          </div>
        );
        return {
          LINE_1: <p className="text-base">{blackListAddressHash}</p>,
          LINE_2: displayedPublicTag,
          LINK: dynamicUrl.ADDRESS,
        };
      default:
        return {
          LINE_1: <></>,
          LINE_2: <></>,
          LINK: '/',
        };
    }
  };

  const displayedId = (
    <div className="flex flex-1 items-center space-x-4">
      <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
      <h2 className="text-xl font-semibold">
        {t(`SEARCHING_RESULT_PAGE.ITEM_TITLE_${type}`)}
        <span className="ml-2 text-primaryBlue">{data.id}</span>
      </h2>
    </div>
  );

  const displayedSubtitle = (
    <div className="flex items-center space-x-2 text-sm">
      <Image
        src={`/icons/${type.toLocaleLowerCase()}_icon.svg`}
        alt="address_icon"
        width={20}
        height={20}
      />
      <p>{t(`SEARCHING_RESULT_PAGE.ITEM_SUBTITLE_${type}`)}</p>
    </div>
  );

  const displayedLine1 = getContent().LINE_1;
  const displayedLine2 = getContent().LINE_2;
  const link = getContent().LINK;

  return (
    <div className="">
      <Link href={link}>
        {/* Info: (20231115 - Julian) Link */}
        <div className="rounded-lg bg-darkPurple p-8 shadow-xl transition-all duration-300 ease-in-out hover:bg-purpleLinear">
          {/* Info: (20231115 - Julian) Title */}
          <div className="flex w-4/5 items-center">
            {/* Info: (20231115 - Julian) ID */}
            {displayedId}
            {/* Info: (20231115 - Julian) SubTitle */}
            {displayedSubtitle}
          </div>

          {/* Info: (20231115 - Julian) Content */}
          <div className="flex flex-col items-center px-12">
            {/* Info: (20231115 - Julian) Line 1 */}
            <div className="flex w-full items-center border-b border-darkPurple4 py-5">
              <div className="flex w-200px items-center space-x-2">
                <p className="text-base font-bold text-lilac">
                  {t(`SEARCHING_RESULT_PAGE.ITEM_LINE_1_${type}`)}
                </p>
                <Tooltip>
                  This is tooltip Sample Text. So if I type in more content, it would be like this.
                </Tooltip>
              </div>
              {/* Info: (20231115 - Julian) Line 1 Content */}
              {displayedLine1}
            </div>
            {/* Info: (20231115 - Julian) Line 2 */}
            <div className="flex w-full items-center border-b border-darkPurple4 py-5">
              <div className="flex w-200px items-center space-x-2">
                <p className="text-base font-bold text-lilac">
                  {t(`SEARCHING_RESULT_PAGE.ITEM_LINE_2_${type}`)}
                </p>
                <Tooltip>
                  This is tooltip Sample Text. So if I type in more content, it would be like this.
                </Tooltip>
              </div>
              {/* Info: (20231115 - Julian) Line 2 Content */}
              {displayedLine2}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchingResultItem;
