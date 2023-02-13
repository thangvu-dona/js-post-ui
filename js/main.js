import axiosClient from "./api/axiosClient";
import postApi from "./api/postAPI";

async function main() {
  // const response = await axiosClient.get('/posts');
  try {
    const params = {
      _page: 2,
      _limit: 5
    };
    const response = await postApi.getAll(params);
    console.log(response);
  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast errors, ...
  }
}

main();