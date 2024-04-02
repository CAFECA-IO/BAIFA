import {IoIosCloseCircleOutline} from 'react-icons/io';
import {HiPlus} from 'react-icons/hi';
import {FaHeart} from 'react-icons/fa';
import {FiTrash2} from 'react-icons/fi';
import {ChangeEvent, useState} from 'react';
import useAPIResponse from '../../lib/hooks/use_api_response';
import {HttpMethod} from '../../constants/api_request';
import {buttonStyle} from '../../constants/config';

interface IAddAddressPanelProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  addAddressHandler: (address: string) => void;
}

const AddAddressPanel = ({
  modalVisible,
  modalClickHandler,
  addAddressHandler,
}: IAddAddressPanelProps) => {
  // Info: (20240326 - Julian) 是否顯示 Following List
  const [visibleFollowingList, setVisibleFollowingList] = useState(false);
  // Info: (20240326 - Julian) address 清單
  // ToDo: (20240326 - Julian) 之後應該要改成 <string[]>
  const [addressList, setAddressList] = useState<string>('');
  // Info: (20240402 - Julian) 輸入的地址
  const [inputValue, setInputValue] = useState('');
  // Info: (20240402 - Julian) 是否顯示 address 建議清單
  const [visibleAddressSuggestion, setVisibleAddressSuggestion] = useState(false);

  const {data: followingList, isLoading: isFollowingList} = useAPIResponse<string[]>(
    '/api/v1/app/tracking_tool/add_address/following_list',
    {method: HttpMethod.GET}
  );

  // Info: (20240402 - Julian) 從 API 取得的地址建議清單
  const {data: addressSuggestion} = useAPIResponse<string[]>(
    `/api/v1/app/tracking_tool/add_address/address_suggestion`,
    {method: HttpMethod.GET},
    {search_input: inputValue}
  );

  // Info: (20240326 - Julian) 顯示 Following List
  const visibleFollowingListHandler = () => setVisibleFollowingList(prev => !prev);

  // Info: (20240326 - Julian) 點擊 Add 按鈕後的處理
  const addAddressButtonHandler = () => {
    addAddressHandler(addressList);
    modalClickHandler();
  };
  // Info: (20240402 - Julian) focus 搜尋欄位時，顯示搜尋建議
  const handleInputFocus = () => setVisibleAddressSuggestion(true);
  // Info: (20240402 - Julian) 改變搜尋欄位的值
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setVisibleAddressSuggestion(true);
  };

  // Info: (20240326 - Julian) 點擊 Add 按鈕後，將輸入的地址加入清單，並清空 input
  const addButtonClickHandler = () => {
    setAddressList(inputValue);
    setInputValue('');
  };

  // Info: (20240326 - Julian) 如果清單為空，就不能點擊 Add 按鈕
  const addAddressButtonDisabled = addressList === '';

  // Info: (20240402 - Julian) 顯示建議
  const displayAddressSuggestion = visibleAddressSuggestion
    ? addressSuggestion?.map((suggestion, index) => {
        // Info: (20240402 - Julian) 將地址寫入 input，並收起建議
        const addAddressHandler = () => {
          setInputValue(suggestion);
          setVisibleAddressSuggestion(false);
        };
        return (
          <div
            key={index}
            onClick={addAddressHandler}
            className="w-full cursor-pointer px-4 py-2 text-hoverWhite hover:bg-purpleLinear"
          >
            {suggestion}
          </div>
        );
      })
    : null;

  // Info: (20240326 - Julian) 顯示地址清單
  const displayAddressList =
    addressList !== '' ? (
      <div className="flex w-full items-center border-b border-darkPurple4 px-4 py-2">
        <p className="w-100px grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-xl font-semibold text-primaryBlue lg:w-300px">
          <span className="text-hoverWhite">Address </span>
          {addressList}
        </p>

        {/* Info: (20240326 - Julian) Delete button */}
        <button onClick={() => setAddressList('')} className={`${buttonStyle} ml-4`}>
          <FiTrash2 size={24} />
        </button>
      </div>
    ) : null;

  const displayFollowingList =
    !isFollowingList && followingList ? (
      followingList.map((address, index) => {
        // Info: (20240326 - Julian) 將地址加入清單並關閉 Following List
        const addButtonHandler = () => {
          setAddressList(address);
          visibleFollowingListHandler();
        };
        return (
          <div
            key={index}
            className="flex w-full items-center border-b border-darkPurple4 px-4 py-2"
          >
            <p className="w-100px grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-xl font-semibold text-primaryBlue lg:w-300px">
              <span className="text-hoverWhite">Address </span>
              {address}
            </p>

            {/* Info: (20240326 - Julian) Add button */}
            <button onClick={addButtonHandler} className={`${buttonStyle} ml-4`}>
              <HiPlus size={24} />
            </button>
          </div>
        );
      })
    ) : (
      <p>Loading...</p>
    );

  const isShowFollowingList = visibleFollowingList ? (
    <div
      id="following-list"
      className="absolute z-80 flex w-9/10 flex-col items-center rounded bg-darkPurple p-10 shadow-lg lg:w-700px"
    >
      {/* Info: (20240326 - Julian) Close button */}
      <button
        onClick={visibleFollowingListHandler}
        className="absolute right-6 top-6 hover:opacity-75"
      >
        <IoIosCloseCircleOutline size={30} />
      </button>

      <h2 className="text-xl font-semibold">Following List</h2>
      {/* Info: (20240326 - Julian) Address list */}
      <div className="mt-10 flex h-fit w-full flex-col items-center overflow-y-auto bg-darkPurple3">
        {displayFollowingList}
      </div>
    </div>
  ) : null;

  const isShowPanel = modalVisible ? (
    <div className="fixed z-60 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/25 backdrop-blur-sm">
      <div
        id="add-address-panel"
        className="relative z-70 flex h-400px w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple p-10 lg:w-700px"
      >
        {/* Info: (20240326 - Julian) Close button */}
        <button onClick={modalClickHandler} className="absolute right-6 top-6 hover:opacity-75">
          <IoIosCloseCircleOutline size={30} />
        </button>
        {/* Info: (20240401 - Julian) Title */}
        <h2 className="text-xl font-semibold">Add address</h2>
        {/* Info: (20240326 - Julian) Input address */}
        <div className="relative flex w-full items-center">
          <input
            type="text"
            placeholder="Enter the address"
            value={inputValue}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            className="h-55px w-full rounded bg-purpleLinear px-6 text-base shadow-xl placeholder:text-lilac"
          />
          <button
            onClick={visibleFollowingListHandler}
            className="absolute right-3 rounded bg-violet px-4 py-2 text-sm hover:bg-hoverWhite hover:text-darkPurple3"
          >
            <p className="hidden lg:block">Following List</p>
            <FaHeart size={12} className="block lg:hidden" />
          </button>
          <div className="absolute top-55px flex w-full flex-col items-start bg-darkPurple4 shadow-lg">
            {displayAddressSuggestion}
          </div>
        </div>
        {/* Info: (20240326 - Julian) Add button */}
        <button onClick={addButtonClickHandler} className={`${buttonStyle} shadow-lg`}>
          <HiPlus size={24} />
        </button>
        {/* Info: (20240326 - Julian) Pre add address list */}
        <div className="flex w-full flex-1 flex-col overflow-y-auto">{displayAddressList}</div>

        <button
          disabled={addAddressButtonDisabled}
          onClick={addAddressButtonHandler}
          className="rounded bg-primaryBlue px-10 py-4 text-base font-bold text-darkPurple3 hover:bg-hoverWhite hover:text-darkPurple3 disabled:bg-lilac disabled:text-hoverWhite"
        >
          Add
        </button>
      </div>
      {/* Info: (20240326 - Julian) Following list */}
      {isShowFollowingList}
    </div>
  ) : null;

  return <>{isShowPanel}</>;
};

export default AddAddressPanel;
