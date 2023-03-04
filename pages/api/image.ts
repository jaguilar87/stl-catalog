import fse from 'fs-extra';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;

  fse.createReadStream(path as string).pipe(res);
}
