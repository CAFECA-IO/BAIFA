import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';
import {useRouter} from 'next/router';
import NavBar from '../../components/nav_bar/nav_bar';
import BoltButton from '../../components/bolt_button/bolt_button';
import TransactionTab from '../../components/transaction_tab/transaction_tab';
import Footer from '../../components/footer/footer';
import {BsArrowLeftShort} from 'react-icons/bs';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {dummyTransactionData, ITransaction} from '../../interfaces/transaction';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../../interfaces/locale';
import {getChainIcon} from '../../lib/common';

const TransactionListPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const router = useRouter();

  const {addressId} = router.query;
  //  Info: (20231114 - Julian) 如果取得 addressId，且 addressId 是陣列，則顯示該 address 的交易資料
  const isShowAddressData = !!addressId && typeof addressId === 'object';

  const headTitle = isShowAddressData
    ? `${t('TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_1')} ${addressId[0]} ${t(
        'TRANSACTION_LIST_PAGE.HEAD_TITLE_ADDRESS_2'
      )} ${addressId[1]} - BAIFA`
    : ``;

  // Info: (20231114 - Julian) Transaction Data State
  // ToDo: (20231114 - Julian) 這裡的 dummyTransactionData 和 'isun' 應該改成從 API 取得的資料
  const [chainId, setChainId] = useState('isun');
  const [filteredTransactionData, setFilteredTransactionData] =
    useState<ITransaction[]>(dummyTransactionData);

  const chainIcon = getChainIcon(chainId);

  const backClickHandler = () => router.back();

  const mainTitle = isShowAddressData ? (
    <h1 className="text-2xl font-bold lg:text-48px">
      <span className="text-primaryBlue">{t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
      {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_ADDRESSES')}
    </h1>
  ) : (
    <h1 className="text-2xl font-bold lg:text-48px">
      <span className="text-primaryBlue">{t('TRANSACTION_LIST_PAGE.MAIN_TITLE_HIGHLIGHT')}</span>
      {t('TRANSACTION_LIST_PAGE.MAIN_TITLE_BLOCK')}
    </h1>
  );

  const subTitle = isShowAddressData ? (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <h2 className="text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId[0]}
        </h2>
      </div>
      <Image src="/icons/switch.svg" alt="" width={24} height={24} />
      <div className="flex items-center space-x-2">
        <Image src={chainIcon.src} alt={chainIcon.alt} width={30} height={30} />
        <h2 className="text-xl">
          {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {addressId[1]}
        </h2>
      </div>
    </div>
  ) : (
    <></>
  );

  const isShowTransactionList = isShowAddressData ? (
    <TransactionTab transactionList={filteredTransactionData} />
  ) : (
    <h2 className="text-2xl font-bold">{t('ERROR_PAGE.HEAD_TITLE')}</h2>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center space-y-10 px-5 pb-10 pt-28 lg:px-40">
            <div className="flex w-full items-center justify-start py-10">
              {/* Info: (20231114 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              <div className="flex flex-1 flex-col items-center justify-center space-y-6">
                {/* Info: (20231114 -Julian) Transaction List Title */}
                {mainTitle}
                {/* Info: (20231114 -Julian) Sub Title */}
                {subTitle}
              </div>
            </div>

            {/* Info: (20231114 - Julian) Transaction List */}
            {isShowTransactionList}

            <div className="pt-10">
              <BoltButton
                onClick={backClickHandler}
                className="px-12 py-4 font-bold"
                color="blue"
                style="hollow"
              >
                {t('COMMON.BACK')}
              </BoltButton>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default TransactionListPage;
