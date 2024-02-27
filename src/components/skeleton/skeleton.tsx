import {cn} from '../../lib/common';

interface ISkeletonProps {
  width: number;
  height: number;
  rounded?: boolean;
  className?: string;
}

interface ISkeletonListProps {
  count: number;
}

const Skeleton = ({width, height, rounded, className}: ISkeletonProps) => {
  return (
    <div
      className={cn('relative overflow-hidden bg-skeleton', rounded ? 'rounded-full' : 'rounded')}
      style={{width: `${width}px`, height: `${height}px`}}
    >
      <span
        className={cn(
          'absolute left-0 top-0 w-full animate-loading bg-skeletonCube blur-xl',
          className
        )}
        style={{height: `${height}px`}}
      ></span>
    </div>
  );
};

export const SkeletonList = ({count}: ISkeletonListProps) => {
  return (
    <div
      role="status"
      className="space-y-2 divide-y divide-darkPurple4 rounded border border-darkPurple4 p-4 shadow md:p-6"
    >
      {' '}
      {Array.from({length: count}, (_, index) => (
        <div key={index} className={`${index !== 0 ? `pt-4` : ``}`}>
          {/* Info: (20240226 - Julian) Desktop */}
          <div className="hidden items-center justify-between lg:flex">
            <Skeleton width={200} height={30} /> <Skeleton width={50} height={30} />
          </div>
          {/* Info: (20240226 - Julian) Mobile */}
          <div className="flex items-center justify-between lg:hidden">
            <Skeleton width={100} height={30} /> <Skeleton width={40} height={30} />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
