export default{

    getAllAconImagen :  async ()=>{
        try{
            let res = await $apiService.get('api/AcontecimientoImagene/ListaImagenAcontecimientos');
            return res;
        }catch(error){
            console.log(error);
        }
    },
    addImagenAcon :  async (data)=>{
        try{
            let res = await $apiService.post('api/AcontecimientoImagene/AgregarImagenAcontecimiento',data);
            return res;
        }catch(error){
            console.log(error);
        }
    },
    updateImagenAcon :  async (data)=>{
        try{
            let res = await $apiService.put('api/AcontecimientoImagene/UpdateImagenAcontecimiento',data);
            return res;
        }catch(error){
            console.log(error);
        }
    },
    getAconImagenByid :  async (id)=>{
        try{
            let res = await $apiService.get('api/AcontecimientoImagene/ImagenAcontecimientoById?id='+id);
            return res;
        }catch(error){
            console.log(error);
        }
    },
    getImagenUrl: async (url, fecha) => {
        let imagenUrl;
        try {
          imagenUrl = await $apiService.getImagen("inboxacontecimiento/"+ url +"?"+ fecha,{
            responseType: 'blob'
          })
          // console.log(imagenUrl);
          return imagenUrl;
          
        } catch (error) {
          return '';
        }
      }
}