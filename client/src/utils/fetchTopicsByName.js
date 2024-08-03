import axios from "axios";

const fetchTopicsbyName = async (topic) => {
  try {
    const resp = await axios.get(`http://localhost:5000/api/topics/${topic}`);
    return resp;
  } catch (error) {
    console.log(error);
  }
};

export default fetchTopicsbyName;
