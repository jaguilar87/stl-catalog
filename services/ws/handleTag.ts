import fse from 'fs-extra';
import path from 'path';

import { VENDORS_PATH } from '@/config/config';
import { VendorService } from '../VendorService';

export async function handleTag(
  rawVendor: string,
  tags: string,
  cb: () => void
) {
  const vendor = new VendorService(rawVendor);

  vendor.removeTag('NEW');
  for (const tag of tags.split(' ')) {
    vendor.addTag(tag);
  }

  if (vendor.tags.size === 0) {
    console.error('Cannot remove all tags from vendor', vendor);
    return cb();
  }

  fse.moveSync(
    path.join(VENDORS_PATH, rawVendor),
    path.join(VENDORS_PATH, vendor.folderName),
    { overwrite: true }
  );

  if (vendor.hasTag('ZZZ')) {
    fse.emptyDirSync(path.join(VENDORS_PATH, vendor.folderName));
  }

  cb();
}
