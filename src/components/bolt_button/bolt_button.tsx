interface IBoltButtonProps {
  children: React.ReactNode;
  style: 'hollow' | 'solid';
  color: 'blue' | 'purple' | 'red';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const BoltButton = ({children, style, color, className, ...otherProps}: IBoltButtonProps) => {
  const buttonStyle =
    style === 'hollow'
      ? 'bg-transparent border text-primaryBlue hover:border-hoverWhite hover:text-hoverWhite'
      : 'hover:bg-hoverWhite';
  const buttonColor =
    color === 'blue'
      ? 'bg-primaryBlue text-darkPurple3 border-primaryBlue'
      : color === 'purple'
      ? 'bg-violet text-hoverWhite border-violet hover:text-darkPurple3'
      : 'bg-lightRed text-darkPurple3 border-lightRed';

  return (
    <button
      className={`${className} ${buttonStyle} ${buttonColor} whitespace-nowrap rounded text-base disabled:bg-lilac`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default BoltButton;
