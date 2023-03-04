import fs from 'fs/promises';
import { VENDORS_PATH } from '@/config/config';
import path from 'path';

export async function handleGetVendors(cb: (_vendors: string[]) => void) {
  const files = await fs.readdir(VENDORS_PATH);

  for (const file of files) {
    if (file.endsWith(' - ')) {
      await fs.rename(
        path.join(VENDORS_PATH, file),
        path.join(VENDORS_PATH, file.replace(' - ', ' - NEW'))
      );
    }
  }

  cb(files);
}
