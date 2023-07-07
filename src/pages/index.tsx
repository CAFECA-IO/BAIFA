import Head from 'next/head';
import NavBar from '../components/nav_bar/nav_bar';
import HomePageBody from '../components/home_page_body/home_page_body';

const Home = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <title>BAIFAAA</title>
        <meta name="description" content="" />
        <meta name="author" content="CAFECA" />
        <meta name="keywords" content="區塊鏈,人工智慧" />

        <meta property="og:title" content="BAIFAAA" />
        <meta property="og:description" content="" />
      </Head>

      <NavBar />

      <main>
        <HomePageBody />
      </main>
    </>
  );
};

export default Home;
