import {useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

const I18n = () => {
  const {asPath} = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('Language');

  const clickMenuHandler = () => setMenuOpen(!menuOpen);

  const internationalizationList = [
    {label: '繁體中文', value: 'tw'},
    {label: 'English', value: 'en'},
    {label: '简体中文', value: 'cn'},
  ];

  const subMenu = internationalizationList.map((item, index) => {
    const clickHandler = () => {
      setMenuOpen(!menuOpen);
      setCurrentLanguage(item.label);
    };

    return (
      <li key={index} className="py-2 hover:cursor-pointer hover:bg-purpleLinear">
        <Link
          locale={item.value}
          className="block h-full w-full px-6 py-2"
          href={asPath}
          onClick={clickHandler}
        >
          {item.label}
        </Link>
      </li>
    );
  });

  return (
    <>
      <div className="bg-darkGray relative flex w-140px rounded">
        <div
          className="flex w-full items-center px-5 py-2 hover:cursor-pointer"
          onClick={clickMenuHandler}
        >
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${
              menuOpen ? 'invisible opacity-0' : 'visible opacity-100'
            }`}
          >
            {currentLanguage}
          </div>
          <span className="-mt-2 h-12px w-12px rotate-45 border-b-2 border-r-2 border-white"></span>
        </div>
        <ul
          className={`absolute top-12 grid h-auto w-full grid-cols-1 rounded bg-darkPurple2 font-sans ${
            menuOpen ? 'visible grid-rows-1 opacity-100' : 'invisible grid-rows-0 opacity-0'
          } drop-shadow-lg transition-all duration-300 ease-in-out`}
        >
          {subMenu}
        </ul>
      </div>
    </>
  );
};

export default I18n;
