
import axios from 'axios';
import { IFeed } from './domain/IFeed';
import { IPortal } from './domain/IPortal';

const portals: IPortal[] = [
  {
    name: 'uudised',
    portal: 'uudised',
    minItems: 7,
    maxItems: 7,
    primaryColor: '#2E3192',
    textColor: '#EEEEEE'
  },
  {
    name: 'kultuur',
    portal: 'kultuur',
    minItems: 3,
    maxItems: 3,
    primaryColor: '#DAB230',
    textColor: '#1E1E1E'
  },
  {
    name: 'sport',
    portal: 'sport',
    minItems: 2,
    maxItems: 5,
    primaryColor: '#BD2020',
    textColor: '#EEEEEE'
  },
  {
    name: 'meelelahutus',
    portal: 'menu',
    minItems: 3,
    maxItems: 3,
    primaryColor: '#503084',
    textColor: '#EEEEEE'
  },
  {
    name: 'teadus',
    portal: 'teadus',
    minItems: 3,
    maxItems: 3,
    primaryColor: '#64A131',
    textColor: '#EEEEEE'
  }
];

export function getPortals() {
  return portals;
}

export async function getFeeds() {
  const output = {};

  for (const feed of portals) {
    const { portal, minItems, maxItems } = feed;
    const params = {
      portal, minItems, maxItems, lasthours: 24, stripHtml: false
    }
    const url = 'https://services.err.ee/api/feeds/GetTVFeed';
    const { data } = await axios.get<IFeed[]>(url, { params });

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
