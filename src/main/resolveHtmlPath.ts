import { app } from 'electron';
import path from 'path';

export const resolveHtmlPath = (htmlFileName: string): string => {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return `http://localhost:${port}/${htmlFileName}`;
  }
  return `file://${path.join(app.getAppPath(), 'dist', htmlFileName)}`;
};
