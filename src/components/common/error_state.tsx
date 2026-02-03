'use client';

import { XCircle } from 'lucide-react';

interface IErrorStateProps {
  title?: string; // 錯誤標題，預設為「數據加載失敗」
  message?: string | null; // 錯誤詳細訊息
  onRetry?: () => void; // 重試按鈕的回調函式
  showContainer?: boolean; // 是否顯示邊框與陰影 (容器樣式)，預設為 false
}

const ErrorState = ({
  title = '數據加載失敗',
  message,
  onRetry,
  showContainer = false,
}: IErrorStateProps) => {
  const containerClasses = showContainer
    ? 'rounded-xl border border-gray-100 bg-white p-6 shadow-md'
    : '';

  return (
    <div
      className={`flex flex-col items-center justify-center py-10 text-center ${containerClasses}`}
    >
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <XCircle size={28} />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-red-900">{title}</h3>
      {message && <p className="max-w-md text-sm text-red-600">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
        >
          重試
        </button>
      )}
    </div>
  );
};

export default ErrorState;
