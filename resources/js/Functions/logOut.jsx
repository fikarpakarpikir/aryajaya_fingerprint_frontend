import axios from 'axios';

async function logOut(encIdKaryawan) {
    const data = new FormData()
    data.append('object', encIdKaryawan)

    // console.log(encIdKaryawan);
    const csrfToken = document.querySelector('input[name="_token"]').value;

    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    try {
        const response = await axios.post('/Logout/' + encIdKaryawan, data);

        if (response.status === 200) {
            // console.log(response.data); 
            location.reload()
            // return response.data;
        } else if (response.status === 500) {
            console.log(response.data);
        }
    } catch (error) {
        console.error(error);
        throw error; // Propagate the error to the caller if needed
    }
}

export default logOut;
