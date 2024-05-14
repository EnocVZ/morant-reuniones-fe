import { ofetch } from 'ofetch'

export const $api = ofetch.create({
   baseURL: 'https://localhost:7016/',
  // baseURL: "https://devapiedomex.azurewebsites.net/", //RUTA DE PRUEBAS TABLERO
  // baseURL: 'https://apiedomex.azurewebsites.net/',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})
