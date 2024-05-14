export default {
    obtenerPaises: async () =>{
        try {
            let res = await $apiService.get('api/Paises/ListaPaises');
            return res.data
        } catch (error) {
            console.log(error);
        }
    }
}