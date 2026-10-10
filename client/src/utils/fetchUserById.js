import axios from "axios";
import { API_BASE } from "./apiBase";

const fetchUserByid = async (id) => {
  try {
    const resp = await axios.get(`${API_BASE}/user/id/${id}`);
    return resp.data[0];
  } catch (error) {
    console.log(error);
  }
};

export default fetchUserByid;
