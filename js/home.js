import postApi from "./api/postAPI";

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { getUlPaginationElement, setTextContent, truncateText } from "./utils";
import debounce from "lodash.debounce";

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
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  // clear current list then render new request list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
};

const renderPagination = (pagination) => {
  if (!pagination) return;

  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPage to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enabled/disabled prev link
  if (_page <= 1) {
    ulPagination.firstElementChild.classList.add('disabled')
  } else {
    ulPagination.firstElementChild.classList.remove('disabled');
  };

  // check if enabled/disabled next link
  if (_page >= totalPages) {
    ulPagination.lastElementChild.classList.add('disabled');
  } else {
    ulPagination.lastElementChild.classList.remove('disabled');
  };

};

const handleFilterChange = async (filterName, filterValue) => {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    // reset _page if needed (in case search)
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('fail to fetch post list', error);
  }
};

const handlePrevClick = (e) => {
  e.preventDefault();
  console.log('Prev click');

  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  // get current page and calculate the previous page
  const currentPage = Number.parseInt(ulPagination.dataset.page) || 1;
  console.log('current page: ' + currentPage);
  if (currentPage <= 1) return;

  handleFilterChange('_page', currentPage - 1);
}

const handleNextClick = (e) => {
  e.preventDefault();
  console.log('Next click')

  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  // get current page and calculate the next page
  const currentPage = Number.parseInt(ulPagination.dataset.page) || 1;
  if (currentPage >= ulPagination.dataset.totalPages) return;

  handleFilterChange('_page', currentPage + 1);
}

const initURL = () => {
  const url = new URL(window.location);

  //update search params(_page, _limit) if no exists
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
};

const initPagination = () => {
  // bind click events  for prev/next link
  const ulPagination = getUlPaginationElement();
  if (!ulPagination) return;

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick);
  }

  // add click event for prev link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
};

const initSearch = () => {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // set default values from query params
  // title like
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  // attach event to search input
  const debounceSearch = debounce((event) => handleFilterChange('title_like', event.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    // attach click event for links
    initPagination();

    // attack search Input
    initSearch();

    // set default pagination(_page, _limit) on URL
    initURL();

    // render post list base on URL params
    const params = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(params);
    renderPostList(data);
    renderPagination(pagination);

  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast errors, ...
  }
})();