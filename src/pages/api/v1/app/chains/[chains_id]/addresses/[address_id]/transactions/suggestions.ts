// create a Hello World API
import type {NextApiRequest, NextApiResponse} from 'next';

type ResponseData = {
  suggestions: string[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const searchInput = req.query.search_input as string;

  if (!searchInput) {
    return res.status(200).json({suggestions: []});
  }

  try {
    // generate randome suggestions
    const suggestions = new Set();
    suggestions.add(searchInput);
    suggestions.add('Hello');
    suggestions.add('World');
    suggestions.add('API');

    const limitedSuggestions = Array.from(suggestions).slice(0, 5) as string[];

    // eslint-disable-next-line no-console
    console.log('limitedSuggestions', limitedSuggestions);

    return res.status(200).json({suggestions: limitedSuggestions});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching suggestions for transactions of address', error);
    return res.status(500).json({suggestions: []});
  }
}
