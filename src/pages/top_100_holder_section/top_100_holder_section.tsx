import {useState} from 'react';
import SortingMenu from '../../components/sorting_menu/sorting_menu';
import {TranslateFunction} from '../../interfaces/locale';
import {useTranslation} from 'react-i18next';
import {sortOldAndNewOptions} from '../../constants/config';

const Top100HolderSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg shadow-xl">
      <h2 className="text-xl text-lilac">Top 100 Holders</h2>
      <div className="flex w-full flex-col bg-darkPurple p-4">
        {/* Info: (20231102 - Julian) Sorting Menu */}
        <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
          <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
          <SortingMenu
            sortingOptions={sortOldAndNewOptions}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      </div>
    </div>
  );
};

export default Top100HolderSection;
