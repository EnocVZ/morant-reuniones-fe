export default {
    GetTemaReunionesMetricas: async () => {
        try {
            let res = await $apiService.get('api/TableroMinutas/ObtenerTemaReunion').then(data => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    GetAcuerdoMinutasId: async (id) => {
        try {
            let res = await $apiService.get('api/TableroMinutas/ObtenerAcuerdoMinutasId?idMinuta=' + id)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    AddComentario: async (payload) => {
        try {
            let res = await $apiService.post('api/TableroMinutas/AgregarComentarioAcuerdo', payload).then((data) => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    GetTareasAcuerdo: async (id) => {
        try {
            let res = await $apiService.get('api/TareaAcuerdoMinuta/ObtenerTareaIdAcuerdo?idAcuerdo=' + id).then(data => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    AddTareaAcuerdo: async (payload) => {
        try {
            let res = await $apiService.post('api/TareaAcuerdoMinuta/AgregarTareaAcuerdo', payload).then((data) => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    UpdateTareaAcuerdo: async (payload) => {
        try {
            let res = await $apiService.put('api/TareaAcuerdoMinuta/ActualizarTareaAcuerdo', payload).then((data) => data)
            return res
        } catch (error) {
            console.log(error);
        }
    },

    deleteTareaAcuerdo: async (id) => {
        try {
            let res = await $apiService.delete('api/TareaAcuerdoMinuta/EliminarTarea?id=' + id)
            return res
        } catch (error) {
            return error
        }
    },

    updateComentarioPrincipal: async (payload) => {
        try {
            let res = await $apiService.put('api/TableroMinutas/ActualizarComentarioTableroAcuerdo', payload)
            return res
        } catch (error) {
            return error
        }
    },

    updateAcuerdosTablero: async (idAcuerdo, idEstatusTablero) => {
        try {
            let res = await $apiService.put('api/TableroMinutas/ActualizarAcuerdosTablero?idAcuerdo=' + idAcuerdo + '&&idEstatusTablero=' + idEstatusTablero)
            return res
        } catch (error) {
            return error
        }
    },
}