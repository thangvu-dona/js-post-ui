import axiosClient from "./api/axiosClient";
import postApi from "./api/postAPI";

async function main() {
  // const response = await axiosClient.get('/posts');
  const params = {
    _page: 2,
    _limit: 5
  };
  const response = await postApi.getAll(params);
  console.log(response);
}

main();