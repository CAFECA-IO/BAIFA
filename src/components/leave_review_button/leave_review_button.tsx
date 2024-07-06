import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {BFAURL} from '@/constants/url';
import {TranslateFunction} from '@/interfaces/locale';
import BoltButton from '@/components/bolt_button/bolt_button';

const LeaveReviewButton = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // ToDo: (20231214 - Julian) Add function
  // Note: 評論內容字數限制英文為 100 ，中文 50
  return (
    <Link href={BFAURL.COMING_SOON} className="w-300px lg:w-auto">
      <BoltButton style="solid" color="blue" className="w-full px-10 py-3 text-sm font-bold">
        {t('REVIEWS_PAGE.BUTTON')}
      </BoltButton>
    </Link>
  );
};

export default LeaveReviewButton;
