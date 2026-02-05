'use client';

import { useState, useEffect } from 'react';
import { useEthRpc } from '@/lib/hooks/use_eth_rpc';
import { formatEther, formatUnits } from 'ethers';
import { rpcService } from '@/lib/services/rpc_service';
import { AlertTriangle, Loader2 } from 'lucide-react';
import CopyButton from '@/components/common/copy_button';

const TOKEN_MAP = {
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
};

const checkAddressSecurity = async (address: string, chainId: string) => {
  try {
    // Info: (20260204 - Julian) GoPlus 支援多鏈：提供「惡意地址檢測」
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=${chainId}`
    );
    const data = await response.json();

    if (data.code === 1 && data.result) {
      const res = data.result;
      // Info: (20260204 - Julian) 檢查關鍵風險欄位
      const isScam =
        res.cybercrime === '1' || res.phishing_activities === '1' || res.blacklisted === '1';

      return {
        isScam,
        label: isScam ? '已舉報為惡意地址 (Hack/Scam)' : null,
      };
    }
  } catch (err) {
    console.error('Security check failed', err);
  }
  return { isScam: false, label: null };
};

interface IAddressDetailHeaderProps {
  chainId: string;
  address: string;
}

interface IAddressStats {
  totalAssets: string;
  ethBalance: string;
  ethValue: string;
  usdtBalance: string;
  usdcBalance: string;
}

const AddressDetailHeader = ({ chainId, address }: IAddressDetailHeaderProps) => {
  const { executeBatch, isLoading } = useEthRpc(chainId);
  const [security, setSecurity] = useState({ isScam: false, label: '' });
  const [stats, setStats] = useState<IAddressStats>({
    ethBalance: '0',
    totalAssets: '0',
    ethValue: '0',
    usdtBalance: '0',
    usdcBalance: '0',
  });

  useEffect(() => {
    // Info: (20260204 - Julian) 執行安全檢測
    checkAddressSecurity(address, chainId).then((res) => {
      if (res.isScam) setSecurity({ isScam: true, label: res.label || '' });
    });

    const fetchHeaderData = async () => {
      const requests = [
        rpcService.getBalance(address),
        rpcService.getErc20Balance(TOKEN_MAP.USDT, address),
        rpcService.getErc20Balance(TOKEN_MAP.USDC, address),
      ];

      const res = await executeBatch<string>(requests);
      if (!res) return;

      // Info: (20260204 - Julian) 安全提取 result，若為 "0x" 或 undefined 則補回 "0x0"
      const sanitize = (val: string) => (!val || val === '0x' ? '0x0' : val);

      const ethRaw = sanitize(res[0]?.result);
      const usdtRaw = sanitize(res[1]?.result);
      const usdcRaw = sanitize(res[2]?.result);

      const ethPrice = 2320.5;
      const ethBalance = parseFloat(formatEther(ethRaw));

      setStats({
        ethBalance: ethBalance.toFixed(8),
        ethValue: (ethBalance * ethPrice).toLocaleString(),
        usdtBalance: parseFloat(formatUnits(usdtRaw, 6)).toFixed(2),
        usdcBalance: parseFloat(formatUnits(usdcRaw, 6)).toFixed(2),
        totalAssets: (
          ethBalance * ethPrice +
          parseFloat(formatUnits(usdtRaw, 6)) +
          parseFloat(formatUnits(usdcRaw, 6))
        ).toLocaleString(),
      });
    };

    fetchHeaderData();
  }, [address, chainId, executeBatch]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#5841D8]" />
      </div>
    );
  }

  const isShowHackBanner = security.isScam && (
    <>
      {/* Info: (20260130 - Julian) Warning Banner */}
      <div className="flex w-full items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4 text-sm text-gray-800">
        <AlertTriangle className="shrink-0 text-orange-500" size={18} />
        <p>
          該地址被舉報為 <span className="font-bold">Hack 地址</span>
          ，請注意可能涉及的風險！
        </p>
      </div>

      {/* Info: (20260130 - Julian) Tags */}
      <div className="flex items-center gap-2">
        <p className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
          {security.label}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Info: (20260204 - Julian) Address Identity Section */}
      <div className="mb-6 flex flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200">
              {/* Info: (20260130 - Julian) Mock Identicon */}
              <div className="grid h-full grid-cols-2 gap-0.5 p-1">
                <div className="bg-orange-400"></div>
                <div className="bg-blue-400"></div>
                <div className="bg-green-400"></div>
                <div className="bg-purple-400"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">地址</span>
              <span className="text-xl font-medium text-gray-500">{address}</span>
              <CopyButton value={address} />
            </div>
          </div>
        </div>

        {isShowHackBanner}
      </div>

      {/* Info: (20260204 - Julian) Asset Overview Board */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Info: (20260204 - Julian) Top Row */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-400">ISC 鏈總資產</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">$ {stats.totalAssets}</span>
            </div>
          </div>
          <div className="space-y-2 border-gray-100 md:border-l md:pl-8">
            <div className="text-xs font-medium text-gray-400">ISC 持倉</div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">{stats.ethBalance} ISC</span>
              <span className="text-xs text-gray-500">({stats.ethValue})</span>
            </div>
          </div>
          <div className="space-y-2 border-gray-100 md:border-l md:pl-8">
            <div className="text-xs font-medium text-gray-400">USDT 持倉</div>
            <div className="text-base font-bold text-gray-900">{stats.usdtBalance} USDT</div>
          </div>
          <div className="flex items-center justify-between border-gray-100 md:border-l md:pl-8">
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400">USDC 持倉</div>
              <div className="text-base font-bold text-gray-900">{stats.usdcBalance} USDC</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressDetailHeader;
