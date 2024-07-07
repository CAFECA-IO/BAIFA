import {Dispatch, SetStateAction} from 'react';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {DEFAULT_REVIEWS_COUNT_IN_PAGE, sortOldAndNewOptions} from '@/constants/config';
import {BFAURL} from '@/constants/url';
import {IReviewDetail, IReviews} from '@/interfaces/review';
import {TranslateFunction} from '@/interfaces/locale';
import {roundToDecimal} from '@/lib/common';
import ReviewItem from '@/components/review_item/review_item';
import BoltButton from '@/components/bolt_button/bolt_button';
import SortingMenu from '@/components/sorting_menu/sorting_menu';
import Skeleton from '@/components/skeleton/skeleton';

interface IReviewDetailSection {
  reviews: IReviews;
  sorting: string;
  setSorting: Dispatch<SetStateAction<string>>;
  isLoading?: boolean;
}

const ReviewSection = ({reviews, sorting, setSorting, isLoading}: IReviewDetailSection) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {score, reviewData} = reviews;

  const sortedReviews = reviewData
    ? reviewData.sort((a, b) => {
        if (sorting === sortOldAndNewOptions[0]) {
          return b.createdTimestamp - a.createdTimestamp;
        } else {
          return a.createdTimestamp - b.createdTimestamp;
        }
      })
    : [];

  // Info: (20231031 - Julian) 全部的 Review
  const displayedReviews = sortedReviews.map((review, index) => (
    <ReviewItem key={index} review={review} />
  ));

  const leaveReviewButton = (
    <Link href={BFAURL.COMING_SOON} className="w-300px lg:w-auto">
      <BoltButton style="solid" color="blue" className="w-full px-10 py-3 text-sm font-bold">
        {t('REVIEWS_PAGE.BUTTON')}
      </BoltButton>
    </Link>
  );

  const displayedReviewSection = isLoading ? (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full flex-col items-center justify-between space-y-10 rounded lg:flex-row lg:space-y-0">
        <h2 className="text-6xl">
          <Skeleton width={200} height={50} />
        </h2>
        {/* Info: (20231031 - Julian) Sort & Leave review button */}
        <div className="flex flex-col items-end space-y-10 lg:space-y-4">
          {leaveReviewButton}
          <SortingMenu
            sortingOptions={sortOldAndNewOptions}
            sorting={sorting}
            setSorting={setSorting}
            bgColor="bg-darkPurple"
            loading={isLoading}
          />{' '}
        </div>
      </div>
      {/* Info: (20231031 - Julian) Reviews List */}
      <div className="my-6 flex flex-col space-y-4 lg:space-y-0">
        {Array.from({length: DEFAULT_REVIEWS_COUNT_IN_PAGE}).map((_, index) => (
          <ReviewItem key={index} review={{} as IReviewDetail} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full flex-col items-center justify-between space-y-10 rounded lg:flex-row lg:space-y-0">
        <h2 className="text-6xl">
          {roundToDecimal(score, 1)}
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
            loading={isLoading}
          />
        </div>
      </div>
      {/* Info: (20231031 - Julian) Reviews List */}
      <div className="my-6 flex flex-col space-y-4 lg:space-y-0">{displayedReviews}</div>
    </div>
  );

  return <>{displayedReviewSection}</>;
};

export default ReviewSection;
