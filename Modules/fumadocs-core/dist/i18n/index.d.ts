import { I as I18nConfig } from '../config-inq6kP6y.js';
import { NextMiddleware } from 'next/dist/server/web/types';

interface MiddlewareOptions extends I18nConfig {
    /**
     * A function that adds the locale prefix to path name
     */
    format?: (locale: string, path: string) => string;
}
declare function createI18nMiddleware({ languages, defaultLanguage, format, hideLocale, }: MiddlewareOptions): NextMiddleware;

export { I18nConfig, createI18nMiddleware };
