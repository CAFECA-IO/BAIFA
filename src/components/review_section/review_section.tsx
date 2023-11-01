import Link from 'next/link';
import {useState} from 'react';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {IReview} from '../../interfaces/review';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {FaChevronDown} from 'react-icons/fa';
import {roundToDecimal} from '../../lib/common';
import ReviewItem from '../review_item/review_item';
import BoltButton from '../bolt_button/bolt_button';
import {BFAURL} from '../../constants/url';
import {REVIEW_SECTION_LIMIT} from '../../constants/config';

interface IReviewSection {
  seeAllLink?: string;
  reviews: IReview[];
}

const ReviewSection = (reviews: IReviewSection) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {seeAllLink, reviews: reviewList} = reviews;

  const [sorting, setSorting] = useState<'Newest' | 'Oldest'>('Newest');
  const {
    targetRef: sortingRef,
    componentVisible: sortingVisible,
    setComponentVisible: setSortingVisible,
  } = useOuterClick<HTMLUListElement>(false);
  // Info: (20231031 - Julian) Sorting Handlers
  const sortingClickHandler = () => setSortingVisible(!sortingVisible);
  const newestSortClickHandler = () => {
    setSorting('Newest');
    setSortingVisible(false);
  };
  const oldestSortClickHandler = () => {
    setSorting('Oldest');
    setSortingVisible(false);
  };

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

  // Info: (20231031 - Julian) 全部的 Review
  const displayedReviews = sortedReviews.map((review, index) => (
    <ReviewItem key={index} review={review} />
  ));

  // Info: (20231031 - Julian) 擷取前 3 個 Review (Address Detail Page)
  const displayedReviewsLimited = displayedReviews.slice(0, REVIEW_SECTION_LIMIT);

  const sortingButton = (
    <div className="relative my-2 flex w-300px items-center text-base lg:my-0 lg:w-fit lg:space-x-2">
      <p className="hidden text-lilac lg:block">{t('SORTING.SORT_BY')} :</p>
      <button
        onClick={sortingClickHandler}
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
  );

  const leaveReviewButton = (
    <Link href={BFAURL.COMING_SOON} className="w-300px lg:w-auto">
      <BoltButton style="solid" color="blue" className="w-full px-10 py-3 text-sm font-bold">
        {t('REVIEWS_PAGE.BUTTON')}
      </BoltButton>
    </Link>
  );

  // Info: (20231031 - Julian) 如果有 seeAllLink，就表示是在 Address Detail Page 裡，只顯示前 3 個 Review
  if (seeAllLink)
    return (
      <div className="flex w-full flex-col space-y-4">
        <h2 className="text-xl text-lilac">
          {t('REVIEWS_PAGE.TITLE')}
          <span className="ml-2">({score})</span>
        </h2>
        <div className="flex w-full flex-col rounded bg-darkPurple p-4">
          {/* Info: (20231020 - Julian) Sort & Leave review button */}
          <div className="flex flex-col-reverse items-center justify-between lg:flex-row">
            {sortingButton}
            {leaveReviewButton}
          </div>
          {/* Info: (20231020 - Julian) Reviews List */}
          <div className="my-6 flex flex-col space-y-4">{displayedReviewsLimited}</div>
          <div className="mx-auto py-5 text-sm underline underline-offset-2">
            <Link href={seeAllLink}>{t('REVIEWS_PAGE.SEE_ALL')}</Link>
          </div>
        </div>
      </div>
    );

  // Info: (20231031 - Julian) 如果沒有 seeAllLink，就表示是在 Reviews Page 裡，顯示全部的 Review
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full flex-col items-center justify-between space-y-10 rounded lg:flex-row lg:space-y-0">
        <h2 className="text-6xl">
          {score}
          <span className="ml-2 text-base text-lilac">{t('COMMON.OF')} 5</span>
        </h2>
        {/* Info: (20231031 - Julian) Sort & Leave review button */}
        <div className="flex flex-col items-end space-y-10 lg:space-y-4">
          {leaveReviewButton}
          {sortingButton}
        </div>
      </div>
      {/* Info: (20231031 - Julian) Reviews List */}
      <div className="my-6 flex flex-col space-y-4 lg:space-y-0">{displayedReviews}</div>
    </div>
  );
};

export default ReviewSection;
