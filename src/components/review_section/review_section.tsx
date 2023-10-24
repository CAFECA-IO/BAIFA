import useOuterClick from '../../lib/hooks/use_outer_click';
import {useState} from 'react';
import {IReview} from '../../interfaces/review';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {FaChevronDown} from 'react-icons/fa';
import {roundToDecimal} from '../../lib/common';

interface IReviewSection {
  reviews: IReview[];
}

const ReviewSection = (reviews: IReviewSection) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {reviews: reviewList} = reviews;

  const [sorting, setSorting] = useState<'Newest' | 'Oldest'>('Newest');
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLUListElement>(false);

  const newestSortClickHandler = () => setSorting('Newest');
  const oldestSortClickHandler = () => setSorting('Oldest');

  // Info: (20231020 - Julian) Calculate average score
  const score = roundToDecimal(
    reviewList.reduce((acc, cur) => acc + cur.stars, 0) / reviewList.length,
    1
  );

  const sortedReviews = reviewList.sort((a, b) => {
    if (sorting === 'Newest') {
      return b.createdTimestamp - a.createdTimestamp;
    } else {
      return a.createdTimestamp - b.createdTimestamp;
    }
  });

  const displayedReviews = sortedReviews.map(review => (
    <div className="flex items-center bg-darkPurple2 p-5">{review.id}</div>
  ));

  return (
    <div className="flex w-full flex-col space-y-4">
      <h2 className="text-xl text-lilac">
        {t('COMMON.REVIEWS_TITLE')}
        <span className="ml-2">({score})</span>
      </h2>
      <div className="flex w-full flex-col rounded bg-darkPurple p-4">
        {/* Info: (20231020 - Julian) Sort & Leave review button */}
        <div className="flex items-center">
          <div className="relative flex w-full items-center pb-2 text-base lg:w-fit lg:space-x-2 lg:pb-0">
            <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
            <button
              onClick={() => setSortingVisible(!sortingVisible)}
              className="flex w-full items-center space-x-4 rounded bg-darkPurple px-6 py-4 text-hoverWhite lg:w-140px"
            >
              <p
                className={`flex-1 text-left lg:w-60px ${
                  sortingVisible ? 'opacity-0' : 'opacity-100'
                } transition-all duration-300 ease-in-out`}
              >
                {sorting === 'Newest' ? t('SORTING.NEWEST') : t('SORTING.OLDEST')}
              </p>
              <FaChevronDown />
            </button>
            <ul
              ref={sortingRef}
              className={`absolute right-0 z-10 grid w-full grid-cols-1 items-center overflow-hidden lg:w-140px ${
                sortingVisible
                  ? 'visible translate-y-90px grid-rows-1 opacity-100'
                  : 'invisible translate-y-12 grid-rows-0 opacity-0'
              } rounded bg-darkPurple2 text-left text-hoverWhite shadow-xl transition-all duration-300 ease-in-out`}
            >
              <li
                onClick={newestSortClickHandler}
                className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
              >
                {t('SORTING.NEWEST')}
              </li>
              <li
                onClick={oldestSortClickHandler}
                className="w-full px-8 py-3 hover:cursor-pointer hover:bg-purpleLinear"
              >
                {t('SORTING.OLDEST')}
              </li>
            </ul>
          </div>
        </div>
        {/* Info: (20231020 - Julian) Reviews List */}
        <div className="my-6 flex flex-col">{displayedReviews}</div>
      </div>
    </div>
  );
};

export default ReviewSection;
