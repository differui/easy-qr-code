import getTitleAtUrl from 'get-title-at-url';
import * as cfg from '@/configs';

/* eslint-disable import/prefer-default-export */
export function getTitle(url) {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(reject, cfg.GET_TITLE_TIMEOUT);
    }),
    new Promise((resolve, reject) => {
      getTitleAtUrl(url, (title, err) => {
        if (err) reject(err);
        else resolve(title);
      });
    }),
  ]);
}
