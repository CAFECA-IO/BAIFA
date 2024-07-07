import {Dispatch, SetStateAction} from 'react';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import useOuterClick from '@/lib/hooks/use_outer_click';

// ToDo: (20230727 - Julian) when login function is done, remove this props
interface IUserProps {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

const User = ({isLogin, setIsLogin}: IUserProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {
    targetRef: userRef,
    componentVisible: userVisible,
    setComponentVisible: setUsereVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const userClickHandler = () => setUsereVisible(!userVisible);
  const logoutHandler = () => setIsLogin(!isLogin);

  const desktopUser = (
    <div className="relative hidden lg:block">
      <div
        ref={userRef}
        onClick={userClickHandler}
        className="flex h-60px w-60px items-center justify-center rounded-full bg-primaryBlue text-4xl hover:cursor-pointer"
      >
        J
      </div>

      <ul
        className={`absolute right-0 top-16 flex h-fit w-240px flex-col items-start bg-darkPurple2 ${
          userVisible ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-5 opacity-0'
        } drop-shadow-lg transition-all duration-500 ease-in-out`}
      >
        {/* ToDo: (20230727 - Julian) page link */}
        <li className="w-full hover:cursor-pointer hover:bg-purpleLinear">
          <Link href={BFAURL.COMING_SOON} className="block h-full w-full px-8 py-4">
            {t('USER.MY_ADDRESS')}
          </Link>
        </li>
        <li className="w-full hover:cursor-pointer hover:bg-purpleLinear">
          <Link href={BFAURL.COMING_SOON} className="block h-full w-full px-8 py-4">
            {t('USER.FINANCIAL_ANALYSIS')}
          </Link>
        </li>
        <li className="w-full hover:cursor-pointer hover:bg-purpleLinear">
          <Link href={BFAURL.COMING_SOON} className="block h-full w-full px-8 py-4">
            {t('USER.CLOUD_DRIVE')}
          </Link>
        </li>
        <li className="w-full hover:cursor-pointer hover:bg-purpleLinear">
          <Link href={BFAURL.COMING_SOON} className="block h-full w-full px-8 py-4">
            {t('USER.AUDITING_HISTORY')}
          </Link>
        </li>
        <li
          className="w-full px-8 py-4 hover:cursor-pointer hover:bg-purpleLinear"
          onClick={logoutHandler}
        >
          {t('USER.LOGOUT')}
        </li>
      </ul>
    </div>
  );

  const mobileUser = (
    <ul className="flex w-full flex-col items-center lg:hidden">
      {/* ToDo: (20230727 - Julian) page link */}
      <li className="w-full px-8 py-6 text-center hover:cursor-pointer hover:bg-purpleLinear">
        <Link href={BFAURL.COMING_SOON}>{t('USER.MY_ADDRESS')}</Link>
      </li>
      <li className="w-full px-8 py-6 text-center hover:cursor-pointer hover:bg-purpleLinear">
        <Link href={BFAURL.COMING_SOON}>{t('USER.FINANCIAL_ANALYSIS')}</Link>
      </li>
      <li className="w-full px-8 py-6 text-center hover:cursor-pointer hover:bg-purpleLinear">
        <Link href={BFAURL.COMING_SOON}>{t('USER.CLOUD_DRIVE')}</Link>
      </li>
      <li className="w-full px-8 py-6 text-center hover:cursor-pointer hover:bg-purpleLinear">
        <Link href={BFAURL.COMING_SOON}>{t('USER.AUDITING_HISTORY')}</Link>
      </li>
      <li
        className="w-full px-8 py-6 text-center hover:cursor-pointer hover:bg-purpleLinear"
        onClick={logoutHandler}
      >
        {t('USER.LOGOUT')}
      </li>
    </ul>
  );

  return (
    <>
      {desktopUser}
      {mobileUser}
    </>
  );
};

export default User;
