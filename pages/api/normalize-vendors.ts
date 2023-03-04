import fs from 'fs';

import path from 'path';

import { VENDORS_PATH } from '@/config/config';
import { VendorService } from '@/services/VendorService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = [];
  const { act } = req.query;

  for (const rawVendor of fs.readdirSync(VENDORS_PATH)) {
    const vendor = new VendorService(rawVendor);

    if (rawVendor === vendor.folderName) {
      continue;
    }

    resp.push([rawVendor, vendor.folderName]);

    if (act) {
      fs.renameSync(
        path.join(VENDORS_PATH, rawVendor),
        path.join(VENDORS_PATH, vendor.folderName)
      );
    }
  }

  res.status(200).json(resp);
}
