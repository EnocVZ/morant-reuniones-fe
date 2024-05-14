
export default {
  obtenerDirectorioIdDependencia: async () => {
    try {
      let res = await $apiService.get('api/Directorio/ListarTodosLosDirectorios')
      return res
    } catch (error) {
      console.log(error);
    }
  },

  ObtenerDirectorioIdDependecias: async (id) => {
    try {
      let result = await $apiService.get('api/Directorio/ListarDirectorioPorIdDependencia?idDependencia=' + id)
      return result
    } catch (error) {
      console.log(error);
    }
  },

  agregarDirectorio: async (payload) => {
    try {
      let res = await $apiService.post('api/Directorio/AgregarDirectorio', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res
    } catch (error) {
      console.log(error);
    }
  },

  actualizarDirectorio: async (payload) => {
    try {
      let res = await $apiService.put('api/Directorio/ActualizarDirectorio', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res
    } catch (error) {
      console.log(error);
    }
  },

  actualizarDirectorioImagen: async (payload) => {
    try {
      let res = await $apiService.put('api/Directorio/ActualizarDirectorioImagen', payload,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res
    } catch (error) {
      console.log(error);
    }
  },


  listarDirectorioPorId: async (id) => {
    try {
      let res = await $apiService.get('api/Directorio/ListarDirectoriosPorId?id=' + id);
      return res
    } catch (error) {
      console.log(error);
    }
  },

  listarDirectorio: async () => {
    try {
      let res = await $apiService.get('api/Directorio/ListarTodosLosDirectorios')
      return res.data
    } catch (error) {
      console.log(error);
    }
  },

  listarDirectorioV2: async (data) => {
    try {
      let res = await $apiService.post('api/Directorio/ListarTodosLosDirectoriosV2', data)
      return res.data
    } catch (error) {
      console.log(error);
    }
  },
  listarDirectorioV2idDependencia: async (data) => {
    try {
      let res = await $apiService.post('api/Directorio/ListarTodosLosDirectoriosV2PorIdDependencia', data)
      return res.data
    } catch (error) {
      console.log(error);
    }
  },

  eliminarDirectorio: async (id) => {
    try {
      let res = await $apiService.delete('api/Directorio/EliminarDirectorio?Id=' + id);
      return res
    } catch (error) {
      console.log(error);
    }
  },
  obtenerImagenUrl: async (url, fecha) => {
    let imagenUrl;
    try {
      imagenUrl = await $apiService.getImagen("directorio/" + url + "?" + fecha, {
        responseType: 'blob'
      })
      // console.log(imagenUrl);
      return imagenUrl;

    } catch (error) {
      return '';
    }
  },
  ObtenerTipoDirectorio: async () => {
    try {
      let res = await $apiService.get('api/Directorio/ObtenerTipoDirectorio')
      return res.data
    } catch (error) {
      console.log(error);
    }
  },
};