import Image from 'next/image';
import MainMenu from '../main_menu/main_menu';
import Footer from '../footer/footer';

const HomePageBody = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex flex-1 flex-col items-center pt-32">
        {/* ToDo: (20230614 - Julian) Global Search */}
        <div className="flex w-full flex-col items-center space-y-4">
          <div className="p-10">
            <Image src="/elements/main_pic_1.svg" width={250} height={250} alt="global" />
          </div>

          <input
            type="search"
            className="block w-800px rounded-full bg-darkGray p-3 pl-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-blue-500"
            placeholder="What do you want to know?"
          />
        </div>

        <div className="mt-14">
          <MainMenu />
        </div>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default HomePageBody;
