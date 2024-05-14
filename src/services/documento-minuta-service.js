import { $apiService } from "@/utils/api-service"

export default {
    
    subirDocumentoMinuta: async (payload) => {
        try {
            let result = await $apiService.post('api/DocumentoMinuta/AgregarDocumentoMinuta',payload,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            });
            return result;
        }catch(error) {
            console.log(error)
        }
    },
    obtenerDocumentoMinuta: async (idMinuta) => {
        try {
            let result = await $apiService.get('api/DocumentoMinuta/ObtenerByIdMinuta?IdMinuta='+idMinuta)
            return result.data
        }catch(error) {
            console.log(error)
        }
    },   
    obtenerDocumentoAzure: async (nombre) => {
        try {
            let result = await $apiService.getImagen('minutas/'+nombre,{
                responseType: 'blob'
            });
            console.log(result)
            return result;
        }catch(error) {
            console.log(error)
        }
    },
    editarDocumentoMinuta: async (payload) => {
        try {
            let result = await $apiService.put('api/DocumentoMinuta/ActualizarDocumentoMinuta',payload,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            });
            return result;
        }catch(error) {
            console.log(error)
        }
    },
    eliminarDocumentoMinuta: async (id) => {	
        try {	
            let result = await $apiService.delete('api/DocumentoMinuta/EliminarDocumentoMinuta?IdDocumento='+id)	
            return result	
        }catch(error) {	
            console.log(error)	
        }	
    },
    obtenerDocumentoMinutaById: async (id) => {
        try {    
            let result = await $apiService.get('api/DocumentoMinuta/ObtenerDocumentoById?IdDocumento='+id)    
            return result.data    
        }catch(error) {    
            console.log(error)    
        }    
    },
}