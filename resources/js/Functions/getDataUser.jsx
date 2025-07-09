import axios from 'axios';

async function getDataUser() {
    try {
        const response = await axios.get('/user');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Propagate the error to the calling code
    }
}

export default getDataUser;
