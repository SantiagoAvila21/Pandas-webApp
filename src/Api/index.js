import axios from 'axios'

const url = "http://localhost:5000"

const instance = axios.create({
    baseURL: url
});

const get = async url => {
    try{
        return await instance.get(url);
    }catch(error){
        return error;
    }
}

export default instance;

export { get }