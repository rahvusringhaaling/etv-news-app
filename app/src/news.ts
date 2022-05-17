
import axios from 'axios';

export async function test() {
  axios.get('https://services.err.ee/api/feeds/GetTVFeed?portal=uudised&minItems=7&maxItems=7&lasthours=24&stripHtml=false')
    .then(({ data }) => {
      console.log('');
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
