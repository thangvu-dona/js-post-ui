import postApi from "./api/postAPI";
import { setTextContent, truncateText } from "./utils/common";

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

// extend plugin to use fromNow function
dayjs.extend(relativeTime);

const createPostElement = (post) => {
  if (!post) return;
  // console.log(post);

  try {
    // find and clone template
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    // update tile, description, author, thumbnail
    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="author"]', post.author);
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));

    // get last updated time
    // console.log('time from now: ', dayjs(post.updatedAt).fromNow());
    setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);
    // const titleElement = liElement.querySelector('[data-id="title"]');
    // if (titleElement) titleElement.textContent = post.title;

    // const descriptionElement = liElement.querySelector('[data-id="description"]');
    // if (descriptionElement) descriptionElement.textContent = post.description;

    // const authorElement = liElement.querySelector('[data-id="author"]');
    // if (authorElement) authorElement.textContent = post.author;

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;

      thumbnailElement.addEventListener('error', () => {
        thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
      });
    };

    // attach events


    return liElement;
  } catch (error) {
    console.log('Fail to create post item', error);
  }
};

const renderPostList = (postList) => {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
};

(async () => {
  try {
    const params = {
      _page: 1,
      _limit: 6
    };

    const { data, pagination } = await postApi.getAll(params);

    // render post 
    renderPostList(data);

  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast errors, ...
  }
})();