'use client';

import { Copy } from 'lucide-react';

interface ICopyButtonProps {
  value: string;
}

const CopyButton = ({ value }: ICopyButtonProps) => {
  const copyHandler = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <button onClick={copyHandler} className="p-2 text-gray-300 hover:text-gray-500">
      <Copy size={12} />
    </button>
  );
};

export default CopyButton;
