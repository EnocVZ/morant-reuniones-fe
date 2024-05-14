export default {
    listaAcontecimiento: async () => {
        try {
            let res = await $apiService.get('api/Acontecimiento/ListaAcontecimientos')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },
    listaAcontecimientoV2: async (data) => {
        try {
            let res = await $apiService.post('api/Acontecimiento/ListaAcontecimientosV2', data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaGrupos: async () => {
        try {
            let res = await $apiService.getInbox('api/v1/grupos')
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    listaAcontecimientoByGrupo: async (id) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientoByGrupo?id=' + id)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaAcontecimientoByGrupoV2: async (id, data) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientoByGrupoV2?id=' + id, data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaAcontecimientosEliminados: async () => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientosEliminados')
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    listaAcontecimientosEliminadosV2: async (data) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientosEliminadosV2', data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addAcontecimiento: async (data) => {
        try {
            let res = await $apiService.post('api/Acontecimiento/AgregarAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    updateAcontecimientos: async (data) => {
        try {
            let res = await $apiService.put('api/Acontecimiento/UpdateAcontecimientos', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    updateAcontecimiento: async (data) => {
        try {
            let res = await $apiService.put('api/Acontecimiento/VincularAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    updateDatosAcontecimiento: async (data) => {
        try {
            let res = await $apiService.put('api/Acontecimiento/UpdateDatosAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    deleteAcontecimiento: async (data) => {
        try {
            let res = await $apiService.put('api/Acontecimiento/DeleteAcontecimiento', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    AcontecimientoById: async (id) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientoById?id=' + id)
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    getResumen: async (data) => {
        try {
            let res = await $apiService.postInbox('api/v1/obtener_resumen', data)
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    enviarMensaje: async (data) => {
        try {
            let res = await $apiService.postInbox('api/v1/enviar_mensaje', data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    listaEstadosAcontecimientos: async () => {
        try {
            let res = await $apiService.get('api/EstadosAcontecimiento/ListaAcontecimientos')
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    listaEstadosAcontecimientosV2: async (data) => {
        try {
            let res = await $apiService.get('api/EstadosAcontecimiento/ListaAcontecimientosV2', data)
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    EstadoAcontecimientoById: async (id) => {
        try {
            let res = await $apiService.get('api/EstadosAcontecimiento/AcontecimientoById?id=' + id)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    AcontecimientoByHistoria: async (id) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/AcontecimientoByHistoria?id=' + id)
            return res;
        } catch (error) {
            console.log(error);
        }
    },

    ActoresAcontecimiento: async (id) => {
        try {
            let res = await $apiService.get('api/Acontecimiento/ActoresAcontecimiento?id=' + id)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
}