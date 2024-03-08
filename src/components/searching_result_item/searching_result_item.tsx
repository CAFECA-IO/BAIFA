import Link from 'next/link';
import Image from 'next/image';
import Tooltip from '../../components/tooltip/tooltip';
import {SearchType} from '../../constants/search_type';
import {getChainIcon, timestampToString, truncateText} from '../../lib/common';
import {getDynamicUrl} from '../../constants/url';
import {RiskLevel} from '../../constants/risk_level';
import {ISearchResult} from '../../interfaces/search_result';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IAddress} from '../../interfaces/address';
import {IBlock} from '../../interfaces/block';
import {IBlackList} from '../../interfaces/blacklist';
import {StabilityLevel} from '../../constants/stability_level';
import {IContract} from '../../interfaces/contract';
import {IEvidence} from '../../interfaces/evidence';
import {ITransactionDetail} from '../../interfaces/transaction';
import {IRedFlagSearchResult} from '../../interfaces/red_flag';
import {DEFAULT_CHAIN_ICON, DEFAULT_TRUNCATE_LENGTH} from '../../constants/config';

interface ISearchingResultItemProps {
  searchResult: ISearchResult;
}

const SearchingResultItem = ({searchResult}: ISearchingResultItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {type, data} = searchResult;

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
        const {stability} = data as IBlock;

        const blockStability =
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

        return {
          ID: data.id,
          LINE_1: blockStability,
          LINE_2: displayedTime,
          LINK: getDynamicUrl(data.chainId, data.id).BLOCK,
        };
      // Info: (20231115 - Julian) ----------------- ADDRESS -----------------
      case SearchType.ADDRESS:
        const {address, flaggingCount, riskLevel} = data as IAddress;

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
              <span className="mr-2 text-primaryBlue">{flaggingCount}</span> {t('COMMON.TIMES')}
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
          ID: address,
          LINE_1: <p className="break-all text-base">{address}</p>,
          LINE_2: addressFlagging,
          LINK: getDynamicUrl(data.chainId, address).ADDRESS,
        };
      // Info: (20231115 - Julian) ----------------- CONTRACT -----------------
      case SearchType.CONTRACT:
        const {contractAddress} = data as IContract;
        return {
          ID: contractAddress,
          LINE_1: <p className="break-all text-base">{contractAddress}</p>,
          LINE_2: displayedTime,
          LINK: getDynamicUrl(data.chainId, contractAddress).CONTRACT,
        };
      // Info: (20231115 - Julian) ----------------- EVIDENCE -----------------
      case SearchType.EVIDENCE:
        const {id} = data as IEvidence;
        return {
          ID: id,
          LINE_1: <p className="break-all text-base">{id}</p>,
          LINE_2: displayedTime,
          LINK: getDynamicUrl(data.chainId, id).EVIDENCE,
        };
      // Info: (20231115 - Julian) ----------------- TRANSACTION -----------------
      case SearchType.TRANSACTION:
        const {hash} = data as ITransactionDetail;
        return {
          ID: hash,
          LINE_1: <p className="break-all text-base">{hash}</p>,
          LINE_2: displayedTime,
          LINK: getDynamicUrl(data.chainId, hash).TRANSACTION,
        };
      // Info: (20231115 - Julian) ----------------- RED FLAG -----------------
      case SearchType.RED_FLAG:
        const {redFlagType, interactedAddresses} = data as IRedFlagSearchResult;
        const displayedRedFlagType = (
          <div className="flex items-center gap-2">
            <Image src="/icons/red_flag.svg" alt="red_flag_icon" width={24} height={24} />
            <p>{t(redFlagType)}</p>
          </div>
        );
        const displayedInteractedAddresses = interactedAddresses.map((address, index) => (
          <div
            key={index}
            className="whitespace-nowrap rounded-lg border-primaryBlue bg-primaryBlue px-3 py-2 text-sm text-darkPurple3"
          >
            <p>
              {t('ADDRESS_DETAIL_PAGE.ADDRESS_ID')}{' '}
              {truncateText(address.id, DEFAULT_TRUNCATE_LENGTH)}
            </p>
          </div>
        ));

        return {
          ID: data.id,
          LINE_1: displayedRedFlagType,
          LINE_2: (
            <div className="flex flex-wrap items-center gap-3">{displayedInteractedAddresses}</div>
          ),
          LINK: getDynamicUrl(data.chainId, data.id).RED_FLAG,
        };
      // Info: (20231115 - Julian) ----------------- BLACK LIST -----------------
      case SearchType.BLACKLIST:
        const {address: blacklistAddress, tagName} = data as IBlackList;
        const displayedPublicTag = (
          <div className="whitespace-nowrap rounded-lg border-violet bg-violet px-3 py-2 text-sm text-hoverWhite">
            {t(tagName)}
          </div>
        );
        const addressType = (data as IBlackList).targetType.toUpperCase();
        return {
          ID: blacklistAddress,
          LINE_1: <p className="break-all text-base">{blacklistAddress}</p>,
          LINE_2: displayedPublicTag,
          LINK: getDynamicUrl(data.chainId, blacklistAddress)[
            addressType as keyof typeof getDynamicUrl
          ],
        };
      default:
        return {
          ID: '',
          LINE_1: <></>,
          LINE_2: <></>,
          LINK: '/',
        };
    }
  };

  const displayedId = getContent().ID;
  const displayedLine1 = getContent().LINE_1;
  const displayedLine2 = getContent().LINE_2;
  const link = getContent().LINK;

  const displayedTitle = (
    <div className="flex flex-wrap items-center space-x-2 text-xl font-semibold">
      <div className="flex items-center space-x-4">
        <Image
          src={chainIcon.src}
          alt={chainIcon.alt}
          width={30}
          height={30}
          onError={e => (e.currentTarget.src = DEFAULT_CHAIN_ICON)}
        />
        <h2>
          {t(
            `SEARCHING_RESULT_PAGE.ITEM_TITLE_${type}${
              type === SearchType.BLACKLIST
                ? `_${(data as IBlackList).targetType.toUpperCase()}`
                : ``
            }`
          )}
        </h2>
      </div>
      <div title={displayedId} className="w-200px grow text-primaryBlue lg:w-500px">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">{displayedId}</p>
      </div>
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

  return (
    <div className="">
      <Link href={link}>
        {/* Info: (20231115 - Julian) Link */}
        <div className="rounded-lg bg-darkPurple p-6 shadow-xl transition-all duration-300 ease-in-out hover:bg-purpleLinear lg:p-8">
          {/* Info: (20231115 - Julian) Title */}
          <div className="flex w-full items-center">
            {/* Info: (20231115 - Julian) ID */}
            <div className="flex-1">{displayedTitle}</div>
            {/* Info: (20231115 - Julian) SubTitle - For Desktop */}
            <div className="ml-auto mr-1/10 hidden lg:block">{displayedSubtitle}</div>
          </div>

          {/* Info: (20231115 - Julian) Content */}
          <div className="flex flex-col items-center lg:px-12">
            {/* Info: (20231115 - Julian) Line 1 */}
            <div className="flex w-full flex-col items-start gap-2 border-b border-darkPurple4 py-5 lg:flex-row lg:items-center">
              <div className="flex w-200px items-center space-x-2">
                <p className="text-base font-bold text-lilac">
                  {t(
                    `SEARCHING_RESULT_PAGE.ITEM_LINE_1_${type}${
                      type === SearchType.BLACKLIST
                        ? `_${(data as IBlackList).targetType.toUpperCase()}`
                        : ``
                    }`
                  )}
                </p>
                <Tooltip>
                  {t(
                    `SEARCHING_RESULT_PAGE.TOOL_TIP_1_${type}${
                      type === SearchType.BLACKLIST
                        ? `_${(data as IBlackList).targetType.toUpperCase()}`
                        : ``
                    }`
                  )}
                </Tooltip>
              </div>
              {/* Info: (20231115 - Julian) Line 1 Content */}
              {displayedLine1}
            </div>
            {/* Info: (20231115 - Julian) Line 2 */}
            <div className="flex w-full flex-col items-start gap-2 border-b border-darkPurple4 py-5 lg:flex-row lg:items-center">
              <div className="flex w-200px items-center space-x-2">
                <p className="text-base font-bold text-lilac">
                  {t(`SEARCHING_RESULT_PAGE.ITEM_LINE_2_${type}`)}
                </p>
                <Tooltip>{t(`SEARCHING_RESULT_PAGE.TOOL_TIP_2_${type}`)}</Tooltip>
              </div>
              {/* Info: (20231115 - Julian) Line 2 Content */}
              {displayedLine2}
            </div>

            {/* Info: (20231115 - Julian) SubTitle - For Mobile */}
            <div className="flex items-center py-5 lg:hidden">{displayedSubtitle}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchingResultItem;
