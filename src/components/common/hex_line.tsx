interface IHexLineProps {
  chunk: string;
  index: number;
  renderValue: (value: string, key: string) => React.ReactNode;
}

// 專門處理 32-byte 換行的顯示
const HexLine = ({ chunk, index, renderValue }: IHexLineProps) => (
  <div className="flex items-start gap-3 font-mono text-sm">
    <span className="shrink-0 text-gray-400 select-none">
      [{(index * 32).toString(16).padStart(3, '0')}]
    </span>
    <div className="grow">{renderValue(chunk, `data_chunk_${index}`)}</div>
  </div>
);

export default HexLine;
