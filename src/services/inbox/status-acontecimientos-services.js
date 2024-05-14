export default{

    listaEstadosAcon : async()=>{
        try{
            let res = await $apiService.get('api/EstadosAcontecimiento/ListaAcontecimientos')
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    listaEstadosAconV2: async (data) => {
        try {
            let res = await $apiService.get('api/EstadosAcontecimiento/ListaAcontecimientosV2',data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addEstadoAcon : async(data)=>{
        try{
            let res = await $apiService.post('api/EstadosAcontecimiento/AgregarAcontecimiento',data)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    updateEstadoAcon : async(data)=>{
        try{
            let res = await $apiService.put('api/EstadosAcontecimiento/UpdateAcontecimiento',data)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    deleteEstadoAcon : async(id)=>{
        try{
            let res = await $apiService.delete('api/EstadosAcontecimiento/DeleteAcontecimiento?id='+id)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    EstadoAconById : async(id)=>{
        try{
            let res = await $apiService.put('api/EstadosAcontecimiento/AcontecimientoById?id='+id)
            return res.data
        }catch(error){
            console.log(error)
        }
    },
}