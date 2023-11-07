import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../components/footer/footer';
import ContractDetail from '../../../../../components/contract_detail/contract_detail';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {getChainIcon} from '../../../../../lib/common';
import {BFAURL} from '../../../../../constants/url';
import {IContract, dummyContractData} from '../../../../../interfaces/contract';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../components/transaction_history_section/transaction_history_section';
import {dummyTransactionData} from '../../../../../interfaces/transaction';
import Link from 'next/link';

interface IContractDetailPageProps {
  chainId: string;
  contractId: string;
  contractData: IContract;
}

const ContractDetailPage = ({chainId, contractId, contractData}: IContractDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {transactionIds} = contractData;
  const headTitle = `Contract ${contractId} - BAIFA`;

  const router = useRouter();
  const backClickHandler = () => router.back();

  const transactionHistory = dummyTransactionData.filter(transaction =>
    transactionIds.includes(transaction.id)
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
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-28 lg:px-40 lg:pt-40">
            {/* Info: (20231106 - Julian) Header */}
            <div className="relative flex w-full flex-col items-center justify-start lg:flex-row">
              {/* Info: (20231106 - Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20231106 - Julian) Contract Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image
                  src={getChainIcon(chainId).src}
                  alt={getChainIcon(chainId).alt}
                  width={40}
                  height={40}
                />
                <h1 className="text-2xl font-bold lg:text-32px">
                  Contract
                  <span className="ml-2 text-primaryBlue"> {contractId}</span>
                </h1>
              </div>
              {/* Info: (20231107 - Julian) Platform Link Button */}
              <div className="right-0 mt-6 lg:absolute lg:mt-0">
                <Link href={BFAURL.COMING_SOON}>
                  <BoltButton
                    className="flex items-center justify-center space-x-4 px-6 py-3"
                    color="purple"
                    style="solid"
                  >
                    <Image src="/icons/link.svg" alt="" width={24} height={24} />
                    <p>Platform</p>
                  </BoltButton>
                </Link>
              </div>
            </div>

            {/* Info: (20231106 - Julian) Contract Detail */}
            <div className="my-10 w-full">
              <ContractDetail contractData={contractData} />
            </div>

            {/* Info: (20231106 - Julian) Private Note Section */}
            <div className="w-full">
              <PrivateNoteSection />
            </div>

            {/* Info: (20231103 - Julian) Transaction History */}
            <div className="my-10 w-full">
              <TransactionHistorySection transactions={transactionHistory} />
            </div>

            {/* Info: (20231017 - Julian) Back Button */}
            <div className="mt-10">
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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyContractData
    .flatMap(contract => {
      return locales?.map(locale => ({
        params: {chainId: contract.chainId, contractId: `${contract.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; contractId: string}; locale: string} => !!path
    );

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.contractId || typeof params.contractId !== 'string') {
    return {
      notFound: true,
    };
  }

  const contractData = dummyContractData.find(contract => `${contract.id}` === params.contractId);
  const chainId = contractData?.chainId ?? null;

  if (!contractData || !chainId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      contractId: params.contractId,
      contractData: contractData,
      chainId: chainId,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default ContractDetailPage;
