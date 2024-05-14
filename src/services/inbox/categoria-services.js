export default{

    listaCategoria : async()=>{
        try{
            let res = await $apiService.get('api/Categorias/ListaCategorias')
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    listaCategoriaV2: async (data) => {
        try {
            let res = await $apiService.get('api/Categorias/ListaCategoriasV2',data)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    },

    addCategoria : async(data)=>{
        try{
            let res = await $apiService.post('api/Categorias/AgregarCategoria',data)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    updateCategoria : async(data)=>{
        try{
            let res = await $apiService.put('api/Categorias/UpdateCategoria',data)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    deleteCategoria : async(id)=>{
        try{
            let res = await $apiService.delete('api/Categorias/DeleteCategoria?id='+id)
            return res.data
        }catch(error){
            console.log(error)
        }
    },

    CategoriaById : async(id)=>{
        try{
            let res = await $apiService.put('api/Categorias/CategoriaById?id='+id)
            return res.data
        }catch(error){
            console.log(error)
        }
    },
}