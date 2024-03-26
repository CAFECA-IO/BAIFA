import {IoIosCloseCircleOutline} from 'react-icons/io';
import {HiPlus} from 'react-icons/hi';
import {FaHeart} from 'react-icons/fa';

interface IAddAddressPanelProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
}

const AddAddressPanel = ({modalVisible, modalClickHandler}: IAddAddressPanelProps) => {
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
          <button className="absolute right-3 rounded bg-violet px-4 py-2 text-sm hover:bg-hoverWhite hover:text-darkPurple3">
            <p className="hidden lg:block">Following List</p>
            <FaHeart size={12} className="block lg:hidden" />
          </button>
        </div>
        {/* Info: (20240326 - Julian) Add button */}
        <button className="flex h-48px w-48px items-center justify-center rounded bg-purpleLinear hover:opacity-75 disabled:opacity-50">
          <HiPlus size={24} />
        </button>
        {/* Info: (20240326 - Julian) Address list */}
        <div className="flex flex-1 flex-col overflow-y-auto"></div>

        <button className="rounded bg-primaryBlue px-10 py-4 text-base font-bold text-darkPurple3 hover:bg-hoverWhite hover:text-darkPurple3 disabled:bg-lilac disabled:text-hoverWhite">
          Add
        </button>
      </div>
    </div>
  ) : null;

  return <>{isShowPanel}</>;
};

export default AddAddressPanel;
