import axios from "axios";

export const APIGuarda = axios.create({baseURL: 'http://brz-ti27:8283/'})

export const APILocal = axios.create({baseURL: '/'})

export const dbChecklist = axios.create({baseURL: '/'}) 