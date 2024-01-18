import {useState, ChangeEvent, KeyboardEvent} from 'react';
import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {ImCross} from 'react-icons/im';
import Link from 'next/link';
import {BFAURL} from '../../constants/url';

const PrivateNoteSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // ToDo: (20231117 - Julian) API
  const [isLogin /* setIsLogin */] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [addingTag, setAddingTag] = useState<boolean>(true);

  // Info: (20231017 - Julian) 輸入中文的過程中，暫停標籤的添加
  const handleCompositionStart = () => setAddingTag(false);
  // Info: (20231017 - Julian) 輸入完成後，恢復標籤的添加
  const handleCompositionEnd = () => setAddingTag(true);
  // Info: (20231017 - Julian) 輸入框的值改變時，更新 inputValue
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const addTagHandler = () => {
    const trimmedInputValue = inputValue.trim();
    // Info: (20231017 - Julian) 如果 input 為空，不新增 tag
    if (trimmedInputValue === '') return;
    // Info: (20231017 - Julian) 新增 tag 並清空 input
    setTags([...tags, trimmedInputValue]);
    setInputValue('');
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && addingTag) {
      // Info: (20231017 - Julian) 攔截 Enter 和 Space 鍵，避免輸入空白字元，並新增 tag
      e.preventDefault();
      addTagHandler();
    }
  };

  // Info: (20231017 - Julian) 點擊 tag 時，刪除該 tag
  const handleTagClick = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
  };

  const tagList = tags.map((tag, index) => (
    <div
      key={index}
      className="flex items-center space-x-2 rounded-full bg-primaryBlue px-4 py-2 text-sm text-darkPurple3"
    >
      <p>{tag}</p>
      <button className="text-xxs" onClick={() => handleTagClick(tag)}>
        <ImCross />
      </button>
    </div>
  ));

  const displayNotes = (
    <>
      {/* Info: (20231017 - Julian) Tag List */}
      <div className="mb-2 flex flex-wrap gap-2">{tagList}</div>
      {/* Info: (20231017 - Julian) Input part */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="h-55px w-full rounded bg-purpleLinear px-3 py-2 text-base text-hoverWhite"
          placeholder={t('COMMON.PRIVATE_NOTE_PLACEHOLDER')}
        />
        <button className="absolute right-4" onClick={addTagHandler}>
          <Image src="/icons/edit.svg" alt="edit_icon" width={24} height={24} />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex w-full flex-col space-y-4">
      <h2 className="text-xl text-lilac">{t('COMMON.PRIVATE_NOTE_TITLE')}</h2>
      <div className="flex w-full flex-col rounded-lg bg-darkPurple p-4 shadow-xl">
        {isLogin ? (
          displayNotes
        ) : (
          <div className="flex w-full items-center justify-center py-2">
            <Link href={BFAURL.COMING_SOON}>
              <p className="text-base text-primaryBlue underline underline-offset-2">
                {t('COMMON.LOG_IN_ONLY')}
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateNoteSection;
