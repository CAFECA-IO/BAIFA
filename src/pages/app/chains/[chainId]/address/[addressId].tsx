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
import {IAddress, dummyAddressData} from '../../../../../interfaces/address';
import AddressDetail from '../../../../../components/address_detail/address_detail';
import {getChainIcon} from '../../../../../lib/common';
import PrivateNoteSection from '../../../../../components/private_note_section/private_note_section';
import Link from 'next/link';
import {BFAURL} from '../../../../../constants/url';
import {AiOutlinePlus} from 'react-icons/ai';

interface IAddressDetailPageProps {
  addressId: string;
  addressData: IAddress;
}

const AddressDetailPage = ({addressId, addressData}: IAddressDetailPageProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const headTitle = `${t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} ${addressId} - BAIFA`;
  const chainIcon = getChainIcon(addressData.chainId);

  const router = useRouter();
  const backClickHandler = () => router.back();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{headTitle}</title>
      </Head>

      <NavBar />
      <main>
        <div className="flex min-h-screen flex-col items-center overflow-hidden font-inter">
          <div className="flex w-full flex-1 flex-col items-center px-5 pb-10 pt-32 lg:px-20 lg:pt-40">
            {/* Info: (20231017 - Julian) Header */}
            <div className="flex w-full items-center justify-start">
              {/* Info: (20230912 -Julian) Back Arrow Button */}
              <button onClick={backClickHandler} className="hidden lg:block">
                <BsArrowLeftShort className="text-48px" />
              </button>
              {/* Info: (20230912 -Julian) Address Title */}
              <div className="flex flex-1 items-center justify-center space-x-2">
                <Image src={chainIcon.src} alt={chainIcon.alt} width={40} height={40} />
                <h1 className="text-2xl font-bold lg:text-32px">
                  {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')}
                  <span className="ml-2 text-primaryBlue">{addressId}</span>
                </h1>
              </div>
            </div>
            <div className="my-4 flex w-full flex-col items-center space-y-10">
              {/* Info: (20231018 - Julian) Public Tag */}
              <div className="flex text-base font-bold text-lilac">
                <h2>{t('ADDRESS_DETAIL_PAGE.PUBLIC_TAG')}</h2>
              </div>
              <div className="flex flex-col items-center space-y-4 lg:w-2/5 lg:flex-row lg:space-x-6 lg:space-y-0">
                {/* Info: (20231018 - Julian) Tracing Tool Button */}
                <Link href={BFAURL.COMING_SOON} className="w-full">
                  <BoltButton
                    className="flex w-full items-center justify-center space-x-2 px-6 py-4 lg:w-fit"
                    color="purple"
                    style="solid"
                  >
                    <Image src="/icons/tracing.svg" alt="" width={24} height={24} />
                    <p>{t('COMMON.TRACING_TOOL_BUTTON')}</p>
                  </BoltButton>
                </Link>
                {/* Info: (20231018 - Julian) Follow Button */}
                <Link href={BFAURL.COMING_SOON} className="w-full">
                  <BoltButton
                    className="flex w-full items-center justify-center space-x-2 px-6 py-4 lg:w-fit"
                    color="purple"
                    style="solid"
                  >
                    <AiOutlinePlus className="text-2xl text-black" />
                    <p>{t('COMMON.FOLLOW')}</p>
                  </BoltButton>
                </Link>
              </div>
            </div>

            <div className="my-10 w-full">
              <AddressDetail addressData={addressData} />
            </div>

            <div className="w-full">
              <PrivateNoteSection />
            </div>

            {/* Info: (20231006 - Julian) Back button */}
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

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const paths = dummyAddressData
    .flatMap(address => {
      return locales?.map(locale => ({
        params: {chainId: `${address.chainId}`, addressId: `${address.id}`},
        locale,
      }));
    })
    .filter(
      (path): path is {params: {chainId: string; addressId: string}; locale: string} => !!path
    );

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({params, locale}) => {
  if (!params || !params.addressId || typeof params.addressId !== 'string') {
    return {
      notFound: true,
    };
  }

  const addressData = dummyAddressData.find(address => `${address.id}` === params.addressId);

  if (!addressData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      addressId: params.addressId,
      addressData: addressData,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  };
};

export default AddressDetailPage;
