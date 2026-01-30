'use client';

interface IToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  label?: {
    open: string;
    close: string;
  };
  labelOnRight?: boolean;
}

const Toggle = ({ isOpen, onToggle, label, labelOnRight }: IToggleProps) => {
  const labelContent = label ? (isOpen ? label?.open : label?.close) : null;

  const leftContent = labelOnRight ? <p className="text-sm text-gray-400">{labelContent}</p> : null;
  const rightContent = labelOnRight ? null : (
    <p className="text-sm text-gray-400">{labelContent}</p>
  );

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 text-nowrap"
      onClick={onToggle}
    >
      {leftContent}
      <div
        className={`relative h-4 w-8 rounded-full transition-colors ${isOpen ? 'bg-black' : 'bg-gray-300'}`}
      >
        <div
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}
        ></div>
      </div>
      {rightContent}
    </button>
  );
};

export default Toggle;
