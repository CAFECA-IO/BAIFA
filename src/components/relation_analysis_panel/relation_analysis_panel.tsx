import {useState, useEffect} from 'react';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import {VscCircleSmall} from 'react-icons/vsc';
import {HttpMethod} from '@/constants/api_request';
import {IRelationAnalysis} from '@/interfaces/relation_analysis';
import {truncateText} from '@/lib/common';
import useAPIResponse from '@/lib/hooks/use_api_response';
import BoltButton from '@/components/bolt_button/bolt_button';
import Skeleton from '@/components/skeleton/skeleton';

interface IRelationAnalysisPanelProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  analysisItems: string[];
}

const RelationAnalysisPanel = ({
  modalVisible,
  modalClickHandler,
  analysisItems,
}: IRelationAnalysisPanelProps) => {
  const [items, setItems] = useState<string[]>(['', '']);

  useEffect(() => {
    if (analysisItems.length === 2) {
      setItems(analysisItems);
    }
  }, [analysisItems]);

  const {
    data: analysisData,
    isLoading,
    error: analysisError,
  } = useAPIResponse<IRelationAnalysis>(
    `/api/v1/app/tracking_tool/relation_analysis`,
    {method: HttpMethod.GET},
    {
      addressIdA: items[0],
      addressIdB: items[1],
    }
  );

  const isAnalysisSkeleton =
    analysisData && !isLoading ? (
      <div
        id="relation-analysis-panel"
        className="relative z-70 flex h-fit w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple p-10 lg:w-500px"
      >
        {/* Info: (20240408 - Julian) Close button */}
        <button onClick={modalClickHandler} className="absolute right-6 top-6 hover:opacity-75">
          <IoIosCloseCircleOutline size={30} />
        </button>
        {/* Info: (20240408 - Julian) Title */}
        <h2 className="text-xl font-semibold">Relation Analysis</h2>
        <div className="flex flex-col items-center gap-8">
          {/* Info: (20240408 - Julian) Subtitle */}
          <p>
            Between{' '}
            <span className="whitespace-nowrap rounded bg-violet px-2 py-1">
              Address {truncateText(items[0], 7)}
            </span>{' '}
            and{' '}
            <span className="whitespace-nowrap rounded bg-violet px-2 py-1">
              Address {truncateText(items[1], 7)}
            </span>
          </p>
          {/* Info: (20240408 - Julian) Analysis */}
          <div className="flex w-full flex-col items-start gap-3">
            {/* Info: (20240408 - Julian) Connecting Level */}
            <div className="flex items-center whitespace-nowrap">
              Connecting Level
              <div className="ml-2 flex items-center whitespace-nowrap">
                <VscCircleSmall />
                <p>{analysisData.connectingLevel}</p>
              </div>
            </div>
            <hr className="h-px w-full border-lilac" />
            {/* Info: (20240408 - Julian) Direct Transactions */}
            <div className="flex items-center whitespace-nowrap">
              Direct Transactions:
              <p className="ml-2 whitespace-nowrap">{analysisData.directTransactionCount} Times</p>
            </div>
            {/* Info: (20240408 - Julian) Total Direct Transactions Volume */}
            <div className="flex items-center whitespace-nowrap">
              Total Direct Transactions Volume:
              <p className="ml-2 whitespace-nowrap">
                {analysisData.totalDirectTransactionsVolume} {analysisData.directUnit}
              </p>
            </div>
            {/* Info: (20240408 - Julian) Minimum Connecting Layer */}
            <div className="flex items-center whitespace-nowrap">
              Minimum Connecting Layer:
              <p className="ml-2 whitespace-nowrap">{analysisData.minimumConnectingLayer}</p>
            </div>
            {/* Info: (20240408 - Julian) Transaction within 3 layers */}
            <div className="flex items-center whitespace-nowrap">
              Transaction within 3 layers:
              <p className="ml-2 whitespace-nowrap">{analysisData.transactionWithinThreeLayers}</p>
            </div>
            {/* Info: (20240408 - Julian) Common Counterpart */}
            <div className="flex items-center whitespace-nowrap">
              Common Counterpart:
              <p className="ml-2 whitespace-nowrap">
                {analysisData.commonAddressCount} Addresses and {analysisData.commonContractCount}{' '}
                Contracts
              </p>
            </div>
            {/* Info: (20240408 - Julian) Pattern similarity level */}
            <div className="flex items-center whitespace-nowrap">
              Pattern similarity level:
              <p className="ml-2 whitespace-nowrap">{analysisData.patternSimilarityLevel}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end gap-2">
          {/* ToDo: (20240408 - Julian) Generate Report */}
          {/* <BoltButton style="solid" color="purple" className="px-3 py-2">
            Generate Report
          </BoltButton> */}
          <BoltButton
            onClick={modalClickHandler}
            style="solid"
            color="purple"
            className="px-3 py-2"
          >
            Okay
          </BoltButton>
        </div>
      </div>
    ) : (
      // ToDo: (20240408 - Julian) Loading
      <div className="relative z-70 flex h-fit w-9/10 flex-col items-center gap-4 rounded-lg bg-darkPurple p-10 lg:w-500px">
        {/* Info: (20240408 - Julian) Close button */}
        <button onClick={modalClickHandler} className="absolute right-6 top-6 hover:opacity-75">
          <IoIosCloseCircleOutline size={30} />
        </button>
        {/* Info: (20240408 - Julian) Title */}
        <h2 className="text-xl font-semibold">Relation Analysis</h2>
        <div className="flex flex-col items-center gap-8">
          {/* Info: (20240408 - Julian) Subtitle */}
          <p>
            Between{' '}
            <span className="whitespace-nowrap rounded bg-violet px-2 py-1">
              Address {truncateText(items[0], 7)}
            </span>{' '}
            and{' '}
            <span className="whitespace-nowrap rounded bg-violet px-2 py-1">
              Address {truncateText(items[1], 7)}
            </span>
          </p>
          {/* Info: (20240408 - Julian) Analysis */}
          <div className="flex w-full flex-col items-start gap-3">
            {/* Info: (20240408 - Julian) Connecting Level */}
            <div className="flex items-center whitespace-nowrap">
              Connecting Level
              <div className="ml-2 flex items-center whitespace-nowrap">
                <VscCircleSmall />
                <Skeleton width={100} height={20} />
              </div>
            </div>
            <hr className="h-px w-full border-lilac" />
            {/* Info: (20240408 - Julian) Direct Transactions */}
            <div className="flex items-center whitespace-nowrap">
              Direct Transactions: <Skeleton width={50} height={20} />
            </div>
            {/* Info: (20240408 - Julian) Total Direct Transactions Volume */}
            <div className="flex items-center whitespace-nowrap">
              Total Direct Transactions Volume: <Skeleton width={50} height={20} />
            </div>
            {/* Info: (20240408 - Julian) Minimum Connecting Layer */}
            <div className="flex items-center whitespace-nowrap">
              Minimum Connecting Layer: <Skeleton width={50} height={20} />
            </div>
            {/* Info: (20240408 - Julian) Transaction within 3 layers */}
            <div className="flex items-center whitespace-nowrap">
              Transaction within 3 layers: <Skeleton width={50} height={20} />
            </div>
            {/* Info: (20240408 - Julian) Common Counterpart */}
            <div className="flex items-center whitespace-nowrap">
              Common Counterpart: <Skeleton width={100} height={20} />
            </div>
            {/* Info: (20240408 - Julian) Pattern similarity level */}
            <div className="flex items-center whitespace-nowrap">
              Pattern similarity level: <Skeleton width={50} height={20} />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end gap-2">
          <BoltButton
            onClick={modalClickHandler}
            style="solid"
            color="purple"
            className="px-3 py-2"
          >
            Okay
          </BoltButton>
        </div>
      </div>
    );

  // Info: (20240408 - Julian) 判斷是否有拿到 API 回傳的資料，如果沒有則顯示提示訊息
  const isAnalysisItems =
    analysisItems.length !== 2 || analysisError ? (
      <div className="flex flex-col items-center gap-4 rounded-lg bg-darkPurple p-10">
        <p>Please select 2 items to analysis</p>
        <BoltButton onClick={modalClickHandler} style="solid" color="purple" className="px-3 py-2">
          OK
        </BoltButton>
      </div>
    ) : (
      isAnalysisSkeleton
    );

  const isShowPanel = modalVisible ? (
    <div className="fixed z-60 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/25 backdrop-blur-sm">
      {isAnalysisItems}
    </div>
  ) : null;

  return <>{isShowPanel}</>;
};

export default RelationAnalysisPanel;
