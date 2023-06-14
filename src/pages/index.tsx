import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HomePageBody from '../components/home_page_body/home_page_body';

const Home = () => {
  return (
    <>
      <Head>
        <title>BOLT Explorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>
        <HomePageBody />
      </main>
    </>
  );
};

export default Home;
