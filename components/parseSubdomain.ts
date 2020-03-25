import {
  subdomains,
  backup as backupSettings,
} from './subdomain_settings.json';

import os from 'os';
function getHostName() {
  try {
    return location.hostname;
  } catch (error) {}
  try {
    return os.hostname();
  } catch (error) {}

  return '';
}

export function parseSubdomain(
  hostName?: string,
): {
  matches: string[];
  storageURL: string;
  settings: string;
  beta: boolean;
  audioURL: string;
  soglo: boolean;
  disclaimer: boolean;
} {
  try {
    const hn = getHostName();

    const subDomain = subdomains.find(s => s.matches.includes(hn));

    return subDomain ? subDomain : backupSettings;
  } catch (error) {
    return backupSettings;
  }
}
