const Footer = () => {
  return (
    <>
      {/* ToDo:(20230614 - Julian) i18n */}
      <footer className="flex flex-col bg-darkGray">
        <div className="p-4 text-center text-darkGray3">
          <h2 className="text-sm font-bold leading-8">Powered by BOLT</h2>
          <p className="text-xs">
            BOLT Explorer is a Block Explorer and Analytics Platform for BOLT,
          </p>
          <p className="text-xs">a decentralized smart contracts platform.</p>
          <p className="text-xs leading-8">© Boltchain 2023</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
