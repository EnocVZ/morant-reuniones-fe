export default {
    listaGrupos: async () => {
        try {
            let res = await $apiService.get('api/GruposEnviar/ListaGruposEnviar')
            return res.data;
        } catch (error) {
            return error
        }
    },

    listaGruposV2: async (data) => {
        try {
            let res = await $apiService.post('api/GruposEnviar/ListaGruposEnviarV2', data)
            return res.data;
        } catch (error) {
            return error
        }
    },

    addGrupo: async (data) => {
        try {
            let res = await $apiService.post('api/GruposEnviar/AgregarGrupoEnviar', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateGrupo: async (data) => {
        try {
            let res = await $apiService.put('api/GruposEnviar/UpdateGrupoEnviar', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteGrupo: async (id) => {
        try {
            let res = await $apiService.delete('api/GruposEnviar/DeleteGrupoEnviar?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    grupoById: async (id) => {
        try {
            let res = await $apiService.get('api/GruposEnviar/GrupoEnviarById?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}