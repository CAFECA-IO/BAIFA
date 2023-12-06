// /app/suggestions?search_input=${searchInput}

import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  suggestions: Array<string>;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const result: ResponseData = {
    'suggestions': ['110029', '113248', '114007', '115588'],
  };
  res.status(200).json(result);
}
