import axios from "axios";
import { API_BASE } from "./apiBase";

export const fetchAllTopics = async () => {
  try {
    const resp = await axios.get(`${API_BASE}/api/topics`);
    return resp.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const API_THIS_MONTH_QUESTIONS = async (userId) => {
  try {
    const resp = await axios.get(
      `${API_BASE}/user/${userId}/topics-solved-this-month`
    );
    return resp.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
