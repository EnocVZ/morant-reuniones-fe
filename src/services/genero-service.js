export default {
    obtenerGeneros: async () =>{
        try {
            let res = await $apiService.get('api/Genero/ListaGeneros');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}