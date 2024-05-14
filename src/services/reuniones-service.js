import { $apiService } from "@/utils/api-service"

export default {
    obtenerReuniones: async () => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerReunion')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerReunionesV2: async (data) => {
        try {
            let result = await $apiService.post('api/Reunion/ObtenerReunionV2', data)
            console.log(result.data)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerReunionesNoVinculadasEnMinutas: async () => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerReunionNoVinculadaAMinutas')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerListaModalidad: async () => {
        try {
            let result = await $apiService.get('api/Modalidad/ListaModalidad')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    ObtenerReunionesNoVinculadas: async () => {
        try {
            let result = await $apiService.get('api/Reunion/ListaReunionNoVinculada')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    ObtenerReunionesVinculada: async (id) => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerReunionVinculada?id=' + id)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerListaEstatus: async () => {
        try {
            let result = await $apiService.get('api/EstatusReunion/ListaEstatus')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    agregarReunion: async (payload) => {
        try {
            let result = await $apiService.post('api/Reunion/AgregarReunion', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    actualizarReunion: async (payload) => {
        try {
            let result = await $apiService.put('api/Reunion/ActualizarReunion', payload)
            return result
        } catch (error) {
            console.log(error);
        }
    },
    obtenerDatosActualizar: async (id) => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerReunionId?Id=' + id)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    obtenerDatosActualizarPar: async (id) => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerReunionIdPar?Id=' + id)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    obtenerListaOrdenXIdReunion: async (id) => {
        try {
            let List = await $apiService.get("api/Reunion/ListaOrdenReunion?Id=" + id)
            return List.data
        } catch (error) {
            console.log(error)
        }

    },
    obtenerListaParticipanteIdReunio: async (id) => {
        try {
            let ListP = await $apiService.get("api/Reunion/ListaParticipanteReunion?Id=" + id)
            return ListP.data
        } catch (error) {
            console.log(error)
        }
    },

    obtenerListaParticipanteIdReunionMesa: async (id) => {
        try {
            let ListP = await $apiService.get("api/Reunion/ListaParticipanteReunionMesa?Id=" + id)
            return ListP.data
        } catch (error) {
            console.log(error)
        }
    },
    envioInvitacion: async (id, payload) => {
        try {
            let envio = await $apiService.put("api/Reunion/InvitarParticipantesReunion?id=" + id, payload)
            return envio
        } catch (error) {
            console.log(error);
        }
    },
    AsistenciaParticipante: async (payload) => {
        try {
            let result = await $apiService.put('api/Reunion/GuardarAsistenciaParticipante', payload)
            return result
        } catch (error) {
            console.log(error);
        }
    },
    ActualizarOrdenMesaParticipante: async (id, payload) => {
        try {
            let result = await $apiService.put('api/Reunion/ActualizarOrdenMesaParticipante?id=' + id, payload)
            return result
        } catch (error) {
            console.log(error);
        }
    },
    eliminarReunion: async (id) => {
        try {
            let result = await $apiService.delete('api/Reunion/EliminarReunion?Id=' + id)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    agregarMinuta: async (payload) => {
        try {
            let result = await $apiService.post('api/Minutas/AgregarMinuta', payload)
            return result

        } catch (error) {
            console.log(error)
        }
    },
    obtenerMinuta: async () => {
        try {
            let result = await $apiService.get('api/Minutas/ObtenerMinuta')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerMinutasV2: async (payload) => {
        try {
            let result = await $apiService.post('api/Minutas/ObtenerMinutasV2', payload)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerDatosReunionesVinculadasConMinutas: async (id) => {
        try {
            let ListP = await $apiService.get("api/Minutas/ObtenerDatosReunionesVinculadas?Id=" + id)
            return ListP.data
        } catch (error) {
            console.log(error)
        }
    },
    ObtenerDatosReunionMinutasIdReunion: async (Id) => {
        try {
            let result = await $apiService.get("api/Minutas/ObtenerDatosReunionMinutas?Id=" + Id)
            return result.data
        } catch (error) {
            console.log(error);
        }
    },
    ObtenerDatosMinutasId: async (Id) => {
        try {
            let result = await $apiService.get("api/Minutas/ObtenerMinutasId?Id=" + Id)
            return result.data
        } catch (error) {
            console.log(error);
        }
    },
    obtenerDependenciasPorIdReunion: async (id) => {
        try {
            let result = await $apiService.get('api/Minutas/ObtenerDependenciaDeParticipantesPorIdReunion?Id=' + id)
            return result.data

        } catch (error) {
            console.log(error)
        }
    },
    actualizarMinuta: async (payload) => {
        try {
            let result = await $apiService.put('api/Minutas/ActualizarMinuta', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    subirDocumentoAcuerdo: async (payload) => {
        try {
            let result = await $apiService.post('api/DocumentoAcuerdo/AgregarDocumentoAcuerdo', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return result;
        } catch (error) {
            console.log(error)
        }
    },
    obtenerDocumentoAcuerdo: async (idAcuerdo) => {
        try {
            let result = await $apiService.get('api/DocumentoAcuerdo/ObtenerByIdAcuerdo?IdAcuerdo=' + idAcuerdo)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    obtenerDocumentoAzure: async (nombre) => {
        try {
            let result = await $apiService.getImagen('documentosacuerdos/' + nombre, {
                responseType: 'blob'
            });
            console.log(result)
            return result;
        } catch (error) {
            console.log(error)
        }
    },
    editarDocumentoAcuerdo: async (payload) => {
        try {
            let result = await $apiService.put('api/DocumentoAcuerdo/ActualizarDocumentoAcuerdo', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return result;
        } catch (error) {
            console.log(error)
        }
    },
    eliminarDocumentoAcuerdo: async (id) => {
        try {
            let result = await $apiService.delete('api/DocumentoAcuerdo/EliminarDocumentoAcuerdo?IdDocumento=' + id)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    obtenerDocumentoAcuerdoById: async (id) => {
        try {
            let result = await $apiService.get('api/DocumentoAcuerdo/ObtenerDocumentoById?IdDocumento=' + id)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },
    actualizarEstatusAcuerdo: async (payload) => {
        try {
            let result = await $apiService.put('api/Minutas/ActualizarEstatusAcuerdo', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    actualizarActaMinuta: async (payload) => {
        try {
            let result = await $apiService.put('api/Minutas/ActualizarActa', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    obtenerTipoReunion: async () => {
        try {
            let result = await $apiService.get('api/Reunion/ObtenerTipoReunion')
            return result.data
        } catch (error) {
            console.log(error)
        }
    },

    CheckListByIdReunion: async (id) => {
        try {
            let result = await $apiService.get('api/Reunion/CheckListPorReunion?id=' + id)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },

    CheckListValidados: async (id) => {
        try {
            let result = await $apiService.get('api/Reunion/CheckListValidados?id=' + id)
            return result.data
        } catch (error) {
            console.log(error)
        }
    },

    ActualizarChecks: async (id, payload) => {
        try {
            let result = await $apiService.put('api/Reunion/ActualizarCheckList?id=' + id, payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },

    ActualizarParticipante: async (payload) => {
        try {
            let result = await $apiService.put('api/ParticipanteReunion/ActualizarParticipante', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
    ActualizarPersonificador: async (payload) => {
        try {
            let result = await $apiService.put('api/ParticipanteReunion/ActualizarPersonificador', payload)
            return result
        } catch (error) {
            console.log(error)
        }
    },
} 