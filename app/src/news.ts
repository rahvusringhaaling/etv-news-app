
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { IPortal } from './types/IPortal';
import { Language } from './types/Language';
import { data } from './server';

const portalsFallback: IPortal[] = [
  {
    enabled: true,
    name: 'uudised',
    portal: 'uudised',
    minItems: 7,
    maxItems: 7,
    lastHours: 24,
    primaryColor: '#2E3192',
    textColor: '#EEEEEE'
  },
  // {
  //   enabled: true,
  //   name: 'kultuur',
  //   portal: 'kultuur',
  //   minItems: 3,
  //   maxItems: 3,
  //   lastHours: 24,
  //   primaryColor: '#DAB230',
  //   textColor: '#1E1E1E'
  // },
  // {
  //   enabled: true,
  //   name: 'sport',
  //   portal: 'sport',
  //   minItems: 2,
  //   maxItems: 5,
  //   lastHours: 24,
  //   primaryColor: '#BD2020',
  //   textColor: '#EEEEEE'
  // },
  // {
  //   enabled: true,
  //   name: 'meelelahutus',
  //   portal: 'menu',
  //   minItems: 3,
  //   maxItems: 3,
  //   lastHours: 24,
  //   primaryColor: '#503084',
  //   textColor: '#EEEEEE'
  // },
  // {
  //   enabled: true,
  //   name: 'teadus',
  //   portal: 'teadus',
  //   minItems: 3,
  //   maxItems: 3,
  //   lastHours: 24,
  //   primaryColor: '#64A131',
  //   textColor: '#EEEEEE'
  // },
];

function getPortalsArray(): IPortal[] {
  const allPortals = data?.newsTable?.rows ?? portalsFallback;
  const portals = allPortals.filter((portal) => portal.enabled);

  const isInvalid = portals.some(
    (portal) => !(
      'enabled' in portal &&
      'name' in portal && portal.name.length > 0 &&
      'portal' in portal && portal.portal.length > 0 &&
      'minItems' in portal && portal.minItems > 0 &&
      'maxItems' in portal && portal.maxItems > 0 &&
      'lastHours' in portal && portal.lastHours > 0 &&
      'primaryColor' in portal && portal.primaryColor.length > 0 &&
      'textColor' in portal && portal.textColor.length > 0
    ));

  return isInvalid ? portalsFallback : portals;
}

export function getPortals(language: Language): IPortal[] {
  const weatherPortal: IPortal = {
    enabled: true,
    name: language === Language.Estonian ? 'ilm' : 'погода',
    portal: 'ilm',
    minItems: 0,
    maxItems: 0,
    lastHours: 0,
    primaryColor: '#29ABE2',
    textColor: '#EEEEEE'
  }

  if (data.weatherTable?.showObservations || data.weatherTable?.showForecast) {
    return [...getPortalsArray(), weatherPortal];
  }
  return [...getPortalsArray()];
}

export async function getFeeds() {
  const output = {};
  let portals = getPortalsArray();

  for (const feed of portals) {
    const { portal, minItems, maxItems, lastHours } = feed;
    const params = {
      portal,
      minItems: minItems.toString(),
      maxItems: maxItems.toString(),
      lasthours: lastHours.toString()
    }
    const url = 'https://services.err.ee/api/feeds/GetTVFeed?'
      + new URLSearchParams(params);
    const response = await fetch(url);
    const data = await response.json();

    const items = data[0].FeedItems.map(item => ({
      header: item.Header,
      lead: item.Lead,
      body: item.Body,
      imageURL: item.ImageURL,
      imageAuthor: item.ImageAuthor,
      imageCaption: item.ImageCaption,
      date: item.Date,
      url: item.URL,
      hasAudio: item.HasAudio,
      hasVideo: item.HasVideo,
      hasGallery: item.HasGallery
    }))
    output[portal] = items;
  }

  return output;
}
