import { $apiService } from "@/utils/api-service"

export default {
    listaPalabras: async () => {
        try {
            let respuesta = await $apiService.get('api/PalabrasVinculadas/ListaPalabras')
            return respuesta.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaPalabrasV2: async (data) => {
        try {
            let respuesta = await $apiService.post('api/PalabrasVinculadas/ListaPalabrasV2',data)
            return respuesta.data;
        } catch (error) {
            console.log(error);
        }
    },

    addPalabras: async (data) => {
        try {
            let res = await $apiService.post('api/PalabrasVinculadas/AgregarPalabra', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    updatePalabras: async (data) => {
        try {
            let res = await $apiService.put('api/PalabrasVinculadas/UpdatePalabra', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    deletePalabras: async (id) => {
        try {
            let res = await $apiService.delete('api/PalabrasVinculadas/DeletePalabra?id=' + id)
            return res
        } catch (error) {
            console.log(error);
        }
    }
}