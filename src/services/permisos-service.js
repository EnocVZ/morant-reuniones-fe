export default {
    obtenerPermisosPorTipoPermiso: async (tipoPermiso) => {
        try {
            let res = await $apiService.get('api/Auth/ObtenerPermisosPorTipoPermiso?tipoPermiso=' + tipoPermiso)
            return res.data.data;
        } catch (error) {
            console.log(error);
        }
    },

    obtenerPermisosPorProyecto: async (id) => {
        try {
            let res = await $apiService.get('api/Auth/ObtenerPermisosPorProyecto?id=' + id)
            return res.data.data;
        } catch (error) {
            console.log(error);
        }
    },
}