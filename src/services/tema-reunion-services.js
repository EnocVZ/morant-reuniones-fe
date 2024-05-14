export default {
    Temas: async () => {
        try {
            let res = await $apiService.get('api/TemaReunion/Listar')
            return res.data;
        } catch (error) {
            return error
        }
    },

    addTema: async (data) => {
        try {
            let res = await $apiService.post('api/TemaReunion/Agregar', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateTema: async (data) => {
        try {
            let res = await $apiService.put('api/TemaReunion/Editar', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteTema: async (id) => {
        try {
            let res = await $apiService.delete('api/TemaReunion/Eliminar?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    TemaById: async (id) => {
        try {
            let res = await $apiService.get('api/TemaReunion/ObtenerXId?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}