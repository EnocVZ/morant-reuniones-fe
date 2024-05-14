export default {
    listaInformantes: async () => {
        try {
            let res = await $apiService.get('api/Informant/ObtenerInformantes')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaInformantesV2: async (data) => {
        try {
            let res = await $apiService.post('api/Informant/ObtenerInformantesV2',data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addInformante: async (data) => {
        try {
            let res = await $apiService.post('api/Informant/AgregarInformante', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateInformante: async (data) => {
        try {
            let res = await $apiService.put('api/Informant/ActualizarInformante', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteInformante: async (id) => {
        try {
            let res = await $apiService.delete('api/Informant/EliminarInformante?id=' + id)
            return res
        } catch (error) {
            return error
        }
    }
}