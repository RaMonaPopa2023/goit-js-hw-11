import { updateNewsList } from './markup.js';
import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '39793361-61fd61a37c7dccba520b78587';

export default class PhotosApi {
  constructor() {
    this.queryPage = 1;
    this.searchQuery = '';
  }

  async searchPhotos(query, page) {
    try {
      const imagesPerPage = 40;
      const response = await axios.get(
        `${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&per_page=${imagesPerPage}&page=${page}`
      );

      if (response.data.hits) {
        return response.data.hits;
      } else {
        throw new Error('No results found');
      }
    } catch (err) {
      throw err;
    }
  }
}
