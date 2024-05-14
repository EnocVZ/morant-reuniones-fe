
export default {
    obtenerDependencias: async ()=> {
        try {
            let res = await $apiService.get('api/Dependencia/ObtenerDependencias')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    obtenerDependenciasV2: async (data)=> {
        try {
            let res = await $apiService.post('api/Dependencia/ObtenerDependenciasV2',data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    agregarDependencia: async(payload)=>{
        try {
            let res = await $apiService.post('api/Dependencia/AgregarDependencia',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    actualizarDependencia: async (payload) =>{
        try {
            let res = await $apiService.put('api/Dependencia/ActualizarDependencia',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    eliminarDependencia: async (id) =>{
        try {
            let res = await $apiService.delete('api/Dependencia/EliminarDependencia?id='+id)
            return res
        } catch (error) {
            console.log(error);
        }
    }
}