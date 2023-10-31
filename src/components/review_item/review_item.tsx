import Link from 'next/link';
import Image from 'next/image';
import {IReview} from '../../interfaces/review';
import {getDynamicUrl} from '../../constants/url';
import {dummyAddressData} from '../../interfaces/address';
import BoltButton from '../bolt_button/bolt_button';
import {timestampToString} from '../../lib/common';

interface ReviewItemProps {
  review: IReview;
}

const ReviewItem = (review: ReviewItemProps) => {
  const {chainId, transactionId, content, createdTimestamp, authorAddressId, stars} = review.review;

  // Info: (20231031 - Julian) Transaction Link
  const transactionLink = getDynamicUrl(chainId, `${transactionId}`).TRANSACTION;
  // Info: (20231031 - Julian) Author Address Link
  const authorChainId =
    dummyAddressData.find(address => address.id === authorAddressId)?.chainId ?? '';
  const authorLink = getDynamicUrl(authorChainId, `${authorAddressId}`).ADDRESS;

  const displayedStars = [];
  for (let i = 0; i < stars; i++) {
    displayedStars.push(
      <Image key={i} src="/icons/star.svg" alt="star_icon" width={20} height={20} />
    );
  }

  return (
    <div className="flex h-100px items-center bg-darkPurple2 p-5">
      {/* Info: (20231031 - Julian) Transaction & Stars */}
      <div className="flex flex-col items-start space-y-2">
        <Link href={transactionLink}>
          <BoltButton style="solid" color="purple" className="px-3 py-2">
            Transaction {transactionId}
          </BoltButton>
        </Link>
        <div className="flex items-center space-x-5px">{displayedStars}</div>
      </div>
      {/* Info: (20231031 - Julian) Divider */}
      <span className="mx-10 h-full w-px bg-darkPurple4"></span>
      {/* Info: (20231031 - Julian) Review Content */}
      <div className="line-clamp-2 flex-1 text-sm">{content}</div>
      {/* Info: (20231031 - Julian) Reviewer & Date */}
      <div className="ml-10 flex h-full flex-col items-end justify-between text-sm text-lilac">
        <p>{timestampToString(createdTimestamp).date}</p>
        <p>
          By{' '}
          <Link href={authorLink} className="text-primaryBlue underline">
            Address {authorAddressId}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ReviewItem;
