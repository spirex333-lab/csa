import { UAParser } from 'ua-parser-js';
import { getUniqueId } from '../../core';
export type IPUAProps = {
  ipInfoAPIURL?: string;
  ua: string;
};
export const getIPUA = async (ip_: string, opts: IPUAProps) => {
  const visitorId = getUniqueId();
  let ip = ip_?.match(
    /\b((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\b/
  )?.[0];
  ip ??= '::1';
  const ipInfoAPIURL =
    opts?.ipInfoAPIURL ??
    // `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`;
    `https://api.ipapi.is/?q=${ip}`;
  // opts?.ipInfoAPIURL ?? `https://ipinfo.io/${clientIP}/json`;

  if (ip?.length) {
    // get details from third party API
    const resp = await fetch(ipInfoAPIURL);
    const ipInfo = await resp?.json?.();
    // ipInfo.ip = ipInfo.query;
    if (ipInfo?.ip) {
      // call cloaker server api to get a/b response
      const { browser, cpu, device, engine, os, ua } = UAParser(opts?.ua);
      const ipua = {
        ip,
        ipInfo,
        ua: {
          browser,
          device,
          platform: os,
        },
        visitorId,
      };
      return ipua;
    }
  }
  return;
};
