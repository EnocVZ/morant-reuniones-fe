export default {
    Municipios: async () => {
        try {
            let res = await $apiService.get('api/Municipios/ListaMunicipios')
            return res.data;
        } catch (error) {
            return error
        }
    },

    addMunicipio: async (data) => {
        try {
            let res = await $apiService.post('api/Municipios/AgregarMunicipio', data)
            return res
        } catch (error) {
            return error
        }
    },

    updateMunicipio: async (data) => {
        try {
            let res = await $apiService.put('api/Municipios/UpdateMunicipio', data)
            return res
        } catch (error) {
            return error
        }
    },

    deleteMunicipio: async (id) => {
        try {
            let res = await $apiService.delete('api/Municipios/DeleteMunicipio?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    municipioById: async (id) => {
        try {
            let res = await $apiService.get('api/Municipios/MunicipioById?id=' + id)
            return res.data
        } catch (error) {
            return error
        }
    }
}