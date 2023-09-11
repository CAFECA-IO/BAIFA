import Image from 'next/image';
import BoltButton from '../bolt_button/bolt_button';
import {timestampToString} from '../../lib/common';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ITransactionData} from '../../interfaces/transaction_data';

interface ITransactionDetailProps {
  transactionData: ITransactionData;
}

const TransactionDetail = (transactionData: ITransactionDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {hash, status, blockId, createdTimestamp, from, to, content, fee, flagging} =
    transactionData.transactionData;

  const displayStatus =
    status === 'PROCESSING' ? (
      <div className="flex items-center text-hoverWhite">
        <Image
          src="/animations/trade_processing.gif"
          alt="processing_icon"
          width={20}
          height={20}
        />
        <p className="ml-2 text-hoverWhite">{t('CHAIN_DETAIL_PAGE.STATUS_PROCESSING')}</p>
      </div>
    ) : status === 'SUCCESS' ? (
      <div className="flex items-center text-lightGreen">
        <Image src="/icons/success_icon.svg" alt="success_icon" width={20} height={20} />
        <p className="ml-2 text-lightGreen">{t('CHAIN_DETAIL_PAGE.STATUS_SUCCESS')}</p>
      </div>
    ) : (
      <div className="flex items-center text-lightRed">
        <Image src="/icons/failed_icon.svg" alt="failed_icon" width={20} height={20} />
        <p className="ml-2 text-lightRed">{t('CHAIN_DETAIL_PAGE.STATUS_FAILED')}</p>
      </div>
    );

  const displayFlagging = !!flagging ? (
    <BoltButton className="px-3 py-1" color="red" style="solid">
      Multiple Transfer
    </BoltButton>
  ) : (
    <p>None</p>
  );

  const displayTime = (
    <div className="flex items-center space-x-2">
      <p>{timestampToString(createdTimestamp).date}</p>
      <p>{timestampToString(createdTimestamp).time}</p>
    </div>
  );

  return (
    <div className="flex w-4/5 flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20230911 - Julian) Hash */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.HASH')}</p>
        <p>{hash}</p>
      </div>
      {/* Info: (20230911 - Julian) Status */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.STATUS')}</p>
        <p>{displayStatus}</p>
      </div>
      {/* Info: (20230911 - Julian) Block */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.BLOCK')}</p>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('BLOCK_DETAIL_PAGE.MAIN_TITLE')} {blockId}
        </BoltButton>
      </div>
      {/* Info: (20230911 - Julian) Time */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.TIME')}</p>
        <p>{displayTime}</p>
      </div>
      {/* Info: (20230911 - Julian) From */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.FROM')}</p>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {from}
        </BoltButton>
      </div>
      {/* Info: (20230911 - Julian) To */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.TO')}</p>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('CONTRACT_DETAIL_PAGE.MAIN_TITLE')} {to}
        </BoltButton>
      </div>
      {/* Info: (20230911 - Julian) Content */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.CONTENT')}</p>
        <BoltButton className="px-3 py-1" color="blue" style="solid">
          {t('EVIDENCE_DETAIL_PAGE.MAIN_TITLE')} {content}
        </BoltButton>
      </div>
      {/* Info: (20230911 - Julian) Value */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.VALUE')}</p>
        {/* ToDo: (20230911 - Julian) log in button */}
        <p className="text-primaryBlue underline underline-offset-2">LOG IN ONLY</p>
      </div>
      {/* Info: (20230911 - Julian) Fee */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.FEE')}</p>
        {/* ToDo: (20230911 - Julian) unit */}
        <p>{fee} BLT</p>
      </div>
      {/* Info: (20230911 - Julian) Flagging */}
      <div className="flex items-center px-3 py-4">
        <p className="w-170px font-bold text-lilac">{t('TRANSACTION_DETAIL_PAGE.FLAGGING')}</p>
        {/* ToDo: (20230911 - Julian) Flagging */}
        <p>{displayFlagging}</p>
      </div>
    </div>
  );
};

export default TransactionDetail;
