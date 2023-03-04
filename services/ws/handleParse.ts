import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

import { PARSE_MSGS } from '@/utils/constants';
import { VENDORS_PATH } from '@/config/config';
import { VendorService } from '../VendorService';
import { slugify } from '@/utils/slugify';
import type { ParserResponseDto } from '@/types';

export async function handleParse(
  folder: string,
  cb: (_msgs: ParserResponseDto[]) => void
) {
  if (!fs.existsSync(folder)) {
    cb([
      {
        type: PARSE_MSGS.ERROR,
        msg: `Error: Folder '${folder}' does not exist`,
      },
    ]);
    return;
  }

  const msgs = [];
  const vendors = fs
    .readdirSync(VENDORS_PATH)
    .map((vendor) => new VendorService(vendor));

  for (const parsedFile of fs.readdirSync(folder)) {
    try {
      console.debug(`Parsing ${parsedFile}...`);

      let [, name] =
        /^(.+?)([\s-]+)(\d{1,4})[\s\-_]+(\d{1,4})/.exec(parsedFile) || [];

      if (!name) continue;

      const similarVendors = vendors.filter(
        (vendor) =>
          vendor.folderName.startsWith(`${slugify(name)} -`) &&
          vendor.folderName !== parsedFile.toLowerCase()
      );

      if (similarVendors.length === 0) {
        const newVendor = new VendorService(`${name} - NEW`);
        fs.mkdirSync(path.join(VENDORS_PATH, newVendor.folderName));
        fse.moveSync(
          path.join(folder, parsedFile),
          path.join(VENDORS_PATH, newVendor.folderName, parsedFile),
          { overwrite: true }
        );

        vendors.push(newVendor);
        msgs.push({
          type: PARSE_MSGS.NEW_VENDOR,
          msg: `Created new vendor ${name}`,
          name: newVendor.folderName,
        });

        continue;
      }

      if (similarVendors.length > 1) {
        msgs.push({
          type: PARSE_MSGS.MULTIPLE_MATCHES,
          msg: `Error: Found ${similarVendors.length} similar vendors for ${parsedFile}`,
        });
        continue;
      }

      const vendor = similarVendors[0];

      if (vendor.hasTag('ZZZ')) {
        fse.removeSync(path.join(folder, parsedFile));
        msgs.push({ type: PARSE_MSGS.DELETED, msg: `Deleted ${parsedFile}` });
        continue;
      }

      fse.moveSync(
        path.join(folder, parsedFile),
        path.join(VENDORS_PATH, vendor.folderName, parsedFile),
        { overwrite: true }
      );

      msgs.push({
        type: PARSE_MSGS.SUCCESS,
        msg: `Moved ${parsedFile} to ${vendor.name}`,
      });
    } catch (err: any) {
      console.error(err, parsedFile);
      msgs.push({ type: PARSE_MSGS.ERROR, msg: err.message, name: parsedFile });
    }
  }

  console.debug('Done parsing!');
  msgs.push({ type: PARSE_MSGS.DONE, msg: 'Done parsing!' });

  cb(msgs);
}
