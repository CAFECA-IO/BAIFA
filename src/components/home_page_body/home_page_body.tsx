import MainMenu from '@/components/main_menu/main_menu';
import GlobalSearch from '@/components/global_search/global_search';
import Footer from '@/components/footer/footer';

const HomePageBody = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="flex flex-1 flex-col items-center pt-20 lg:pt-32">
        {/* Info: (20231115 - Julian) Global Search */}
        <GlobalSearch />

        {/* Info: (20231115 - Julian) Main Menu */}
        <div className="mt-14">
          <MainMenu />
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default HomePageBody;
