
import axios from 'axios';
import { IFeed } from './domain/IFeed';
import { IPortal } from './domain/IPortal';

const portals: IPortal[] = [
  {
    name: 'uudised',
    portal: 'uudised',
    minItems: 7,
    maxItems: 7,
    primary: '#2E3192',
    text: '#EEEEEE'
  },
  {
    name: 'kultuur',
    portal: 'kultuur',
    minItems: 3,
    maxItems: 3,
    primary: '#DAB230',
    text: '#1E1E1E'
  },
  {
    name: 'sport',
    portal: 'sport',
    minItems: 2,
    maxItems: 5,
    primary: '#BD2020',
    text: '#EEEEEE'
  },
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
