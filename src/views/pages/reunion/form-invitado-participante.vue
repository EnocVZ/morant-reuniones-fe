

<script>
import directorioService from "@/services/directorio-service";
import reunionService from "@/services/reuniones-service";
import { useToast } from "vue-toastification";
import FormDirectorio from "@/views/pages/directorio/form-directorio.vue";

export default {
   components: {
    "form-directorio": FormDirectorio,
  },
   props: ["value", "listRegistrados", "onSave", "modalOption", "tipoProceso"],
   data() {
      const defaultParticipante = {
         idParticipante: 0,
         idPersona: 0,
         persona: ""
      }
      return {
         toast: useToast(),
         listaParticipantesRegistrados: [],
         listaDirectorio: [],
         directorioPorDependencia: [],
         listIdInvitado: [],
         defaultParticipante: defaultParticipante,
         registroParticipante: {
            id: 0,
            persona: "",
            representador: defaultParticipante,
            invitado: defaultParticipante
         },
         representador: defaultParticipante,
         invitado: {
            ...defaultParticipante,
            invitadoRepresentante: false
         },
         modalAgregarDirectorio: false,
         invitadoRepresentante: false
      }
   },
   watch: {
      "representador": function (val, pre) {
         if (val.idParticipante) {
            val.idPersona = val.idPersona
         } else {
            val.idPersona = val.id
         }
         val.selecciono = true
      },
      "invitado": function (val, pre) {
         if (val.idParticipante) {
            val.idPersona = val.idPersona
         } else {
            val.idPersona = val.id
         }
         val.selecciono = true
      },
   },
   computed: {
      validarListaDirectorio() {
         const { idDependencia } = this.registroParticipante
         if (idDependencia > 0) return this.directorioPorDependencia;
         return this.listaDirectorio;
      },
      validarRegistroDirectorio() {
         const listaParticipantes = this.listaParticipantesRegistrados;
         let listaIdSeleccionados = [];
         let idInvitado = [];

         listaParticipantes.forEach((lisItem) => {
            listaIdSeleccionados.push(lisItem?.idPersona);
            if (lisItem?.representador?.idPersona) {
               listaIdSeleccionados.push(lisItem?.representador?.idPersona);
            }
            if (lisItem.invitado) {
               idInvitado = lisItem.invitado.map(item => item.idPersona);
               listaIdSeleccionados = listaIdSeleccionados.concat(idInvitado);
            }
         });
         
         const newLista = this.validarListaDirectorio.filter((item) => {
            const findItem = listaIdSeleccionados.includes(item.id)
            if (findItem) return false
            return true
         });

         return newLista;

      },

      validarListaRepresentante() {
         const { idPersona } = this.registroParticipante;
         let lista = this.validarRegistroDirectorio;
         lista = JSON.parse(JSON.stringify(lista));
         const idList = [idPersona, this.invitado?.idPersona, this.invitado?.id];
         let index = lista.findIndex((element) => idList.includes(element.id));
         if (index >= 0) lista.splice(index, 1);
         return lista;
      },

      validarListaInvitado() {
         const idList = [this.representador?.idPersona, this.representador?.id];
         let lista = this.validarListaRepresentante;
         return lista.filter((element) => !idList.includes(element.id));
      },

   },
   methods: {
      async obtenerListaDirectorio(IdTipo = 2) {
         this.listaDirectorio = []
         let resultDirectorio = await directorioService.obtenerDirectorioIdDependencia();
         if (resultDirectorio.data) {
            this.listaDirectorio = resultDirectorio.data.filter(x => x.idTipoDirectorio == IdTipo);
         }
      },
      async directorioPorIdDependencia(id) {
         this.directorioPorDependencia = [];
         const response = await directorioService.ObtenerDirectorioIdDependecias(id);
         this.directorioPorDependencia = response.data;
      },
      createNewSpace(val) {
         return JSON.parse(JSON.stringify(val));
      },
      async confirmarModificacion() {
         
         try {
            let { representador, invitado, keyInvitado } = this.registroParticipante;
            let listaNuevosInvitados = [];

            if (representador?.idParticipante > 0) {
               representador.idPersona = this.representador.idPersona
               representador.proceso = 2
            } else {
               if (this.representador.idPersona > 0) {
                  representador = {
                     idParticipante: 0,
                     idPersona: this.representador.idPersona,
                     persona: "",
                     proceso: 1
                  }
               } else {
                  representador = this.defaultParticipante
               }

            }
            if(this.tipoProceso == 1){
               listaNuevosInvitados = this.listIdInvitado.map(item=>{
                  return {
                     idPersona: item.id,
                     proceso: 1,
                     invitadoRepresentante: this.invitadoRepresentante
                  }
               });
               invitado = invitado.concat(listaNuevosInvitados)

            }else if(this.tipoProceso == 2){
               let invitadoSeleccionado = invitado[keyInvitado];
               invitadoSeleccionado.idPersona = this.invitado.idPersona;
               invitadoSeleccionado.proceso = 2;
               invitadoSeleccionado.invitadoRepresentante = this.invitadoRepresentante
               invitado[keyInvitado] = invitadoSeleccionado;
            }

            this.registroParticipante.representador = representador;
            this.registroParticipante.invitado = invitado;

            const response = await reunionService.ActualizarParticipante(this.registroParticipante)
            
            if (response?.data?.success) {
               this.onSave()
               this.toast.success("Se actualizaron los datos del participante");
            }else{
               this.toast.error("No se actualizaron los datos del participante");
            }

         } catch (e) {
            this.toast.error("Error al realizar la solicitud");
            console.error(e)
         }
      },

      onCancel(){
         this.modalOption(false)
      },

      handleModalAgregarDirectorio(option = true){
         this.modalAgregarDirectorio = option
      },

      onCancelModalAgregarDirectorio(){
         this.modalAgregarDirectorio = false
      },

      async alGuardarDirectorio() {
         if (this.value.idDependencia > 0) {
            await this.directorioPorIdDependencia(this.value.idDependencia);
         } else {
            await this.obtenerListaDirectorio();
         }
         this.handleModalAgregarDirectorio(false)
      }

   },
   async created() {
      if (this.value.idDependencia > 0) {
         await this.directorioPorIdDependencia(this.value.idDependencia);
      }else{
         await this.obtenerListaDirectorio();
      }
   },
   mounted() {
      if (this.value) {
         this.registroParticipante = this.createNewSpace(this.value);

         if (this.value?.representador != null) {
            this.representador = this.value?.representador
         }
         if (this.value?.keyInvitado >= 0) {
            this.invitado = this.value?.invitado[this.value?.keyInvitado];
            this.invitadoRepresentante = this.invitado.invitadoRepresentante;
         }
      }

      if (this.listRegistrados.length > 0) {
         this.listaParticipantesRegistrados = this.listRegistrados
      }
   }

}
</script>


<template>
   <VCard>
      <VCardTitle>
         <span class="headline">Editar representante o invitado {{ tipoProceso }}</span>
      </VCardTitle>
      <VCardText>
         <VContainer>
            <VRow>
               <v-col cols="12">
                  <v-btn variant="text" color="#b48d57" @click="handleModalAgregarDirectorio()">
                    Crear directorio
                    <v-icon end icon="tabler-plus" />
                  </v-btn>
                </v-col>
               <!--VCol cols="12" md="12">
                  <AppCombobox color="#b48d57" v-model="registroParticipante" :items="validarRegistroDirectorio"
                     item-title="persona" item-value="id" label="Participante" density="compact" disabled />
               </VCol-->
               <VCol cols="12" md="12" v-show="tipoProceso == 1">
                  <AppCombobox color="#b48d57" v-model="representador" :items="validarListaRepresentante"
                     item-title="persona" item-value="id" label="Representante" density="compact"
                     placeholder="Seleccion el representante" />
               </VCol>
               <VCol cols="12" md="12" v-show="tipoProceso == 1">
                  <AppCombobox color="#b48d57" v-model="listIdInvitado" :items="validarListaInvitado" item-title="persona"
                  item-value="id" label="Invitado" density="compact" placeholder="Seleccione el invitado" multiple />
                  <br />
                  <v-switch v-model="invitadoRepresentante" label="Invitado del representante"  v-show="representador.id > 0" />
               </VCol>
               <VCol cols="12" md="12" v-show="tipoProceso == 2">
                  <AppCombobox color="#b48d57" v-model="invitado" :items="validarListaInvitado" item-title="persona"
                  item-value="id" label="Invitado" density="compact" placeholder="Seleccione el invitado" />
                  <br />
                  <v-switch v-model="invitadoRepresentante" label="Invitado del representante"  v-show="representador.id > 0" />
               </VCol>
            </VRow>
         </VContainer>
      </VCardText>
      <VCardActions>
         <VSpacer />

         <VBtn color="error" variant="outlined" @click="onCancel()">
            Cerrar
         </VBtn>

         <VBtn color="success" variant="elevated" @click="confirmarModificacion()">
            Guardar
         </VBtn>
      </VCardActions>
   </VCard>
   <!-- Formulario modal para agregar/editar directorio -->
  <VDialog v-model="modalAgregarDirectorio" max-width="650px">
   <VCard>
     <VCardTitle>
       <span class="headline">Agregar Directorio</span>
     </VCardTitle>
     <VCardText>
       <VContainer>
         <form-directorio :onSave="alGuardarDirectorio" :onCancel="onCancelModalAgregarDirectorio"/>
       </VContainer>
     </VCardText>
   </VCard>
 </VDialog>
</template>