<script>
import dependeciaServices from "@/services/dependencia-service";
import reunionService from "@/services/reuniones-service";
import directorioService from "@/services/directorio-service";
import lugarReunionService from "@/services/lugar-reunion-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import FormDirectorio from "@/views/pages/directorio/form-directorio.vue";


export default {
  name: "FormParticipante",
  props: ["dependeciaLista", "onSave", "valoresBD"],
  components: {
    VDataTable,
    "form-directorio": FormDirectorio,
  },
  data() {
    const defaultParticipante = {
        idParticipante: 0,
        idPersona: 0,
        persona: ""
      }
    return {
      modalAgregarDirectorio: false,
      toast: useToast(),
      listaTipoDirectorio: [],
      listaDirectorio: [],
      directorioxIdDependencia: [],
      idPersonaSelecParticipante: [],
      representanteSeleccionado: {
        id:null,
        persona:null
      },
      invitadoSeleccinado: [], // aqui era de tipo ""
      tipoDirectorioSeleccionado: "",
      dependenciaSeleccionado: "",
      invitadoRepresentante: false,
      modalParticipante: false,
      modalInvitado :false,
      idParticipanteInvitado : null,
      modalEliminarInvitado : false,
      refFromAgregarParticipante: "",
      refFromParticipante: "",
      formRequest: {
        idReunion: 0,
        titulo: "",
        fecha: new Date(),
        hora: this.getCurrentTime(),
        tema: "",
        rqActa: false,
        idLugar: null,
        idModalidad: 1,
        idReunionVinculada: null,
        listaOrden: [],
        listaParticipantes: [],
        idTipoReunion: 1,
      },
      fromParticipante: {
        idParticipante: 0,
        idReunion: 0,
        idPersona: undefined,
        persona: "",
        invitacion: false,
        dependencia: "",
        representante: "",
        cargo: "",
      },
      headersParticipante: [
        {
          title: '',
          key: 'data-table-expand',
        },
        {
          title: "ID",
          sortable: false,
          key: "idParticipante",
        },
        {
          title: "Dependencia",
          key: "dependencia",
        },
        {
          title: "Participante",
          key: "persona",
        },
        {
          title: "Representante",
          key: "representador.persona",
        },
        {
          title: "Invitado",
          key: "invitado.persona",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      registroParticipante: {
        representador:defaultParticipante,
        invitado: [] // aqui era de tipo : defaultParticipante
      },
      eliminarResponsable: false,
      btnEliminarInvitado: false,
      modalEliminar:false,
      defaultParticipante:defaultParticipante,
      invitadoRepresentanteEdit: false,
      invitado:{},
      invitadoIndiceActualizar: null,
    };
  },
  watch: {
    "dependenciaSeleccionado": function (val) {
      const INVALIDVAUE = [0, "", null, undefined];
      if (!INVALIDVAUE.includes(val)) this.directorioDependencias(val);
    },
    "registroParticipante.representador": function (val, pre) {
      if(val !== null){
        if (val?.idPersona > 0) {
          val.idPersona = val?.idPersona
        } 
        else {
          val.idPersona = val?.id
        }
      }
      
    },

    "registroParticipante.invitado": function (val, pre) {
      if (val?.idPersona > 0) {
        val.idPersona = val?.idPersona
      } else {
        val.idPersona = val?.id
      }
    },
    "tipoDirectorioSeleccionado":  function(val) {
      if (val == 2) {
        this.obtenerListaDirectorio();
      }else{
        this.directorioxIdDependencia = []
      }
      this.dependenciaSeleccionado = "";
      this.idPersonaSelecParticipante = [];
      this.invitadoSeleccinado = []  // aqui era de tipo : ""
    },
    "listaParticipanteString": function (val){
      const newVal = JSON.parse(val)
      this.$emit('onChange', newVal)
    }
  },

  computed: {
    participanteSeleccionado() {
      return this.idPersonaSelecParticipante.length === 1;
    },

    opcionDirecotorioDependencia() {
      return this.tipoDirectorioSeleccionado == 1;
    },

    validarListaDirectorio() {
      const { idDependencia } = this.registroParticipante
      if (this.opcionDirecotorioDependencia || idDependencia > 0) return this.directorioxIdDependencia;
      return this.listaDirectorio;
    },

    validarRegistroDirectorio() {
      const { listaParticipantes } = this.formRequest;
      let listaIdSeleccionados = [];

      listaParticipantes.forEach((lisItem) => {
        listaIdSeleccionados.push(lisItem.idPersona);
        if (lisItem?.representador?.idPersona) {
          listaIdSeleccionados.push(lisItem?.representador?.idPersona);
        }
        if (lisItem?.invitado.length > 0) {
            lisItem.invitado.forEach((invitado)=>{
            listaIdSeleccionados.push(invitado.idPersona);
          })
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
      const { idPersona, invitado } = this.registroParticipante;
      let lista = this.validarRegistroDirectorio;
      lista = JSON.parse(JSON.stringify(lista));
      const primerParticipante = this.idPersonaSelecParticipante.find((itemm, index) => index == 0);
      const idList = [idPersona, primerParticipante?.id, invitado.idPersona, invitado.id];
      let index = lista.findIndex((element) => idList.includes(element.id));
      if (index >= 0) lista.splice(index, 1);
      return lista;
    },

    validarListaInvitado() {
      const { representador } = this.registroParticipante;
      const idList = [representador?.idPersona, representador?.id, this.representanteSeleccionado?.id];
      let lista = this.validarListaRepresentante;
      return lista.filter((element) => !idList.includes(element.id));
    },
    listaParticipanteString(){
      return JSON.stringify(this.formRequest.listaParticipantes)
    }
  },

  methods: {
    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      // Formateamos la hora en formato de 24 horas (HH:mm:ss)
      return `${hours}:${minutes}:${seconds}`;
    },

    async directorioDependencias(id) {
      this.directorioxIdDependencia = [];
      this.idPersonaSelecParticipante = [];
      const response = await directorioService.ObtenerDirectorioIdDependecias(id);
      this.directorioxIdDependencia = response.data;
    },

    async agregarParticipante() {
      const defaultParticipante = {
        idParticipante: 0,
        idPersona: 0,
        persona: ""
      }
      const { id, persona } = this.representanteSeleccionado ?? {};
      const dependencia = this.dependeciaLista.find(
        (item) => item.id == this.dependenciaSeleccionado
      );

      if (this.idPersonaSelecParticipante.length == 0) {
        //return this.toast.warning("Seleccione por lo menos un participante");
        return false;
      }

      this.idPersonaSelecParticipante.forEach((element) => {
        let participante = {
          representador: defaultParticipante,
          invitado: []
        };
        participante.idParticipante = 0;
        participante.idReunion = 0;
        participante.idPersona = element.id;
        participante.persona = element.persona;
        if (id) {
          participante.representador = {
            idPersona: id,
            persona: persona,
          };
        }
        if (this.invitadoSeleccinado.length > 0) {
          this.invitadoSeleccinado.forEach((invitado) => {
                participante.invitado.push({
                idPersona: invitado.id,
                persona: invitado.persona,
                invitadoRepresentante: this.invitadoRepresentante,
              });
          });
          console.log(participante.invitado,"parti invi");
        }

        if (dependencia) {
          participante.dependencia = dependencia.nombre;
          participante.idDependencia = dependencia.id
        }

        this.formRequest.listaParticipantes.push(participante);
        this.fromParticipante = { ...this.fromParticipanteDefault };
      });
      this.idPersonaSelecParticipante = [];
      this.representanteSeleccionado = "";
      this.invitadoSeleccinado = [];
    },

    async obtenerTipoDirectorio() {
      const response = await directorioService.ObtenerTipoDirectorio();
      this.listaTipoDirectorio = response.data;
    },

    async guardarCita() {
      this.onSave(this.formRequest.listaParticipantes);
    },

    abrirDialogoEliminar(participante) {
      this.cargarDatosRegistro(participante)
      this.modalEliminar = true;
    },
    eliminarParticipante() {
      const { idPersona } = this.registroParticipante
      let { listaParticipantes } = this.formRequest;
      let index = listaParticipantes.findIndex((element) => element.idPersona == idPersona);
      this.formRequest.listaParticipantes.splice(index, 1);
      this.cancelarEliminar();
    },
    cargarDatosRegistro(participante,tipo,indice) {
      const INVALID = [null, undefined, "", 0, " "];
      const newObject = JSON.parse(JSON.stringify(participante));
      if(tipo === 1){

        if(INVALID.includes(newObject.representador)) newObject.representador = this.defaultParticipante
        newObject.invitado = []
        this.registroParticipante = newObject;

      }else if(tipo ===2){
        if(INVALID.includes(newObject.representador)) newObject.representador = this.defaultParticipante
        if(INVALID.includes(newObject.invitado)) newObject.invitado = this.defaultParticipante
        this.registroParticipante = newObject;
      }
    },

    editarParticipante(participante,tipo) {
      this.cargarDatosRegistro(participante,tipo)
      this.invitadoRepresentanteEdit = participante.invitado?.invitadoRepresentante || false
      if (participante.idDependencia > 0) {
        this.directorioDependencias(participante.idDependencia);
      } else {
        this.obtenerListaDirectorio()
      }
      
      this.$refs.refFromAgregarParticipante.reset();
      this.modalParticipante = true;
    },

    abrirmodalAgregarDirectorio(open = true) {
      this.modalAgregarDirectorio = open;
    },
    async obtenerListaDirectorio(IdTipo = 2) {
      let resultDirectorio = await directorioService.obtenerDirectorioIdDependencia();
      if (resultDirectorio.data) {
        this.listaDirectorio = resultDirectorio.data.filter(x => x.idTipoDirectorio == IdTipo);
      }
    },

    createNewSpace(val){
      return JSON.parse(JSON.stringify(val));
    },
    confirmarModificacion() {
      const INVALID = [null, undefined, "", 0, " "];
      try {
        const { representador, invitado } = this.registroParticipante;
        const listaParticipantes = this.formRequest.listaParticipantes.map((val, index) => {
          var item = this.createNewSpace(val);

          if (item.idPersona == this.registroParticipante.idPersona) {
            if (INVALID.includes(representador?.idPersona)) {
              item.representador = this.createNewSpace(this.defaultParticipante);
            } else {
              if (INVALID.includes(item.representador)) {
                item.representador = this.createNewSpace(this.defaultParticipante);
              }
              //item.representador.idParticipante = representador?.idParticipante || 0
              item.representador.idPersona = representador?.idPersona || representador.id
              item.representador.persona = representador.persona;
            }
            invitado.forEach((inv)=>{
              const exists = item.invitado.some(invitado => invitado.idPersona === inv.idPersona);
              if (!exists) {
                  item.invitado.push({
                    idPersona: inv?.idPersona || inv.id,
                    persona: inv.persona,
                    invitadoRepresentante: this.invitadoRepresentanteEdit
                } );
              }
            })
          }
          return item
        })
        this.formRequest.listaParticipantes = this.createNewSpace(listaParticipantes);
        this.eliminarResponsable = false
        this.btnEliminarInvitado = false
        this.modalParticipante = false
      } catch (e) {
        console.error(e)
      }
    },

    editarInvitado(invitado,tipo,indice) {
      this.invitadoIndiceActualizar = indice;
      this.invitado = invitado.invitado[indice];
      this.cargarDatosRegistro(invitado,tipo,indice)
      this.invitadoRepresentanteEdit = invitado.invitadoRepresentante || false
      if (invitado.idDependencia > 0) {
        this.directorioDependencias(invitado.idDependencia);
      } else {
        this.obtenerListaDirectorio()
      }
      
      this.$refs.refFromAgregarParticipante.reset();
      this.modalInvitado = true;
    },

    confirmarModificacionInvitado() {
      const INVALID = [null, undefined, "", 0, " "];
      try {
        const listaParticipantes = this.formRequest.listaParticipantes.map((val, index) => {
          var item = this.createNewSpace(val);
          if (item.idPersona == this.registroParticipante.idPersona) {
            if(this.invitado){
              const invitadoAnterior = this.invitadoIndiceActualizar;
              if(invitadoAnterior !== -1){
                item.invitado.splice(invitadoAnterior,1)
              }
              item.invitado.push({
                idPersona: this.invitado.idPersona || this.invitado.id,
                persona: this.invitado.persona,
                invitadoRepresentante: this.invitadoRepresentanteEdit
              })
            }
          }
          return item
        })
        this.formRequest.listaParticipantes = this.createNewSpace(listaParticipantes);
        this.modalInvitado = false
      } catch (e) {
        console.error(e)
      }
    },

    cancelarEdicionInvitado() {
      this.modalInvitado = false;
    },

    cancelarEliminarInvitado(){
      this.modalEliminarInvitado = false;
    },
    abrirDialogoEliminarInvitado(invitado,idPersona) {
      this.idParticipanteInvitado = idPersona
      this.registroParticipante = invitado;
      this.modalEliminarInvitado = true;
    },
    eliminarInvitado() {
      const { idPersona } = this.registroParticipante
      const { listaParticipantes } = this.formRequest;
      let index = listaParticipantes.findIndex(participante => participante.idPersona === idPersona);
      if (index !== -1) {
        let invitadoIndex = listaParticipantes[index].invitado.findIndex(invitado => invitado.idPersona === this.idParticipanteInvitado );
        if (invitadoIndex !== -1) {
          listaParticipantes[index].invitado.splice(invitadoIndex, 1);
        }
      }
      this.modalEliminarInvitado = false;
    },
    cancelarEdicion() {
      this.registroParticipante = {
        representador: {},
        invitado: {}
      };
      this.eliminarResponsable = false;
      this.btnEliminarInvitado = false;
      this.modalParticipante = false;
    },
    cancelarEliminar(){
      this.registroParticipante = {
        representador: {},
        invitado: {}
      };
      this.modalEliminar = false;
    },
    eliminarRepresentante() {
      this.registroParticipante.representador = this.createNewSpace(this.defaultParticipante);;
    },
    // eliminarInvitado() {
    //   this.registroParticipante.invitado = this.createNewSpace(this.defaultParticipante);;
    // },

    cancelarCrearDirectorio(){
      this.modalAgregarDirectorio = false;
    }
  },

  created() {
    this.obtenerTipoDirectorio();
  },

  mounted() {
    if (this.valoresBD.listaParticipantes.length > 0) {
      this.formRequest.listaParticipantes = this.valoresBD.listaParticipantes//this.agruparParticipantes(this.valoresBD.listaParticipantes);
    }
  },
};
</script>

<template>
  <VForm ref="refFromParticipante" @submit.prevent="guardarCita()">
    <VRow>
      <VForm ref="refFromAgregarParticipante" @submit.prevent="agregarParticipante()">
        <VRow>
          <VCol cols="12">
            <h6 class="text-h6 font-weight-medium">Participante reunión</h6>
            <p class="mb-0">Selecciones los participantes por dependencias</p>
          </VCol>
          <v-col cols="12">
            <v-btn variant="text" color="#b48d57" @click="abrirmodalAgregarDirectorio()">
              Crear directorio
              <v-icon end icon="tabler-plus" />
            </v-btn>
          </v-col>
          <VCol cols="12" md="6">
            <AppSelect color="#b48d57" v-model="tipoDirectorioSeleccionado" label="Tipo directorio"
              placeholder="Seleccione el tipo directorio" :items="listaTipoDirectorio" item-title="nombre"
              item-value="id" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6" v-show="opcionDirecotorioDependencia">
            <AppSelect color="#b48d57" v-model="dependenciaSeleccionado" label="Dependencia"
              placeholder="Seleccione la dependencia" :items="dependeciaLista" item-title="nombre" item-value="id"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppCombobox color="#b48d57" v-model="idPersonaSelecParticipante" :items="validarRegistroDirectorio"
              item-title="persona" item-value="id" label="Participantes" density="compact"
              placeholder="Selecciones los participante por dependencia" multiple :rules="[requiredValidator]" />
          </VCol>
          <!-- <VCol cols="12" md="6"  v-show="participanteSeleccionado">
            <AppCombobox color="#b48d57" v-model="representanteSeleccionado" :items="validarListaRepresentante"
              item-title="persona" item-value="id" label="Representante" density="compact"
              placeholder="Selecciones un representante" />
          </VCol>

          <VCol cols="12" md="6" v-show="participanteSeleccionado">
            <AppCombobox color="#b48d57" v-model="invitadoSeleccinado" :items="validarListaInvitado"
              item-title="persona" item-value="id" label="Invitado" density="compact" multiple
              placeholder="Seleccione un invitado" />
          </VCol>
          <VCol cols="12" md="6" class="align-self-center" v-show="representanteSeleccionado?.id > 0">
            <v-switch v-model="invitadoRepresentante" label="Invitado del representante" />
          </VCol> -->
          <VCol cols="12" md="12" class="align-self-center">
            <VBtn color="#b48d57" type="submit">
              Agregar
              <VIcon end icon="tabler-checkbox" />
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
      <VCol cols="12" md="12" class="pt-9">
        <VDataTable :headers="headersParticipante" :items="formRequest.listaParticipantes" density="compact" expand-on-click>
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">

              <IconBtn @click="editarParticipante(item,1)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="abrirDialogoEliminar(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
          <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
              <td :colspan="headersParticipante.length">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Invitado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr  v-for="(invitado, index) in slotProps.item.invitado" :key="index">
                      <td>{{invitado.persona}}</td>
                      <td>
                        <div class="d-flex gap-1">
                          <IconBtn @click="editarInvitado(slotProps.item,2,index)">
                              <VIcon icon="tabler-edit" />
                          </IconBtn>
                          <IconBtn @click="abrirDialogoEliminarInvitado(slotProps.item,invitado.idPersona)">
                              <VIcon icon="tabler-trash" />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCol>
    </VRow>
    <VCol cols="12">
      <slot name="footer"></slot>
    </VCol>
  </VForm>
  <!-- Formulario modal para agregar/editar directorio -->
  <VDialog v-model="modalAgregarDirectorio" max-width="650px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{ "Agregar Directorio" }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <form-directorio :onSave="abrirmodalAgregarDirectorio" :onCancel="cancelarCrearDirectorio"/>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="modalParticipante" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Editar representante</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12" md="10">
              <AppCombobox color="#b48d57" v-model="registroParticipante" :items="validarRegistroDirectorio"
                item-title="persona" item-value="id" label="Participante" density="compact" disabled />
            </VCol>
            <VCol cols="12" md="10">
              <AppCombobox color="#b48d57" v-model="registroParticipante.representador"
                :items="validarListaRepresentante" item-title="persona" item-value="id" label="Representante"
                density="compact" placeholder="Seleccion el representante" />
            </VCol>
            <VCol cols="12" md="2" class="align-self-end">
              <IconBtn @click="() => eliminarResponsable = true" v-show="!eliminarResponsable">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <VBtn @click="eliminarRepresentante()" variant="outline-danger" v-show="eliminarResponsable">
                Eliminar
              </VBtn>
            </VCol>
            <VCol cols="12" md="10">
              <AppCombobox color="#b48d57" v-model="registroParticipante.invitado" :items="validarListaInvitado"
                item-title="persona" item-value="id" label="Invitado" density="compact" multiple
                placeholder="Seleccione el invitado" />
            </VCol>
            <!-- <VCol cols="12" md="2" class="align-self-end">
              <IconBtn @click="() => btnEliminarInvitado = true" v-show="!btnEliminarInvitado">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <VBtn @click="eliminarInvitado()" variant="outline-danger" v-show="btnEliminarInvitado">
                Eliminar
              </VBtn>
            </VCol> -->
            <VCol cols="12" md="10" v-show="registroParticipante.representador.idPersona > 0">
              <v-switch v-model="invitadoRepresentanteEdit"
              label="Invitado del representante" />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="() => cancelarEdicion()">
          Cerrar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="confirmarModificacion()">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalInvitado" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Editar invitado</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>      
            <VCol cols="12" md="10">
              <AppCombobox color="#b48d57" v-model="invitado" :items="validarListaInvitado"
                item-title="persona" item-value="idPersona" label="Invitado" density="compact"
                placeholder="Seleccione el invitado" />
            </VCol>
            <VCol cols="12" md="10" v-show="registroParticipante.representador.idPersona > 0">
              <v-switch v-model="invitadoRepresentanteEdit"
              label="Invitado del representante" />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="() => cancelarEdicionInvitado()">
          Cerrar
        </VBtn>
        <VBtn  color="success" variant="elevated" @click="confirmarModificacionInvitado()">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalEliminar" max-width="500px">
    <VCard>
      <VCardTitle class="align-self-center">¿Deseas eliminar el registro?</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="cancelarEliminar()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="eliminarParticipante">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalEliminarInvitado" max-width="500px">
    <VCard>
      <VCardTitle class="align-self-center">¿Deseas eliminar el invitado?</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="cancelarEliminarInvitado()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="eliminarInvitado()">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
