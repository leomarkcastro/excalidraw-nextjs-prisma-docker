// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export type SampleData = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SampleData>
) {
  res.status(200).json({ name: 'John Doe' });
}
