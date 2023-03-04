import fs from 'fs';

import { VENDORS_PATH } from '@/config/config';
import { VendorService } from '../services/VendorService';

for (const rawVendor of fs.readdirSync(VENDORS_PATH)) {
  const vendor = new VendorService(rawVendor);

  console.log(rawVendor, vendor.folderName);
}
