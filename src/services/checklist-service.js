
export default {
    obtenerCheckList: async () => {
        try {
            let result = await $apiService.get('api/CheckListReunion/ListarCheckList')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerCheckListV2: async (data) => {
        try {
            let result = await $apiService.post('api/CheckListReunion/ListarCheckListV2', data)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerCheckListbyId: async (id) => {
        try {
            let result = await $apiService.get('api/CheckListReunion/CheckListReunionById?id=' + id)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    agregarCheckList: async (data) => {
        try {
            let result = await $apiService.post('api/CheckListReunion/AgregarCheckListReunion', data)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    actualizarCheckList: async (data) => {
        try {
            let result = await $apiService.put('api/CheckListReunion/ActualizarCheckListReunion', data)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    eliminarCheckList: async (id) => {
        try {
            let result = await $apiService.delete('api/CheckListReunion/DeleteCheckList?Id=' + id);
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
        }
    },
}