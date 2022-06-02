export interface IFeedItem {
  fancyUrl: string,
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