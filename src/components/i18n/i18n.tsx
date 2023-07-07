import {useState} from 'react';

const I18n = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const clickMenuHandler = () => setMenuOpen(!menuOpen);
  const clickENHandler = () => setLanguage('English');
  const clickTWHandler = () => setLanguage('繁體中文');
  const clickCNHandler = () => setLanguage('简体中文');

  const subMenu = (
    // ToDo: (20230614 - Julian) i18n Function
    <div
      className={`absolute top-12 grid h-auto w-full grid-cols-1 rounded bg-darkPurple2 font-sans ${
        menuOpen ? 'visible grid-rows-1 opacity-100' : 'invisible grid-rows-0 opacity-0'
      } drop-shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div
        className="px-6 py-4 hover:cursor-pointer hover:bg-purpleLinear"
        onClick={clickENHandler}
      >
        English
      </div>
      <div
        className="px-6 py-4 hover:cursor-pointer hover:bg-purpleLinear"
        onClick={clickTWHandler}
      >
        繁體中文
      </div>
      <div
        className="px-6 py-4 hover:cursor-pointer hover:bg-purpleLinear"
        onClick={clickCNHandler}
      >
        简体中文
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-darkGray relative flex w-140px rounded" onClick={clickMenuHandler}>
        <div className="flex w-full items-center px-5 py-2 hover:cursor-pointer">
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${
              menuOpen ? 'invisible opacity-0' : 'visible opacity-100'
            }`}
          >
            {language}
          </div>
          <span className="-mt-2 h-12px w-12px rotate-45 border-b-2 border-r-2 border-white"></span>
        </div>
        {subMenu}
      </div>
    </>
  );
};

export default I18n;
