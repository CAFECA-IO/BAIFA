import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {DEFAULT_TRUNCATE_LENGTH} from '@/constants/config';
import {getDynamicUrl} from '@/constants/url';
import {IReviewDetail} from '@/interfaces/review';
import {TranslateFunction} from '@/interfaces/locale';
import {timestampToString, truncateText} from '@/lib/common';
import Skeleton from '@/components/skeleton/skeleton';

interface ReviewItemProps {
  review: IReviewDetail;
}

const ReviewItem = (review: ReviewItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {chainId, content, createdTimestamp, authorAddress, stars} = review.review;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!!authorAddress) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authorAddress]);

  /* Info: (20240221 - Shirley) hide transaction cause it's unnecessary
  // Info: (20231031 - Julian) Transaction Link
  // const transactionLink = getDynamicUrl(chainId, `${transactionId}`).TRANSACTION;
  */

  // Info: (20231031 - Julian) Author Address Link
  const authorChainId = chainId;
  const authorLink = getDynamicUrl(authorChainId, `${authorAddress}`).ADDRESS;

  // Info: (20231031 - Julian) Stars
  const displayedStars = [];
  for (let i = 0; i < stars; i++) {
    displayedStars.push(
      <Image key={i} src="/icons/star.svg" alt="star_icon" width={20} height={20} />
    );
  }

  return (
    <div className="flex flex-col items-start border-b border-darkPurple4 bg-darkPurple2 px-3 py-4 lg:h-100px lg:flex-row lg:items-center lg:p-5">
      {/* Info: (20231031 - Julian) Transaction & Stars */}
      <div className="flex flex-col items-start space-y-2">
        {/* Info: (20240221 - Shirley) hide transaction cause it's unnecessary */}
        {/* <Link href={transactionLink}>
          <BoltButton style="solid" color="purple" className="px-3 py-2 text-sm">
            {t('TRANSACTION_DETAIL_PAGE.MAIN_TITLE')} {transactionId}
          </BoltButton>
        </Link> */}
        <div className="flex w-100px items-center space-x-5px">
          {loading ? <Skeleton width={100} height={30} /> : displayedStars}
        </div>
      </div>
      {/* Info: (20231031 - Julian) Divider */}
      <span className="my-2 h-px w-full bg-darkPurple4 lg:mx-10 lg:h-full lg:w-px"></span>
      {/* Info: (20231031 - Julian) Review Content */}
      <div className="line-clamp-3 flex-1 text-sm leading-5">
        {loading ? <Skeleton width={300} height={30} /> : content}
      </div>
      {/* Info: (20231031 - Julian) Reviewer & Date */}
      <div className="mt-2 flex h-full flex-col items-start space-y-2 text-sm text-lilac lg:ml-10 lg:mt-0 lg:items-end lg:justify-between">
        <div>
          {loading ? <Skeleton width={50} height={20} /> : timestampToString(createdTimestamp).date}{' '}
        </div>
        <div>
          {loading ? (
            <Skeleton width={200} height={20} />
          ) : (
            <>
              {t('REVIEWS_PAGE.BY')}{' '}
              <Link
                href={authorLink}
                title={authorAddress}
                className="text-primaryBlue underline underline-offset-2"
              >
                {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE_ADDRESS')}{' '}
                {truncateText(authorAddress, DEFAULT_TRUNCATE_LENGTH)}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
