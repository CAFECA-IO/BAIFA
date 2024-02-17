interface ISkeletonProps {
  width: number;
  height: number;
  rounded?: boolean;
}

const Skeleton = ({width, height, rounded}: ISkeletonProps) => {
  const skeletonWidth = `w-${width}px`;
  const skeletonHeight = `h-${height}px`;
  const skeletonRounded = rounded ? 'rounded-full' : 'rounded';

  return (
    <div
      className={`${skeletonHeight} ${skeletonWidth} ${skeletonRounded} bg-skeleton relative overflow-hidden`}
    >
      <span
        className={`absolute bg-skeletonCube ${skeletonHeight} left-0 top-0 w-full blur-xl animate-loading`}
      ></span>
    </div>
  );
};

export default Skeleton;
