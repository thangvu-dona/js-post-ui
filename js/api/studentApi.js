import axiosClient from "./axiosClient";

const studentApi = {
  getAll(params) {
    const url = '/students';
    return axiosClient.get(url, { params }); // params _page, _limit,...
  },

  getById(id) {
    const url = `/students/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = 'students';
    return axiosClient.post(url, data); // data payload send to server
  },

  update(data) {
    const url = `/students/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove() {
    const url = `/students/${data.id}`;
    return axiosClient.delete(url);
  }
}

export default studentApi;