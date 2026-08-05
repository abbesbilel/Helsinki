import axios from "axios";
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
}

const create = (newObject) => {
    return axios
        .post(baseUrl, newObject)
        .then(response => response.data)
        // .catch(error => {
        //     console.log(error.response.data.error)
        // })
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = (url) => {
    return axios.delete(url)
        .then(response => response.data)
}

export default { getAll, create, update, remove }