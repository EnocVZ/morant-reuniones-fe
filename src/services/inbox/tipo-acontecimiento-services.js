export default {
    listaTipoAcon: async () => {
        try {
            let res = await $apiService.get('api/TipoAcontecimiento/ListaAcontecimientos')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaTipoAconV2: async (data) => {
        try {
            let res = await $apiService.post('api/TipoAcontecimiento/ListaAcontecimientosV2',data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addTipoAcon: async (data) => {
        try {
            let res = await $apiService.post('api/TipoAcontecimiento/AgregarAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    updateTipoAcon: async (data) => {
        try {
            let res = await $apiService.put('api/TipoAcontecimiento/UpdateAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    deleteTipoAcon: async (id) => {
        try {
            let res = await $apiService.delete('api/TipoAcontecimiento/DeleteCategoria?id=' + id)
            return res
        } catch (error) {
            console.log(error);
        }
    },
    TipoAcontecimientoById: async (id) => {
        try {
            let res = await $apiService.get('api/TipoAcontecimiento/AcontecimientoById?id=' + id)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
}