import fse from 'fs-extra';
import path from 'path';

import { VENDORS_PATH } from '@/config/config';

function scanForImages(basePath: string, images: string[] = []) {
  for (const file of fse.readdirSync(basePath)) {
    const fullPath = path.join(basePath, file);
    const lstat = fse.lstatSync(fullPath);

    if (lstat.isDirectory()) {
      scanForImages(fullPath, images);
    }

    if (lstat.isFile() && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file)) {
      images.push(fullPath);
    }
  }

  return images;
}

export async function handleGetGallery(
  rawVendor: string,
  cb: (_: string[]) => void
) {
  if (!rawVendor) {
    cb([]);
    return;
  }

  console.log('Fetching gallery for vendor: ', rawVendor);

  const ret: string[] = [];
  const basePath = path.join(VENDORS_PATH, rawVendor);

  scanForImages(basePath, ret);

  cb(ret);
}
