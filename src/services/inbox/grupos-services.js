export default {
    listaGrupos: async () => {
        try {
            let res = await $apiService.get('api/Grupos/ListaGrupos')
            return res.data;
        } catch (error) {
            return error
        }
    },

    listaGruposV2: async (data) => {
        try {
            let res = await $apiService.post('api/Grupos/ListaGruposV2',data)
            return res.data;
        } catch (error) {
            return error
        }
    },

    addGrupo: async (data) => {
        try {
            let res = await $apiService.post('api/Grupos/AgregarGrupo', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateGrupo: async (data) => {
        try {
            let res = await $apiService.put('api/Grupos/UpdateGrupo', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteGrupo: async (id) => {
        try {
            let res = await $apiService.delete('api/Grupos/DeleteGrupo?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    grupoById: async (id) => {
        try {
            let res = await $apiService.get('api/Grupos/GrupoById?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}