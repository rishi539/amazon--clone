import axios from "axios"

const axiosInstance = axios.create({
  // local instance of firebase functions
  // baseURL: "http://127.0.0.1:5001/clone-evangadi-2024/us-central1/api",

  // deployed versions f firebase function
  baseURL: 'https://api-y43ecatycq-uc.a.run.app',
  
  // deployed versions of on render.com
  // baseURL:  'https://amazon-clone-server-zm56.onrender.com/'
});

export { axiosInstance }; 