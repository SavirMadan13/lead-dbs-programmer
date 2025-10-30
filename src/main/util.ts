/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    // Load root in development to avoid dev-server 404s for /index.html
    return `http://localhost:${port}/`;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
