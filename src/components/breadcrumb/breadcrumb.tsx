import {FiChevronRight} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import {BFAURL} from '@/constants/url';
import {ICrumbItem} from '@/interfaces/crumb_item';

export interface IBreadcrumbProps {
  crumbs: ICrumbItem[];
}

const Breadcrumb = ({crumbs}: IBreadcrumbProps) => {
  const crumbList = crumbs.map((crumb, i) => {
    const isHomeIcon =
      crumb.path === BFAURL.APP ? (
        <Image src="/icons/home.svg" alt="home_icon" width={24} height={24} />
      ) : null;
    const isLast = i === crumbs.length - 1;

    if (!isLast) {
      return (
        <div className="flex items-center space-x-2" key={i}>
          {/* Info: (20230904 - Julian) home icon */}
          {isHomeIcon}
          <Link
            href={crumb.path}
            className="whitespace-nowrap text-hoverWhite hover:cursor-pointer"
          >
            {crumb.label}
          </Link>
          {/* Info: (20230724 - Julian) separator */}
          <FiChevronRight className="text-2xl" />
        </div>
      );
    } else {
      return (
        <p key={i} className="text-primaryBlue">
          {crumb.label}
        </p>
      );
    }
  });

  return (
    <div className="flex items-center space-x-2 py-1 text-center font-inter text-base">
      {crumbList}
    </div>
  );
};

export default Breadcrumb;
