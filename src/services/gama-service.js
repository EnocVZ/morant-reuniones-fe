export default {
    obtenerGamas: async () =>{
        try {
            let res = await $apiService.get('api/Gama/ListaGamas');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}