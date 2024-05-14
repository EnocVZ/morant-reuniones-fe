export default {
    getOficinas: async () => {
        try {
            let res = await $apiService.get('api/Oficina/ObtenerOficinas')
            return res.data;
        } catch (error) {
            return error
        }
    },

    addOficina: async (data) => {
        try {
            let res = await $apiService.post('api/Oficina/AgregarOficina', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateOficina: async (data) => {
        try {
            let res = await $apiService.put('api/Oficina/ActualizarOficina', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteOficina: async (id) => {
        try {
            let res = await $apiService.delete('api/Oficina/EliminarOficina?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    OficinaById: async (id) => {
        try {
            let res = await $apiService.get('api/Oficina/ObtenerOficnaById?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}