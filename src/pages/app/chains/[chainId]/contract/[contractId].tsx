import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {GetStaticPaths, GetStaticProps} from 'next';
import {BsArrowLeftShort} from 'react-icons/bs';
import NavBar from '../../../../../components/nav_bar/nav_bar';
import BoltButton from '../../../../../components/bolt_button/bolt_button';
import Footer from '../../../../../components/footer/footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../../../../interfaces/locale';
import {getChainIcon} from '../../../../../lib/common';
import {getDynamicUrl} from '../../../../../constants/url';
import {IContract, dummyContractData} from '../../../../../interfaces/contract';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import TransactionHistorySection from '../../../../../components/transaction_history_section/transaction_history_section';
import {dummyTransactionData} from '../../../../../interfaces/transaction';
import Tooltip from '../../../../../components/tooltip/tooltip';

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
            <div className="flex w-full items-center justify-start">
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
            </div>

            {/* Info: (20231106 - Julian) Contract Detail */}
            <div className="my-10 w-full">
              <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
                {/* Info: (20231106 - Julian) Creator */}
                <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
                  <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
                    <p>Creator</p>
                    <Tooltip>
                      This is tooltip Sample Text. So if I type in more content, it would be like
                      this.
                    </Tooltip>
                  </div>
                </div>
              </div>
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
