import { exec } from 'child_process';
import { VENDORS_PATH } from '@/config/config';

export async function handleExplore(vendor: string) {
  exec(`start "" "${VENDORS_PATH}\\${vendor}"`);
}
