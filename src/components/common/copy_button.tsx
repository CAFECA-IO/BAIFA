'use client';

import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface ICopyButtonProps {
  value: string;
}

const CopyButton = ({ value }: ICopyButtonProps) => {
  const copyHandler = () => {
    navigator.clipboard.writeText(value);
    toast.success('複製成功！');
  };

  return (
    <button
      type="button"
      onClick={copyHandler}
      className="p-2 text-gray-300 hover:text-gray-500"
      aria-label="Copy to clipboard"
    >
      <Copy size={12} />
    </button>
  );
};

export default CopyButton;
