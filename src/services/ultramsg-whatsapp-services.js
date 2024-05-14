export default {
    obtenerEstutusUltramsgWhatsapp: async () =>{
        try {
            let res = await $apiService.get('api/UltramsgWhatsapp/AuthenticatedUltraMsg');
            return res.data
        } catch (error) {
            console.log(error);
        }
    }
}