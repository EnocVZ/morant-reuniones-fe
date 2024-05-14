export default {

    listaHistorias: async () => {
        try {
            let res = await $apiService.get('api/Historias/ListaHistorias')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaHistoriasV2: async (data) => {
        try {
            let res = await $apiService.get('api/Historias/ListaHistoriasV2', data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    HistoriaById: async (id) => {
        try {
            let res = await $apiService.get('api/Historias/HistoriaById?id=' + id)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    updateHistoria: async (data) => {
        try {
            let res = await $apiService.put('api/Historias/UpdateHistoria', data)
            return res
        } catch (error) {
            return error
        }
    },
}