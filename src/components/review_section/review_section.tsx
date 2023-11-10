import Link from 'next/link';
import {useState} from 'react';
import {IReview} from '../../interfaces/review';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {roundToDecimal} from '../../lib/common';
import ReviewItem from '../review_item/review_item';
import BoltButton from '../bolt_button/bolt_button';
import {BFAURL} from '../../constants/url';
import {REVIEW_SECTION_LIMIT, sortOldAndNewOptions} from '../../constants/config';
import SortingMenu from '../sorting_menu/sorting_menu';

interface IReviewSection {
  seeAllLink?: string;
  reviews: IReview[];
}

const ReviewSection = (reviews: IReviewSection) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {seeAllLink, reviews: reviewList} = reviews;

  const [sorting, setSorting] = useState<string>(sortOldAndNewOptions[0]);

  // Info: (20231020 - Julian) Calculate average score
  const score = roundToDecimal(
    reviewList.reduce((acc, cur) => acc + cur.stars, 0) / reviewList.length,
    1
  );

  const sortedReviews = reviewList.sort((a, b) => {
    if (sorting === sortOldAndNewOptions[0]) {
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
            <SortingMenu
              sortingOptions={sortOldAndNewOptions}
              sorting={sorting}
              setSorting={setSorting}
              bgColor="bg-darkPurple"
            />
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
          <SortingMenu
            sortingOptions={sortOldAndNewOptions}
            sorting={sorting}
            setSorting={setSorting}
            bgColor="bg-darkPurple"
          />
        </div>
      </div>
      {/* Info: (20231031 - Julian) Reviews List */}
      <div className="my-6 flex flex-col space-y-4 lg:space-y-0">{displayedReviews}</div>
    </div>
  );
};

export default ReviewSection;
