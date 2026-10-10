import axios from "axios";
import { API_BASE } from "./apiBase";

const fetchTopicsbyName = async (topic) => {
  try {
    const resp = await axios.get(`${API_BASE}/api/topics/${topic}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export default fetchTopicsbyName;
