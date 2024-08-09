import axios from "axios";

const fetchUserByid = async (id) => {
    try {
        const resp = await axios.get(`http://localhost:5000/user/id/${id}`);
        return resp.data[0];
    } catch (error) {
        console.log(error);
    }
};

export default fetchUserByid;
