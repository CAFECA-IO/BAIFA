import { MOCK_CHAINS } from '@/data/mock_chains';
import { jsonOk } from '@/lib/utils/response';

export async function GET() {
  return jsonOk(MOCK_CHAINS);
}
