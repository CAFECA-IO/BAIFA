import {useState} from 'react';
import {HiOutlineExclamationCircle} from 'react-icons/hi';

interface ITooltipProps {
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({children, className}: ITooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const mouseEnterHandler = () => setShowTooltip(true);
  const mouseLeaveHandler = () => setShowTooltip(false);

  return (
    <div
      className={`relative whitespace-normal text-sm font-normal text-hoverWhite ${className}`}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="text-lightGray1 opacity-70">
        <HiOutlineExclamationCircle size={24} color="#ABA7BD" />
      </div>

      <div
        role="tooltip"
        className={`w-225px absolute bottom-8 left-0 z-20 rounded bg-darkPurple2 ${
          showTooltip ? 'visible opacity-100' : 'invisible opacity-0'
        } px-3 py-2 shadow-lg shadow-black/80 transition duration-150 ease-in-out`}
      >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
