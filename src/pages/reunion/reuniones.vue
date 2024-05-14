<script>
import reunionService from "@/services/reuniones-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import draggable from 'vuedraggable';
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useReunionesStore } from "@/stores/reuniones";
import { $apiService } from "@/utils/api-service";
import { mapActions, mapState } from "pinia";
import usuariosService from "@/services/usuarios-service";
import directorioService from '@/services/directorio-service'
import checklistService from '@/services/checklist-service';
import FormInvitadoParticipante from '@/views/pages/reunion/form-invitado-participante.vue'
import { noNull } from "@antfu/utils";

const colibri = `${import.meta.env.BASE_URL ?? "/"}images/logos/Colibri.png`;

// import sillaBas from '@images/logos/sillaBas.png'

// import sillaLighk from '@images/logos/sillaBas.png'
// import silla2Lighk from '@images/logos/sillaHombre.png'

export default {
  name: "Lista Reuniones",
  components: {
    VDataTable,
    draggable,
    "form-invitado-participante": FormInvitadoParticipante
  },
  data() {
    return {
      invertirMesa: false,
      isSnackbarVisible: false,
      sillasIzquierda: [], // Inicializa con tus datos
      sillasDerecha: [],
      invertirOrden1: true,
      invertirOrden2: false,
      idInvitacionSpiner: 0,
      toast: useToast(),
      directorioGuardar: {
        id: 0,
        imagen: '',
        ImagenFile: null,
      },
      participantesFoto: [],
      idDirectorioPersona: null,
      idReunion: 0,
      search: "",
      headersReunion: [
        {
          title: "Id",
          key: "idReunion",
        },
        {
          title: "Titulo",
          key: "titulo",
        },
        {
          title: "Tema",
          key: "tema",
        },
        {
          title: "Fecha",
          key: "fechaString",
        },
        {
          title: "Hora",
          key: "horaString",
        },
        {
          title: "Lugar",
          key: "lugar",
        },
        {
          title: "Acta",
          key: "rqActaString",
        },
        {
          title: "Reunion Vinculada",
          key: "idReunionVinculada",
        },
        {
          title: "Modalidad",
          key: "modalidad",
        },
        {
          title: "Estatus",
          key: "estatus",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      Reuniones: [],
      idReunionEliminar: 0,
      openEliminar: false,
      openListaOrden: false,
      headers: [
        {
          title: "",
          key: "data-table-expand",
        },
        {
          title: "Id",
          key: "idOrden",
        },
        {
          title: "Orden",
          key: "numOrden",
        },
        {
          title: "Descrpcion",
          key: "descripcion",
        },
        {
          title: "Inicio",
          key: "inicioString",
        },
        {
          title: "Minutos",
          key: "minutos",
        },
        {
          title: "Final",
          key: "finalString",
        },
      ],
      data: [],
      openListaParticipante: false,
      headersParticipantes: [
        {
          title: "Id",
          key: "idParticipante",
        },
        {
          title: "Dependencia",
          key: "dependencia",
        },
        {
          title: "Invitación",
          key: "invitacionString",
        },
        {
          title: "Persona",
          key: "persona",
        },
        {
          title: "Representante",
          key: "representante",
        },
      ],
      listaParticipantes: [],
      openInvitacion: false,
      selected: [],
      selectedParticipantes: [],
      openModalSelectParti: false,
      headersInvitacion: [
        {
          title: "",
          key: "checks",
        },
        {
          title: "Dependencia",
          key: "dependencia",
        },
        {
          title: "Persona",
          key: "persona",
        },
        {
          title: "Teléfono",
          key: "telefono",
        },
        {
          title: "Rango",
          key: "gama",
        },
        {
          title: "Invitación",
          key: "invitacionString",
        },
      ],
      openRepresentante: false,
      fromParticipante: {
        idParticipante: 0,
        idReunion: 0,
        idPersona: undefined,
        persona: "",
        idInvitante: 0,
        idRepresentado: 0,
        invitacion: false,
        dependencia: "",

      },
      fromParticipanteDefault: {
        idParticipante: 0,
        idReunion: 0,
        idPersona: undefined,
        persona: "",
        invitacion: false,
        dependencia: "",
        representante: "",
        cargo: "",
      },
      Cargo: "",
      Representante: "",
      // headersInvitado: [
      //   {
      //     title: "Invitado",
      //     key: "invitado",
      //   },
      //   {
      //     title: "cargo",
      //     key: "slotProps.invitado.cargo",
      //   },
      //   {
      //     title: "Acciones",
      //     key: "actions",
      //   },
      // ],
      headersAsistencia: [
        {
          title: '',
          key: 'data-table-expand',
        },
        { title: "", key: "asistencia" },
        {
          title: "Imagen",
          key: "imagen",
        },
        {
          title: "Dependencia",
          key: "dependencia",
        },
        {
          title: "Persona",
          key: "persona",
        },
        {
          title: "Representante",
          key: "representador.persona",
        },
        // {
        //   title: "Invitado",
        //   key: "invitado.persona"
        // },
        // {
        //   title: "Cargo",
        //   key: "cargo",
        // },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      headersAsistenciaTrue: [
        {
          title: '',
          key: 'data-table-expand',
        },
        {
          title: "Dependencia",
          key: "dependencia",
        },
        {
          title: "Persona",
          key: "persona",
        },
        {
          title: "Representante",
          key: "representador.persona",
        },
        // {
        //   title: "Invitado",
        //   key: "invitado.persona"
        // },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      modalAsistencia: false,
      idParticipanteReunion: null,
      openPaseDeLista: false,
      openAsistenciaTrue: false,
      openAsistenciaOrden: false,
      openAsistencia: false,
      open: false,
      selected: [],
      Item: null,
      selectedAsistencia: [],
      selectedInivitacion: [],
      idPersonaselect: null,
      openConfirmarAsistencia: false,
      openRequiereRepresentante: false,
      IdReunion: null,
      idParticipante: null,
      tipoGuardarRepresentate: 0,
      openOrdenMesa: false,
      openAgregarOrdenMesa: false,
      totalSillasIndependientes: 0,
      totalSillasMesa: 0,
      sillasIndependientes: [],
      sillasIzquierda: [],
      sillasDerecha: [],
      CountListaParticipante: 0,
      idPersonaSelect: null,
      listaParticipanteOrdenMesa: [],
      NumeroSilla: 0,
      NombreLugar: "",
      BorrarOrdenMesaParticipante: false,
      NumeroSillaBorrar: 0,
      formRequest: {
        idReunion: 0,
        titulo: "",
        fecha: "",
        hora: "",
        lugar: "",
        tema: "",
        rqActa: false,
        listaOrden: [],
        listaParticipantes: [],
      },
      listaParticipantesVisibles: [],
      listaParticipanteOrden: [],
      listaDependenciaOrden: [],
      datosDrag: [],
      page: 1,
      itemsPerPage: 6,
      hasMoreItems: true,
      loading: false,
      totalConsultas: 0,
      imagenMiniatura: "",
      directorioPersona: [],
      StorageEdomexURL: '',


      // Variables Checklist
      Checks: [],
      ChecksSelecionados: [],
      openCheckList: false,
      idReunionCheck: null,
      registroParticipante: null,
      participanteExtra: [],
      checkboxModel: false,
      banderaFoto: false,
      tipoProcesoEditarModal: 0,
      tab: null,
      participantesGamaAlta: [],
      participantesSinNumero: [],
      participantesConNumero: [],
      isSnackbarVisibleQR: false,
      URLQR: "",
      authenticated: false
    };
  },
  computed: {
    agruparPorDependencia() {
      const participantesPorDependencia = {};
      let contador = 1;
      this.formRequest.listaParticipantes.forEach((participante) => {
        const dependencia = participante.dependencia;
        if (!dependencia) {
          if (!participantesPorDependencia["Sociedad Civil"]) {
            participantesPorDependencia["Sociedad Civil"] = [];
          }
          participantesPorDependencia["Sociedad Civil"].push(participante);

        } else {
          if (!participantesPorDependencia[dependencia]) {
            participantesPorDependencia[dependencia] = [];
          }
          participantesPorDependencia[dependencia].push(participante);
          participante.numeroPar = contador++;
        }
      });
      console.log("->>>>>>>>>>>>", participantesPorDependencia)
      return participantesPorDependencia;
    },

    loadImagen() {
      return this.imagenMiniatura;
    },

    listaConAsistencia() {
      // const newList = this.listaParticipantes?.filter((x) => x.representador != null ? x.representador?.asistencia == false : x.asistencia == false
      // ) || [];7
      const newList = this.listaParticipantes
      return newList
    },
  },
  watch: {
    idPersonaSelect: function (val) {
      this.selectedParticipantes = val;
    },
    // selected: function (newSelected) {
    //   console.log(newSelected);
    //   const selectedIds = newSelected.slice(0);
    //   console.log(selectedIds);
    //   selectedIds.forEach((id) => {
    //     const index = this.listaParticipantes.findIndex((x) => x.id === id);
    //     if (index !== -1) {
    //       this.listaParticipantes[index].invitacionString = "Si";
    //       this.listaParticipantes[index].invitacion = true;
    //     }
    //   });

    //   const notSelectedItems = this.listaParticipantes.filter((item) => {
    //     const isNotSelected = !selectedIds.includes(item.id);
    //     if (isNotSelected) {
    //       item.invitacionString = "No";
    //       item.invitacion = false;
    //     }
    //     return isNotSelected;
    //   });
    // },
    selectedAsistencia: function (newItemSelect) {
      if (newItemSelect.length == this.listaParticipantes.length)
        console.log("Selecciono todo");
    },

  },

  methods: {
    async _CheckUltramsg() {
      this.URLQR = "";
      this.authenticated = false;
      let result = await usuariosService.CheckUltramsg().then(data => data)
      let permiso = useCookie('permisos').value.find(data => data.id == 1 || data.id == 2)
      console.log(result, "Datos Ultramsg");
      if (!result?.data?.accountStatus) {
        if (permiso) {
          if (result) {
            this.CargarQR();

            if (this.$route.name == "reunion-reuniones") {
              await this._CheckUltramsg()
            }
          }
        } else {
          this.CargarQR();
        }
      }
      if (result?.data?.accountStatus?.status == "authenticated") {
        this.authenticated = true;
        this.isSnackbarVisible = false
        this.isSnackbarVisibleQR = false

      } else if (result?.data?.accountStatus?.status == "qr") {
        this.URLQR = result?.data?.accountStatus?.urlQR;
        this.CargarQR();
      }
      else {

      }
    },
    CerrarQR() {
      this.isSnackbarVisibleQR = false
    },
    CargarQR() {
      if (useCookie('tipoUsuario').value == "1") {
        if (useCookie('idTipoPermiso').value == 2 || useCookie('idTipoPermiso').value == 3) {
          this.isSnackbarVisibleQR = true;
        }
        else
          this.isSnackbarVisible = true;
      }
      else
        this.isSnackbarVisible = true;
    },
    // Función para generar un ID único
    generateUniqueId() {
      return 'img_' + Math.random().toString(36).substr(2, 9);
    },

    // Función para agregar una imagen con ID único al contenedor
    addImage() {
      // Generar un ID único para la imagen
      var uniqueId = this.generateUniqueId();

      // URL de la imagen (asumiendo que URLQR es una variable definida)
      var timestamp = Date.now();
      var imageURL = `${this.URLQR}&timestamp=${timestamp}`;

      // Crear el elemento de imagen
      var imgElement = document.createElement('img');
      imgElement.src = imageURL;
      imgElement.id = uniqueId;

      // Crear el contenedor div
      var divElement = document.createElement('div');
      divElement.className = 'text-center';

      // Agregar la imagen al contenedor div
      divElement.appendChild(imgElement);

      // Obtener el contenedor donde se agregarán las imágenes
      var container = document.getElementById('imageContainer');

      // Verificar si el contenedor existe antes de intentar agregar la imagen
      if (container) {
        container.innerHTML = '';
        // Agregar el contenedor div al elemento con el ID "imageContainer"
        container.appendChild(divElement);
      }
    },

    ...mapActions(useReunionesStore, ["setParData"]),
    async _ObtenerReuniones() {
      let result = await reunionService.obtenerReuniones().then((res) => {
        this.Reuniones = res.data;
      });
    },
    async _ObtenerReunionesV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        try {
          let result = await reunionService.obtenerReunionesV2(payload);
          this.Reuniones =
            this.page == 1 ? result.data : [...this.Reuniones, ...result.data];
          this.totalConsultas = result.total;
          this.hasMoreItems = result.total > this.page * this.itemsPerPage;
          this.loading = false;
          // await this.ObtenerListaModalidadYListaEstatus();
        } catch (err) {
          console.log(err);
          this.loading = false;
        }
      }
    },
    async masDatos() {
      this.page++;
      await this._ObtenerReunionesV2();
    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (
        scrollingElement.scrollTop + scrollingElement.clientHeight + gap >=
        scrollingElement.scrollHeight
      ) {
        $("#btn-mas").click();
      }
    },
    async buscarResultados() {
      if (
        this.search.trim() !== "" &&
        this.loading == false &&
        this.search.trim() !== undefined
      ) {
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await reunionService.obtenerReunionesV2(payload);
        this.Reuniones = result.data;
        // await this.ObtenerListaModalidadYListaEstatus();
        this.loading = false;
        this.hasMoreItems = false;
      } else {
        this.hasMoreItems = true;
        await this._ObtenerReunionesV2(1);//1
      }
    },

    abrirModalSelecAsistencia(item) {
      // this.participantesFoto = item;
      // if (this.participantesFoto?.invitado != null) {
      //   this.modalAsistencia = true;
      //   this.participanteExtra = item
      // } else {
      this.AsistenciaParticipantes(item);
      // }

    },

    updateParticipanteReunion() {

      this.fromParticipante = this.idParticipanteReunion;
      console.log(this.fromParticipante)
      if (this.fromParticipante.idRepresentado == null && this.fromParticipante.idInvitante == null) {

        this.toast.info("Recuerda que al pasar la asistencia del Participante se borrara de la lista");
      } else if (this.fromParticipante.idRepresentado > 0) {

        this.toast.info("Recuerda que al pasar la asistencia del Representante se borrara de la lista");
      } else {

      }
    },

    guardarAsistencia() {

      let valor = this.selectedAsistencia.indexOf(this.fromParticipante.id);
      if (valor === -1) this.selectedAsistencia.push(this.fromParticipante.id);
      else this.selectedAsistencia.splice(this.fromParticipante.id, 1);
      this.GuardarAsistenciaPartipante();
      this.modalAsistencia = false;
    },

    AsistenciaParticipantes(item) {
      console.log('item de invitado -->', item)
      if (item.representador != null) {
        this.fromParticipante = item.representador;
        let participanteId = item
        let valor = this.selectedAsistencia.indexOf(participanteId.id);
        if (valor === -1) this.selectedAsistencia.push(participanteId.id);
        else this.selectedAsistencia.splice(participanteId.id, 1);
        this.idPersonaselect = participanteId.id;
      } else {
        this.fromParticipante = item;
        let valor = this.selectedAsistencia.indexOf(item.id);
        if (valor === -1) this.selectedAsistencia.push(item.id);
        else this.selectedAsistencia.splice(item.id, 1);
        this.idPersonaselect = item.id;
      }
      // this.fromParticipante = item;
      this.GuardarAsistenciaPartipante();
      // this.ModalConfimacionAsistencia();
    },
    eliminarParticipante(participante) {
      const index = this.listaParticipantesVisibles.indexOf(participante);
      if (index !== -1) {
        this.listaParticipantesVisibles.splice(index, 1);
      }
      this.$emit("actualizarLista", this.listaParticipantesVisibles); // Emitir evento con la lista actualizada
    },
    OpenEliminar(id) {
      this.idReunionEliminar = id;
      this.openEliminar = true;
    },

    CerrarEliminar() {
      this.idReunionEliminar = 0;
      this.openEliminar = false;
    },
    openAsistencias() {
      this.openAsistenciaTrue = true;
    },

    async EliminarReunion() {
      let result = await reunionService.eliminarReunion(this.idReunionEliminar);
      if (result.data.success) {
        this.toast.success(result.data.message);
        this.CerrarEliminar();
        // await this._ObtenerReuniones();
        this.hasMoreItems = true
        await this._ObtenerReunionesV2(1);//1
        this.hasMoreItems = false
      } else {
        this.toast.error(result.data.message);
      }
    },
    editar(id) {
      this.$router.push({ name: "reunion-crear-reunion", params: { id: id } });
    },
    listaPar(id, listaParticipantesVisibles) {
      this.setParData(listaParticipantesVisibles);

      this.$router.push({
        name: "reunion-lista-asistencia-pdf",
        query: { id: id },
      });
    },

    async ListaOrden(id) {
      let listaOrden = await reunionService
        .obtenerListaOrdenXIdReunion(id)
        .then((res) => {
          this.data = res;
        });
      if (this.data.length) this.openListaOrden = true;
      else this.toast.info("La lista de orden no contiene datos");
    },
    CerrarOpenListaOrden() {
      this.openListaOrden = false;
      this.listaOrden = [];
    },
    async listaParticipanteId(tipo, id) {
      await this._CheckUltramsg()
      this.addImage();
      if (this.authenticated) {
        this.IdReunion = id;
        this.listaParticipantes = [];
        let listaParticipante = await reunionService
          .obtenerListaParticipanteIdReunio(id)
          .then((res) => {
            this.listaParticipantes = res;
          });

        if (tipo == 1) {
          if (this.listaParticipantes.length) this.openListaParticipante = true;
          else this.toast.info("La lista de participante no contiene datos");
        } else if (tipo == 2) {
          if (this.listaParticipantes.length) {
            this.openInvitacion = true;
            this.listaParticipantes.map((data) => {
              if (!data.invitacion) {
                if (data.idGama != 1 && data.telefono != null) this.selectedInivitacion.push(data.id);
              }
            });
            this.participantesGamaAlta = this.listaParticipantes.filter(par => par.idGama == 1);
            this.participantesSinNumero = this.listaParticipantes.filter(par => par.telefono == null && par.idGama !== 1)
            this.participantesConNumero = this.listaParticipantes.filter(par => par.telefono !== null && par.idGama !== 1)
          } else
            this.toast.info("La lista para los invitaciones no contiene datos");
        } else {
          this.openAsistencia = true;
        }
      }

    },
    //AQUI SE OBTIENE LA LISTA DE LOS PARTICIPANTES 
    async listaParticipanteIdPaseDeLista(tipo, id) {
      this.Item = id
      this.IdReunion = id.idReunion;
      let listaParticipante = await reunionService
        .obtenerListaParticipanteIdReunio(this.IdReunion)
        .then((res) => {
          this.listaParticipantes = res;
        });
      if (tipo === 3) {

        this.openAsistencia = true;
      }

    },
    async AsistenciaParticipantesTrue(id) {
      this.IdReunion = id;
      let listaParticipantesVisibles = await reunionService
        .obtenerListaParticipanteIdReunio(id)
        .then((res) => {
          this.listaParticipantesVisibles = res;
        });

      this.listaParticipantesVisibles = this.listaParticipantesVisibles.filter(
        (x) => x.representador != null ? x.representador?.asistencia == true : x.asistencia == true
      );
      console.log(this.listaParticipantesVisibles)
      this.openAsistenciaTrue = true;
    },

    async AsistenciaParticipantesOrden(id) {
      this.IdReunion = id;
      console.log(this.IdReunion)
      let listaParticipanteOrden = await reunionService
        .obtenerListaParticipanteIdReunionMesa(id)
        .then((res) => {
          this.formRequest.listaParticipantes = res
        });
      this.dependenciaParticipantes();
      this.openAsistenciaOrden = true;

    },
    dependenciaParticipantes() {
      const dependenciasAgrupadas = [];

      this.formRequest.listaParticipantes.forEach(participante => {
        const dependencia = participante.dependencia || 'Sociedad Civil';

        // Busca si ya existe una entrada para la dependencia en el array dependenciasAgrupadas
        const dependenciaExistente = dependenciasAgrupadas.find(item => item.nombre === dependencia);

        if (!dependenciaExistente) {
          // Si la dependencia no existe, crea una nueva entrada para ella
          dependenciasAgrupadas.push({
            OrdenDependencia: participante.ordenDependencia != null ? participante.ordenDependencia : dependenciasAgrupadas.length + 1,
            nombre: dependencia,
            participantes: [{
              IdParticipante: participante.id,
              persona: participante.persona || participante.nombres,
              IdDependencia: participante.idDependencia,
              IdReunion: participante.idReunion,
              OrdenMesa: participante.ordenMesa,
              OrdenParticipante: participante.ordenParticipante != null ? participante.ordenParticipante : null
            }]
          });
        } else {
          // Si la dependencia ya existe, agrega el participante a su lista de participantes
          dependenciaExistente.participantes.push({
            IdParticipante: participante.id,
            persona: participante.persona || participante.nombres,
            IdDependencia: participante.idDependencia,
            IdReunion: participante.idReunion,
            OrdenMesa: participante.ordenMesa,
            OrdenParticipante: participante.ordenParticipante != null ? participante.ordenParticipante : null

          });
        }
      });

      // Ordenar las dependencias por el campo ordenDependencia
      dependenciasAgrupadas.sort((a, b) => a.OrdenDependencia - b.OrdenDependencia);

      // Ordenar los participantes dentro de cada dependencia por el campo OrdenMesa
      dependenciasAgrupadas.forEach(dependencia => {
        dependencia.participantes.sort((a, b) => a.OrdenParticipante - b.OrdenParticipante);
      });

      this.datosDrag = dependenciasAgrupadas;
    },
    OrdenParticipante() {

      if (Array.isArray(this.datosDrag) && this.datosDrag.length > 0) {

        this.datosDrag.forEach(dependencia => {

          if (dependencia.hasOwnProperty('participantes') && Array.isArray(dependencia.participantes)) {

            dependencia.participantes.forEach((participante, index) => {

              participante.OrdenParticipante = index + 1;
            });
          }
        });
      }
    },

    OrdenDependencia() {
      // Verifica que datosDrag sea un array y no esté vacío
      if (Array.isArray(this.datosDrag) && this.datosDrag.length > 0) {
        // Recorre cada elemento en datosDrag y asigna el orden de la dependencia
        this.datosDrag.forEach((dependencia, index) => {
          // Agrega el campo 'ordenDependencia' a cada dependencia
          dependencia.OrdenDependencia = index + 1;
        });
      }
    },

    async guardarOrdenParticipante() {

      const participantesConOrden = [];

      // Iterar sobre todas las dependencias y sus participantes
      this.datosDrag.forEach(dependencia => {
        dependencia.participantes.forEach(participante => {
          // Clonar el objeto participante para no modificar el original
          const participanteConOrden = { ...participante };
          // Agregar el campo ordenDependencia al participante clonado
          participanteConOrden.OrdenDependencia = dependencia.OrdenDependencia;
          participantesConOrden.push(participanteConOrden);
        });
      });

      let guardar = await reunionService.ActualizarOrdenMesaParticipante(this.IdReunion, participantesConOrden)

      if (guardar.data.success) {
        this.toast.success("Orden de los participantes guardado");
        this.openAsistenciaOrden = false;
        // await this._ObtenerReuniones();
        this.hasMoreItems = true
        await this._ObtenerReunionesV2(1);//1
        this.hasMoreItems = false
      } else {
        this.toast.success(guardar.data.message);
      }
    },

    toggleParticipantes(dependencia) {

      dependencia.expanded = !dependencia.expanded;
    },

    async listaDetallesOrden(tipo, id) {
      this.IdReunion = id;
      let result = await reunionService
        .obtenerDatosActualizar(id)
        .then((res) => {
          this.formRequest = res.data;
        });
      if (this.formRequest.listaParticipantes.length)
        this.openListaParticipante = true;
      else this.toast.info("La lista de participante no contiene datos");

      console.log(this.formRequest);
    },
    formatearFecha(fecha) {
      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];

      const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const [diaStr, mesStr, anio] = fecha.split("-");
      const dia = parseInt(diaStr);
      const mes = meses[parseInt(mesStr) - 1]; // Restamos 1 porque los arrays en JavaScript comienzan desde 0

      const fechaFormateada = new Date(anio, parseInt(mesStr) - 1, dia);
      const diaSemana = diasSemana[fechaFormateada.getDay()];

      return `${diaSemana} ${dia} de ${mes} del ${anio}`;
    },
    async EnviarInvitacion(id) {
      let result = await reunionService.envioInvitacion(
        id,
        this.listaParticipantes
      );
      if (result.data.success) {
        this.toast.success(result.data.message);
        // await this._ObtenerReuniones();
        this.hasMoreItems = true
        await this._ObtenerReunionesV2(1);//1
        this.hasMoreItems = false
      } else {
        this.toast.error(result.data.message);
      }
    },
    CerrarOpenListaParticipante() {
      this.openListaParticipante = false;
      this.listaParticipantes = [];
    },
    async CerrarModelAsistencia() {
      this.openAsistencia = false;
      this.hasMoreItems = true
      await this._ObtenerReunionesV2(1);//1
      this.hasMoreItems = false
    },
    CerrarOpenInivtados() {
      this.openInvitacion = false;
      this.listaParticipantes = [];
    },
    CerrarModelAsistenciaTrue() {
      this.openAsistenciaTrue = false;
      this.checkboxModel = false;
    },
    openRepresentanteModal(tipo, item, keyInvitado) {
      this.registroParticipante = item
      this.registroParticipante.keyInvitado = keyInvitado
      this.tipoGuardarRepresentate = tipo;
      this.tipoProcesoEditarModal = tipo
      this.openRepresentante = true;
    },

    async obtenerDirectorioId(id) {
      let resultado = await directorioService.listarDirectorioPorId(id).then((res) => {
        this.directorioPersona = res.data;
        console.log("resultado de directorio", this.directorioPersona)
      })
    },

    async obtenerIdSegunOpcion() {
      this.banderaFoto = true;
      this.directorioGuardar.id = this.idDirectorioPersona;
      await this.obtenerDirectorioId(this.idDirectorioPersona);
      if (this.directorioPersona.imagen != null) {
        await directorioService.obtenerImagenUrl(this.directorioPersona.imagen, Date.now()).then((value) => {
          this.imagenMiniatura = value
        });
      } else {
        this.imagenMiniatura = "";
      }
    },

    async obtenerImagenAzure(item) {
      this.participantesFoto = item;
      if (this.participantesFoto.imagen != null) {
        await directorioService.obtenerImagenUrl(this.participantesFoto.imagen, Date.now()).then((value) => {
          this.imagenMiniatura = value
        });
      } else {
        this.imagenMiniatura = "";
      }
      this.open = true
    },

    async guardarImagenParticipante() {
      console.log("datos de la imagen", this.directorioGuardar)
      let formData = new FormData();
      formData.append('Id', this.directorioGuardar.id);
      formData.append('ImagenFile', this.directorioGuardar.ImagenFile);
      formData.append('Imagen', this.directorioGuardar.imagen != null ? this.directorioGuardar.imagen : '');
      let result = await directorioService.actualizarDirectorioImagen(formData);
      if (result.data.success) {
        this.toast.success('Imagen agregada');
        this.open = false;
        this.imagenMiniatura = "";
        this.banderaFoto = false;
        await this.listaParticipanteIdPaseDeLista(3, this.Item);
      } else {
        console.error(result);
      }
    },

    async onSubmit() {
      let res = await this.$refs.refFrom.validate();
      if (res.valid) {
        this.guardarImagenParticipante()
      }
    },

    cerrar() {
      this.open = false;
      this.banderaFoto = false;
      this.imagenMiniatura = "";
      if (this.modalAsistencia == true) {
        this.modalAsistencia = false;
      }
    },

    obtenerImagen(e) {
      let file = '';
      file = e.target.files[0];
      this.directorioGuardar.ImagenFile = file;
      this.cargarImagen(file);
    },
    cargarImagen(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imagenMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },
    async CerrarModalInvitacion() {
      this.Cargo = "";
      this.Representante = "";
      this.fromParticipante = { ...this.fromParticipanteDefault };
      this.openRepresentante = false;
      this.hasMoreItems = true
      await this._ObtenerReunionesV2(1)//1;
      this.hasMoreItems = false
    },
    ModificarRowsParticipante() {
      if (this.tipoGuardarRepresentate == 1) {
        let indexeRows = this.listaParticipantes.indexOf(this.fromParticipante);
        if (indexeRows !== -1) {
          this.listaParticipantes[indexeRows].representante =
            this.Representante;
          this.listaParticipantes[indexeRows].cargo = this.Cargo;
          this.CerrarModalInvitacion();
        } else {
          this.toast.info("El elemento no se encuentra en las lista");
          this.CerrarModalInvitacion();
        }
      } else {
        this.fromParticipante.representante = this.Representante;
        this.fromParticipante.cargo = this.Cargo;
        this.GuardarAsistenciaPartipante();
        this.CerrarModalInvitacion();
      }
    },
    datosPDF(id) {
      this.$router.push({ name: "reunion-reunion-pdf", params: { idReunion: id } });
    },
    InvitacionPDF(id) {
      this.$router.push({ name: "reunion-asistencia-pdf", params: { idReunion: id } });
    },
    ModalConfimacionAsistencia() {
      this.openConfirmarAsistencia = true;
    },
    CerrarModalConfirmacionAsistencia() {
      this.openConfirmarAsistencia = false;
      let valor = this.selectedAsistencia.indexOf(this.idPersonaselect);
      this.selectedAsistencia.splice(valor, 1);
    },
    OpenModalRequiereRepresentante() {
      if (
        this.fromParticipante.representante == "" &&
        this.fromParticipante.cargo == ""
      ) {
        this.openRequiereRepresentante = true;
        this.CerrarModalConfirmacionAsistencia();
      } else {
        this.CerrarModalConfirmacionAsistencia();
        this.GuardarAsistenciaPartipante();
      }
    },
    async GuardarAsistenciaPartipante() {
      let result = await reunionService.AsistenciaParticipante(
        this.fromParticipante
      );
      if (result.data.success) {
        this.toast.success(result.data.message);
        this.listaParticipanteId(3, this.IdReunion);
        //this.$router.push({ name: 'reunion-reuniones' });
      } else {
        this.toast.error(result.data.message);
      }
    },
    GuardarAsistencia(tipo) {
      if (tipo == 1) {
        this.openRequiereRepresentante = false;
        //No requiere datos de reprensente
        //Aqui vamos a guardar la asistencia para la persona
        this.GuardarAsistenciaPartipante();
      } else {
        //Requiere datos de participante
        //Vamos a abrir el modal para solicitar los datos del representante
        this.openRequiereRepresentante = false;
        this.openRepresentanteModal(2, null);
      }
    },
    async OpenMesa(item) {
      this.CerrarOrdenMesa();
      let listaParticipante = await reunionService
        .obtenerListaParticipanteIdReunionMesa(item.idReunion)
        .then((res) => {
          this.listaParticipantes = res;
        });
      this.AsiganarParticipantesAListaOrdenMesa();
      this.NombreLugar = item.lugar;
      this.IdReunion = item.idReunion;
      this.totalSillasIndependientes = this.listaParticipantes.length;
      this.listaParticipantes.forEach(participante => {
        if (participante.representador !== null) {
          this.totalSillasIndependientes--;
        }
      });

      console.log(this.listaParticipantes);
      this.totalSillasMesa = item.totalLugares;
      console.log('dsd', this.totalSillasMesa)
      this.generarSillasEnColumnas();
      this.generarSillasIndependientes();
      this.openOrdenMesa = true;
      //Verificar si se edito la lista de particiantes que se agregar a la lista listaParticipanteOrdenMesa
      this.listaParticipanteOrdenMesa.forEach((elemento) => {
        if (elemento.ordenMesa != null && elemento.ordenMesa !== 0)
          this.actualizarValoresSillas(elemento.ordenMesa, elemento);
      });
    },

    /** funcuion de abir mesa orden  */
    /************************************ */
    async OpenPaseDeLista(item) {
      this.invertirMesa = false;
      this.invertirOrden1 = true;
      this.invertirOrden2 = false;
      this.CerrarOrdenMesa();
      this.openAsistencia = false;
      this.openPaseDeLista = true;
      let listaParticipante = await reunionService
        .obtenerListaParticipanteIdReunionMesa(item.idReunion)
        .then((res) => {
          this.listaParticipantes = res;
        });
      this.AsiganarParticipantesAListaOrdenMesa();
      this.NombreLugar = item.lugar;
      this.IdReunion = item.idReunion;
      this.totalSillasIndependientes = this.listaParticipantes.length;
      this.listaParticipantes.forEach(participante => {
        if (participante.representador !== null) {
          this.totalSillasIndependientes--;
        }
      })
      this.totalSillasMesa = item.totalLugares;
      this.generarSillasEnColumnas();
      this.generarSillasIndependientes();
      this.listaParticipanteOrdenMesa.forEach((elemento) => {
        if (elemento.ordenMesa != null && elemento.ordenMesa !== 0)
          this.actualizarValoresSillas(elemento.ordenMesa, elemento);
      });
    },
    AsiganarParticipantesAListaOrdenMesa() {
      this.listaParticipantes.forEach((elemento) => {
        this.listaParticipanteOrdenMesa.push(elemento);
      });
    },
    async GuardarOrdenMensaParticipanteBD() {
      let result = await reunionService.ActualizarOrdenMesaParticipante(
        this.IdReunion,
        this.listaParticipantes
      );
      if (result.data.success) {
        this.toast.success(result.data.message);
        this.CerrarOrdenMesa();
        // await this._ObtenerReuniones();
        this.hasMoreItems = true
        await this._ObtenerReunionesV2(1);//1
        this.hasMoreItems = false
      } else {
        this.toast.success(result.data.message);
      }
    },
    async CerrarOrdenMesa() {
      this.openOrdenMesa = false;
      this.totalSillasIndependientes = 0; // Reemplaza con el valor real
      this.totalSillasMesa = 0; // Reemplaza con el valor real
      this.sillasIndependientes = []; // Reemplaza con tus datos reales
      this.sillasIzquierda = [];
      this.sillasDerecha = [];
      this.listaParticipantes = [];
      this.listaParticipanteOrdenMesa = [];
      this.NombreLugar = "";
      this.IdReunion = 0;
      this.hasMoreItems = true
      await this._ObtenerReunionesV2(1);//
      this.hasMoreItems = false
    },
    CerrarPaseDeLista() {
      this.openPaseDeLista = false;
      this.totalSillasIndependientes = 0; // Reemplaza con el valor real
      this.totalSillasMesa = 0; // Reemplaza con el valor real
      this.sillasIndependientes = []; // Reemplaza con tus datos reales
      this.sillasIzquierda = [];
      this.sillasDerecha = [];
      this.listaParticipantes = [];
      this.listaParticipanteOrdenMesa = [];
      this.NombreLugar = "";
      this.listaParticipanteId(3, this.IdReunion);
    },
    OpenAgregarOrdenMesa(silla) {
      this.NumeroSilla = silla;
      this.openAgregarOrdenMesa = true;
    },
    CerrarAgregarOrdenMesa() {
      this.openAgregarOrdenMesa = false;
      this.NumeroSilla = 0;
    },
    AgregarOrdenMesa() {
      this.actualizarValoresSillas(this.NumeroSilla, this.idPersonaSelect);
    },
    generarSillasEnColumnas() {
      // Lógica para generar las sillas en las columnas izquierda y derecha según el totalSillasMesa
      const sillasRestantes = this.totalSillasMesa - 1;
      // Comienza desde la silla número 2
      const startingNumber = 2;
      // Agrega el asiento especial en la primera posición de las sillas izquierdas
      this.sillasIzquierda = [
        {
          ordenMesa: 1,
          nombre: "Nombre 1",
          descripcion: "Asiento especial",
          idParticipante: 0,
          idPersona: 0,
          idReunion: 0,
          idInvitante: 0,
          idRepresentado: 0,
          asistencia: false,
          representante: "",
          cargo: "",
          personaRepresentar: "",
          invitadoPor: ""
        },
      ];

      // Si hay más de una silla restante, genera el resto de las sillas izquierdas
      if (sillasRestantes > 0) {
        this.sillasIzquierda = [
          ...this.sillasIzquierda,
          ...Array.from(
            {
              length: Math.min(sillasRestantes, Math.ceil(sillasRestantes / 2)),
            },
            (_, i) => {
              const numeroSilla = i * 2 + startingNumber;
              return this.crearSilla(numeroSilla);
            }
          ),
        ];
      } else {
        this.sillasIzquierda = [];
      }

      // Si hay más de una silla restante, genera las sillas derechas
      if (sillasRestantes > 1) {
        this.sillasDerecha = Array.from(
          {
            length: Math.min(sillasRestantes, Math.floor(sillasRestantes / 2)),
          },
          (_, i) => {
            const numeroSilla = i * 2 + startingNumber + 1;
            return this.crearSilla(numeroSilla);
          }
        );
      } else {
        this.sillasDerecha = [];
      }
    },

    invertirOrden(Item) {
      this.invertirMesa = !this.invertirMesa;
      // Invierte el orden de generación de las sillas
      const sillasDerechaInvertidas = this.sillasIzquierda.slice(1).reverse();
      const sillasIzquierdaInvertidas = this.sillasDerecha.reverse();
      // Actualiza las sillas izquierdas, incluyendo la especial
      this.sillasIzquierda = [
        this.sillasIzquierda[0],
        ...sillasIzquierdaInvertidas,
      ];

      // Actualiza las sillas derechas
      this.sillasDerecha = [...sillasDerechaInvertidas];

      // if (this.sillasIzquierda.length % 2 === 0) {
      //     this.sillasIzquierda.pop();
      // }
      // Invierte los indicadores de orden
      this.invertirOrden1 = !this.invertirOrden1;
      this.invertirOrden2 = !this.invertirOrden2;
    },

    crearSilla(numeroSilla) {
      return {
        ordenMesa: numeroSilla,
        nombre: `Nombre ${numeroSilla}`,
        descripcion: `Descripción ${numeroSilla}`,
        idParticipante: 0,
        idPersona: 0,
        idReunion: 0,
        idGenero: 0,
        idInvitante: 0,
        idRepresentado: 0,
        asistencia: false,
        representante: "",
        cargo: "",
        personaRepresentar: "",
        invitadoPor: ""
      };
    },
    generarSillasIndependientes() {
      const SillasRestante =
        this.totalSillasIndependientes - this.totalSillasMesa;
      const startingNumber = this.totalSillasMesa + 1; // Continúa desde el totalSillasMesa + 1
      // Si hay más de una silla independiente, genera las sillas
      if (SillasRestante > 0) {
        this.sillasIndependientes = Array.from(
          { length: SillasRestante },
          (_, i) => ({
            ordenMesa: i + startingNumber,
            nombre: `Nombre ${i + startingNumber}`,
            descripcion: `Descripción ${i + startingNumber}`,
            idParticipante: 0,
            idPersona: 0,
            idReunion: 0,
            idGenero: 0,
            idInvitante: 0,
            idRepresentado: 0,
            asistencia: false,
            representante: "",
            cargo: "",
            personaRepresentar: "",
            invitadoPor: ""
          })
        );
      } else {
        this.sillasIndependientes = [];
      }
    },
    async actualizarValoresSillas(numSilla, participanteSeleccionado) {
      // Función que devuelve una promesa para poder usar await en ella
      const buscarYActualizarEnLista = async (lista) => {
        const silla = lista.find(
          (silla) => silla.ordenMesa === numSilla && silla.idParticipante === 0
        );

        if (silla) {
          // Actualizar valores según tus necesidades
          silla.nombre = participanteSeleccionado.persona;
          silla.descripcion = participanteSeleccionado.cargoPersona;
          silla.idParticipante = participanteSeleccionado.idParticipante;
          silla.idPersona = participanteSeleccionado.idPersona;
          silla.idReunion = participanteSeleccionado.idReunion;
          silla.idGenero = participanteSeleccionado.idGenero;
          silla.asistencia = participanteSeleccionado.asistencia;
          silla.cargo = participanteSeleccionado.cargo;
          silla.representante = participanteSeleccionado.representante;
          silla.idInvitante = participanteSeleccionado.idInvitante;
          silla.idRepresentado = participanteSeleccionado.idRepresentado;
          silla.personaRepresentar = participanteSeleccionado.personaRepresentar;
          silla.invitadoPor = participanteSeleccionado.invitadoPor;
          const actParticipant = this.listaParticipantes.find(
            (actParticipant) =>
              actParticipant.idParticipante ===
              participanteSeleccionado.idParticipante
          );
          actParticipant.ordenMesa = silla.ordenMesa;
        } else {
          const silla = lista.find((silla) => silla.ordenMesa === numSilla);
          if (silla !== undefined) {
            let ListaDatos = this.listaParticipantes.filter(
              (x) => x.idParticipante === silla.idParticipante
            );

            if (ListaDatos !== undefined) {
              const ListaDatosAct = ListaDatos[0];
              ListaDatosAct.ordenMesa = null;
              silla.nombre = participanteSeleccionado.persona;
              silla.descripcion = participanteSeleccionado.cargoPersona;
              silla.idParticipante = participanteSeleccionado.idParticipante;
              silla.idPersona = participanteSeleccionado.idPersona;
              silla.idReunion = participanteSeleccionado.idReunion;
              silla.idGenero = participanteSeleccionado.idGenero;
              silla.asistencia = participanteSeleccionado.asistencia;
              silla.cargo = participanteSeleccionado.cargo;
              silla.idInvitante = participanteSeleccionado.idInvitante;
              silla.idRepresentado = participanteSeleccionado.idRepresentado;
              silla.representante = participanteSeleccionado.representante;
              silla.personaRepresentar = participanteSeleccionado.personaRepresentar;
              silla.invitadoPor = participanteSeleccionado.invitadoPor;
              const actParticipant = this.listaParticipantes.find(
                (actParticipant) =>
                  actParticipant.idParticipante ===
                  participanteSeleccionado.idParticipante
              );
              actParticipant.ordenMesa = silla.ordenMesa;
              // Usa await para esperar a que se resuelva la promesa antes de continuar
              await this.listaParticipanteOrdenMesa.push(ListaDatosAct);
            }
          }
        }
      };

      // Usa await para esperar a que se resuelvan las promesas antes de continuar
      await buscarYActualizarEnLista(this.sillasIndependientes);
      await buscarYActualizarEnLista(this.sillasIzquierda);
      await buscarYActualizarEnLista(this.sillasDerecha);

      let valor = this.listaParticipanteOrdenMesa.indexOf(
        participanteSeleccionado
      );
      this.listaParticipanteOrdenMesa.splice(valor, 1);

      this.idPersonaSelect = null;
      this.CerrarAgregarOrdenMesa();
    },
    BorrarOrdenMesa(silla) {
      this.NumeroSillaBorrar = silla;
      this.BorrarOrdenMesaParticipante = true;
    },
    async BorrarPaseLista(silla) {
      if (silla.asistencia === true) {
        console.log('aqui silla', silla)
        this.fromParticipante = silla;
        let result = await reunionService.AsistenciaParticipante(
          this.fromParticipante
        );

        if (result.data.success) {
          this.IdReunion = this.Item.idReunions;
          this.toast.success(result.data.message);
          //this.CerrarPaseDeLista();
          setTimeout(() => {
            this.selectedAsistencia = [];
            this.OpenPaseDeLista(this.Item);
          }, 1);
        } else {
          this.toast.error(result.data.message);
        }
      } else {
        console.log("La asistencia no es falsa");
      }
    },

    async BorrarySalirModalMesaParticipante(tipo) {
      if (tipo === 1) {
        this.NumeroSillaBorrar = 0;
        this.BorrarOrdenMesaParticipante = false;
      } else {
        // Función que devuelve una promesa para poder usar await en ella
        const LimpiarSillaEnLista = async (lista) => {
          const silla = lista.find(
            (silla) => silla.ordenMesa === this.NumeroSillaBorrar
          );
          if (silla !== undefined) {
            let ListaDatos = this.listaParticipantes.filter(
              (x) => x.idParticipante === silla.idParticipante
            );

            if (ListaDatos !== undefined) {
              const actParticipant = this.listaParticipantes.find(
                (actParticipant) =>
                  actParticipant.idParticipante === silla.idParticipante
              );
              actParticipant.ordenMesa = null;
              silla.nombre = `Nombre ${this.NumeroSillaBorrar}`;
              silla.descripcion = `Descripción ${this.NumeroSillaBorrar}`;
              silla.idParticipante = 0;
              silla.idPersona = 0;
              silla.idReunion = 0;
              silla.idGenero = 0;
              silla.cargo = "";
              silla.representante = "";
              silla.idInvitante = 0;
              silla.idRepresentado = 0;
              silla.personaRepresentar = "",
                silla.invitadoPor = ""

              //actParticipant.ordenMesa = 0;
              // Usa await para esperar a que se resuelva la promesa antes de continuar
              await this.listaParticipanteOrdenMesa.push(ListaDatos[0]);
            }
          }
          this.BorrarOrdenMesaParticipante = false;
        };
        // Usa await para esperar a que se resuelvan las promesas antes de continuar
        await LimpiarSillaEnLista(this.sillasIndependientes);
        await LimpiarSillaEnLista(this.sillasIzquierda);
        await LimpiarSillaEnLista(this.sillasDerecha);
      }
    },
    async EnviarInivtaciones() {
      // Aca ocurre toda la magia
      for (const data of this.listaParticipantes) {
        this.idInvitacionSpiner = data.id;
        if (this.selectedInivitacion.includes(data.id)) {
          if (!data.invitacion) {
            if (data.idGama != 1)
              await new Promise(async (resolve, reject) => {
                // Suponiendo que envioInvitacion toma dos argumentos: id y data
                const result = await reunionService.envioInvitacion(
                  data.idReunion,
                  data
                );

                if (result.data.success) {
                  data.invitacion = true;
                  //this.toast.success(result.data.message);
                  resolve(); // Resolvemos el Promise cuando todo va bien
                } else {
                  data.invitacion = false;
                  if (result.data.tipoError == 1 || result.data.tipoError == 2) {
                    this.toast.error(result.data.error);
                    this.idInvitacionSpiner = 0;
                    return;
                  }
                  //reject(new Error(result.data.message)); // Rechazamos el Promise en caso de error
                }
              }).catch((error) => {
                console.error(error); // Manejamos cualquier error que se haya rechazado
              });

            //data.invitacion = true;

            const val = this.selectedInivitacion.indexOf(data.id);
            if (val !== -1) {
              // Aseguramos que el índice sea válido
              this.selectedInivitacion.splice(val, 1);
            }
          }
        }
        this.idInvitacionSpiner = 0;
      }
      this.hasMoreItems = true
      await this._ObtenerReunionesV2(1)//1;
      this.hasMoreItems = false
    },


    /* METODOS CHECKLIST */

    async _CheckListValidados(id) {
      this.openCheckList = true
      try {
        let res = await reunionService.CheckListValidados(id).then(data => data)
        console.log(res.data, id, "Validados")
        if (res?.data) {
          res?.data.map(data => {
            data.tipo = data.emoji + " " + data.actividad
          })
          this.Checks = res.data
        }
      } catch (error) {
        console.log(error);
      }
    },

    async _CheckListPorReunion(id) {
      try {
        let res = await reunionService.CheckListByIdReunion(id).then(data => data)
        if (res?.data) {
          this.idReunionCheck = id
          res?.data.map(data => {
            data.tipo = data.emoji + " " + data.actividad
          })
          this.Checks = res.data
        }
      } catch (error) {
        console.log(error);
      }
    },

    async _abrirModalCheckList(id, tipo) {
      console.log(id, tipo, "DatosCheck")
      if (tipo == 1) {
        await this._CheckListPorReunion(id)
        this.idReunionCheck = id
      }
      else
        await this._CheckListValidados(id)

      this.openCheckList = true
    },
    async _cerrarModalCheckList() {
      this.idReunionCheck = null
      this.openCheckList = false
    },

    async _GuardarCheckList(opc, id) {
      var data = []
      try {
        if (opc == 1) {
          data.push(id)
        } else {
          this.Checks.map(d => {
            data.push(d.id)
          })
        }

        let res = await reunionService.ActualizarChecks(this.idReunionCheck, data).then(data => data)

        if (res?.data?.success) {
          await this._CheckListPorReunion(this.idReunionCheck)
          this.toast.success(res.data.message)
          if (this.Checks.length == 0) {
            this.openCheckList = false
            this.idReunionCheck = null
          }
          this.hasMoreItems = true
          await this._ObtenerReunionesV2(1);
          this.hasMoreItems = false
        } else {
          this.toast.success(res?.response?.data?.message)
        }
      } catch (error) {
        console.log(error);
      }
    },

    async alActualizarParticipante() {
      await this.listaParticipanteIdPaseDeLista(3, this.Item);
      this.modalActualizarParticipante(false)
    },

    modalActualizarParticipante(val) {
      this.openRepresentante = val
    },
    InvitadosFirmar() {
      let tieneInvitado = false;
      if (this.checkboxModel) {

        this.listaParticipantesVisibles.forEach(participante => {
          if (participante.invitado != null) {
            participante.invitado.forEach(invitado => {

              tieneInvitado = true;
              console.log("here geresr")
              console.log(this.listaParticipantesVisibles)
              if (invitado.asistencia != false) {
                this.listaParticipantesVisibles.push(invitado);
              }
            });
          }

        });
      } else {
        this.listaParticipantesVisibles.forEach(participante => {
          tieneInvitado = true;
          console.log("here")
          console.log(this.listaParticipantesVisibles)
          this.listaParticipantesVisibles = this.listaParticipantesVisibles.filter(participante => !participante.idInvitante > 0);

        });

      }
      if (tieneInvitado == false) {
        this.toast.error("Esta reunion no tiene invitados");
        this.checkboxModel = false;
      }
    },
    crearReunion() {
      this.$router.push({ name: "reunion-crear-reunion", params: { id: 0 } });

    },
    CheckboxInvitacionChange(id) {
      if (this.selectedInivitacion.includes(id)) {
        const index = this.selectedInivitacion.indexOf(id);
        this.selectedInivitacion.splice(index, 1); // Si ya está, lo elimina
      } else {
        this.selectedInivitacion.push(id); // Si no está, lo agrega
      }
    }

  },

  async created() {

    console.log(this.$route.name, "###");
    this.StorageEdomexURL = $apiService.urlAzureBlobStorage + "directorio/";
    // await this._ObtenerReuniones();
    await this._ObtenerReunionesV2();
    if (this.$route.name == "reunion-reuniones") {
      await this._CheckUltramsg()
      this.addImage();
    }
    // document.addEventListener("DOMContentLoaded", function() {
    //         // Llamar a la función para agregar la imagen

    //         console.log("Ejecutando")
    // });
    // await this.ObtenerListaModalidadYListaEstatus();
  },
  async mounted() {

    window.addEventListener("scroll", this.scrolling);
  },

  unmounted() {
    window.removeEventListener("scroll", this.scrolling);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.scrolling);
  },
};
</script>
<template>
  <div>
    <a href="" id="btn-mas" style="display: none" @click.prevent="masDatos()"></a>
    <p class="text-2xl mb-6">
      <VIcon icon="custom-wizard-social-link" color="primary" class="me-3" size="30" />
      Lista de reuniones
    </p>
    <VRow>
      <VCol cols="12" md="4">
        <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
          single-line hide-details dense outlined @input="buscarResultados" />
      </VCol>
      <VCol cols="12" md="6">
        <v-btn size="40" rounded="pill" color="cafe" @click="crearReunion">
          <VIcon class="tabler-plus" size="32" />
        </v-btn>
      </VCol>
      <VCol cols="12" md="4" v-for="item in Reuniones" :key="item.idReunion">
        <VCard class="mb-4">
          <VCardItem class="d-flex align-center justify-space-between">
            <VRow>
              <VCol cols="10" class="linea-divisora">
                <p class="text-h5 text-primary">
                  <VIcon icon="custom-wizard-social-link" class="me-3" size="18" />
                  Reunión {{ item.idReunion }}
                </p>
                <p>Tema: {{ item.tema }}</p>
                <p>
                  <VIcon icon="tabler-file-typography" color="primary" size="16" />
                  {{ item.titulo }}
                </p>
                <VRow>
                  <VCol md="6">
                    <p>
                      <VIcon icon="tabler-calendar-event" color="primary" size="16" />
                      <span>{{ formatearFecha(item.fechaString) }}</span>
                    </p>
                  </VCol>
                  <VCol md="6">
                    <p>
                      <VIcon icon="tabler-clock-hour-3" color="primary" size="16" />
                      <span>{{ item.horaString }} horas.</span>
                    </p>
                  </VCol>
                </VRow>
                <p>
                  <VIcon icon="tabler-map-pin" color="primary" size="16" />
                  {{ item.lugar }}
                </p>
                <VRow>
                  <VCol md="6">
                    <p>
                      <VIcon icon="tabler-users" color="primary" size="16" />
                      {{ item.modalidad }}
                    </p>
                  </VCol>
                  <VCol md="6">
                    <p>
                      <VIcon icon="tabler-calendar" color="primary" size="16" />
                      {{ item.estatus }}
                    </p>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol md="6">
                    <p>
                      <VIcon icon="tabler-file-text" color="primary" size="16" />
                      Tipo: {{ item.tipoReunionString }}
                    </p>
                  </VCol>
                  <!-- <VCol md="6">
                    <p>
                      <VIcon icon="custom-wizard-social-link" color="primary" size="16" />
                      R. Vinculada: {{ item.idReunionVinculada }}
                    </p>
                  </VCol> -->
                </VRow>
              </VCol>
              <VCol cols="2">
                <div v-if="item.idEstatus === 1">
                  <IconBtn @click="editar(item.idReunion)" color="primary" title="Editar reunión">
                    <VIcon icon="tabler-edit" />
                  </IconBtn>
                </div>
                <div v-else>
                  <IconBtn @click="editar(item.idReunion)" color="success" title="Editar reunión">
                    <VIcon icon="tabler-edit" />
                  </IconBtn>
                </div>

                <IconBtn @click="
                  item.idEstatus === 3
                    ? this.toast.error(
                      'No se puede eliminar una reunion en estatus Procesada'
                    )
                    : OpenEliminar(item.idReunion)
                  " color="error" title="Eliminar reunión">
                  <VIcon icon="tabler-trash" />
                </IconBtn>
                <IconBtn @click="listaDetallesOrden(1, item.idReunion)" title="Detalles reunión">
                  <VIcon icon="tabler-align-left" />
                </IconBtn>
                <IconBtn color="primary" @click="datosPDF(item.idReunion)" title="PDF">
                  <VIcon icon="tabler-file-type-pdf" />
                </IconBtn>
                <IconBtn color="primary" @click="InvitacionPDF(item.idReunion)" title="Personificadores">
                  <VIcon icon="tabler-printer" />
                </IconBtn>
                <VDivider />
                <div v-if="item.countBtnMesa == 0">
                  <IconBtn color="success" @click="OpenMesa(item)" title="Orden mesa">

                    <VIcon icon="tabler-column-insert-left" />
                  </IconBtn>
                </div>
                <div v-else>
                  <IconBtn color="warning" @click="OpenMesa(item)" title="Orden mesa">

                    <VIcon icon="tabler-column-insert-left" />
                  </IconBtn>
                </div>
                <div v-if="item.countBtnInvitacion == 0">
                  <IconBtn color="success" @click="listaParticipanteId(2, item.idReunion)" title="Inivitación">
                    <VIcon icon="tabler-message-share" />
                  </IconBtn>
                </div>
                <div v-else>
                  <IconBtn color="warning" @click="listaParticipanteId(2, item.idReunion)" title="Inivitación">
                    <VIcon icon="tabler-message-share" />
                  </IconBtn>
                </div>
                <div v-if="item.countBtnAsistencia == 0">
                  <IconBtn color="success" @click="listaParticipanteIdPaseDeLista(3, item)" title="Asistencia">
                    <VIcon icon="tabler-pencil-check" />
                  </IconBtn>
                </div>
                <div v-else>
                  <IconBtn color="warning" @click="listaParticipanteIdPaseDeLista(3, item)" title="Asistencia">
                    <VIcon icon="tabler-pencil-check" />
                  </IconBtn>
                </div>
                <div v-if="item.countBtnCheckList == 0">
                  <IconBtn color="success" @click="_abrirModalCheckList(item.idReunion, 2)" title="CheckList">
                    <VIcon icon="tabler-input-check" />
                  </IconBtn>
                </div>
                <div v-else>
                  <IconBtn color="warning" @click="_abrirModalCheckList(item.idReunion, 1)" title="CheckList">
                    <VIcon icon="tabler-input-check" />
                  </IconBtn>
                </div>
                <VDivider />



                <IconBtn color="primary" @click="AsistenciaParticipantesTrue(item.idReunion)" title="Firmar asistencia">
                  <VIcon icon="tabler-signature" size="20" />
                </IconBtn>

                <IconBtn color="primary" @click="AsistenciaParticipantesOrden(item.idReunion)"
                  title="Orden de Asistencia">
                  <VIcon icon="tabler-user" size="20" />
                </IconBtn>


                <VDivider />


              </VCol>
            </VRow>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <VDialog v-model="openEliminar" max-width="500px">
    <VCard>
      <VCardTitle class="d-flex justify-center mt-1 mb-1">¿Deseas eliminar el registro?</VCardTitle>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarEliminar">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="EliminarReunion">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openListaOrden" max-width="1000px">
    <VCard>
      <VCardTitle class="text-center mt-5"> <b>Lista de orden</b></VCardTitle>
      <VCardItem>
        <VDataTable :headers="headers" :items="data" expand-on-click>
          <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
              <td :colspan="headers.length">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th></th>
                      <th>Cargo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(persona, index) in slotProps.item.listaPersona" :key="index">
                      <td>{{ persona.persona }}</td>
                      <td></td>
                      <td>{{ persona.cargo }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardItem>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarOpenListaOrden()">
          Cancelar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openListaParticipante" max-width="1200px">
    <!-- <DialogCloseBtn @click="openListaParticipante = !openListaParticipante" /> -->
    <VCard style="overflow-y: hidden;">
      <VRow class="conte-parti scroll__contenido">
        <VCol cols="12" md="8">
          <VRow>
            <VCol cols="12" md="12">
              <VCard>
                <VCardItem>
                  <p class="text-h4 text-primary">
                    <VIcon icon="custom-wizard-social-link" class="me-3" size="30" />
                    Datos de la reunión
                  </p>
                  <p>Tema: {{ formRequest.tema }}</p>
                  <p>
                    <VIcon icon="tabler-file-typography" color="primary" size="20" />
                    {{ formRequest.titulo }}
                  </p>
                  <VRow>
                    <VCol md="6">
                      <p>
                        <VIcon icon="tabler-calendar-event" color="primary" size="20" />
                        <span>{{
                          formatearFecha(formRequest.fechaString)
                        }}</span>
                      </p>
                    </VCol>
                    <VCol md="6">
                      <p>
                        <VIcon icon="tabler-clock-hour-3" color="primary" size="20" />
                        <span>{{ formRequest.horaString }} horas.</span>
                      </p>
                    </VCol>
                  </VRow>
                  <p>
                    <VIcon icon="tabler-map-pin" color="primary" size="20" />{{
                      formRequest.lugar
                    }}
                  </p>
                </VCardItem>
              </VCard>
            </VCol>
            <VCol cols="12" md="12">
              <VCard>
                <VCardItem>
                  <p class="text-h4 text-primary">
                    <VIcon icon="tabler-align-box-left-top" class="me-3" size="30" />
                    Orden del día
                  </p>
                  <div class="mt-3 mb-3" v-for="(orden, index) in formRequest.listaOrden" :key="index">
                    <p>
                      <b> {{ orden.numOrden }}. {{ orden.descripcion }}</b>
                    </p>
                    <VRow>
                      <VCol cols="12" md="6" v-for="(persona, personaIndex) in orden.listaPersona" :key="personaIndex">
                        <p class="mb-0">
                          <VIcon icon="tabler-user" color="primary" size="20" />
                          <span>{{ persona.persona }}</span>
                        </p>
                        <p class="ps-6">{{ persona.cargo }}</p>
                      </VCol>
                    </VRow>
                    <hr class="mt-2 mb-2" />
                  </div>
                </VCardItem>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" md="4">
          <VCard>
            <VCardItem>
              <p class="text-h5 text-primary">
                <VIcon icon="tabler-user-up" class="me-3" size="30" />
                Participantes de la reunión
              </p>
              <div v-for="(
                  participantesPorDependencia, dependencia
                ) in agruparPorDependencia" :key="dependencia">
                <hr />
                <p class="text-h6 text-primary mt-2">
                  {{ dependencia }}
                </p>
                <div v-for="(participante, index) in participantesPorDependencia" :key="index">
                  <p class="mb-0" v-if="participante.representador == null">
                    <VIcon icon="tabler-user" color="primary" size="20" />
                    <span>{{ participante.persona }}</span>
                  <p class="ps-6">{{ participante.cargoPersona }}</p>
                  </p>

                  <p class="mb-2" v-if="participante.representador?.idPersona > 0">
                    <VIcon icon="tabler-user" color="primary" size="20" />
                    <span>{{ participante.representador.persona }} <b class="text-primary">en representación de</b> {{
                      participante.persona }}</span>
                  </p>
                  <div v-for="(invitado, indexInvitado) in participante.invitado" :key="indexInvitado">
                    <p class="pl-5" v-if="invitado?.idPersona > 0">
                    <p class="text-primary mb-0 mt-0">Invitado:</p>
                    <span>{{ invitado.persona }} <b class="text-primary"></b> </span>
                    <span>{{ invitado.cargo }} <b class="text-primary"></b> </span>
                    </p>
                  </div>

                  <!-- <hr style="border:1px solid red; margin-top:5px;margin-bottom:5px"> -->
                </div>
              </div>

            </VCardItem>
          </VCard>
        </VCol>

      </VRow>
    </VCard>
  </VDialog>
  <VDialog v-model="openInvitacion" max-width="1000px" persistent>
    <VCard>
      <VCardTitle class="text-center mt-5"><b>Lista para invitación</b></VCardTitle>
      <VCardItem>
        <v-tabs class="v-tabs-pill" v-model="tab">
          <v-tab class="content-tabs" value="Ralto">Rango alta</v-tab>
          <v-tab class="content-tabs" value="conNumero">Con número</v-tab>
          <v-tab class="content-tabs" value="sinNumero">Sin número</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="Ralto">
            <VDataTable :headers="headersInvitacion" :items="participantesGamaAlta" :items-per-page="25">
              <template #item.checks="{ item }">
                <v-checkbox primary hide-details @click.stop :model-value="selectedInivitacion.includes(item.id)"
                  @input="CheckboxInvitacionChange(item.id)" />
              </template>

              <template #item.invitacionString="{ item }">
                <div v-if="item.invitacion">
                  <VIcon icon="tabler-checks" size="30" colo="info" />
                </div>
                <div v-else>
                  <VProgressCircular v-if="item.id == idInvitacionSpiner" :size="30" width="3" color="cafe"
                    indeterminate />
                  <VProgressCircular v-else />
                </div>
              </template>
            </VDataTable>
          </v-window-item>
          <v-window-item value="sinNumero">
            <VDataTable :headers="headersInvitacion" :items="participantesSinNumero" :items-per-page="25">
              <template #item.checks="{ item }">
                <v-checkbox primary hide-details @click.stop :model-value="selectedInivitacion.includes(item.id)"
                  @input="CheckboxInvitacionChange(item.id)" />
              </template>

              <template #item.invitacionString="{ item }">
                <div v-if="item.invitacion">
                  <VIcon icon="tabler-checks" size="30" colo="info" />
                </div>
                <div v-else>
                  <VProgressCircular v-if="item.id == idInvitacionSpiner" :size="30" width="3" color="cafe"
                    indeterminate />
                  <VProgressCircular v-else />
                </div>
              </template>
            </VDataTable>
          </v-window-item>
          <v-window-item value="conNumero">
            <VDataTable :headers="headersInvitacion" :items="participantesConNumero" :items-per-page="25">
              <template #item.checks="{ item }">
                <v-checkbox primary hide-details @click.stop :model-value="selectedInivitacion.includes(item.id)"
                  @input="CheckboxInvitacionChange(item.id)" />
              </template>

              <template #item.invitacionString="{ item }">
                <div v-if="item.invitacion">
                  <VIcon icon="tabler-checks" size="30" colo="info" />
                </div>
                <div v-else>
                  <VProgressCircular v-if="item.id == idInvitacionSpiner" :size="30" width="3" color="cafe"
                    indeterminate />
                  <VProgressCircular v-else />
                </div>
              </template>
            </VDataTable>
          </v-window-item>
        </v-window>

      </VCardItem>
      <VCardActions class="pt-3">
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarOpenInivtados()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="EnviarInivtaciones()">
          Enviar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="openRepresentante" max-width="500px">
    <form-invitado-participante :value="registroParticipante" :listRegistrados="listaParticipantes"
      :tipo-proceso="tipoProcesoEditarModal" :onSave="alActualizarParticipante"
      :modalOption="modalActualizarParticipante" />
  </VDialog>
  <VDialog v-model="openAsistencia" max-width="1200px">
    <VCard>
      <VCardTitle class="text-center mt-5"><b>Pase de lista</b></VCardTitle>
      <VCardItem>
        <VDataTable :headers="headersAsistencia" :items="listaConAsistencia" expand-on-click>
          <template #item.imagen="{ item }">
            <div class="d-flex align-center">
              <VAvatar size="34">
                <Img class="image-left" :src="`${StorageEdomexURL + item.imagen}`" alt="Imagen" width="32"
                  v-if="item.imagen" />

                <img class="image-left" src="../../assets/images/logos/Colibri.png" alt="Imagen" width="32" v-else />
              </VAvatar>
            </div>
          </template>
          <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
              <td :colspan="headersAsistencia.length">
                <table class="table" style="width:100%;text-align:center">
                  <thead>
                    <tr>
                      <th>Asistencia</th>
                      <th>Invitado</th>
                      <th>Cargo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody v-for="(persona, index) in slotProps" :key="index">
                    <tr v-for="(invitado, keyInvitado) in persona.invitado" :key="keyInvitado">
                      <td v-if="invitado.asistencia == false"> <v-checkbox v-if="invitado.asistencia == false" primary
                          hide-details @click.stop :model-value="selectedAsistencia.includes(invitado.id)"
                          @update:model-value="AsistenciaParticipantes(invitado)" /></td>
                      <td v-if="invitado.asistencia == false">{{ invitado.persona }} </td>
                      <td v-if="invitado.asistencia == false">{{ invitado.cargo }} </td>
                      <td v-if="invitado.asistencia == false">
                        <IconBtn @click="openRepresentanteModal(2, persona, keyInvitado)">
                          <VIcon icon="tabler-edit" color="success" size="20" style="margin:5px " />
                        </IconBtn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
          <!-- aqui tengo lo que necesito  -->
          <!-- aqui tengo lo que necesito  -->
          <!-- aqui tengo lo que necesito  -->
          <!-- aqui tengo lo que necesito  -->

          <template #item.asistencia="{ item }">
            <v-checkbox v-if="item.asistencia == false && item.representador == null" primary hide-details @click.stop
              :model-value="selectedAsistencia.includes(item.id)"
              @update:model-value="abrirModalSelecAsistencia(item)" />
            <v-checkbox v-else-if="item.representador != null && item.representador?.asistencia == false" primary
              hide-details @click.stop :model-value="selectedAsistencia.includes(item.id)"
              @update:model-value="abrirModalSelecAsistencia(item)" />

            <VIcon color="success" v-if="item.asistencia == true || item.representador?.asistencia == true"
              icon="tabler-check" />
            <!-- <v-checkbox v-if="item.representador == null && item.invitado == null" primary hide-details @click.stop
              :model-value="selectedAsistencia.includes(item.id)"
              @update:model-value="abrirModalSelecAsistencia(item)" /> -->
            <!-- <VIcon class="ml-1" icon="tabler-box-model-2" v-else-if="item.invitado != null" primary hide-details
              @click.stop :model-value="selectedAsistencia.includes(item.id)" @click="abrirModalSelecAsistencia(item)">
            </VIcon> -->
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-1" v-if="item.asistencia == false && item.representador == null">
              <IconBtn @click="openRepresentanteModal(1, item)">
                <VIcon icon="tabler-replace" />
              </IconBtn>
              <IconBtn @click="obtenerImagenAzure(item)">
                <VIcon icon="tabler-plus" />
              </IconBtn>
            </div>
            <div class="d-flex gap-1" v-else-if="item.representador != null && item.representador?.asistencia == false">
              <IconBtn @click="openRepresentanteModal(1, item)">
                <VIcon icon="tabler-replace" />
              </IconBtn>
              <IconBtn @click="obtenerImagenAzure(item)">
                <VIcon icon="tabler-plus" />
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCardItem>
      <VCardActions class="d-flex justify-center pt-3">
        <VBtn color="error" variant="outlined" @click="CerrarModelAsistencia()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="OpenPaseDeLista(Item)">
          Mesa
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Formulario modal para agregar/editar directorio -->
  <VDialog v-model="open" max-width="450px" persistent>
    <VCard>
      <VCardTitle>
        <span class="headline">Agregar imagen</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VForm ref="refFrom" @submit.prevent="onSubmit()" enctype="multipart/form-data">
            <VRow>
              <VCol cols="12" md="4" class="file-upload-container">
                <div class="image-container">
                  <VImg class="image-left" :src="loadImagen" alt="Imagen" width="150" height="150" v-if="loadImagen" />

                  <img class="image-left" src="../../assets/images/logos/Colibri.png" alt="Imagen" width="150"
                    height="150" v-else />

                  <!-- <VIcon v-else size="100" icon="table-user"></VIcon> -->
                </div>
                <label for="fileInput" class="custom-file-button">
                  <VIcon class="tabler-plus" size="32" />
                </label>
                <input v-if="banderaFoto" type="file" accept="image/*" id="fileInput" ref="fileInput"
                  @change="obtenerImagen" style="display: none;" />
              </VCol>
              <VDivider class="my-3" />
              <VRow>
                <VCol cols="12">
                  <label>Selecciona a la persona para subir la foto:</label>
                  <VRadioGroup v-model="idDirectorioPersona" @change="obtenerIdSegunOpcion">
                    <VRow>
                      <VCol class="mt-6" cols="12" v-if="participantesFoto.idPersona">
                        <label>Participante</label>
                        <VRadio :label="participantesFoto.persona" :value="participantesFoto.idPersona" />
                      </VCol>
                      <VCol cols="12" v-if="participantesFoto.representador?.idPersona > 0">
                        <label>Representante</label>
                        <VRadio :label="participantesFoto.representador.persona"
                          :value="participantesFoto.representador.idPersona" />
                      </VCol>
                      <VCol v-if="participantesFoto.invitado.length > 0"
                        v-for="(invitado, index) in participantesFoto.invitado" :key="indice" cols="12">
                        <label>Invitado</label>
                        <VRadio :label="invitado.persona" :value="invitado.idPersona" />
                      </VCol>
                    </VRow>
                  </VRadioGroup>
                </VCol>
              </VRow>
              <!-- Botones de submit y reset -->
              <VCol cols="12" class="d-flex gap-4">
                <VBtn color="success" variant="elevated" type="submit">
                  Guardar
                </VBtn>
                <VBtn color="secondary" type="reset" variant="tonal" @click="cerrar">
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="modalAsistencia" max-width="450px">
    <VCard>
      <VCardTitle>
        <span class="headline">Pasar lista</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VForm ref="refFrom" @submit.prevent="guardarAsistencia()" enctype="multipart/form-data">
            <VRow>

              <VDivider class="my-3" />
              <VRow>
                <VCol cols="12">
                  <label>Seleccionar persona para la asistencia:</label>
                  <VRadioGroup v-model="idParticipanteReunion" @change="updateParticipanteReunion">
                    <VRow>
                      <VCol class="mt-6" cols="12" v-if="participantesFoto.representador == null">
                        <label>Participante</label>
                        <VRadio :label="participantesFoto.persona" :value="participanteExtra" />
                      </VCol>
                      <VCol cols="12"
                        v-if="participantesFoto.representador?.idPersona > 0 && participantesFoto.representador?.asistencia != true">
                        <label>Representante</label>
                        <VRadio :label="participantesFoto.representador.persona"
                          :value="participanteExtra.representador" />
                      </VCol>
                      <VCol cols="12"
                        v-if="participantesFoto.invitado?.idPersona > 0 && participantesFoto.invitado?.asistencia != true">
                        <label>Invitado</label>
                        <VRadio :label="participantesFoto.invitado.persona" :value="participanteExtra.invitado" />
                      </VCol>
                    </VRow>
                  </VRadioGroup>
                </VCol>
              </VRow>
              <!-- Botones de submit y reset -->
              <VCol cols="12" class="d-flex gap-4">
                <VBtn color="success" variant="elevated" type="submit">
                  Guardar
                </VBtn>
                <VBtn color="secondary" type="reset" variant="tonal" @click="cerrar">
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="openAsistenciaTrue" max-width="1000px">
    <VCard>
      <VCardTitle class="text-center mt-5"><b>Participantes Confirmados</b></VCardTitle>
      <VCardItem>
        <VCardActions>
          <VSpacer />
          <v-checkbox primary hide-details v-model="checkboxModel" @update:model-value="InvitadosFirmar()"
            v-if="listaParticipantesVisibles.length > 0">
            Firma de invitados
          </v-checkbox>
          <VSpacer />
        </VCardActions>
        <VDataTable :headers="headersAsistenciaTrue" :items="listaParticipantesVisibles">
          <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
              <td :colspan="headersAsistenciaTrue.length">
                <table class="table" style="width:100%;text-align:center">
                  <thead>
                    <tr>
                      <th>Invitado</th>
                      <th>Cargo</th>

                    </tr>
                  </thead>
                  <tbody v-for="(persona, index) in slotProps" :key="index">
                    <tr v-for="(invitado, keyInvitado) in persona.invitado" :key="keyInvitado">
                      <td v-if="invitado.asistencia != false">{{ invitado.persona }} </td>
                      <td v-if="invitado.asistencia != false">{{ invitado.cargo }} </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
          <template #item.persona="{ item }">
            <p v-if="item.representador == null">{{ item.persona }}</p>
            <p v-else><small><b><strike>{{ item.persona }}</strike></b></small></p>

          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <!--<IconBtn @click="listaPar(item.idReunion, listaParticipantesVisibles)">
                                <VIcon icon="tabler-file-settings" />
                            </IconBtn>-->
              <IconBtn @click="eliminarParticipante(item)">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </div>
          </template>
        </VDataTable>
      </VCardItem>
      <VCardActions class="pt-3">
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarModelAsistenciaTrue()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="listaPar(this.IdReunion, listaParticipantesVisibles)">
          Imprimir
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openAsistenciaOrden" class="v-dialog-sm" height="">
    <DialogCloseBtn @click="openAsistenciaOrden = false" />
    <VCard>
      <VRow>
        <VCol cols="12" md="12">
          <VCardText>

            <VCol cols="12" md="12" class="px-0">
              <h6 class="text-h4 font-weight-medium">
                Seleccionar el orden de las dependencias y los participantes.
              </h6>
            </VCol>
            <div class="scrollable-content py-0">
              <draggable v-model="datosDrag" group="dependencias" @update="OrdenDependencia" tag="ul" :animation="300"
                style="list-style: none;">
                <template #item="{ element: dependencia }">
                  <div>
                    <div class="text-depen">
                      <VRow @click="toggleParticipantes(dependencia)">
                        <VCol cols="2" md="2" variant="tonal">
                          <VAvatar color="secondary" icon="tabler-user-pentagon" />
                        </VCol>
                        <VCol cols="10" md="10" class="pt-4">
                          <strong>{{ dependencia.nombre }}</strong>
                        </VCol>
                      </VRow>

                    </div>

                    <draggable v-if="dependencia.expanded" v-model="dependencia.participantes" group="participantes"
                      @update="OrdenParticipante" tag="ul" :animation="300" style="list-style: none;">
                      <template #item="{ element: participante, index }">
                        <li class="border py-3 my-3 rounded context" style="padding:10px;">
                          <VRow>
                            <VCol cols="2" md="2" variant="tonal" class="text-center">
                              <VAvatar color="secondary" size="35" icon="tabler-user" />
                            </VCol>
                            <VCol cols="10" md="10">
                              <div class="my-2">
                                <strong>{{ participante.persona }}</strong>
                              </div>
                            </VCol>
                          </VRow>
                        </li>
                      </template>
                    </draggable>
                  </div>
                </template>
              </draggable>
            </div>
          </VCardText>
          <VCardActions class="justify-end flex-wrap gap-3 mt-5 py-0 mr-5 mb-4">
            <VBtn variant="tonal" color="secondary" @click="openAsistenciaOrden = false">
              Cancelar
            </VBtn>
            <VBtn variant="elevated" color="primary" @click="guardarOrdenParticipante()">
              Guardar
            </VBtn>
          </VCardActions>
        </VCol>
      </VRow>
    </VCard>
  </VDialog>
  <VDialog v-model="openConfirmarAsistencia" max-width="500px">
    <VCard>
      <VCardTitle>¿Esta seguro que es la persona?</VCardTitle>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarModalConfirmacionAsistencia()">
          No
        </VBtn>
        <VBtn color="success" variant="elevated" @click="OpenModalRequiereRepresentante()">
          Si
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openRequiereRepresentante" max-width="500px">
    <VCard>
      <VCardTitle>¿La persona requiere representante?</VCardTitle>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="GuardarAsistencia(1)">
          No
        </VBtn>
        <VBtn color="success" variant="elevated" @click="GuardarAsistencia(2)">
          Si
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>


  <!-- modal para la orden de mesa -->
  <VDialog v-model="openOrdenMesa" style="max-width: 1000px; width: auto">
    <DialogCloseBtn @click="openOrdenMesa = !openOrdenMesa" />
    <VCard>
      <div class="container">
        <div class="text-center">
          <p class="sub-titulo" color="cafe">
            <b>Asignación de lugares en la Sala de Juntas.<br />
              {{ this.NombreLugar }}</b>
          </p>
        </div>
        <VRow class="centrosss">
          <VCol md="3">
            <div v-if="totalSillasIndependientes > totalSillasMesa" class="" style="width: 250px">
              <VCol md="" class="align-content-center">
                <div class="col-pdf-silla-independientes">
                  <div class="justo" style="max-height: 450px; overflow-y: auto;">
                    <div v-for="silla in sillasIndependientes" :key="silla.ordenMesa">
                      <div class="silla-cen mb-2">
                        <IconBtn @click="
                          silla && OpenAgregarOrdenMesa(silla.ordenMesa)
                          " title="Orden mesa" class="pas">
                          <div class="d-block">
                            <!-- <VIcon class="tabler-armchair me-3" color="primary" size="22"/> -->
                            <div v-if="silla.idParticipante == 0">
                              <VIcon class="me-2">
                                <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-2(1).ico"
                                  alt="" />
                              </VIcon>
                            </div>
                            <div v-else>
                              <div v-if="silla.idGenero == 1">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-3.ico"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-1(1).ico"
                                    alt="" />
                                </VIcon>
                              </div>
                            </div>
                          </div>
                        </IconBtn>
                        <div v-if="silla.idParticipante == 0">
                          <VBtn size="22" color="primary" class="mt-2" title="Silla libre">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                        <div v-else>
                          <VBtn size="22" color="primary" class="mt-2" @click="BorrarOrdenMesa(silla.ordenMesa)"
                            title="Limpiar silla">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                      </div>
                      <span class="texto mt-1">
                        <p class="mb-0">
                          <b>{{ silla.nombre }}</b>
                        </p>
                        <p class="mb-0">{{ silla.descripcion }}</p>
                        <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de {{
                          silla.personaRepresentar }}</b></p>
                        <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                          silla.invitadoPor }}</b></p>
                      </span>
                    </div>
                  </div>
                </div>
              </VCol>
            </div>
          </VCol>
          <VCol class="d-flex justify-center" md="9">
            <VCol md="9" class="ma-10">
              <div class="align-content-center">
                <div class="col-pdf-1">
                  <div v-if="this.sillasIzquierda.length > 0">
                    <p>
                      <b>{{ this.sillasIzquierda[0].nombre }}</b>
                    </p>
                    <p>{{ this.sillasIzquierda[0].descripcion }}</p>
                    <IconBtn @click="
                      OpenAgregarOrdenMesa(sillasIzquierda[0].ordenMesa)
                      " title="Orden mesa" class="tabler-user text-primary" size="30">
                    </IconBtn>
                  </div>
                </div>
                <br />
              </div>
              <div class="row-pdf">
                <div class="col-pdf">
                  <div class="col-silla-iz">
                    <div v-for="silla in sillasIzquierda.slice(1)" :key="silla.ordenMesa">
                      <span class="texto mt-0">
                        <p class="mb-0">
                          <b>{{ silla.nombre }}</b>
                        </p>
                        <p class="mb-0">{{ silla.descripcion }}</p>
                        <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de
                            {{ silla.personaRepresentar }}</b></p>
                        <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                          silla.invitadoPor }}</b></p>
                      </span>
                      <div class="silla-cen mb-2 me-4 ms-2">
                        <IconBtn @click="
                          silla && OpenAgregarOrdenMesa(silla.ordenMesa)
                          " title="Orden mesa" class="pas">
                          <div class="d-block">
                            <div v-if="silla.idParticipante == 0">
                              <VIcon class="me-2">
                                <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-2(1).ico"
                                  alt="" />
                              </VIcon>
                            </div>
                            <div v-else>
                              <div v-if="silla.idGenero == 1">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-3.ico"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-1(1).ico"
                                    alt="" />
                                </VIcon>
                              </div>
                            </div>
                          </div>
                        </IconBtn>
                        <div v-if="silla.idParticipante == 0">
                          <VBtn size="22" color="primary" class="mt-2" title="Silla libre">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                        <div v-else>
                          <VBtn size="22" color="primary" class="mt-2" @click="BorrarOrdenMesa(silla.ordenMesa)"
                            title="Limpiar silla">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-pdf-2 mx-3">
                  <div class="ms" ref="msElement"></div>
                </div>
                <div class="col-pdf">
                  <div class="col-silla-der">
                    <div v-for="silla in sillasDerecha" :key="silla.ordenMesa">
                      <div class="d-flex">
                        <div class="silla-cen mb-2 me-2 ms-3">
                          <div v-if="silla.idParticipante == 0">
                            <VBtn size="22" color="primary" class="mt-2 ma-1" title="Silla libre">
                              <span size="15">{{ silla.ordenMesa }}</span>
                            </VBtn>
                          </div>
                          <div v-else>
                            <VBtn size="22" color="primary" class="mt-2 ma-1" @click="BorrarOrdenMesa(silla.ordenMesa)"
                              title="Limpiar silla">
                              <span size="15">{{ silla.ordenMesa }}</span>
                            </VBtn>
                          </div>

                          <IconBtn @click="
                            silla && OpenAgregarOrdenMesa(silla.ordenMesa)
                            " title="Orden mesa" class="pas">
                            <div class="d-block">
                              <div v-if="silla.idParticipante == 0">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 13.png"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <div v-if="silla.idGenero == 1">
                                  <!-- <VIcon class="tabler-armchair me-3" color="primary"
                                                                        size="22" /> -->
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso H12.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso M14.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                            </div>
                          </IconBtn>
                        </div>
                        <span class="texto mt-0">
                          <p class="mb-0">
                            <b>{{ silla.nombre }}</b>
                          </p>
                          <p class="mb-0">{{ silla.descripcion }}</p>
                          <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de
                              {{ silla.personaRepresentar }}</b></p>
                          <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                            silla.invitadoPor }}</b></p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </VCol>
          </VCol>
        </VRow>
      </div>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarOrdenMesa()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="GuardarOrdenMensaParticipanteBD()">
          Guardar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="openAgregarOrdenMesa" max-width="500px">
    <VCard>
      <VCardTitle class="text-center mt-5"><b>Agregar participante a la mesa</b></VCardTitle>
      <VCol cols="12" md="12">
        <AppCombobox color="#b48d57" v-model="idPersonaSelect" :items="listaParticipanteOrdenMesa" item-title="persona"
          item-value="id" label="Lista participantes" density="compact" placeholder="Seleccione el participante" />
      </VCol>
      <!-- <VRow>
        <VCol cols="12" md="4">
          <label style="display: flex;justify-content: center;" for="fecha">Participante</label>
          <p style="display: flex;justify-content: center;"
            v-if="selectedParticipantes?.representador == null && selectedParticipantes?.invitado == null">
            <strong>
              <VIcon class="tabler-square-check"></VIcon>
            </strong>
          </p>
        </VCol>
        <VCol cols="12" md="4">
          <label style="display: flex;justify-content: center;" for="hora">Representante</label>
          <p style="display: flex;justify-content: center;" v-if="selectedParticipantes?.representador != null">
            <strong>
              <VIcon class="tabler-square-check"></VIcon>
            </strong>
          </p>
        </VCol>
        <VCol cols="12" md="4">
          <label style="display: flex;justify-content: center;" for="acta">Invitado</label>
          <p style="display: flex;justify-content: center;" v-if="selectedParticipantes?.invitado != null">
            <strong>
              <VIcon class="tabler-square-check"></VIcon>
            </strong>
          </p>
        </VCol>
      </VRow> -->
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarAgregarOrdenMesa()">
          No
        </VBtn>
        <VBtn color="success" variant="elevated" @click="AgregarOrdenMesa()">
          Si
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="BorrarOrdenMesaParticipante" max-width="500px">
    <VCard>
      <VCardTitle class="text-center mt-5"><b>¿Esta seguro que desea cambiar de lugar?</b></VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="BorrarySalirModalMesaParticipante(1)">
          No
        </VBtn>
        <VBtn color="success" variant="elevated" @click="BorrarySalirModalMesaParticipante(2)">
          Si
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openPaseDeLista" style="max-width: 1000px; width: auto">
    <DialogCloseBtn @click="openPaseDeLista = !openPaseDeLista" />
    <VCard>
      <div class="container">
        <div class="text-center">
          <p class="sub-titulo" color="cafe">
            <b>Asignación de lugares en la Sala de Juntas.<br />
              {{ this.NombreLugar }}</b>
          </p>
          <div class="boton">
            <VBtn size="38" @click="invertirOrden(Item)">
              <VIcon size="22" icon="tabler-analyze" />
            </VBtn>
          </div>
        </div>

        <VRow class="centrosss">
          <VCol md="3">
            <div v-if="totalSillasIndependientes > totalSillasMesa" class="" style="width: 250px">
              <VCol md="" class="align-content-center">
                <div class="col-pdf-silla-independientes">
                  <div class="justo" style="max-height: 450px; overflow-y: auto;">
                    <div v-for="silla in sillasIndependientes" :key="silla.ordenMesa">
                      <div class="silla-cen mb-2">
                        <div class="pas">
                          <div class="d-block my-1">
                            <!-- <VIcon class="tabler-armchair me-3" color="primary" size="22"/> -->
                            <div v-if="silla.asistencia == false">
                              <div v-if="silla.idParticipante == 0">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-2(1).ico"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <div v-if="silla.idGenero == 1">
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-3.ico"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-1(1).ico"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="silla.idParticipante == 0">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 22.png"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <div v-if="silla.idGenero == 1">
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 24.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <VIcon class="me-2" color="success">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 23.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="silla.idParticipante == 0">
                          <VBtn size="22" color="primary" class="mt-2" title="Silla libre">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                        <div v-else>
                          <VBtn size="22" color="primary" class="mt-2" @click="BorrarPaseLista(silla)"
                            title="Limpiar silla">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                      </div>
                      <span class="texto mt-1">
                        <p class="mb-0">
                          <b>{{ silla.nombre }}</b>
                        </p>
                        <p class="mb-0">{{ silla.descripcion }}</p>
                        <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de
                            {{ silla.personaRepresentar }}</b></p>
                        <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                          silla.invitadoPor }}</b></p>
                      </span>
                    </div>
                  </div>
                </div>
              </VCol>
            </div>
          </VCol>
          <VCol md="9">
            <VCol md="9" class="ma-10">
              <div v-if="invertirOrden1" class="align-content-center">
                <div class="col-pdf-1">
                  <div v-if="this.sillasIzquierda.length > 0">
                    <p>
                      <b>{{ this.sillasIzquierda[0].nombre }}</b>
                    </p>
                    <p>{{ this.sillasIzquierda[0].descripcion }}</p>
                    <div v-if="this.sillasIzquierda[0].asistencia == false">
                      <IconBtn class="tabler-user text-primary" size="30">
                      </IconBtn>
                    </div>
                    <div v-else>
                      <IconBtn class="tabler-user text-primary" size="30" color="success">
                      </IconBtn>
                    </div>
                  </div>
                </div>
                <br />
              </div>
              <div class="row-pdf">
                <div class="col-pdf">
                  <div class="col-silla-iz">
                    <!-- !Quitar si no funciona -->
                    <div v-if="this.sillasIzquierda.length ==
                      this.sillasDerecha.length && this.invertirMesa == true
                    ">
                      <div class="d-flex">
                        <div class="silla-cen mb-2 me-2 ms-3">
                          <div></div>

                          <div class="pas">
                            <div>
                              <div class="d-block my-1 ms-1">
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span class="texto mt-0">
                          <p class="mb-0">
                            <b></b>
                          </p>
                          <p></p>
                        </span>
                      </div>
                    </div>
                    <!-- !Hasta -->
                    <div v-for="silla in sillasIzquierda.slice(1)" :key="silla.ordenMesa">
                      <span class="texto mt-0">
                        <p class="mb-0">
                          <b>{{ silla.nombre }}</b>
                        </p>
                        <p class="mb-0">{{ silla.descripcion }}</p>
                        <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de
                            {{ silla.personaRepresentar }}</b></p>
                        <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                          silla.invitadoPor }}</b></p>
                      </span>
                      <div class="silla-cen mb-2 me-4 ms-2">
                        <div class="pas">
                          <div class="d-block my-1">
                            <div v-if="silla.asistencia == false">
                              <div v-if="silla.idParticipante == 0">
                                <VIcon class="me-2">
                                  <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-2(1).ico"
                                    alt="" />
                                </VIcon>
                              </div>
                              <div v-else>
                                <div v-if="silla.idGenero == 1">
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-3.ico"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso-1(1).ico"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="silla.idParticipante == 0">
                                <div>
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 22.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                              <div v-else>
                                <div v-if="silla.idGenero == 1">
                                  <VIcon class="me-2" color="success">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 24.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <VIcon class="me-2" color="success">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 23.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="silla.idParticipante == 0">
                          <VBtn size="22" color="primary" class="mt-2" title="Silla libre">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                        <div v-else>
                          <VBtn size="22" color="primary" class="mt-2" @click="BorrarPaseLista(silla)"
                            title="Limpiar silla">
                            <span size="15">{{ silla.ordenMesa }}</span>
                          </VBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-pdf-2 mx-3">
                  <div class="ms" ref="msElement"></div>
                </div>
                <div class="col-pdf">
                  <div class="col-silla-der">
                    <div v-for="silla in sillasDerecha" :key="silla.ordenMesa">
                      <div class="d-flex">
                        <div class="silla-cen mb-2 me-2 ms-3">
                          <div v-if="silla.idParticipante == 0">
                            <VBtn size="22" color="primary" class="mt-2 ma-1" title="Silla libre">
                              <span size="15">{{ silla.ordenMesa }}</span>
                            </VBtn>
                          </div>
                          <div v-else>
                            <VBtn size="22" color="primary" class="mt-2 ma-1" @click="BorrarPaseLista(silla)"
                              title="Limpiar silla">
                              <span size="15">{{ silla.ordenMesa }}</span>
                            </VBtn>
                          </div>

                          <div class="pas">
                            <div v-if="silla.asistencia == false">
                              <div class="d-block my-1 ms-1">
                                <div v-if="silla.idParticipante == 0">
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 13.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <div v-if="silla.idGenero == 1">
                                    <!-- <VIcon class="tabler-armchair me-3" color="primary"
                                                                        size="22" /> -->
                                    <VIcon class="me-2">
                                      <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso H12.png"
                                        alt="" />
                                    </VIcon>
                                  </div>
                                  <div v-else>
                                    <VIcon class="me-2">
                                      <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso M14.png"
                                        alt="" />
                                    </VIcon>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <div class="d-block my-1 ms-1">
                                <div v-if="silla.idParticipante == 0">
                                  <VIcon class="me-2">
                                    <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 25.png"
                                      alt="" />
                                  </VIcon>
                                </div>
                                <div v-else>
                                  <div v-if="silla.idGenero == 1">
                                    <!-- <VIcon class="tabler-armchair me-3" color="primary"
                                                                        size="22" /> -->
                                    <VIcon class="me-2">
                                      <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 26.png"
                                        alt="" />
                                    </VIcon>
                                  </div>
                                  <div v-else>
                                    <VIcon class="me-2">
                                      <img class="mx-2" width="20" src="../../assets/images/icons/file/Recurso 27.png"
                                        alt="" />
                                    </VIcon>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span class="texto mt-0">
                          <p class="mb-0">
                            <b>{{ silla.nombre }}</b>
                          </p>
                          <p class="mb-0">{{ silla.descripcion }}</p>
                          <p v-if="silla.idRepresentado !== 0 && silla.idRepresentado !== null"><b>Representante de
                              {{ silla.personaRepresentar }}</b></p>
                          <p v-if="silla.idInvitante !== 0 && silla.idInvitante !== null"><b>Invitado de {{
                            silla.invitadoPor }}</b></p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="invertirOrden2" class="align-content-center mt-4">
                <div class="col-pdf-1">
                  <div v-if="this.sillasIzquierda.length > 0">
                    <p>
                      <b>{{ this.sillasIzquierda[0].nombre }}</b>
                    </p>
                    <p>{{ this.sillasIzquierda[0].descripcion }}</p>
                    <div v-if="this.sillasIzquierda[0].asistencia == false">
                      <IconBtn class="tabler-user text-primary" size="30">
                      </IconBtn>
                    </div>
                    <div v-else>
                      <IconBtn class="tabler-user text-primary" size="30" color="success">
                      </IconBtn>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </VCol>
          </VCol>
        </VRow>
      </div>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarPaseDeLista()">
          Cancelar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>


  <!-- * Modal de checkList -->

  <VDialog v-model="openCheckList" max-width="1000px">
    <VCard class="pa-3" style="min-height: 65px;">
      <VCardText>
        <!-- <VCol> -->
        <VRow>
          <VCol cols="12" md="4" lg="4" v-for="(check, key ) in Checks" :key="key" :loading="loading">
            <VCard>
              <VCardText>
                <div class="d-flex" v-if="idReunionCheck != null">
                  <VCheckbox true-icon="tabler-check" @click="_GuardarCheckList(1, check.id)" false-icon="tabler-x"
                    :value="check.id" color="cafe" />
                  <p class="mb-0 mt-1">{{ check.tipo }}</p>
                </div>
                <div class="d-flex" v-else>
                  <p class="mb-0 mt-1">{{ check.tipo }}</p>
                </div>
              </VCardText>
            </VCard>
            <!-- <VSelect color="#b48d57" v-model="ChecksSelecionados" :items="Checks" item-title="tipo"
                          item-value="id" label="Seleccione los checkList" density="compact"
                          placeholder="Selecciones checklist" multiple /> -->
          </VCol>

        </VRow>

      </VCardText>
      <!-- <VCardTitle>¿Deseas eliminar el registro?</VCardTitle> -->

      <VCardActions class="pa-0 mt-4">
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="_cerrarModalCheckList()">
          Cerrar
        </VBtn>
        <VBtn v-if="idReunionCheck != null" color="success" variant="elevated" @click="_GuardarCheckList(2)">
          Guardar todos
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VSnackbar v-model="isSnackbarVisible" vertical color="error" variant="tonal" location="top" :timeout="60000">
    "Le informo: Los datos del teléfono para enviar mensajes de WhatsApp son incorrectos.
    El token del teléfono no coincide con nuestros registros. Para ayuda adicional, comuníquese con su
    administrador de sistemas."
    <!-- {{ !useCookie('permisos').value.find(data => data.id == 1 || data.id == 2) &&
      !useCookie('datosUltraMsg').value.accountStatus
      ? "Ususario normal" : useCookie('datosUltraMsg').value.error }} -->
        
  </VSnackbar>
  <VSnackbar v-model="isSnackbarVisibleQR" vertical color="secundary" location="center" :timeout="15000">
    <div class="text-center">
      <p>"Por favor, escanea el código QR utilizando el teléfono desde el cual se enviarán las invitaciones de
        WhatsApp."
      </p>
    </div>
    <div class="text-center" id="imageContainer"></div>
    <!-- <div class="text-center" ><img :src="`${URLQR}`" ></div> -->
    <div class="d-flex justify-end my-5">
      <VBtn color="primary" @click="CerrarQR()">Cerrar</VBtn>
    </div>
  </VSnackbar>
</template>
<style scoped>
.centrosss {
  justify-content: center;
  display: inline-flex;
}

.sub-titulo {
  font-size: 15px;
  margin-top: 25px;
  justify-content: center;
  align-items: center;
}

.row-pdf {
  display: flex;
  justify-content: center;
  max-width: 1000px;
  width: 100%;
}

.col-pdf {
  max-width: 40%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.centro {
  display: flex;
  justify-content: center;
}

.col-pdf-silla-independientes {
  justify-content: center;
  display: contents;
  flex-direction: column;
  position: relative;
}

.justo {
  width: 180px;
  justify-content: center;
  position: absolute;
  left: 30px;
  bottom: 5%;
}

.silla-independientes {
  justify-content: center;
  display: contents;
  width: 300px;
}

.col-pdf-2 {
  max-width: 20%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.col-pdf-1 {
  max-width: 100%;
  text-align: center;
}

.col-pdf-1 p {
  margin: 0;
}

.ms {
  border: 25px solid #8e3040;
  width: 70px;
  min-height: 100%;
  transition: height 0.5s ease;
  border-radius: 12px;
  position: relative;
}

/* .sillas {
    border: 3px solid #8e3040;
    padding: 4px;
    margin: auto;
    margin-left: 15px;
    height: 51px;
    width: 50px;
    right: 15px;
}

.sillas-2 {
    border: 3px solid #8e3040;
    padding: 4px;
    margin: auto;
    height: 51px;
    right: 15px;
    width: 51px;
}

.sillas3 {
    border: 3px solid #8e3040;
    padding: 4px;
    margin: auto;
    margin-bottom: 15px;
    height: 51px;
    width: 51px;
    right: 15px;
}

.silla {
    padding: 4px;
    padding-left: 6px;
    padding-right: 6px;
    margin: 2px;
    border: 3px solid #8e3040;
    width: 35px;
    height: 35px;
} */

.row-pdf .sillas:first-child {
  margin-top: 30px;
}

.col-silla-iz {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.col-silla-der {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.col-silla-iz div {
  display: flex;
}

.texto {
  max-width: 100%;
  text-align: center;
  font-size: 10px;
}

.texto {
  margin: 0%;
  width: 190px;
  height: 68px;
}

.pas {
  padding-left: 0px;
  padding-right: 0px;
  background-color: transparent !important;
}

.silla-cen {
  display: flex;
  justify-content: center;
}

.cente {
  display: flex;
  justify-content: end;
}

.conte-parti {
  padding: 15px;
}

.cargo {
  margin-bottom: 0;
}

.boton {
  position: absolute;
  top: 20px;
  right: 20px;
}

.linea-divisora {
  border-right: 1.4px solid #726f7b;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.scroll__contenido {
  min-height: auto;
  max-height: 800px;
  overflow-y: scroll !important;
}

.context:hover {
  box-shadow: 14px 10px 50px 0px rgba(0, 0, 0, 0.16);
  font-size: 1rem;
}

.text-depen:hover {
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 12px;
  margin-top: 5px;
  cursor: pointer;
  box-shadow: 14px 10px 50px 0px rgba(0, 0, 0, 0.16);
  font-size: 1rem;
}
</style>
