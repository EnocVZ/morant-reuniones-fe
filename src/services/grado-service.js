export default {
    AgregarGrado: async(payload)=>{
        try {
            let res = await $apiService.post('api/Grado/AgregarGrado',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    EditarGrado: async(payload)=>{
        try {
            let res = await $apiService.put('api/Grado/ActualizarGrado',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    EliminarElGrado: async(id)=>{
        try {
            let res = await $apiService.delete('api/Grado/EliminarGrado?idGrado='+id)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    obtenerGrados: async (payload)=> {
        try {
            let res = await $apiService.post('api/Grado/ListarGradoV2',payload)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
    obtenerGradoV1: async (payload)=> {
        try {
            let res = await $apiService.get('api/Grado/ListarGrado',payload)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
}