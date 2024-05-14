export default{
    ObtenerLugaresReunion: async ()=> {
        try {
            let res = await $apiService.get('api/LugarReunion/ObtenerLugaresReunion')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    ObtenerLugaresReunionV2: async (payload)=> {
        try {
            let res = await $apiService.post('api/LugarReunion/ObtenerLugaresReunionV2',payload)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    AgregarLugarReunion: async(payload)=>{
        try {
            let res = await $apiService.post('api/LugarReunion/AgregarLugarReunion',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    ActualizarLugarReunion: async (payload) =>{
        try {
            let res = await $apiService.put('api/LugarReunion/ActualizarLugarReunion',payload)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    EliminarLugarReunion: async (id) =>{
        try {
            let res = await $apiService.delete('api/LugarReunion/EliminarLugarReunion?idLugarReunion='+id)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    ObtenerLugarReunion: async (id) =>{
        try {
            let res = await $apiService.get('api/LugarReunion/ObtenerLugarReunion?idLugarReunion='+id)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    ObtenerTipoLugares: async() => {
        try{
            let res = await $apiService.get('api/LugarReunion/GetTipoLugares')
            return res.data
        }catch(error){
            console.log(error);
        }
    }
}