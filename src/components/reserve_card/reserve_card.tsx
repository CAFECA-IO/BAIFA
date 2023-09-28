import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {BiLinkAlt} from 'react-icons/bi';
import {TranslateFunction} from '../../interfaces/locale';
import BoltButton from '../bolt_button/bolt_button';

interface IReserveCardProps {
  name: string;
  ratio: string;
  userHoldings: string;
  walletAssets: string;
  icon: string;
  link: string;
  color: string;
}

const ReserveCard = ({
  name,
  ratio,
  userHoldings,
  walletAssets,
  icon,
  link,
  color,
}: IReserveCardProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <div className="flex h-auto w-350px flex-col rounded-lg bg-darkPurple p-8 font-inter shadow-xl">
      <div className="mb-3 flex items-center">
        {/* Info: (20230928 - Julian) Icon */}
        <div className="mr-3 inline-flex shrink-0 items-center justify-center rounded-full">
          <Image src={icon} width={50} height={50} alt={`${name}_icon`} />
        </div>
        {/* Info: (20230928 - Julian) Title */}
        <div className="flex flex-col">
          <h2 className={`text-3xl font-medium ${color}`}>{name}</h2>
          <p> {t('PLUGIN.RESERVE_RATIO_BLOCK_CARD')}</p>
        </div>
      </div>

      <div className="flex-1">
        {/* Info: (20230927 - Julian) Percentage */}
        <p className="font-bold">
          <span className="pr-2 text-6xl leading-relaxed">{ratio}</span> %
        </p>

        {/* Info: (20230927 - Julian) Blockchain Button */}
        <div className="flex w-full justify-end border-b border-darkPurple4 pb-5">
          <BoltButton
            style="solid"
            color="purple"
            className="rounded-full px-3 py-1 transition-all duration-300 ease-in-out"
          >
            <Link
              href={link}
              target="_blank"
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <p> {t('PLUGIN.RESERVE_RATIO_BLOCK_CARD_2')}</p>
              <BiLinkAlt size={20} />
            </Link>
          </BoltButton>
        </div>

        <div className="my-5 flex flex-col space-y-2">
          <p className="text-base text-lilac">{t('PLUGIN.RESERVE_RATIO_BLOCK_DESCRIPTION')}</p>
          <p>{userHoldings}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-base text-lilac">{t('PLUGIN.RESERVE_RATIO_BLOCK_DESCRIPTION_2')}</p>
          <p>{walletAssets}</p>
        </div>
      </div>
    </div>
  );
};

export default ReserveCard;
