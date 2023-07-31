import {useState} from 'react';
import Image from 'next/image';
import useInputNumber from '../lib/hooks/use_input_number';
import Head from 'next/head';
import LandingNavBar from '../components/landing_nav_bar/landing_nav_bar';
import LandingFooter from '../components/landing_footer/landing_footer';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {FormAnimation} from '../constants/form_animation';
import {useTranslation} from 'next-i18next';
import {ILocale, TranslateFunction} from '../interfaces/locale';

const ContactUsPage = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20230731 - Julian) 信件送出的時間
  const now = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'});

  // Info: (20230731 - Julian) 是否顯示動畫 & 顯示哪個動畫
  const [showAnim, setShowAnim] = useState(false);
  const [animation, setAnimation] = useState<string>('');
  // Info: (20230731 - Julian) 是否顯示 Email 格式錯誤的提示
  const [showEmailError, setShowEmailError] = useState(false);

  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useInputNumber('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  // Info: (20230731 - Julian) 驗證信箱格式
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const emailIsValid = emailRule.test(inputEmail);

  // Info: (20230731 - Julian) input change handler
  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };
  const phoneChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPhone(event.target.value);
  };
  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(event.target.value);
    if (emailIsValid) setShowEmailError(false);
    else setShowEmailError(true);
  };
  const messageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value);
  };

  // Info: (20230731 - Julian) 送出失敗事件處理
  const failedProcess = async () => {
    setAnimation(FormAnimation.ERROR);
    setShowAnim(true);
  };

  // Info: (20230731 - Julian) 送出成功事件處理
  const successProcess = async () => {
    setAnimation(FormAnimation.SUCCESS);
    setShowAnim(true);

    // Info: (20230731 - Julian) 3 秒顯示動畫
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Info: (20230731 - Julian) 清空表單
    setInputName('');
    setInputPhone('');
    setInputEmail('');
    setInputMessage('');
    setShowAnim(false);
  };

  // Info: (20230731 - Julian) 送出信件
  const sendEmail = async () => {
    const emailData = {
      comment: `<h3>姓名：${inputName}</h3><h3>手機：${inputPhone}</h3><h3>Email：${inputEmail}</h3><h3>意見：${inputMessage}</h3><p>${now}<p>`,
    };

    // Info: (20230731 - Julian) 3 秒顯示動畫
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Info: (20230731 - Julian) call API
    const res = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify(emailData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    const result = await res.json();

    const success = result.success;
    if (success) {
      await successProcess();
    } else {
      await failedProcess();
    }
  };

  // Info: (20230731 - Julian) 點擊 Form submit
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    // Info: (20230731 - Julian) 先驗證信箱格式，不符合就直接 return
    if (!emailIsValid) {
      return;
    }

    setAnimation(FormAnimation.LOADING);
    setShowAnim(true);

    try {
      event.preventDefault();
      await sendEmail();
    } catch (error) {
      await failedProcess();
    }
  };

  const retryHandler = async () => {
    setAnimation(FormAnimation.LOADING);
    setShowAnim(true);

    try {
      await sendEmail();
    } catch (error) {
      await failedProcess();
    }
  };

  const formPart = (
    <form
      onSubmit={submitHandler}
      className={`flex flex-col items-center space-y-12 ${
        showAnim ? 'invisible opacity-0' : 'visible opacity-100'
      } transition-all duration-300 ease-in-out`}
    >
      <h1 className="w-full text-5xl font-bold drop-shadow-purple">{t('CONTACT_US_PAGE.TITLE')}</h1>

      {/* Info:(20230731 - Julian) Input part */}
      <div className="flex flex-col items-center space-y-4">
        {/* Info:(20230731 - Julian) Name & Phone */}
        <div className="flex items-center space-x-4">
          {/* Info:(20230731 - Julian) Name */}
          <div className="flex flex-col items-start space-y-2">
            <label className="text-sm">{t('CONTACT_US_PAGE.NAME')}</label>
            <input
              id="Name"
              type="text"
              onChange={nameChangeHandler}
              value={inputName || ''}
              className="h-12 border border-violet bg-transparent px-4 py-3 text-base text-white shadow-purple placeholder:text-lilac placeholder:text-opacity-90"
              required
            />
          </div>
          {/* Info:(20230731 - Julian) Phone Number */}
          <div className="flex flex-col items-start space-y-2">
            <label className="text-sm">{t('CONTACT_US_PAGE.PHONE')}</label>
            <input
              id="Phone"
              type="text"
              onChange={phoneChangeHandler}
              value={inputPhone || ''}
              className="h-12 border border-violet bg-transparent px-4 py-3 text-base text-white shadow-purple placeholder:text-lilac placeholder:text-opacity-90"
              required
            />
          </div>
        </div>

        {/* Info:(20230731 - Julian) Email */}
        <div className="flex w-full flex-col items-start space-y-2">
          <label className="text-sm">
            {t('CONTACT_US_PAGE.EMAIL')}
            <span
              className={`ml-4 text-xs text-red-300 ${
                showEmailError ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {t('CONTACT_US_PAGE.EMAIL_VERIFY')}
            </span>
          </label>
          <input
            id="Email"
            type="text"
            onChange={emailChangeHandler}
            value={inputEmail || ''}
            className="h-12 w-full border border-violet bg-transparent px-4 py-3 text-base text-white shadow-purple placeholder:text-lilac placeholder:text-opacity-90"
            required
          />
        </div>

        {/* Info:(20230731 - Julian) Message */}
        <div className="flex w-full flex-col items-start space-y-2">
          <label className="text-sm">{t('CONTACT_US_PAGE.MESSAGE')}</label>
          <textarea
            id="message"
            rows={3}
            wrap="soft"
            onChange={messageChangeHandler}
            value={inputMessage || ''}
            className="w-full border border-violet bg-transparent px-4 py-3 text-base text-white shadow-purple placeholder:text-lilac placeholder:text-opacity-90"
            placeholder={t('CONTACT_US_PAGE.MESSAGE_PLACEHOLDER')}
            required
          />
        </div>
      </div>

      <div className="flex w-full justify-end">
        <button
          id="submit"
          type="submit"
          disabled={!emailIsValid}
          className="rounded-lg bg-violet px-10 py-3 text-white hover:bg-hoverWhite hover:text-black disabled:bg-lilac disabled:text-white"
        >
          {t('CONTACT_US_PAGE.SUBMIT')}
        </button>
      </div>
    </form>
  );

  const animPart = (
    <div
      className={`absolute left-0 top-0 ${
        showAnim ? 'flex' : 'hidden'
      } h-full w-full items-center justify-center`}
    >
      {animation === FormAnimation.LOADING ? (
        /* Info:(20230731 - Julian) Loading animation */
        <div className={`flex flex-col items-center space-y-10`}>
          <Image src="/animations/Loading.svg" width={100} height={100} alt="loading_animation" />
          <p className="text-sm">{t('CONTACT_US_PAGE.SENDING')}</p>
        </div>
      ) : animation === FormAnimation.SUCCESS ? (
        /* Info:(20230731 - Julian) Success animation */
        <div className={`flex flex-col items-center space-y-10`}>
          <Image src="/animations/success.gif" width={150} height={150} alt="loading_animation" />
          <p className="text-sm">{t('CONTACT_US_PAGE.SUCCESS')}</p>
        </div>
      ) : animation === FormAnimation.ERROR ? (
        /* Info:(20230731 - Julian) Error animation */
        <div className={`flex flex-col items-center`}>
          <Image src="/animations/error.gif" width={100} height={100} alt="error_animation" />
          <p className="text-sm">{t('CONTACT_US_PAGE.ERROR')}</p>
          <button
            onClick={retryHandler}
            className="mt-6 rounded-lg bg-violet px-10 py-3 text-white hover:bg-hoverWhite hover:text-black"
          >
            {t('CONTACT_US_PAGE.TRY_AGAIN')}
          </button>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>BAIFA - Contact Us</title>
      </Head>
      {/* Info:(20230731 - Julian) Navbar */}
      <LandingNavBar />

      <main className="flex min-h-screen flex-col justify-between">
        <div className="relative mt-80px flex flex-1 flex-col items-center justify-center overflow-hidden font-roboto">
          {/* Info:(20230731 - Julian) Bubble on the top */}
          <div className="absolute -z-10 h-full w-full bg-bubbleAbove bg-contain bg-right-top bg-no-repeat"></div>
          {/* Info:(20230731 - Julian) Bubble on the bottom */}
          <div className="absolute -z-10 h-full w-full bg-bubbleBelow bg-contain bg-left-bottom bg-no-repeat"></div>

          {/* Info:(20230731 - Julian) Form */}
          <div className="relative m-10 h-auto border-2 border-violet bg-purpleLinear2 p-12 shadow-violet backdrop-blur-lg">
            {formPart}
            {animPart}
          </div>
        </div>
        {/* Info:(20230731 - Julian) Footer */}
        <LandingFooter />
      </main>
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default ContactUsPage;
