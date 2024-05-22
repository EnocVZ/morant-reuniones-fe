// import { config } from '@fullcalendar/core/internal'
import { useCookie } from '@/@core/composable/useCookie'
import axios from 'axios'

export const $apiService = {
    urlApi: "https://apimorantadmin.azurewebsites.net/",
    //urlApi: "https://devapiedomex.azurewebsites.net/", //RUTA DE PRUEBAS TABLERO
    // urlApi: "https://apiedomex.azurewebsites.net/",
    urlApiInbox: "https://informesedomex.azurewebsites.net/",
    urlAzureBlobStorage: 'https://storemorant.blob.core.windows.net/',

    config: {
        headers: {
            'authorization': `Bearer ${useCookie('accessToken').value + ''}`
        }
    },

    post(url, payload) {
        console.log(this.urlApi + url);
        return axios.post(this.urlApi + url, payload, this.config)
    },

    put(url, payload) {
        console.log(this.urlApi + url);
        return axios.put(this.urlApi + url, payload, this.config)
    },

    get(url) {
        console.log(this.urlApi + url);
        // console.log(this.config);
        return axios.get(this.urlApi + url, this.config)
    },

    delete(url) {
        console.log(this.urlApi + url);
        return axios.delete(this.urlApi + url, this.config)
    },

    /* 
    ! Servicios solo para inbox
    */
    getInbox(url) {
        return axios.get(this.urlApiInbox + url)
    },
    postInbox(url, payload) {
        console.log(this.urlApi + url);
        return axios.post(this.urlApiInbox + url, payload)
    },

    async getImagen(url) {
        return await this.urlAzureBlobStorage + url
    }
}
