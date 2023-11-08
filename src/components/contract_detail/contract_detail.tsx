import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IContract} from '../../interfaces/contract';
import Tooltip from '../tooltip/tooltip';
import BoltButton from '../bolt_button/bolt_button';
import {getDynamicUrl} from '../../constants/url';
import {timestampToString} from '../../lib/common';

interface IContractDetailProps {
  contractData: IContract;
}

const ContractDetail = ({contractData}: IContractDetailProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {contractHash, chainId, creatorAddressId, createdTimestamp} = contractData;

  const addressLink = getDynamicUrl(chainId, `${creatorAddressId}`).ADDRESS;

  return (
    <div className="flex w-full flex-col divide-y divide-darkPurple4 rounded-lg bg-darkPurple p-3 text-base shadow-xl">
      {/* Info: (20231107 - Julian) Contract Address */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CONTRACT_ADDRESS')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <p className="break-words text-sm lg:text-base">{contractHash}</p>
      </div>
      {/* Info: (20231107 - Julian) Creator */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CREATOR')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <Link href={addressLink}>
          <BoltButton className="px-3 py-1" color="blue" style="solid">
            {t('ADDRESS_DETAIL_PAGE.MAIN_TITLE')} {creatorAddressId}
          </BoltButton>
        </Link>
      </div>
      {/* Info: (20231107 - Julian) Creating Time */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-center lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.CREATING_TIME')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="mr-2">{timestampToString(createdTimestamp).date}</p>
          <p className="mr-2">{timestampToString(createdTimestamp).time}</p>
        </div>
      </div>
      {/* Info: (20231107 - Julian) Source Code */}
      {/* ToDo: (20231107 - Julian) Code */}
      <div className="flex flex-col space-y-2 px-3 py-4 lg:flex-row lg:items-start lg:space-y-0">
        <div className="flex items-center space-x-2 text-sm font-bold text-lilac lg:w-200px lg:text-base">
          <p>{t('CONTRACT_DETAIL_PAGE.SOURCE_CODE')}</p>
          <Tooltip>
            This is tooltip Sample Text. So if I type in more content, it would be like this.
          </Tooltip>
        </div>
        <pre className="max-h-200px flex-1 overflow-scroll bg-darkPurple3 p-4 text-sm">
          <code>
            <p>// SPDX-FileCopyrightText: 2021 Lido &lt;info@lido.fi&gt;</p>
            <br />
            <br />
            <p>// SPDX-License-Identifier: GPL-3.0</p>
            <br />
            <br />
            <p>/* See contracts/COMPILERS.md */</p>
            <p>pragma solidity 0.8.9;</p>
            <p>import "@openzeppelin/contracts-v4.4/token/ERC20/IERC20.sol";</p>
            <p>import "@openzeppelin/contracts-v4.4/token/ERC721/IERC721.sol";</p>
            <p>import "@openzeppelin/contracts-v4.4/token/ERC20/utils/SafeERC20.sol";</p>
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ContractDetail;
