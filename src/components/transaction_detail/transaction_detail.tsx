import Image from 'next/image';
import Link from 'next/link';
import BoltButton from '../bolt_button/bolt_button';
import Tooltip from '../tooltip/tooltip';
import {timestampToString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransaction} from '../../interfaces/transaction';
import {BFAURL, getDynamicUrl} from '../../constants/url';

interface ITransactionDetailProps {
  transactionData: ITransaction;
}

const TransactionDetail = ({transactionData}: ITransactionDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {
    hash,
    status,
    chainId,
    blockId,
    createdTimestamp,
    fromAddressId,
    toAddressId,
    evidenceId,
    fee,
    flagging,
  } = transactionData;

  const blockLink = getDynamicUrl(chainId, `${blockId}`).BLOCK;
  const addressLink = getDynamicUrl(chainId, `${fromAddressId}`).ADDRESS;
  const contractLink = getDynamicUrl(chainId, `${toAddressId}`).CONTRACT;

  const displayStatus =
    status === 'PROCESSING' ? (
      <div className="flex items-center text-hoverWhite">
        <Image
          src="/animations/trade_processing.gif"
          alt="processing_icon"
          width={20}
          height={20}
        />
        <p className="ml-2 text-sm text-hoverWhite lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING')}
        </p>
      </div>
    ) : status === 'SUCCESS' ? (
      <div className="flex items-center text-lightGreen">
        <Image src="/icons/success_icon.svg" alt="success_icon" width={20} height={20} />
        <p className="ml-2 text-sm text-lightGreen lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_SUCCESS')}
        </p>
      </div>
    ) : (
      <div className="flex items-center text-lightRed">
        <Image src="/icons/failed_icon.svg" alt="failed_icon" width={20} height={20} />
        <p className="ml-2 text-sm text-lightRed lg:text-base">
          {t('CHAIN_DETAIL_PAGE.STATUS_FAILED')}
        </p>
      </div>
    );

  // ToDo: (20230911 - Julian) flagging
  const displayFlagging = !!flagging ? (
    <Link href={BFAURL.COMING_SOON}>
      <BoltButton className="w-fit px-3 py-1" color="red" style="solid">
        {t(flagging)}
      </BoltButton>
    </Link>
  ) : (
    <p>{t('COMMON.NONE')}</p>
  );

  const displayTime = (
    <div className="flex flex-wrap items-center space-x-2">
      <p>{timestampToString(createdTimestamp).date}</p>
      <p>{timestampToString(createdTimestamp).time}</p>
    </div>
  );

  const displayEvidence = evidenceId ? (
    <Link href={getDynamicUrl(`${chainId}`, `${evidenceId}`).EVIDENCE}>
      <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
        {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} {evidenceId}
      </BoltButton>
    </Link>
  ) : (
    <p>{t('COMMON.NONE')}</p>
  );

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230911 - Julian) Hash */}
      <div className="flex flex-col space-y-2 px-3 py-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:text-base">
        <p className="font-bold text-lilac lg:w-200px">{t('TRANSACTION_DETAIL_PAGE.HASH')}</p>
        <p className="break-all">{hash}</p>
      </div>
      {/* Info: (20230911 - Julian) Status */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.STATUS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayStatus}
      </div>
      {/* Info: (20230911 - Julian) Block */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.BLOCK')}
        </p>
        <Link href={blockLink}>
          <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
            {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.TIME')}
        </p>
        {displayTime}
      </div>
      {/* Info: (20230911 - Julian) From */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.FROM')}
        </p>
        <Link href={addressLink}>
          <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {fromAddressId}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) To */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <p className="text-sm font-bold text-lilac lg:w-200px lg:text-base">
          {t('TRANSACTION_DETAIL_PAGE.TO')}
        </p>
        <Link href={contractLink}>
          <BoltButton className="w-fit px-3 py-1" color="blue" style="solid">
            {t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')} {toAddressId}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) Content */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.CONTENT')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayEvidence}
      </div>
      {/* Info: (20230911 - Julian) Value */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.VALUE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {/* ToDo: (20230911 - Julian) log in button */}
        <Link href={BFAURL.COMING_SOON}>
          <p className="text-primaryBlue underline underline-offset-2">{t('COMMON.LOG_IN_ONLY')}</p>
        </Link>
      </div>
      {/* Info: (20230911 - Julian) Fee */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FEE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {/* ToDo: (20230911 - Julian) unit */}
        <p>{fee} BLT</p>
      </div>
      {/* Info: (20230911 - Julian) Flagging */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('TRANSACTION_DETAIL_PAGE.FLAGGING')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        {displayFlagging}
      </div>
    </div>
  );
};

export default TransactionDetail;
