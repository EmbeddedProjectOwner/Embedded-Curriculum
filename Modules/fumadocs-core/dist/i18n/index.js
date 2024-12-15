import "../chunk-MLKGABMK.js";

// src/i18n/middleware.ts
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";
var COOKIE = "FD_LOCALE";
function getLocale(request, locales, defaultLanguage) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => negotiatorHeaders[key] = value);
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  return matchLocale(languages, locales, defaultLanguage);
}
var defaultFormat = (locale, path) => {
  return `/${locale}/${path}`;
};
function createI18nMiddleware({
  languages,
  defaultLanguage,
  format = defaultFormat,
  hideLocale = "never"
}) {
  function getUrl(request, pathname, locale) {
    if (!locale) {
      return new URL(
        pathname.startsWith("/") ? pathname : `/${pathname}`,
        request.url
      );
    }
    return new URL(
      format(locale, pathname.startsWith("/") ? pathname.slice(1) : pathname),
      request.url
    );
  }
  return (request) => {
    const { pathname } = request.nextUrl;
    const pathLocale = languages.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    if (!pathLocale) {
      if (hideLocale === "default-locale") {
        return NextResponse.rewrite(getUrl(request, pathname, defaultLanguage));
      }
      const preferred = getLocale(request, languages, defaultLanguage);
      if (hideLocale === "always") {
        const locale = request.cookies.get(COOKIE)?.value ?? preferred;
        return NextResponse.rewrite(getUrl(request, pathname, locale));
      }
      return NextResponse.redirect(getUrl(request, pathname, preferred));
    }
    if (hideLocale === "always") {
      const path = pathname.slice(`/${pathLocale}`.length);
      const res = NextResponse.redirect(getUrl(request, path));
      res.cookies.set(COOKIE, pathLocale);
      return res;
    }
    if (hideLocale === "default-locale" && pathLocale === defaultLanguage) {
      const path = pathname.slice(`/${pathLocale}`.length);
      return NextResponse.redirect(getUrl(request, path));
    }
    return NextResponse.next();
  };
}
export {
  createI18nMiddleware
};
