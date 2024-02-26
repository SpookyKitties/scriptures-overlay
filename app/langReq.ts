import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { appSettings } from '../components/SettingsComponent';
import { parseCookieLang } from './parseCookieLang';

export const validLangs = [
  'eng',
  'spa',
  'por',
  'fra',
  'zhs',
  'zho',
  'jpn',
  'tha',
  'pes',
  'deu',
  'bp',
];

export function langReq(req: IncomingMessage, query: ParsedUrlQuery) {
  try {
    const lang = query['lang'] as string;

    if (lang?.length >= 2) {
      return lang;
    }
  } catch (error) {}

  try {
    const lang = parseCookieLang(req.headers.cookie); // req.headers.cookie.toLowerCase() as string;
    if (lang?.length >= 2) {
      return lang;
    }
  } catch (error) {}
  try {
    const lang = appSettings.settings.lang; //req.headers.cookie.toLowerCase() as string;
    if (lang?.length >= 2) {
      return lang;
    }
  } catch (error) {}

  return 'eng';
}
