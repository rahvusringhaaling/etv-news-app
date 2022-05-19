
import axios from 'axios';

interface Feed {
  Portal: string;
  FeedItems: Item[];
}

interface Item {
  HasAudio: boolean,
  HasVideo: boolean,
  HasGallery: boolean,
  horizontalPhotos: [
    {
      captionEt: string,
      captionEn: string,
      captionRu: string,
      authorEt: string,
      authorEn: string,
      authorRu: string,
      photoUrlOriginal: string,
      photoUrlBase: string
    }
  ],
  verticalPhotos: [],
  horizontalPoster: [],
  heroImage: [],
  Header: string,
  Lead: string,
  Body: string,
  URL: string,
  Date: string,
  ImageURL: string,
  ImageAuthor: string,
  ImageCaption: string,
}

export async function test() {
  axios.get('https://services.err.ee/api/feeds/GetTVFeed?portal=uudised&minItems=7&maxItems=7&lasthours=24&stripHtml=false')
    .then(({ data }) => {
      console.log('');
      console.log('');
      for (const item of data[0]['FeedItems']) {
        console.log(item['Header']);
        console.log('');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
