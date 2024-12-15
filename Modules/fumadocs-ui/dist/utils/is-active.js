export function isActive(url, pathname, nested = true) {
    return url === pathname || (nested && pathname.startsWith(`${url}/`));
}
