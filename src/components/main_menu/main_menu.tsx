import Image from 'next/image';
import Link from 'next/link';

const MainMenu = () => {
  return (
    // ToDo: (20230614 - Julian) 1. data from context 2. link to other pages
    <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-x-16 lg:space-y-0">
      <Link href="/">
        <div className="flex h-200px w-300px flex-col items-center justify-between rounded-lg border border-darkGray bg-darkGray p-6 text-center hover:border-primaryBlue">
          <Image src="/elements/chain.svg" width={80} height={80} alt="Chains_icon" />
          <div className="flex text-3xl font-bold text-primaryBlue">
            30
            <span className="self-start text-sm">+</span>
          </div>
          <div className="text-sm font-light font-medium text-white">Chains</div>
        </div>
      </Link>

      <Link href="/">
        <div className="flex h-200px w-300px flex-col items-center justify-between rounded-lg border border-darkGray bg-darkGray p-6 text-center hover:border-primaryBlue">
          <Image src="/elements/coin.svg" width={80} height={80} alt="Chains_icon" />
          <div className="flex text-3xl font-bold text-primaryBlue">
            10000
            <span className="self-start text-sm">+</span>
          </div>
          <div className="text-sm font-light font-medium text-white">Crypto Currencies</div>
        </div>
      </Link>

      <Link href="/">
        <div className="flex h-200px w-300px flex-col items-center justify-between rounded-lg border border-darkGray bg-darkGray p-6 text-center hover:border-primaryBlue">
          <Image src="/elements/black_list.svg" width={80} height={80} alt="Chains_icon" />
          <div className="flex text-3xl font-bold text-primaryBlue">200</div>
          <div className="text-sm font-light font-medium text-white">Black List</div>
        </div>
      </Link>
    </div>
  );
};

export default MainMenu;
