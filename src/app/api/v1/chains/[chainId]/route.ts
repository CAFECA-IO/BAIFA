import { MOCK_CHAINS } from '@/data/mock_chains';
import { jsonOk, jsonFail } from '@/lib/utils/response';
import { ApiCode } from '@/lib/utils/status';

export async function GET(request: Request, { params }: { params: Promise<{ chainId: string }> }) {
  const { chainId } = await params;
  const chain = MOCK_CHAINS.find((c) => c.id === chainId);

  if (!chain) {
    return jsonFail(ApiCode.NOT_FOUND, `Chain ${chainId} not found`);
  }

  return jsonOk(chain);
}
