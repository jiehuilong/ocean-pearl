// Direct message access — no next-intl hooks needed in server components
import en from '../messages/en.json';
import zh from '../messages/zh.json';
import ja from '../messages/ja.json';
import fr from '../messages/fr.json';

const all = { en, zh, ja, fr };

export function t(locale, path) {
  const msg = all[locale] || all.en;
  const keys = path.split('.');
  let val = msg;
  for (const k of keys) {
    if (val == null || typeof val !== 'object') return path;
    val = val[k];
  }
  return typeof val === 'string' ? val : path;
}
