export default {
    Actores: async () => {
        try {
            let res = await $apiService.get('api/DirectorioActores/Listar')
            return res.data;
        } catch (error) {
            return error
        }
    },

    addActor: async (data) => {
        try {
            let res = await $apiService.post('api/DirectorioActores/Agregar', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateActor: async (data) => {
        try {
            let res = await $apiService.put('api/DirectorioActores/Editar', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteActor: async (id) => {
        try {
            let res = await $apiService.delete('api/DirectorioActores/Eliminar?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    ActorById: async (id) => {
        try {
            let res = await $apiService.get('api/DirectorioActores/ObtenerXId?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}