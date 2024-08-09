import axios from "axios";
export const fetchAllTopics = async () => {
    try {
        const resp = await axios.get("http://localhost:5000/api/topics");
        return resp.data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const API_THIS_MONTH_QUESTIONS = async (userId) => {
    try {
        const resp = await axios.get(
            `http://localhost:5000/user/${userId}/topics-solved-this-month`
        );
        return resp.data;
    } catch (error) {
        console.log(error);
        return error;
    }
};
