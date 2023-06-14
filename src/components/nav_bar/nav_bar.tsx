import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import I18n from '../i18n/i18n';

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const loginHandler = () => setIsLogin(!isLogin);
  const clickMenuHandler = () => setMenuOpen(!menuOpen);

  // ToDo: (20230614 - Julian) log in function
  const isDisplayedUser = isLogin ? (
    <div
      className="flex h-60px w-60px items-center justify-center rounded-full bg-primaryBlue text-4xl hover:cursor-pointer"
      onClick={loginHandler}
    >
      J
    </div>
  ) : (
    <button
      className="rounded bg-primaryBlue px-7 py-2 text-black hover:bg-hoverWhite"
      onClick={loginHandler}
    >
      wallet connect
    </button>
  );

  // ToDo: (20230614 - Julian) 1. link to other pages 2. i18n
  const desktopNavBar = (
    <div className="hidden h-80px w-screen items-center bg-darkGray px-10 py-3 text-white lg:flex">
      <div className="flex flex-1 space-x-5">
        <Link href="/">
          <Image src="/logo/bolt_logo.svg" width={155} height={40} alt="bolt_logo" />
        </Link>

        <I18n />
      </div>
      <div className="flex items-center space-x-10">
        <div className="text-white hover:text-primaryBlue">
          <Link href="/">Tracing Tool</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href="/">Auditing Tool</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href="/">Red Flag</Link>
        </div>
        <div className="text-white hover:text-primaryBlue">
          <Link href="/">FAQ</Link>
        </div>

        {isDisplayedUser}
      </div>
    </div>
  );

  // ToDo: (20230614 - Julian) wait for mobile mockup
  const mobileNavBar = (
    <div className="relative flex h-80px w-screen items-center bg-darkGray px-10 py-3 text-white lg:hidden">
      <div className="flex-1">
        <Link href="/">
          <Image src="/logo/bolt_logo.svg" width={155} height={40} alt="bolt_logo" />
        </Link>
      </div>

      <button className="h-20px w-30px space-y-2" onClick={clickMenuHandler}>
        <span className="block h-3px rounded-lg bg-lightWhite"></span>
        <span className="block h-3px rounded-lg bg-lightWhite"></span>
        <span className="block h-3px rounded-lg bg-lightWhite"></span>
      </button>

      <div
        className={`absolute left-0 top-0 mt-20 flex w-full flex-col items-center space-y-5 bg-darkGray py-3 ${
          menuOpen ? 'visible h-400px opacity-100' : 'invisible h-0 opacity-0'
        } transition-all duration-300 ease-in-out`}
      >
        <I18n />

        <div className="p-2 text-white hover:text-primaryBlue">
          <Link href="/">Tracing Tool</Link>
        </div>
        <div className="p-2 text-white hover:text-primaryBlue">
          <Link href="/">Auditing Tool</Link>
        </div>
        <div className="p-2 text-white hover:text-primaryBlue">
          <Link href="/">Red Flag</Link>
        </div>
        <div className="p-2 text-white hover:text-primaryBlue">
          <Link href="/">FAQ</Link>
        </div>

        {isDisplayedUser}
      </div>
    </div>
  );

  return (
    <>
      <div className="container fixed inset-x-0 top-0 z-40 mx-auto max-w-full">
        {desktopNavBar}
        {mobileNavBar}
      </div>
    </>
  );
};

export default NavBar;
