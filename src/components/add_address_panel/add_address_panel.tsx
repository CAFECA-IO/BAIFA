import {IoIosCloseCircleOutline} from 'react-icons/io';
import {HiPlus} from 'react-icons/hi';
import {FaHeart} from 'react-icons/fa';
import {FiTrash2} from 'react-icons/fi';
import {useState} from 'react';
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
  const [preAddAddressList, setPreAddAddressList] = useState<string[]>([]);

  const {data: followingList, isLoading: isFollowingList} = useAPIResponse<string[]>(
    '/api/v1/app/tracking_tool/add_address_list',
    {method: HttpMethod.GET}
  );

  const visibleFollowingListHandler = () => setVisibleFollowingList(prev => !prev);

  // Info: (20240326 - Julian) 點擊 Add 按鈕後的處理
  const addAddressButtonHandler = () => {
    // ToDo: (20240326 - Julian) 暫時只取第一筆
    addAddressHandler(preAddAddressList[1]);
    modalClickHandler();
  };
  // Info: (20240326 - Julian) 如果清單為空，就不能點擊 Add 按鈕
  const addAddressButtonDisabled = preAddAddressList.length <= 0;

  const displayPreAddAddressList = preAddAddressList.map((address, index) => {
    const deleteButtonHandler = () => {
      setPreAddAddressList(prev => prev.filter((_, i) => i !== index));
    };
    return (
      <div key={index} className="flex w-full items-center border-b border-darkPurple4 px-4 py-2">
        <p className="w-100px grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-xl font-semibold text-primaryBlue lg:w-300px">
          <span className="text-hoverWhite">Address </span>
          {address}
        </p>

        {/* Info: (20240326 - Julian) Delete button */}
        <button onClick={deleteButtonHandler} className={`${buttonStyle} ml-4`}>
          <FiTrash2 size={24} />
        </button>
      </div>
    );
  });

  const displayFollowingList =
    !isFollowingList && followingList ? (
      followingList.map((address, index) => {
        // Info: (20240326 - Julian) 將地址加入清單並關閉 Following List
        const addButtonHandler = () => {
          setPreAddAddressList(prev => {
            // Info: (20240326 - Julian) 避免重複加入
            if (prev.includes(address)) return prev;
            return [...prev, address];
          });
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
      <div className="mt-10 flex h-400px w-full flex-col items-center overflow-y-auto bg-darkPurple3">
        {displayFollowingList}
      </div>
    </div>
  ) : null;

  const isShowPanel = modalVisible ? (
    <div className="fixed z-60 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/25 backdrop-blur-sm">
      <div
        id="add-address-panel"
        className="relative z-70 flex h-400px w-9/10 flex-col items-center gap-4 rounded bg-darkPurple p-10 lg:w-700px"
      >
        {/* Info: (20240326 - Julian) Close button */}
        <button onClick={modalClickHandler} className="absolute right-6 top-6 hover:opacity-75">
          <IoIosCloseCircleOutline size={30} />
        </button>

        <h2 className="text-xl font-semibold">Add address</h2>
        {/* Info: (20240326 - Julian) Input address */}
        <div className="relative flex w-full items-center">
          <input
            type="text"
            placeholder="Enter the address"
            className="h-55px w-full rounded bg-purpleLinear px-6 text-base shadow-xl placeholder:text-lilac"
          />
          <button
            onClick={visibleFollowingListHandler}
            className="absolute right-3 rounded bg-violet px-4 py-2 text-sm hover:bg-hoverWhite hover:text-darkPurple3"
          >
            <p className="hidden lg:block">Following List</p>
            <FaHeart size={12} className="block lg:hidden" />
          </button>
        </div>
        {/* Info: (20240326 - Julian) Add button */}
        <button className={buttonStyle}>
          <HiPlus size={24} />
        </button>
        {/* Info: (20240326 - Julian) Pre add address list */}
        <div className="flex w-full flex-1 flex-col overflow-y-auto">
          {displayPreAddAddressList}
        </div>

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
