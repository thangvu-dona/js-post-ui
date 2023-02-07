import axiosClient from "./axiosClient";

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params }); // params _page, _limit,...
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = 'posts';
    return axiosClient.post(url, data); // data payload send to server
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove() {
    const url = `/posts/${data.id}`;
    return axiosClient.delete(url);
  },

  // We can override some 'default request config' for our target.
  updateFormData(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data, {
      baseURL: 'https://abc.com',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
}

export default postApi;