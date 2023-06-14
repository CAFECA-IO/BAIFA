import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
  return (
    <>
      <div className="container fixed inset-x-0 top-0 z-40 mx-auto max-w-full">
        <div className="flex w-screen bg-darkGray7 px-10 py-5 text-white">
          <div className="flex flex-1 space-x-5">
            <Link href="/">
              <Image src="/logo/bolt_logo.svg" width={155} height={40} alt="bolt_logo" />
            </Link>

            <button>Language</button>
          </div>
          <div>FAQ</div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
