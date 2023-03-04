import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

import { VENDORS_PATH } from '@/config/config';
import { VendorService } from '../VendorService';

export async function handleMerge(
  rawNewVendor: string,
  rawOldVendor: string,
  newTags: string,
  cb: () => void
) {
  const newVendor = new VendorService(rawNewVendor);
  const oldVendor = new VendorService(rawOldVendor);
  const finalVendor = new VendorService(`${newVendor.name} - ${newTags}`);

  finalVendor.addTags(oldVendor.tags);

  console.log('Merging vendors', newVendor.name, oldVendor.name);

  // Rename old folders
  fse.renameSync(
    path.join(VENDORS_PATH, oldVendor.folderName),
    path.join(VENDORS_PATH, `_${oldVendor.folderName}`)
  );
  fse.renameSync(
    path.join(VENDORS_PATH, newVendor.folderName),
    path.join(VENDORS_PATH, `_${newVendor.folderName}`)
  );

  // Create new folder
  fs.mkdirSync(path.join(VENDORS_PATH, finalVendor.folderName));

  // if ZZZ, delete folders
  if (finalVendor.hasTag('ZZZ')) {
    fs.rmSync(path.join(VENDORS_PATH, `_${newVendor.folderName}`), {
      force: true,
      recursive: true,
    });
    fs.rmSync(path.join(VENDORS_PATH, `_${oldVendor.folderName}`), {
      force: true,
      recursive: true,
    });
    cb();

    return;
  }

  // copy files
  copyFolder(`_${oldVendor.folderName}`, finalVendor.folderName);
  copyFolder(`_${newVendor.folderName}`, finalVendor.folderName);

  // Wait for 2s
  await setTimeout(() => Promise.resolve(), 2000);

  // Delete old folders
  fs.rmdirSync(path.join(VENDORS_PATH, `_${oldVendor.folderName}`));
  fs.rmdirSync(path.join(VENDORS_PATH, `_${newVendor.folderName}`));

  cb();
}

function copyFolder(from: string, to: string) {
  for (const file of fse.readdirSync(path.join(VENDORS_PATH, from))) {
    fse.moveSync(
      path.join(VENDORS_PATH, from, file),
      path.join(VENDORS_PATH, to, file),
      { overwrite: true }
    );
  }
}
