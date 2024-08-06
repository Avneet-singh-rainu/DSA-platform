import axios from "axios";
export const fetchAllTopics = async()=>{
    try {
        const resp = await axios.get("http://localhost:5000/api/topics");
        return resp.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}
