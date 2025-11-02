import Axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const axios = Axios.create({
    baseURL: baseURL,
    timeout: 60000,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-CSRFToken",
});

export default axios;