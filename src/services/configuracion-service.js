
export default {
  
    agregarConfiguracion: async (payload) => {
      try {
        let res = await $apiService.post('api/Configuraciones/AgregarConfiguracion', payload);
        return res
      } catch (error) {
        console.log(error);
      }
    },
  
    actualizarConfiguracion: async (payload) => {
      try {
        let res = await $apiService.put('api/Configuraciones/ActualizarConfiguracion', payload);
        return res
      } catch (error) {
        console.log(error);
      }
    },
  
    listarConfiguracionPorId: async (id) => {
      try {
        let res = await $apiService.get('api/Configuraciones/ObtenerConfiguracionPorId?id=' + id);
        return res
      } catch (error) {
        console.log(error);
      }
    },
  
    listarConfiguracion: async () => {
      try {
        let res = await $apiService.get('api/Configuraciones/ListarConfiguraciones')
        return res.data
      } catch (error) {
        console.log(error);
      }
    },
    
    listarConfiguracionV2: async (data) => {
      try {
        let res = await $apiService.post('api/Configuraciones/ListarConfiguracionesV2',data)
        console.log(res.data)
        return res.data
      } catch (error) {
        console.log(error);
      }
    },
  
    eliminarConfiguracion: async (id) => {
      try {
        let res = await $apiService.delete('api/Configuraciones/EliminarConfiguracion?Id=' + id);
        return res
      } catch (error) {
        console.log(error);
      }
    }
  };