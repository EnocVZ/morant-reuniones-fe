import { $apiService } from "@/utils/api-service";

const controller = 'api/Auth/'

export default {

    obtenerUsuarios: async () => {
        try {
            let res = await $apiService.get(`${controller}ObtenerUsuarios`)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },
    obtenerUsuariosV2: async (data) => {
        try {
            let res = await $apiService.post(`${controller}ObtenerUsuariosV2`, data);
            return res.data;
        } catch (error) {
            console.log("pEUBAS",error);
        }
    },
    agregarUsuario: async (usuario) => {
        try {
            let res = await $apiService.post(`${controller}AgregarUsuario`, usuario)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },

    editarUsuario: async (usuario) => {
        try {
            let res = await $apiService.post(`${controller}ActualizarUsuario`, usuario)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },

    obtenerUsuarioPorId: async (id) => {
        try {
            let res = await $apiService.get(`${controller}ObtenerUsuarioPorId?id=${id}`)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },

    existsNombreUsuario: async (nombreUsuario, idUsuario) => {
        try {
            let res = await $apiService.get(`${controller}ExistsNombreUsuario?nombreUsuario=${nombreUsuario}&idUsuario=${idUsuario}`)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },

    eliminarUsuario: async (id) => {
        try {
            let res = await $apiService.delete(`${controller}EliminarUsuario?id=${id}`)
            return res
        } catch (error) {
            console.log(error);
            return null
        }
    },

    obtenerPermisosXIdUsuario: async (id) => {
        try {
            let res = await $apiService.get(`${controller}ObtenerPermisosPorIdUsuario?id=${id}`).then(data => data)
            return res.data
        } catch (error) {
            return error
        }
    },

    obtenerOficinasXIdUsuario: async (id) => {
        try {
            let res = await $apiService.get(`${controller}ObtenerOficinasPorIdUsuario?id=${id}`).then(data => data)
            return res.data
        } catch (error) {
            return error
        }
    },

    CheckUltramsg: async () => {
        try {
            let res = await $apiService.get('api/UltramsgWhatsapp/AuthenticatedUltraMsg').then(data => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    obtenerTipoUsuarios: async () => {
        try {
            let res = await $apiService.get(`${controller}ObtenerTipoUsuario`)
            return res.data
        } catch (error) {
            console.log(error);
            return null
        }
    }
}