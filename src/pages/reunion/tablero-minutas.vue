<script>
import draggable from "vuedraggable";
import tableroMinutasService from '@/services/TableroMinutas/tablero-minutas-service'
import { VIcon } from "vuetify/lib/components/index.mjs";
import { useToast } from "vue-toastification";
import reunionService from "@/services/reuniones-service";

let id = 1;
export default {
  name: "two-list-headerslots",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable,
  },
  data() {
    return {
      // esto es para los temas

      /* VARIABLES REALES */
      idMinutaUpdateDatos: 0,
      idTemaUpdateDatos: 0,
      idTipoUpdateDatos: 0,
      toast: useToast(),


      TemasReunionesMetricas: [],
      TemasReunionesMetricas2: [],
      TemasReunionesMetricas3: [],
      TemasReunionesMetricas4: [],
      TemasReunionesMetricas5: [],

      //DATOS MODAL TEMAS
      ListaReuniones: [],

      ListaReunionesReserva: [],
      ListaReunionesPendientes: [],
      ListaReunionesEnProceso: [],
      ListaReunionesTerminado: [],
      ListaReunionesArchivados: [],

      //DATOS MODAL REUNION
      datosAcuerdosParaModalReuniones: [],
      datosReunionesParaModalReuniones: [],

      ListaAcuerdosReserva: [],
      ListaAcuerdosPendientes: [],
      ListaAcuerdosEnProceso: [],
      ListaAcuerdosTerminado: [],
      ListaAcuerdosArchivados: [],


      //AGREGAR COMENTARIO
      newComentario: {
        id: 0,
        idAcuerdo: 0,
        comentario: ""
      },
      comentarioError: "",

      //AGREGAR TAREAaCUERDO
      newtareaAcuerdo: {
        idTarea: 0,
        idAcuerdo: 0,
        fecha: null,
        observaciones: "",
        estatus: "",
        contacto: ""
      },
      observacionesError: "",
      refTareaAcuerdo: "",
      idTareaAcuerdoDelete: 0,
      modalDeleteTareaAcuerdo: false,
      verTareaAcuerdo: false,

      //DATOS MODAL ACUERDOS
      datosAcuerdo: [],

      //CARGAR ARCHIVOS
      idAcuerdoArchivos: 0,
      modalEliminarDocumento: false,
      idEliminarDocumento: 0,

      //ACTUALIZAR COMENTARIO PRINCIPAL
      comentarioPrincipal: "",
      updateComentario: {
        idAcuerdo: 0,
        comentario: ""
      },


      //SPINNER
      modalSpinner: false,

      /* FIN VARIABLES REALES */




      columnTemas1: "1",
      columnTemas2: "1",


      columnReunion1: "1",
      columnReunion2: "1",

      // esto es para los acuerdos
      acuerdos: [
        {
          name: "A-1-24-2-2024",
          id: 0,
        },
        { name: "A-2-24-2-2024", id: 1 },
        { name: "A-3-24-2-2024", id: 2 },
      ],
      acuerdos2: [],
      acuerdos3: [],
      acuerdos4: [],
      acuerdos5: [],
      columnAcuerdos1: "1",
      columnAcuerdos2: "1",
      dialog: false,
      items: [
        {
          title: "Crítico",
          value: "1",
          color: "error",
          icon: "tabler-alert-triangle-filled",
        },
        {
          title: "Alto",
          value: "2",
          color: "warning'",
          icon: "tabler-alert-triangle",
        },
        {
          title: "Promedio",
          value: "3",
          color: "success",
          icon: "tabler-brand-vercel",
        },
        {
          title: "Bajo",
          value: "O4",
          color: "secondary",
          icon: "tabler-alert-circle",
        },
      ],
      selectedOption: {
        title: "Promedio",
        value: "3",
        color: "success",
        icon: "tabler-brand-vercel",
      },

      isComentario: false,
      selectedMealId: null,
      selectedMeal: null,
      comentarioTexto: "",
      comments: [],
      numComments: 0,
      isAcurdo: false,
      currentTab: "tab-1",
      listaUser: [
        {
          title: "Enrique B",
          abreviatura: "EB",
          icon: "tabler-user-circle",
          id: 1,
        },
        {
          title: "Erick G",
          abreviatura: "EG",
          icon: "tabler-user-circle",
          id: 2,
        },
        {
          title: "Jesus M",
          abreviatura: "JM",
          icon: "tabler-user-circle",
          id: 3,
        },
      ],
      selectedListaUser: {
        title: "Enrique B",
        abreviatura: "EB",
        icon: "tabler-user-circle",
        value: 1,
      },
      tareaUserLista: [
        {
          fecha: "",
          tarea: "",
          selectUser: "",
          selectStatus: "",
          check: false,
          id: 0
        }

      ],
      checkboxOne: false,
      listEstatus: [
        { nombre: "Pendiente", id: 1 },
        { nombre: "En progreso", id: 2 },
        { nombre: "Completado", id: 3 }
      ],
      tareasNuevas: [],
      selectStatus: {},
      desserts: [

      ],
      panel: 0,
      panel2: 0,
      panel3: 0,
      isDialogTipoMA: false,
      selectedTipoMA: null,
      isModalTemas: false,
      selectedMealId: null
    };
  },
  computed: {

    ///// para los reuniones
    totalListReunion() {
      return this.reunion.length;
    },
    totalListReunion2() {
      return this.reunion2.length;
    },
    totalListReunion3() {
      return this.reunion3.length;
    },
    totalListReunion4() {
      return this.reunion4.length;
    },
    totalListReunion5() {
      return this.reunion5.length;
    },

    ///// para los acuerdos
    totalListAcuerdos() {
      return this.acuerdos.length;
    },
    totalListAcuerdos2() {
      return this.acuerdos2.length;
    },
    totalListAcuerdos3() {
      return this.acuerdos3.length;
    },
    totalListAcuerdos4() {
      return this.acuerdos4.length;
    },
    totalListAcuerdos5() {
      return this.acuerdos5.length;
    },
  },
  methods: {

    async _TemaReunionesMetricas() {
      try {
        let res = await tableroMinutasService.GetTemaReunionesMetricas().then(data => data)
        if (res?.data)
          await this._AcomodarDatosTemas(res.data)

        // console.log(res?.data, "Temas reuniones");
        return res?.data
      } catch (error) {
        console.log(error);
      }
    },

    async _AcuerdoMinutasId(id) {
      try {
        let res = await tableroMinutasService.GetAcuerdoMinutasId(id).then(data => data)
        if (res?.data)
          await this._AcomodarDatosAcuerdos(res.data)

        // console.log(res.data, "Acuerdos minutas");
      } catch (error) {
        console.log(error);
      }
    },



    async _UpdateAcuerdosTablero(idAcuerdo, idEstatusTablero) {
      try {
        var res = await tableroMinutasService.updateAcuerdosTablero(idAcuerdo, idEstatusTablero).then(data => data)
      } catch (error) {

      }
    },



    //ACOMODAR LOS DATOS EN SUS VARIABLES
    async _AcomodarDatosTemas(datos) {
      // this.TemasReunionesMetricas = []
      // this.TemasReunionesMetricas2 = []
      // this.TemasReunionesMetricas3 = []
      // this.TemasReunionesMetricas4 = []
      // this.TemasReunionesMetricas5 = []
      this._LimpiarVariablesTemas()

      datos.map(data => {
        switch (data?.temaReunionVM?.idEstatusTablero) {
          case 1:
            this.TemasReunionesMetricas.push(data)
            break;
          case 2:
            this.TemasReunionesMetricas2.push(data)
            break;
          case 3:
            this.TemasReunionesMetricas3.push(data)
            break;
          case 4:
            this.TemasReunionesMetricas4.push(data)
            break;
          case 5:
            this.TemasReunionesMetricas5.push(data)
            break;
          default:
            this.TemasReunionesMetricas.push(data)
            break;
        }
      })
    },

    async _AcomodarDatosReunion(datos) {
      // this.ListaReunionesReserva = []
      // this.ListaReunionesPendientes = []
      // this.ListaReunionesEnProceso = []
      // this.ListaReunionesTerminado = []
      // this.ListaReunionesArchivados = []
      this._LimpiarVariablesReuniones()

      datos.reunionVM.map(data => {
        // console.log(data);
        switch (data.reunionVM.idEstatusTablero) {
          case 1:
            this.ListaReunionesReserva.push(data)
            break;
          case 2:
            this.ListaReunionesPendientes.push(data)
            break;
          case 3:
            this.ListaReunionesEnProceso.push(data)
            break;
          case 4:
            this.ListaReunionesTerminado.push(data)
            break;
          case 5:
            this.ListaReunionesArchivados.push(data)
            break;
          default:
            this.ListaReunionesReserva.push(data)
            break;
        }
      })
    },

    async _AcomodarDatosAcuerdos(datos) {
      // this.ListaAcuerdosReserva = []
      // this.ListaAcuerdosPendientes = []
      // this.ListaAcuerdosEnProceso = []
      // this.ListaAcuerdosTerminado = []
      // this.ListaAcuerdosArchivados = []
      // this.datosAcuerdosParaModalReuniones = []
      this._LimpiarVariablesAcuerdos()

      this.datosAcuerdosParaModalReuniones = datos

      datos.map(data => {
        // console.log(data.listaAcuerdosMinutas);
        switch (data.listaAcuerdosMinutas[0].acuerdosMinutasVM.idEstatusTablero) {
          case 1:
            this.ListaAcuerdosReserva.push(data)
            break;
          case 2:
            this.ListaAcuerdosPendientes.push(data)
            break;
          case 3:
            this.ListaAcuerdosEnProceso.push(data)
            break;
          case 4:
            this.ListaAcuerdosTerminado.push(data)
            break;
          case 5:
            this.ListaAcuerdosArchivados.push(data)
            break;
          default:
            this.ListaAcuerdosReserva.push(data)
            break;
        }
      })

      // console.log(this.datosAcuerdosParaModalReuniones, "Datos para modal de Reuniones");
    },


    //AGREGAR UN NUEVO COMENTARIO
    async _guardarComentario() {
      try {

        if (this.newComentario.comentario.length > 0) {
          this.comentarioError = ""
          let res = await tableroMinutasService.AddComentario(this.newComentario).then(data => data)
          // console.log(res);
          if (res?.data?.success) {
            this.toast.success(res?.data?.message)
            this.datosAcuerdo.listaComentariosAcuerdos.push({
              comentario: this.newComentario.comentario,
              id: res.data.createdId,
              idAcuerdo: this.newComentario.idAcuerdo
            })
            this.newComentario.comentario = ""

            await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
          } else {
            this.toast.error("No se pudo agregar el comentario")
          }
        } else {
          this.comentarioError = "Ingrese un comentario"
          // this.toast.warning("Ingrese datos en el comentario")
        }
      } catch (error) {
        console.log(error);
      }
    },

    async _guardarTareaAcuerdo() {
      try {
        let form = await this.$refs.refTareaAcuerdo.validate();
        // console.log(form, this.newtareaAcuerdo.observaciones, this.newtareaAcuerdo.observaciones.length);
        if (form.valid && this.newtareaAcuerdo.observaciones.length > 0) {
          this.observacionesError = ""

          if (this.newtareaAcuerdo.idTarea == 0) {
            let res = await tableroMinutasService.AddTareaAcuerdo(this.newtareaAcuerdo).then(data => data)
            if (res?.data.success) {
              this.dialog = false
              this.toast.success(res?.data?.message)
              await this._getTareasAcuerdo()

              // this.datosAcuerdo.listaTareasAcuerdos.push({
              //   idTarea: res.data.createdId,
              //   idAcuerdo: 0,
              //   fecha: null,
              //   observaciones: this.newtareaAcuerdo.observaciones,
              //   estatus: this.newtareaAcuerdo.estatus,
              //   contacto: this.newtareaAcuerdo.contacto
              // })
              this.newtareaAcuerdo.observaciones = ""
              this.newtareaAcuerdo.estatus = ""
              this.newtareaAcuerdo.contacto = ""
              // await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
            } else {
              this.toast.error("No se pudo agregar el estatus")
            }
          } else {
            let res = await tableroMinutasService.UpdateTareaAcuerdo(this.newtareaAcuerdo).then(data => data)
            if (res?.data.success) {
              this.dialog = false
              this.toast.success(res?.data?.message)
              await this._getTareasAcuerdo()

              // this.datosAcuerdo.listaTareasAcuerdos.push({
              //   idTarea: res.data.createdId,
              //   idAcuerdo: 0,
              //   fecha: null,
              //   observaciones: this.newtareaAcuerdo.observaciones,
              //   estatus: this.newtareaAcuerdo.estatus,
              //   contacto: this.newtareaAcuerdo.contacto
              // })
              this.newtareaAcuerdo.observaciones = ""
              this.newtareaAcuerdo.estatus = ""
              this.newtareaAcuerdo.contacto = ""
              // await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
            } else {
              this.toast.error("No se pudo agregar el estatus")
            }
          }

          // console.log(res, "Respuesta add tarea acuerdo");

        } else {
          this.observacionesError = "Ingrese una observación"
        }


      } catch (error) {
        console.log(error);
      }
    },

    async _getTareasAcuerdo() {
      try {
        let res = await tableroMinutasService.GetTareasAcuerdo(this.idAcuerdoArchivos).then(data => data)
        if (res?.data) {
          this.datosAcuerdo.listaTareasAcuerdos = []
          this.datosAcuerdo.listaTareasAcuerdos = res.data.data
        }
      } catch (error) {
        console.log(error);
      }
    },

    async _EliminarTareaAcuerdo() {
      try {
        let res = await tableroMinutasService.deleteTareaAcuerdo(this.idTareaAcuerdoDelete).then(data => data)
        if (res?.data?.success) {
          this.modalDeleteTareaAcuerdo = false
          await this._getTareasAcuerdo()
          this.toast.success(res.data.message)
        }
        // console.log(res, "Tarea eliminada");
      } catch (error) {
        console.log(error);
      }
    },

    async _verTareaAcuerdo(data) {
      this.newtareaAcuerdo = data
      this.verTareaAcuerdo = true
      this.dialog = true
    },

    async _cerrarModalEliminarTareaAcuerdo() {
      this.verTareaAcuerdo = false
      this.modalDeleteTareaAcuerdo = false
    },
    async _abrirModalEliminarTareaAcuerdo(data) {
      this.idTareaAcuerdoDelete = data.idTarea
      // console.log(data.idTarea);
      this.modalDeleteTareaAcuerdo = true
    },
    async _abrirModalEditarTareaAcuerdo(data) {
      this.verTareaAcuerdo = false
      // console.log(data);
      this.newtareaAcuerdo = data
      this.dialog = true
    },


    async _deleteTareaAcuerdo() {
      await this._EliminarTareaAcuerdo()
    },


    //ACTUALIZAR COMENTARIO PRINCIPAL

    async _actualizarComentario() {
      try {
        this.updateComentario.comentario = this.comentarioPrincipal
        // console.log(this.updateComentario);
        let res = await tableroMinutasService.updateComentarioPrincipal(this.updateComentario).then(data => data)

        if (res?.data?.success) {
          this.toast.success(res?.data?.message)
          await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
        }

        // console.log(res, "Resultado de acutalizar comnetario principal");
      } catch (error) {
        console.log(error);
      }
    },


    //MODAL DE LOS CARRILES
    async _ModalTemas(data, tipo) {
      this.idTipoUpdateDatos = tipo
      this.idTemaUpdateDatos = data.id
      this.ListaReuniones = []
      // this.ListaReunionesReserva = []
      this._LimpiarVariablesAcuerdos()


      switch (tipo) {
        case 1:
          this.TemasReunionesMetricas.filter(async (d) => {
            if (d.temaReunionVM.id == data.id) {
              this.ListaReuniones = d
              await this._AcomodarDatosReunion(d)
              // this.ListaReunionesReserva = d
            }
          })
          break;
        case 2:
          this.TemasReunionesMetricas2.filter(async (d) => {
            if (d.temaReunionVM.id == data.id) {
              this.ListaReuniones = d
              await this._AcomodarDatosReunion(d)
              // this.ListaReunionesReserva = d
            }
          })
          break;
        case 3:
          this.TemasReunionesMetricas3.filter(async d => {
            if (d.temaReunionVM.id == data.id) {
              this.ListaReuniones = d
              await this._AcomodarDatosReunion(d)
              // this.ListaReunionesReserva = d
            }
          })
          break;
        case 4:
          this.TemasReunionesMetricas4.filter(async d => {
            if (d.temaReunionVM.id == data.id) {
              this.ListaReuniones = d
              await this._AcomodarDatosReunion(d)
              // this.ListaReunionesReserva = d
            }
          })
          break;
        case 5:
          this.TemasReunionesMetricas5.filter(async d => {
            if (d.temaReunionVM.id == data.id) {
              this.ListaReuniones = d
              await this._AcomodarDatosReunion(d)
              // this.ListaReunionesReserva = d
            }
          })
          break;
        default:
          break;
      }

      this.isModalTemas = true
      this.toggleColumnReunion1(2);
      console.log(this.ListaReuniones, "Datos de modal temas");
    },

    async _ModalReuniones(reunion, tipo) {
      this.datosReunionesParaModalReuniones = []
      this.datosReunionesParaModalReuniones = reunion

      if (tipo == 1) {
        this.idMinutaUpdateDatos = reunion.minutasVM.idMinuta
        await this._AcuerdoMinutasId(reunion.minutasVM.idMinuta)
      }
      else {
        this._LimpiarVariablesAcuerdos()
        this.datosAcuerdosParaModalReuniones = []
      }

      this.selectedTipoMA = reunion;
      this.isDialogTipoMA = true;

      console.log(this.datosReunionesParaModalReuniones, "-------------------------");
    },

    async _ModalAcuerdos(item) {
      this.comentarioPrincipal = ''
      this.datosAcuerdo = []


      this.comentarioPrincipal = item?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.comentarioTablero ?? ''
      this.updateComentario.idAcuerdo = item?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo

      this.newComentario.idAcuerdo = item?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo
      this.newtareaAcuerdo.idAcuerdo = item?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo
      this.idAcuerdoArchivos = item?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo

      this.datosAcuerdo = item
      this.isAcurdo = true
      // console.log(this.datosAcuerdo, "Datos acuerdos")
    },

    openDialog() {
      // this.newtareaAcuerdo = {
      //   idTarea: 0,
      //   idAcuerdo: 0,
      //   fecha: null,
      //   observaciones: "",
      //   estatus: "",
      //   contacto: ""
      // }
      this.newtareaAcuerdo.idTarea = 0
      this.newtareaAcuerdo.fecha = null
      this.newtareaAcuerdo.observaciones = ""
      this.newtareaAcuerdo.estatus = ""
      this.newtareaAcuerdo.contacto = ""

      this.verTareaAcuerdo = false;
      this.dialog = true;
    },


    //LIMPIAR VARIABLES
    _LimpiarVariablesReuniones() {
      this.ListaReunionesReserva = []
      this.ListaReunionesPendientes = []
      this.ListaReunionesEnProceso = []
      this.ListaReunionesTerminado = []
      this.ListaReunionesArchivados = []
    },

    _LimpiarVariablesAcuerdos() {
      this.ListaAcuerdosReserva = []
      this.ListaAcuerdosPendientes = []
      this.ListaAcuerdosEnProceso = []
      this.ListaAcuerdosTerminado = []
      this.ListaAcuerdosArchivados = []
      this.datosAcuerdosParaModalReuniones = []
    },

    _LimpiarVariablesTemas() {
      this.TemasReunionesMetricas = []
      this.TemasReunionesMetricas2 = []
      this.TemasReunionesMetricas3 = []
      this.TemasReunionesMetricas4 = []
      this.TemasReunionesMetricas5 = []
    },

    _NumeroDeOrden(NumOrden) {
      switch (NumOrden) {
        case 1:
          return "PRIMER PUNTO";
        case 2:
          return "SEGUNDO PUNTO";
        case 3:
          return "TERCER PUNTO";
        case 4:
          return "CUARTO PUNTO";
        case 5:
          return "QUINTO PUNTO";
        case 6:
          return "SEXTO PUNTO";
        case 7:
          return "SEPTIMO PUNTO";
        case 8:
          return "OCTAVO PUNTO";
        case 9:
          return "NOVENO PUNTO";
        case 10:
          return "DECIMO PUNTO";
        case 11:
          return "UNDECIMO PUNTO";
        case 12:
          return "DUODECIMO PUNTO";
        case 13:
          return "DECIMOTERCERO PUNTO";
        case 14:
          return "DECIMOCUARTO PUNTO";
        case 15:
          return "DECIMOQUINTO PUNTO";
        case 16:
          return "DECIMOSEXTO PUNTO";
        case 17:
          return "DECIMOSEPTIMO PUNTO";
        case 18:
          return "DECIMOOCTAVO PUNTO";
        case 19:
          return "DECIMONOVENO PUNTO";
        case 20:
          return "VIGESIMO PUNTO";
        default:
          return "Orden no manejada";
      }
    },



    //CARGAR/EDITAR/ELIMINAR Y DESCARGAR ARCHIVOS

    async _cargarArchivo() {
      let fileInput = document.createElement("input");
      fileInput.type = "file";

      fileInput.onchange = (e) => {
        let files = e.target.files;
        if (!files || files.length === 0) {
          // console.log("No se seleccionaron archivos.");
          return;
        }
        this._uploadFileToAPI(files);
      };

      fileInput.click();
    },

    async _uploadFileToAPI(file) {
      if (!file) {
        return;
      }

      let formData = new FormData();
      const extension = file[0].name.split('.').pop();
      const nombreOriginal = file[0].name.replace(new RegExp(`.${extension}$`), '');
      formData.append('IdAcuerdo', this.idAcuerdoArchivos);
      formData.append('File', file[0]);
      formData.append('Extension', extension);
      formData.append('NombreOriginal', nombreOriginal);

      try {
        const response = await reunionService.subirDocumentoAcuerdo(formData);
        if (response.data.success) {
          this.toast.success('Archivo subido con éxito');
          await this.obtenerDocumentoAcuerdo(this.idAcuerdoArchivos)
          await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
        } else {
          this.toast.error('No se pudo subir el archivo');
        }

      } catch (error) {
        console.error('Error al subir el archivo:', error);

      }
    },

    async _editarDocumentoAcuerdo(idDocumento) {
      const documentoEditar = await reunionService.obtenerDocumentoAcuerdoById(idDocumento);

      let fileInput = document.createElement('input');
      fileInput.type = 'file';

      fileInput.onchange = e => {
        let file = e.target.files[0];
        if (!file) {
          // console.log('No se seleccionó archivo.');
          return;
        }
        this._uploadFileEditar(file, documentoEditar);
      };
      fileInput.click();
    },

    async _uploadFileEditar(file, documentoEditar) {
      if (!file) {
        return;
      }

      let formData = new FormData();
      const extension = file.name.split('.').pop();
      const nombreOriginal = file.name.replace(new RegExp(`.${extension}$`), '');
      formData.append('Id', documentoEditar.id);
      formData.append('IdAcuerdo', this.idAcuerdoArchivos);
      formData.append('File', file);
      formData.append('Nombre', documentoEditar.nombre);
      formData.append('Extension', extension);
      formData.append('NombreOriginal', nombreOriginal);

      try {
        const response = await reunionService.editarDocumentoAcuerdo(formData);

        if (response.data.success) {
          this.toast.success('Archivo editado con éxito');
          await this.obtenerDocumentoAcuerdo(this.idAcuerdoArchivos)
          await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
        } else {
          this.toast.error('No se pudo editar el archivo');
        }

      } catch (error) {
        console.error('Error al subir el archivo:', error);

      }
    },

    async OpenEliminarDocumentoAcuerdo(idDocumento) {
      try {

        const response = await reunionService.obtenerDocumentoAcuerdoById(idDocumento);
        this.modalEliminarDocumento = true;
        this.idEliminarDocumento = response.id;

      } catch (error) {
        console.error('Error al obtener el archivo:', error);

      }
    },

    async eliminarDocumentoAcuerdo() {
      try {
        const response = await reunionService.eliminarDocumentoAcuerdo(this.idEliminarDocumento);
        if (response.data.success) {
          this.toast.success('Documento eliminado con éxito');
          this.modalEliminarDocumento = false;
          this.idEliminarDocumento = 0;
          await this.obtenerDocumentoAcuerdo(this.idAcuerdoArchivos)
          await this._AcuerdoMinutasId(this.datosAcuerdo?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idMinuta)
        } else {
          this.toast.error('No se pudo eliminar el documento');
        }
      } catch (error) {
        console.error('Error al eliminar el archivo:', error);

      }
    },

    async descargarDocumento(item) {
      item.link = await reunionService.obtenerDocumentoAzure(item.nombre)

      if (item.link) {
        if (item.extension.toLowerCase() == "pdf" || this.esImagen(item.extension.toLowerCase())) {
          window.open(item.link, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = item.link;
          link.setAttribute('download', item.nombreOriginal);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.toast.success('Descarga exitosa');
        }
      }
    },

    esImagen(extension) {
      const formatosImagen = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg'];
      return formatosImagen.includes(extension.toLowerCase());
    },

    async obtenerDocumentoAcuerdo(idAcuerdo) {
      try {
        const response = await reunionService.obtenerDocumentoAcuerdo(idAcuerdo);
        if (response?.data) {
          this.datosAcuerdo.listaDocumentoAcuerdo = [];
          this.datosAcuerdo.listaDocumentoAcuerdo = response.data;
        }
      } catch (error) {
        console.error('Error al obtener el archivo:', error);

      }
    },







    // AddProcesoAcuerdo(evt) {
    //   let datos = evt.item.__draggable_context.element
    //   // console.log('Elemento añadido:', evt.item);
    //   console.log('Lista destino:', evt.item.__draggable_context.element);

    //   // let metrica = {
    //   //   idMetrica: 0,
    //   //   idCarril: 1,
    //   //   idRelacion: datos.temaReunionVM.id,
    //   //   idTableroMinutas: 2,
    //   //   fechaEntro: new Date(),
    //   //   fechaSalio: ""
    //   // }
    // },

    async UpdateDatosAMostrar() {
      try {
        var result = await this._TemaReunionesMetricas()

        this.ListaReuniones = []

        var tipo = result.filter(data => data.temaReunionVM.id == this.idTemaUpdateDatos)[0]?.temaReunionVM?.idEstatusTablero
        // console.log(tipo);
        switch (tipo) {
          case 1:
            this.TemasReunionesMetricas.filter(async (d) => {
              if (d.temaReunionVM.id == this.idTemaUpdateDatos) {
                this.ListaReuniones = d
                await this._AcomodarDatosReunion(d)
                // this.ListaReunionesReserva = d
              }
            })
            break;
          case 2:
            this.TemasReunionesMetricas2.filter(async (d) => {
              if (d.temaReunionVM.id == this.idTemaUpdateDatos) {
                this.ListaReuniones = d
                await this._AcomodarDatosReunion(d)
                // this.ListaReunionesReserva = d
              }
            })
            break;
          case 3:
            this.TemasReunionesMetricas3.filter(async d => {
              if (d.temaReunionVM.id == this.idTemaUpdateDatos) {
                this.ListaReuniones = d
                await this._AcomodarDatosReunion(d)
                // this.ListaReunionesReserva = d
              }
            })
            break;
          case 4:
            this.TemasReunionesMetricas4.filter(async d => {
              if (d.temaReunionVM.id == this.idTemaUpdateDatos) {
                this.ListaReuniones = d
                await this._AcomodarDatosReunion(d)
                // this.ListaReunionesReserva = d
              }
            })
            break;
          case 5:
            this.TemasReunionesMetricas5.filter(async d => {
              if (d.temaReunionVM.id == this.idTemaUpdateDatos) {
                this.ListaReuniones = d
                await this._AcomodarDatosReunion(d)
                // this.ListaReunionesReserva = d
              }
            })
            break;
          default:
            break;
        }


        await this._AcuerdoMinutasId(this.idMinutaUpdateDatos)
      } catch (error) {
        console.log(error);
      }
    },



    async AddPendientesAcuerdo(evt) {
      let datos = evt.item.__draggable_context.element
      let idAcuerdo = datos?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo;

      // console.log(idAcuerdo, 'Lista pendientes:', datos);
      this.modalSpinner = true;
      await this._UpdateAcuerdosTablero(idAcuerdo, 2);
      await this.UpdateDatosAMostrar()
      this.modalSpinner = false;

    },

    async AddEnProcesoAcuerdo(evt) {

      let datos = evt.item.__draggable_context.element
      let idAcuerdo = datos?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo;

      // console.log(idAcuerdo, 'Lista pendientes:', datos);
      this.modalSpinner = true;
      await this._UpdateAcuerdosTablero(idAcuerdo, 3);
      await this.UpdateDatosAMostrar()
      this.modalSpinner = false;
    },

    async AddTerminadoAcuerdo(evt) {
      let datos = evt.item.__draggable_context.element
      let idAcuerdo = datos?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.idAcuerdo;

      // console.log(idAcuerdo, 'Lista pendientes:', datos);

      this.modalSpinner = true;
      await this._UpdateAcuerdosTablero(idAcuerdo, 4);
      await this.UpdateDatosAMostrar()
      this.modalSpinner = false;
    },

    toggleColumnTemas1() {
      this.columnTemas1 = this.columnTemas1 === "1" ? "250PX" : "1";
    },
    toggleColumnTemas2() {
      this.columnTemas2 = this.columnTemas2 === "1" ? "250PX" : "1";
    },

    toggleColumnReunion1(tipo) {
      if (tipo == 1) {
        this.columnReunion1 = this.columnReunion1 === "1" ? "250px" : "1";
      } else {
        this.columnReunion1 = "250px"
      }
    },
    toggleColumnReunion2() {
      this.columnReunion2 = this.columnReunion2 === "1" ? "250PX" : "1";
    },
    toggleColumnAcuerdos1() {
      this.columnAcuerdos1 = this.columnAcuerdos1 === "1" ? "250PX" : "1";
    },
    toggleColumnacuerdos2() {
      this.columnAcuerdos2 = this.columnAcuerdos2 === "1" ? "250PX" : "1";
    },




    // nombreStatus(idstatus) {
    //   const estatus = this.listEstatus.find(est => est.id === idstatus);
    //   return estatus ? estatus.nombre : idstatus;
    // },
    // abreviaturaUser(idUser) {
    //   const usuario = this.listaUser.find(user => user.id === idUser);
    //   return usuario ? usuario.abreviatura : idUser;
    // },
    // addItem() {
    //   this.isAcurdo = false;
    //   const now = new Date(); // Obtener la fecha y hora actual
    //   const fechaHora = now.toISOString(); // Convertir a formato ISO para almacenar en el objeto
    //   const nuevaTarea = {
    //     fecha: fechaHora, // Agregar fecha y hora actual
    //     tarea: this.tareaUserLista.tarea,
    //     usuario: this.abreviaturaUser(this.tareaUserLista.selectUser), // Obtener el id del usuario seleccionado
    //     estatus: this.nombreStatus(this.tareaUserLista.selectStatus), // Obtener el id del estatus seleccionado
    //     check: false,
    //   };
    //   this.tareasNuevas.push(nuevaTarea);
    //   this.tareaUserLista = []
    //   this.dialog = false;
    //   this.isAcurdo = true;
    // },

    // selectItem(item) {
    //   this.selectedOption = item;
    // },

    // selectUser(tareaUser) {
    //   this.selectedListaUser = tareaUser;
    // },

    // eliminarTarea(index) {
    //   this.tareasNuevas.splice(index, 1);
    // },

    openComentarioModal() {
      // this.selectedMealId = id;
      // this.isComentario = true;
      // this.selectedMeal = this.acuerdos4.find((meal) => meal.id === id);
      this.isAcurdo = true;
      this.currentTab = "tab-3";

    },
    // saveComment() {
    //   if (!this.comentarioTexto.trim()) {
    //     alert('El comentario está vacío. Por favor, escribe algo antes de guardar.');
    //     return;
    //   }
    //   const newComment = {
    //     id: this.electedMealId,
    //     content: this.comentarioTexto,
    //     date: new Date().toLocaleDateString(),
    //   };
    //   this.comments.push(newComment);
    //   this.comentarioTexto = "";
    // },

    // totalComentario(id) {
    //   return this.getCommentsByMealId(id).length;
    // },
    // getCommentsByMealId(id) {
    //   return this.comments.filter((comment) => comment.id === id);
    // },

    // activateSecondDraggable(mealId) {
    //   this.selectedMealId = mealId;
    //   this.isModalTemas = false;
    //   this.toggleColumnReunion1();
    //   setTimeout(() => {
    //     this.selectedMealId = null;
    //   }, 5000);
    // },
  },
  watch: {
    // selectedMealId(newId) {
    //   if (newId) {
    //     this.selectedMeal = this.acuerdos.find((meal) => meal.id === newId);
    //   }
    // },
  },

  async created() {
    await this._TemaReunionesMetricas()
  },
};
</script>

<template>
  <!--! contenidos de TEMAS -->
  <VExpansionPanels v-model="panel" variant="popout" class="mb-3">
    <VExpansionPanel>
      <VExpansionPanelTitle class="py-1">
        <VCardText class="py-2">
          <VRow>
            <VCol cols="12" md="8">
              <h2 class="mt-2">
                Tema
              </h2>
            </VCol>
            <VCol cols="12" md="4">
              <!-- <AppTextField density="compact" v-model="buscar" placeholder="Buscar..." /> -->
            </VCol>
          </VRow>
        </VCardText>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <VRow class="p-2 mb-3">
          <!-- !ESTA ES LA PARTE DE RESERVA -->
          <VCol :cols="columnTemas1" class="ps-1 pe-1 cur">
            <VCard>
              <VCardText style="border-top: 4px solid #a8aaae" class="px-2 ">
                <!-- esto sera cuando este chico el col -->
                <div v-if="columnTemas1 === '1'" class="d-flex justify-center">
                  <div class="texto border rounded px-1 py-5 ">
                    <p class="me-0">
                      Reserva
                      <span><b>({{ TemasReunionesMetricas.length }})</b></span>
                      <IconBtn color="secondary" @click="toggleColumnTemas1" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2" />
                      </IconBtn>
                    </p>
                  </div>
                </div>

                <!-- esto sera cuando este grande  el col -->
                <div v-else>
                  <VCard color="secondary" class="total-lista">
                    <p>
                      {{ TemasReunionesMetricas.length }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Reserva</h3>
                    <IconBtn color="secondary" @click="toggleColumnTemas1">
                      <VIcon class="tabler-arrows-diagonal-minimize-2" />
                    </IconBtn>
                  </div>

                  <draggable v-model="TemasReunionesMetricas" tag="ul" group="temasReservas" :animation="300"
                    style="list-style: none">
                    <template #item="{ element: tema }">
                      <li class="border mb-2 rounded">
                        <VCard @click="_ModalTemas(tema.temaReunionVM, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block color="secondary" style="margin-top: -2px">
                                <p class="mb-0">
                                  Tema
                                  <span>{{ tema.temaReunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ tema.temaReunionVM.nombre }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE PENDIENTES -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #2666be" class="px-2">
                <VCard color="azul" class="total-lista">
                  <p>
                    {{ TemasReunionesMetricas2.length }}
                  </p>
                </VCard>
                <div>
                  <h3 class="mb-3">Pendientes</h3>

                  <draggable v-model="TemasReunionesMetricas2" tag="ul" group="temasPendientes" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: tema }">
                      <li class="border mb-2 rounded">
                        <VCard @click="_ModalTemas(tema.temaReunionVM, 2)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block color="azul" style="margin-top: -2px">
                                <p class="mb-0">
                                  Tema
                                  <span>{{ tema.temaReunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ tema.temaReunionVM.nombre }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE EN PROCESO -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #fd9e43" class="px-2">
                <VCard color="warning" class="total-lista">
                  <p>
                    {{ TemasReunionesMetricas3.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">En proceso</h3>
                  <draggable v-model="TemasReunionesMetricas3" tag="ul" group="temasEnProceso" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: tema }">
                      <li class="border mb-2 rounded" @click="_ModalTemas(tema.temaReunionVM, 3)">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block color="warning" style="margin-top: -2px">
                                <p class="mb-0">
                                  Tema
                                  <span>{{ tema.temaReunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ tema.temaReunionVM.nombre }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE TERMINADO -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #28c66f" class="px-2">
                <VCard color="success" class="total-lista">
                  <p>
                    {{ TemasReunionesMetricas4.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">Terminado</h3>
                  <draggable v-model="TemasReunionesMetricas4" tag="ul" group="temasTerminados" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: tema }">
                      <li class="border mb-2 rounded">
                        <VCard @click="_ModalTemas(tema.temaReunionVM, 4)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block color="success" style="margin-top: -2px">
                                <p class="mb-0">
                                  Tema
                                  <span>{{ tema.temaReunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ tema.temaReunionVM.nombre }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE ARCHIVADO -->
          <VCol :cols="columnTemas2" class="pe-1 ps-1">
            <VCard>
              <VCardText style="border-top: 4px solid #7367f0" class="px-2">
                <div v-if="columnTemas2 === '1'" class="d-flex justify-center">
                  <div class="texto border rounded px-1 py-5">
                    <p>
                      Archivado
                      <span><b>( {{ TemasReunionesMetricas5.length }})</b></span>
                      <IconBtn color="morado" @click="toggleColumnTemas2" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2" />
                      </IconBtn>
                    </p>
                  </div>
                </div>

                <div v-else>
                  <VCard color="morado" class="total-lista">
                    <p>
                      {{ TemasReunionesMetricas5.length }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Archivado</h3>
                    <IconBtn color="morado" @click="toggleColumnTemas2">
                      <VIcon class="tabler-arrows-diagonal-2" />
                    </IconBtn>
                  </div>

                  <draggable v-model="TemasReunionesMetricas5" tag="ul" group="temasArchivados" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: tema }">
                      <li class="border mb-2 rounded">
                        <VCard @click="_ModalTemas(tema.temaReunionVM, 5)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block color="morado" style="margin-top: -2px">
                                <p class="mb-0">
                                  Tema
                                  <span>{{ tema.temaReunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ tema.temaReunionVM.nombre }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>

  <!-- !contenidos de reuniones  -->
  <VExpansionPanels v-model="panel2" variant="popout" class="mb-3">
    <VExpansionPanel>
      <VExpansionPanelTitle class="py-1">
        <VCardText class="py-2">
          <VRow>
            <VCol cols="12" md="8">
              <h2 class="mt-2">
                Reunión
              </h2>
            </VCol>
            <VCol cols="12" md="4">
              <!-- <AppTextField density="compact" v-model="buscar" placeholder="Buscar..." /> -->
            </VCol>
          </VRow>
        </VCardText>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <VRow class="p-2 mb-3">
          <!-- !ESTA ES LA PARTE DE RESERVA -->
          <VCol :cols="columnReunion1" class="ps-1 pe-1">
            <VCard>
              <VCardText style="border-top: 4px solid #a8aaae" class="px-2">
                <!-- esto sera cuando este chico el col -->
                <div class="d-flex justify-center" v-if="columnReunion1 === '1'">
                  <div class="texto border rounded px-1 py-5">
                    <p>
                      Reserva
                      <span><b>({{ ListaReunionesReserva?.reunionVM?.length ?? 0 }})</b></span>
                      <IconBtn color="secondary" @click="toggleColumnReunion1(1)" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2" />
                      </IconBtn>
                    </p>
                  </div>
                </div>
                <!-- esto sera cuando este grande  el col -->
                <div v-else>
                  <VCard color="secondary" class="total-lista">
                    <p>
                      {{ ListaReunionesReserva?.reunionVM?.length ?? 0 }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Reserva</h3>
                    <IconBtn color="secondary" @click="toggleColumnReunion1(1)">
                      <VIcon class="tabler-arrows-diagonal-2" />
                    </IconBtn>
                  </div>

                  <!-- ! estos son los reuniones de backlogs  -->
                  <draggable v-model="ListaReunionesReserva" tag="ul" group="reunionesReservas" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: reunion }">
                      <li class="border mb-2 rounded cursor-pointer"
                        :class="{ 'selected': reunion.reunionVM.idReunion === selectedMealId }">
                        <VCard v-if="reunion.minutasVM" @click="_ModalReuniones(reunion, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-check" />
                                </IconBtn>
                                <p class="mb-0">
                                  {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>

                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>
                          </div>
                        </VCard>

                        <VCard v-else @click="_ModalReuniones(reunion)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio d-flex justify-space-between" label block
                                style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-x" />
                                </IconBtn>
                                <p class="mb-0">
                                  Reunión
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>

                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>

                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE pendientes -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #2666be" class="px-2">
                <VCard color="#2666be" class="total-lista">
                  <p>
                    {{ ListaReunionesPendientes.length }}
                  </p>
                </VCard>
                <div>
                  <h3 class="mb-3">Pendientes</h3>

                  <draggable v-model="ListaReunionesPendientes" tag="ul" group="reunionesPendientes" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: reunion }">
                      <li class="border mb-2 rounded cursor-pointer"
                        :class="{ 'selected': reunion.reunionVM.idReunion === selectedMealId }">
                        <VCard v-if="reunion.minutasVM" @click="_ModalReuniones(reunion, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="azul" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-check" />
                                </IconBtn>
                                <p class="mb-0">
                                  {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>

                          </div>
                        </VCard>

                        <VCard v-else @click="_ModalReuniones(reunion)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="azul" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-x" />
                                </IconBtn>
                                <p class="mb-0">
                                  Reunión
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE en proceso -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #fd9e43" class="px-2">
                <VCard color="warning" class="total-lista">
                  <p>
                    {{ ListaReunionesEnProceso.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">En proceso</h3>
                  <draggable v-model="ListaReunionesEnProceso" tag="ul" group="reunionesEnProceso" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: reunion }">
                      <li class="border mb-2 rounded cursor-pointer"
                        :class="{ 'selected': reunion.reunionVM.idReunion === selectedMealId }">
                        <VCard v-if="reunion.minutasVM" @click="_ModalReuniones(reunion, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="warning" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-check" />
                                </IconBtn>
                                <p class="mb-0">
                                  {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>
                          </div>
                        </VCard>

                        <VCard v-else @click="_ModalReuniones(reunion)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="warning" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-x" />
                                </IconBtn>
                                <p class="mb-0">
                                  Reunión
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE terminado-->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #28c66f" class="px-2">
                <VCard color="success" class="total-lista">
                  <p>
                    {{ ListaReunionesTerminado.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">Terminado</h3>
                  <draggable v-model="ListaReunionesTerminado" tag="ul" group="reunionesTerminados" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: reunion }">
                      <li class="border mb-2 rounded cursor-pointer"
                        :class="{ 'selected': reunion.reunionVM.idReunion === selectedMealId }">
                        <VCard v-if="reunion.minutasVM" @click="_ModalReuniones(reunion, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="success" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-check" />
                                </IconBtn>
                                <p class="mb-0">
                                  {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>

                          </div>
                        </VCard>

                        <VCard v-else @click="_ModalReuniones(reunion)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="success" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-x" />
                                </IconBtn>
                                <p class="mb-0">
                                  Reunión
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>

                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE archivado -->
          <VCol :cols="columnReunion2" class="pe-1 ps-1">
            <VCard>
              <VCardText style="border-top: 4px solid #7367f0" class="px-2">
                <div v-if="columnReunion2 === '1'" class="d-flex justify-center">
                  <div class="texto border rounded px-1 py-5">
                    <p>
                      Archivado
                      <span><b>({{ ListaReunionesArchivados.length }})</b></span>
                      <IconBtn color="morado" @click="toggleColumnReunion2" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2" />
                      </IconBtn>
                    </p>
                  </div>

                </div>
                <div v-else>
                  <VCard color="morado" class="total-lista">
                    <p>
                      {{ ListaReunionesArchivados.length }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Archivado</h3>
                    <IconBtn color="morado" @click="toggleColumnReunion2">
                      <VIcon class="tabler-arrows-diagonal-2" />
                    </IconBtn>
                  </div>

                  <draggable v-model="ListaReunionesArchivados" tag="ul" group="reunionesArchivados" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: reunion }">
                      <li class="border mb-2 rounded cursor-pointer"
                        :class="{ 'selected': reunion.reunionVM.idReunion === selectedMealId }">
                        <VCard v-if="reunion.minutasVM" @click="_ModalReuniones(reunion, 1)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="morado" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-check" />
                                </IconBtn>
                                <p class="mb-0">
                                  {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.titulo }}</p>
                            </div>

                          </div>
                        </VCard>

                        <VCard v-else @click="_ModalReuniones(reunion)">
                          <VRow class="border-bottom">
                            <VCol cols="12" style="padding-right: 0">
                              <VChip class="w-100 radio" color="morado" label block style="margin-top: -2px">
                                <IconBtn>
                                  <VIcon class="tabler-x" />
                                </IconBtn>
                                <p class="mb-0">
                                  Reunión
                                  <span>{{ reunion.reunionVM.id }}</span>
                                </p>
                              </VChip>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div class="px-5 my-3">
                            <div class="d-flex">
                              <VIcon class="tabler-folder" />
                              <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                            </div>
                            <div class="d-flex">
                              <VIcon class="custom-wizard-social-link" />
                              <p class="mb-1 ms-2"> {{ reunion.reunionVM.titulo }}</p>
                            </div>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>


  <!-- !contenedor de acuerdos  -->
  <VExpansionPanels v-model="panel3" variant="popout" class="mb-3">
    <VExpansionPanel>
      <VExpansionPanelTitle class="py-1">
        <VCardText class="py-2">
          <VRow>
            <VCol cols="12" md="8">
              <h2 class="mt-2">
                Acuerdos
              </h2>
            </VCol>
            <VCol cols="12" md="4">
              <!-- <AppTextField density="compact" v-model="buscar" placeholder="Buscar..." /> -->
            </VCol>
          </VRow>

        </VCardText>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <VRow class="p-2">
          <!-- !ESTA ES LA PARTE DE RESERVA -->
          <VCol :cols="columnAcuerdos1" class="ps-1 pe-1">
            <VCard>
              <VCardText style="border-top: 4px solid #a8aaae" class="px-2">
                <div class="d-flex justify-center" v-if="columnAcuerdos1 === '1'">
                  <div class="texto border rounded px-1 py-5">
                    <p>
                      Reserva
                      <span><b>({{ ListaAcuerdosReserva.length }})</b></span>
                      <IconBtn color="secondary" @click="toggleColumnAcuerdos1" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2"></VIcon>
                      </IconBtn>

                    </p>
                  </div>
                </div>

                <div v-else>
                  <VCard color="secondary" class="total-lista">
                    <p>
                      {{ ListaAcuerdosReserva.length }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Reserva</h3>
                    <IconBtn color="secondary" @click="toggleColumnAcuerdos1">
                      <VIcon class="tabler-arrows-diagonal-minimize"></VIcon>
                    </IconBtn>

                  </div>

                  <draggable v-model="ListaAcuerdosReserva" tag="ul" group="meals" :animation="300"
                    style="list-style: none" @add="addPro">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="auto" style="padding-right: 0">
                              <VChip class="radio mt-ac" label color="secondary">
                                <p class="mb-0">50%</p>

                                <p class="mb-0 ms-3">
                                  {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.idAcuerdo }}
                                </p>
                              </VChip>
                            </VCol>

                            <VCol cols="" class="conte">

                              <VMenu open-on-hover>

                                <template #activator="{ props }">
                                  <VBtn class="btn-conte" size="24" color="secondary" v-bind="props">
                                    <VIcon icon="tabler-dots-vertical" size="20" />
                                  </VBtn>
                                </template>

                                <VList>
                                  <ul>
                                    <li class="">
                                      <VBtn variant="text" @click="openComentarioModal()">
                                        <VIcon class="tabler-message-dots" />
                                        <span class=me-1>Comentario</span>
                                      </VBtn>
                                    </li>
                                  </ul>
                                </VList>
                              </VMenu>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div @click="_ModalAcuerdos(meal)" class="px-3 my-3 cursor-pointer">
                            <VIcon class="tabler-bookmarks me-2" />
                            {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }}
                          </div>
                          <VDivider></VDivider>
                          <div class="conte">
                            <div v-if="meal.listaTareasAcuerdos.length > 0">
                              <VChip label class="me-1" title="Total de status">
                                <VIcon start size="16" icon="tabler-list-details" />
                                {{ meal.listaTareasAcuerdos.length }}
                              </VChip>
                            </div>
                            <div v-if="meal.listaComentariosAcuerdos.length > 0">
                              <VChip label title="Total de comentarios">
                                <VIcon start size="16" icon="tabler-message-dots" />
                                {{ meal.listaComentariosAcuerdos.length }}
                              </VChip>
                            </div>
                            <VMenu open-on-hover>

                              <template #activator="{ props }">
                                <VBtn size="25" variant="plain" v-bind="props" :title="selectedOption.title">
                                  <VIcon size="22" :color="selectedOption.color" :icon="selectedOption.icon" />
                                </VBtn>
                              </template>

                              <VList>
                                <VListItem v-for="(item, index) in items" :key="index.icon" @click="selectItem(item)">
                                  <p class="text-body-2 mb-0">
                                    {{ item.title }}
                                  </p>

                                  <template #prepend>
                                    <VIcon size="28" :color="item.color" :icon="item.icon" />
                                  </template>
                                </VListItem>
                              </VList>
                            </VMenu>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE pendientes -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #2666be" class="px-2">
                <VCard color="#2666be" class="total-lista">
                  <p>
                    {{ ListaAcuerdosPendientes.length }}
                  </p>
                </VCard>
                <div>
                  <h3 class="mb-3">Pendientes</h3>

                  <draggable v-model="ListaAcuerdosPendientes" tag="ul" group="meals" :animation="300"
                    style="list-style: none" @add="AddPendientesAcuerdo">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="auto" style="padding-right: 0">
                              <VChip label color="azul" class="radio mt-ac">
                                <!-- <p class="mb-0">50%</p> -->

                                <p class="mb-0 ms-3 border-left">
                                  {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.idAcuerdo }}
                                </p>
                              </VChip>
                            </VCol>

                            <VCol cols="" class="conte">


                              <VMenu open-on-hover>

                                <template #activator="{ props }">
                                  <VBtn class="btn-conte" size="24" color="secondary" v-bind="props">
                                    <VIcon icon="tabler-dots-vertical" size="20" />
                                  </VBtn>
                                </template>

                                <VList>
                                  <ul>
                                    <li class="">
                                      <VBtn variant="text" @click="openComentarioModal(meal.id)">
                                        <VIcon class="tabler-message-dots me-1" />
                                        Comentario
                                      </VBtn>
                                    </li>
                                  </ul>
                                </VList>
                              </VMenu>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div @click="_ModalAcuerdos(meal)" class="px-3 my-3 cursor-pointer">
                            <VIcon class="tabler-bookmarks me-2" />
                            {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }}
                          </div>
                          <VDivider></VDivider>
                          <div class="conte">
                            <div v-if="meal.listaTareasAcuerdos.length > 0">
                              <VChip label class="me-1" title="Total de status">
                                <VIcon start size="16" icon="tabler-list-details" />
                                {{ meal.listaTareasAcuerdos.length }}
                              </VChip>
                            </div>
                            <div v-if="meal.listaComentariosAcuerdos.length > 0">
                              <VChip label title="Total de comentarios">
                                <VIcon start size="16" icon="tabler-message-dots" />
                                {{ meal.listaComentariosAcuerdos.length }}
                              </VChip>
                            </div>
                            <VMenu open-on-hover>

                              <template #activator="{ props }">
                                <VBtn size="25" variant="plain" v-bind="props" :title="selectedOption.title">
                                  <VIcon size="22" :color="selectedOption.color" :icon="selectedOption.icon" />
                                </VBtn>
                              </template>

                              <VList>
                                <VListItem v-for="(item, index) in items" :key="index.icon" @click="selectItem(item)">
                                  <p class="text-body-2 mb-0">
                                    {{ item.title }}
                                  </p>

                                  <template #prepend>
                                    <VIcon size="28" :color="item.color" :icon="item.icon" />
                                  </template>
                                </VListItem>
                              </VList>
                            </VMenu>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE en proceso -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #fd9e43" class="px-2">
                <VCard color="warning" class="total-lista">
                  <p>
                    {{ ListaAcuerdosEnProceso.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">En proceso</h3>
                  <draggable v-model="ListaAcuerdosEnProceso" tag="ul" group="meals" :animation="300"
                    style="list-style: none" @add="AddEnProcesoAcuerdo">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="auto" style="padding-right: 0">
                              <VChip class="radio mt-ac" label color="warning" style="margin-top: -2px">

                                <p class="mb-0 ms-3 border-left">
                                  {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.idAcuerdo }}
                                </p>
                              </VChip>
                            </VCol>

                            <VCol cols="" class="conte">


                              <VMenu open-on-hover>

                                <template #activator="{ props }">
                                  <VBtn class="btn-conte" size="24" color="secondary" v-bind="props">
                                    <VIcon icon="tabler-dots-vertical" size="20" />
                                  </VBtn>
                                </template>

                                <VList>
                                  <ul>
                                    <li class="px-2">
                                      <VBtn variant="text" @click="openComentarioModal(meal.id)">
                                        <VIcon class="tabler-message-dots me-1" />
                                        Comentario
                                      </VBtn>
                                    </li>
                                  </ul>
                                </VList>
                              </VMenu>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div @click="_ModalAcuerdos(meal)" class="px-3 my-3 cursor-pointer">
                            <VIcon class="tabler-bookmarks me-2" />
                            {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }}
                          </div>
                          <VDivider></VDivider>
                          <div class="conte">
                            <div v-if="meal.listaTareasAcuerdos.length > 0">
                              <VChip label class="me-1" title="Total de status">
                                <VIcon start size="16" icon="tabler-list-details" />
                                {{ meal.listaTareasAcuerdos.length }}
                              </VChip>
                            </div>
                            <div v-if="meal.listaComentariosAcuerdos.length > 0">
                              <VChip label title="Total de comentarios">
                                <VIcon start size="16" icon="tabler-message-dots" />
                                {{ meal.listaComentariosAcuerdos.length }}
                              </VChip>
                            </div>
                            <VMenu open-on-hover>

                              <template #activator="{ props }">
                                <VBtn size="25" variant="plain" v-bind="props" :title="selectedOption.title">
                                  <VIcon size="22" :color="selectedOption.color" :icon="selectedOption.icon" />
                                </VBtn>
                              </template>

                              <VList>
                                <VListItem v-for="(item, index) in items" :key="index.icon" @click="selectItem(item)">
                                  <p class="text-body-2 mb-0">
                                    {{ item.title }}
                                  </p>

                                  <template #prepend>
                                    <VIcon size="28" :color="item.color" :icon="item.icon" />
                                  </template>
                                </VListItem>
                              </VList>
                            </VMenu>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE terminado -->
          <VCol cols="" class="px-1">
            <VCard>
              <VCardText style="border-top: 4px solid #28c66f" class="px-2">
                <VCard color="success" class="total-lista">
                  <p>
                    {{ ListaAcuerdosTerminado.length }}
                  </p>
                </VCard>
                <div class="">
                  <h3 class="mb-3">Terminado</h3>
                  <draggable v-model="ListaAcuerdosTerminado" tag="ul" group="meals" :animation="300"
                    style="list-style: none" @add="AddTerminadoAcuerdo">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="auto" style="padding-right: 0">
                              <VChip class="radio mt-ac" label color="success" style="margin-top: -2px">

                                <p class="mb-0 ms-3 border-left">
                                  {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.idAcuerdo }}
                                </p>
                              </VChip>
                            </VCol>
                            <VCol cols="" class="conte">
                              <VMenu open-on-hover>
                                <template #activator="{ props }">
                                  <VBtn class="btn-conte" size="24" color="secondary" v-bind="props">
                                    <VIcon icon="tabler-dots-vertical" size="20" />
                                  </VBtn>
                                </template>
                                <VList>
                                  <ul>
                                    <li class="px-2">
                                      <VBtn variant="text" @click="openComentarioModal(meal.id)">
                                        <VIcon class="tabler-message-dots me-1" />
                                        Comentario
                                      </VBtn>
                                    </li>
                                  </ul>
                                </VList>
                              </VMenu>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div @click="_ModalAcuerdos(meal)" class="px-3 my-3 cursor-pointer">
                            <VIcon class="tabler-bookmarks me-2" />
                            {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }}
                          </div>
                          <VDivider></VDivider>
                          <div class="conte">
                            <div v-if="meal.listaTareasAcuerdos.length > 0">
                              <VChip label class="me-1" title="Total de status">
                                <VIcon start size="16" icon="tabler-list-details" />
                                {{ meal.listaTareasAcuerdos.length }}
                              </VChip>
                            </div>
                            <div v-if="meal.listaComentariosAcuerdos.length > 0">
                              <VChip label title="Total de comentarios">
                                <VIcon start size="16" icon="tabler-message-dots" />
                                {{ meal.listaComentariosAcuerdos.length }}
                              </VChip>
                            </div>

                            <VMenu open-o2n-hover>

                              <template #activator="{ props }">
                                <VBtn size="25" variant="plain" v-bind="props" :title="selectedOption.title">
                                  <VIcon size="22" :color="selectedOption.color" :icon="selectedOption.icon" />
                                </VBtn>
                              </template>

                              <VList>
                                <VListItem v-for="(item, index) in items" :key="index.icon" @click="selectItem(item)">
                                  <p class="text-body-2 mb-0">
                                    {{ item.title }}
                                  </p>

                                  <template #prepend>
                                    <VIcon size="28" :color="item.color" :icon="item.icon" />
                                  </template>
                                </VListItem>
                              </VList>
                            </VMenu>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <!-- !ESTA ES LA PARTE DE archivado  -->
          <VCol :cols="columnAcuerdos2" class="pe-1 ps-1">
            <VCard>
              <VCardText style="border-top: 4px solid #7367f0" class="px-2">
                <div class="d-flex justify-center" v-if="columnAcuerdos2 === '1'">
                  <div class="texto border rounded px-1 py-5">
                    <p>
                      Archivado
                      <span><b>({{ ListaAcuerdosArchivados.length }})</b></span>
                      <IconBtn color="morado" @click="toggleColumnacuerdos2" class="posicion">
                        <VIcon class="tabler-arrows-diagonal-2"></VIcon>
                      </IconBtn>
                    </p>
                  </div>
                </div>

                <div v-else>
                  <VCard color="morado" class="total-lista">
                    <p>
                      {{ ListaAcuerdosArchivados.length }}
                    </p>
                  </VCard>
                  <div class="d-flex justify-space-between">
                    <h3 class="mb-3">Archivado</h3>
                    <IconBtn color="morado" @click="toggleColumnacuerdos2">
                      <VIcon class="tabler-arrows-diagonal-minimize"></VIcon>
                    </IconBtn>
                  </div>
                  <draggable v-model="ListaAcuerdosArchivados" tag="ul" group="meals" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VRow class="border-bottom">
                            <VCol cols="auto" style="padding-right: 0">
                              <VChip class="radio mt-ac" label color="morado" style="margin-top: -2px">

                                <p class="mb-0 ms-3 border-left">
                                  {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.idAcuerdo }}
                                </p>
                              </VChip>
                            </VCol>

                            <VCol cols="" class="conte">


                              <VMenu open-on-hover>

                                <template #activator="{ props }">
                                  <VBtn class="btn-conte" size="24" color="secondary" v-bind="props">
                                    <VIcon icon="tabler-dots-vertical" size="20" />
                                  </VBtn>
                                </template>

                                <VList>
                                  <ul>
                                    <li class="px-2">
                                      <VBtn variant="text" @click="openComentarioModal(meal.id)">
                                        <VIcon class="tabler-message-dots me-1" />
                                        Comentario
                                      </VBtn>
                                    </li>
                                  </ul>
                                </VList>
                              </VMenu>
                            </VCol>
                          </VRow>
                          <VDivider></VDivider>
                          <div @click="_ModalAcuerdos(meal)" class="px-3 my-3 cursor-pointer">
                            <VIcon class="tabler-bookmarks me-2" />
                            {{ meal.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }}
                          </div>
                          <VDivider></VDivider>
                          <div class="conte">
                            <div v-if="meal.listaTareasAcuerdos.length > 0">
                              <VChip label class="me-1" title="Total de status">
                                <VIcon start size="16" icon="tabler-list-details" />
                                {{ meal.listaTareasAcuerdos.length }}
                              </VChip>
                            </div>
                            <div v-if="meal.listaComentariosAcuerdos.length > 0">
                              <VChip label title="Total de comentarios">
                                <VIcon start size="16" icon="tabler-message-dots" />
                                {{ meal.listaComentariosAcuerdos.length }}
                              </VChip>
                            </div>
                            <VMenu open-on-hover>

                              <template #activator="{ props }">
                                <VBtn size="25" variant="plain" v-bind="props" :title="selectedOption.title">
                                  <VIcon size="22" :color="selectedOption.color" :icon="selectedOption.icon" />
                                </VBtn>
                              </template>

                              <VList>
                                <VListItem v-for="(item, index) in items" :key="index.icon" @click="selectItem(item)">
                                  <p class="text-body-2 mb-0">
                                    {{ item.title }}
                                  </p>

                                  <template #prepend>
                                    <VIcon size="28" :color="item.color" :icon="item.icon" />
                                  </template>
                                </VListItem>
                              </VList>
                            </VMenu>
                          </div>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>

  <!-- esto espara todo el detalle de la lista de acurdos  -->
  <VDialog v-model="isAcurdo" class="v-dialog-xl h-100">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isAcurdo = false" />

    <VCard title="Acuerdo">
      <VCardText>
        <VCard>
          <VTabs v-model="currentTab" fixed-tabs>
            <VTab>
              <VIcon start icon="tabler-brand-trello" />
              Detalles
            </VTab>
            <VTab>
              <VIcon start icon="tabler-status-change" />
              <div v-if="datosAcuerdo.listaTareasAcuerdos.length == 0">
                Status
              </div>
              <VBadge v-else :content="datosAcuerdo.listaTareasAcuerdos.length" :offset-x="-18" :offset-y="6">
                Status
              </VBadge>

            </VTab>
            <VTab>
              <VIcon start icon="tabler-message-dots" />
              <div v-if="datosAcuerdo.listaComentariosAcuerdos.length == 0">
                Comentarios
              </div>
              <VBadge v-else :content="datosAcuerdo.listaComentariosAcuerdos.length" :offset-x="-18" :offset-y="6">
                Comentarios
              </VBadge>

            </VTab>
            <VTab>
              <VIcon start icon="tabler-file-type-doc" />
              <div v-if="datosAcuerdo.listaDocumentoAcuerdo.length == 0">
                Documentos
              </div>
              <VBadge v-else :content="datosAcuerdo.listaDocumentoAcuerdo.length" :offset-x="-18" :offset-y="6">
                Documentos
              </VBadge>
            </VTab>
            <VTab>
              <VIcon start icon="tabler-square-half" />
              Métrica
            </VTab>
          </VTabs>

          <VCardText>
            <VWindow v-model="currentTab" fixed-tabs class="ms-3">

              <VWindowItem value="tab-1">
                <VRow>
                  <VCol cols="12" md="6" lg="6">
                    <div>
                      <p class="mb-0">
                        Folio: <span><b class="text-h5">{{
    datosAcuerdo.listaAcuerdosMinutas[0].acuerdosMinutasVM.folioAcuerdo }} </b></span>
                      </p>
                      <p>
                        Dependencia: <span><b>{{
    datosAcuerdo.listaAcuerdosMinutas[0].dependenciaVM.nombre }}</b></span>
                      </p>
                    </div>
                  </VCol>
                  <VCol cols="12" md="6" lg="6" class="texto-en">
                    <p class="mb-0">
                      Status: <span><b> Inicio </b></span>
                    </p>
                    <p>
                      Fecha: <span><b> {{
    datosAcuerdo.listaAcuerdosMinutas[0].acuerdosMinutasVM.fechaString ?? "Sin fecha" }}
                        </b></span>
                    </p>
                  </VCol>
                </VRow>

                <div class="mb-5">
                  <p class="mb-0"><b>Acuerdo</b></p>
                  <div class="px-3 py-3 border-b border-s rounded-s-4 rounded-t-0 rounded-sm">
                    <p class="mb-0" v-html="datosAcuerdo.listaAcuerdosMinutas[0].acuerdosMinutasVM.acuerdo"></p>
                  </div>
                </div>
                <div>
                  <TiptapEditor v-model="comentarioPrincipal" class="border rounded" />
                  <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn @click="_actualizarComentario"> Guardar </VBtn>
                  </VCardText>
                </div>
              </VWindowItem>

              <VWindowItem value="tab-2">
                <VCardText class="pt-0 ps-0 d-flex justify-space-between">
                  <p class="text-h4 mb-0">Status</p>
                  <VBtn size="34" color="primary" @click="openDialog">
                    <VIcon class="tabler-plus" />
                  </VBtn>
                </VCardText>
                <div class="text-center border rounded py-3" v-if="datosAcuerdo.listaTareasAcuerdos.length == 0">
                  <VCardSubtitle>Sin lista de status</VCardSubtitle>
                </div>
                <div v-else>
                  <draggable v-model="datosAcuerdo.listaTareasAcuerdos" tag="ul" group="meals" :animation="300"
                    style="list-style: none">

                    <template #item="{ element: meal }">
                      <li class="border mb-2 rounded">
                        <VCard>
                          <VCardText class="py-2 ps-2 d-flex">
                            <VRow>
                              <!-- <VCol cols="1" md="1" class="pe-0 d-flex justify-center align-items-center">
                                <VCheckbox density="compact" />
                              </VCol> -->
                              <VCol cols="12" md="10" class="">
                                <VRow>
                                  <VCol class="ps-10 pe-5" cols="12" md="8">
                                    <span v-html="meal.estatus"></span>

                                  </VCol>
                                  <VCol class="px-5" cols="12" md="4">
                                    <span v-html="meal.contacto"></span>
                                  </VCol>
                                </VRow>
                              </VCol>
                              <VCol cols="12" md="2" class="px-0 text-center">
                                <!-- <VAvatar v-if="meal.usuario === id" rounded="xl" color="secondary" icon="tabler-user"
                                class="me-1 my-1" size="30" />
                              <VAvatar v-else size="30" color="primary" class="mx-1 my-1">
                                <small>
                                  {{ meal.usuario }}
                                </small>
                              </VAvatar> -->
                                <VBtn class="me-5" size="30" color="primary" title="Ver"
                                  @click="_verTareaAcuerdo(meal)">
                                  <VIcon class="tabler-eye" />
                                </VBtn>
                                <VBtn class="me-5" size="30" color="success" title="Editar"
                                  @click="_abrirModalEditarTareaAcuerdo(meal)">
                                  <VIcon class="tabler-edit" />
                                </VBtn>
                                <VBtn size="30" color="error" title="Eliminar"
                                  @click="_abrirModalEliminarTareaAcuerdo(meal)">
                                  <VIcon class="tabler-trash" />
                                </VBtn>

                              </VCol>
                            </VRow>
                          </VCardText>
                        </VCard>
                      </li>
                    </template>
                  </draggable>
                </div>

              </VWindowItem>

              <VWindowItem value="tab-3">
                <VForm @submit.prevent="_guardarComentario">
                  <VRow>
                    <VCol cols=" 12" md="6" lg="5">
                      <div>
                        <TiptapEditor v-model="newComentario.comentario" class="border rounded" />
                        <VChip class="d-flex justify-center w-100" size="default" variant="tonal" label color="error"
                          v-if="comentarioError">
                          {{ comentarioError }}</VChip>
                      </div>
                      <div class="d-flex justify-end flex-wrap gap-3 mt-3">
                        <!-- <VBtn @click="saveComment" type=""> Guardar </VBtn> -->
                        <VBtn type="submit"> Guardar </VBtn>

                      </div>
                    </VCol>
                    <VCol cols="12" md="6" lg="7">
                      <div class="border rounded h-100 img-center"
                        v-if="datosAcuerdo.listaComentariosAcuerdos.length === 0">
                        <img class="my-8" src="../../assets/images/logos/Colibri.png" alt="Logo" />
                      </div>
                      <div class="altura">

                        <div else v-for="(comment, index) in datosAcuerdo.listaComentariosAcuerdos" :key="index">
                          <VCard class="bg-light-primary mb-2" variant="text">
                            <VCardText class="py-2">
                              <!-- <div class="d-flex justify-space-between align-center mb-1">
                              <span class="app-timeline-title"><b>Nombre</b></span>
                              <small class="app-timeline-meta"><b>{{ comment.date }}</b></small>
                            </div> -->

                              <div class="app-timeline-text">
                                <span v-html="comment.comentario"></span>
                              </div>
                            </VCardText>
                          </VCard>
                        </div>
                      </div>

                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem value="tab-4">
                <VCardText>
                  <div class="flex">
                    <div class="w-full h-auto relative">
                      <div class="cursor-pointer mb-5 border-dashed drop-zone px-5">
                        <div @click="_cargarArchivo"
                          class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 my-7 border rounded ">
                          <IconBtn variant="tonal" class="rounded-sm">
                            <VIcon icon="tabler-upload" />
                          </IconBtn>
                          <div class="text-base text-high-emphasis font-weight-medium">
                            Suelte los archivos aquí o haga clic para cargarlos
                          </div>
                        </div>
                        <div>
                          <div class="d-flex justify-center align-center gap-3  flex-wrap  mb-5">
                            <VRow class="match-height w-100">

                              <template v-for="(index, key) in datosAcuerdo.listaDocumentoAcuerdo" :key="key">
                                <VCol cols="12" sm="3">
                                  <VCard :ripple="false" border>
                                    <VCardText class="d-flex flex-column">
                                      <div class="justify-center d-flex">
                                        <div v-if="index.extension == 'pdf'">
                                          <img src="../../assets/images/logos/PDF.png" width="80" height="80" />
                                        </div>
                                        <div v-if="index.extension == 'docx' ||
    index.extension == 'DOC'
    ">
                                          <img src="../../assets/images/logos/docx.png" width="80" height="80" />
                                        </div>
                                        <div v-if="index.extension == 'pptx'">
                                          <img src="../../assets/images/logos/pptx.png" width="80" height="80" />
                                        </div>
                                        <div v-if="index.extension == 'xlsx'">
                                          <img src="../../assets/images/logos/xlsx.png" width="80" height="80" />
                                        </div>
                                        <!-- <div v-if="index.extension == 'gif'">
                                          <img src="../../assets/images/logos/Img.png" width="60" height="80" />
                                        </div> -->
                                        <div v-if="index.extension == 'jpg' ||
    index.extension == 'png' ||
    index.extension == 'svg' ||
    index.extension == 'jpeg' ||
    index.extension == 'gif' ||
    index.extension == 'bmb'
    ">
                                          <img src="../../assets/images/logos/Img.png" width="60" height="80" />
                                        </div>
                                      </div>
                                      <div class="mt-2 text-center overflow-hidden flex-wrap flex-grow-1">
                                        <div class="text-truncate">
                                          <span class="clamp-text text-wrap text-truncate">
                                            {{
    index.nombreOriginal
      ? index.nombreOriginal
      : "Documento"
  }}
                                          </span>
                                          <span class="text-disabled">
                                            {{ index.extension }}
                                          </span>
                                        </div>
                                      </div>
                                    </VCardText>
                                    <hr />
                                    <div class="demo-space-x py-3 justify-center d-flex">
                                      <VBtn @click="descargarDocumento(index)" size="30" color="secondary" class="mx-1"
                                        title="Descargar documento">
                                        <VIcon icon="tabler-download" size="20" />
                                      </VBtn>
                                      <VBtn @click="_editarDocumentoAcuerdo(index.id)" size="30" color="success"
                                        class="mx-1" title="Editar documento">
                                        <VIcon icon="tabler-edit" size="20" />
                                      </VBtn>
                                      <VBtn @click="OpenEliminarDocumentoAcuerdo(index.id)" size="30" color="error"
                                        class="mx-1" title="Eliminar documento">
                                        <VIcon icon="tabler-trash" size="20" />
                                      </VBtn>
                                    </div>
                                  </VCard>
                                </VCol>
                              </template>
                            </VRow>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </VCardText>

              </VWindowItem>

              <VWindowItem value="tab-5">
                <VTable class="text-no-wrap">
                  <thead>
                    <tr>
                      <th class="text-uppercase">Nombre de columnas</th>
                      <th class="text-uppercase">Tiempo Inicial</th>
                      <th class="text-uppercase">Tiempo Subsecuente</th>
                    </tr>
                  </thead>
                  <tbody v-if="datosAcuerdo.listaMetricasAcuerdo.length === 0">
                    <tr>
                      <td class=" text-center" colspan="3">
                        Sin métrica
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr v-for="(item, key) in datosAcuerdo.listaMetricasAcuerdo" :key="key">
                      <td>
                        {{ item.estatusTableroMinutasVM.estatus }}
                      </td>

                      <td>
                        {{ item.metricasVM.tiempoEsperaPrimeraVez }}
                      </td>
                      <td>
                        {{ item.metricasVM.tiempoEsperaSegundaVez }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VWindowItem>

            </VWindow>
          </VCardText>
        </VCard>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="isAcurdo = false">
          Cerrar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog max-width="800px" v-model="dialog">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialog = false" />

    <VCard flat>
      <VCardTitle v-if="!verTareaAcuerdo">{{ newtareaAcuerdo.idTarea != 0 ? 'Editar ' : 'Agregar ' }} status
      </VCardTitle>
      <VForm ref="refTareaAcuerdo" @submit.prevent="_guardarTareaAcuerdo">
        <VCardText>
          <VRow>

            <VCol cols="12" sm="12">
              <AppTextarea v-model="newtareaAcuerdo.estatus" label="Status" placeholder="Escriba su status" auto-grow
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" sm="12">
              <label for="">Observaciones</label>
              <TiptapEditor v-model="newtareaAcuerdo.observaciones" class="border rounded" />
              <VChip class="d-flex justify-center w-100" size="default" variant="tonal" label color="error"
                v-if="observacionesError">
                {{ observacionesError }}</VChip>
            </VCol>
            <VCol cols="12" sm="12">
              <VTextField v-model="newtareaAcuerdo.contacto" label="Contacto" variant="outlined"
                :rules="[requiredValidator]" />
            </VCol>

          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="dialog = false">
            Cancelar
          </VBtn>
          <VBtn type="submit" v-if="!verTareaAcuerdo"> {{ newtareaAcuerdo.idTarea != 0 ? 'Editar' : 'Agregar' }} </VBtn>
        </VCardText>
      </VForm>

    </VCard>
  </VDialog>
  <!-- este es para agregar comentarios -->
  <VDialog v-model="isComentario" max-width="1100px">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isComentario = false" />

    <VCard>
      <VCardTitle>
        <VIcon size="32" class="tabler-message-dots me-1" /> Agregar comentario
        <P class="text-primary mb-0">{{ selectedMeal.name }}</P>
      </VCardTitle>
      <VDivider></VDivider>
      <VCardText>
        <VRow>
          <VCol cols="12" md="6" lg="5">
            <div>
              <TiptapEditor v-model="comentarioTexto" class="border rounded" />
            </div>
            <div class="d-flex justify-end flex-wrap gap-3 mt-3">
              <VBtn @click="saveComment"> Guardar </VBtn>
            </div>
          </VCol>
          <VCol cols="12" md="6" lg="7" :class="{
    conteChatNoComments: comments.length === 0,
    conteChatWithComments: comments.length > 0,
  }">
            <div class="border rounded h-100 img-center" v-if="comments.length === 0">
              <!-- Si está vacío, muestra la imagen predeterminada -->
              <img src="../../assets/images/logos/Colibri.png" alt="Logo" />
            </div>
            <div else v-for="(comment, index) in comments" :key="index">
              <VCard class="bg-light-primary mb-2" variant="text">
                <VCardText class="py-2">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="app-timeline-title"><b>Nombre</b></span>
                    <small class="app-timeline-meta"><b>{{ comment.date }}</b></small>
                  </div>

                  <div class="app-timeline-text">
                    <span v-html="comment.content"></span>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="isComentario = false">
          Cerrar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="isDialogTipoMA" class="v-dialog-lg">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogTipoMA = false" />

    <VCard title="Detalles de la Reunión">
      <VCardText>
        <VCard>
          <div>
            <div>
              <VTabs v-model="currentTab">
                <VTab>
                  <VIcon start icon="tabler-brand-trello" />
                  Detalles
                </VTab>

                <VTab>
                  <VIcon start icon="tabler-script" />
                  <div v-if="datosAcuerdosParaModalReuniones.length == 0">
                    Acuerdos
                  </div>
                  <VBadge v-else :content="datosAcuerdosParaModalReuniones.length" :offset-x="-18" :offset-y="6">
                    Acuerdos
                  </VBadge>
                </VTab>

                <VTab>
                  <VIcon start icon="tabler-square-half" />
                  Metrica
                </VTab>
              </VTabs>
            </div>

            <VCardText>
              <VWindow v-model="currentTab" class="ms-3">
                <VWindowItem value="tab-1">
                  <div class="py-3" v-if="datosReunionesParaModalReuniones.reunionVM.idTipoReunion == 1">
                    <div class="ps-4">
                      <h2>Minuta</h2>
                    </div>
                    <hr />
                    <div class="ps-5 ">
                      <div class="me-auto">
                        <p class="d-flex align-center mt-5 mb-2">
                        <h2>
                          Tema:
                          <span class="ms-3"> {{ datosReunionesParaModalReuniones.reunionVM.tema
                            }}</span><!--{{ this.formRequest.tema }}-->
                        </h2>
                        </p>
                      </div>
                      <div class="me-auto">
                        <p class="d-flex align-center mb-6">
                          <VIcon icon="tabler-file-typography" size="25" />
                          <span class="ms-3">{{ datosReunionesParaModalReuniones.reunionVM.titulo }}</span>
                          <!--{{ this.formRequest.titulo }}-->
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div class="d-flex my-4">
                      <div class="mx-3">
                        <label for="">Folio de Minuta</label>
                        <div class="border rounded px-3 px-3">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.minutasVM ?
    datosReunionesParaModalReuniones.minutasVM.folio
    : "Sin minuta" }}
                            <!-- {{ this.FormMinuta.folio }} -->
                            <VIcon icon="tabler-folder" class="mx-4" />
                          </div>
                        </div>
                      </div>
                      <div class="mx-3">
                        <label for="">Fecha</label>
                        <div class="border rounded px-3 px-3">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.reunionVM.fechaViewMinutas }}
                            <!-- {{ this.formRequest.fechaString }} -->
                            <VIcon icon="tabler-calendar-event" class="mx-4" />
                          </div>
                        </div>
                      </div>
                      <div class="mx-3">
                        <label for="">Hora</label>
                        <div class="border rounded">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.reunionVM.horaString }}
                            <!-- {{ this.formRequest.horaString }} -->
                            <VIcon icon="tabler-clock-hour-3" class="mx-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="px-5 py-2 mb-5 border-b border-s rounded-s-4 rounded-t-0 rounded-sm">
                      <P class="text-h5"><b>Resumen de Minuta:</b></P>
                      <p v-html="datosReunionesParaModalReuniones.minutasVM ?
    (datosReunionesParaModalReuniones.minutasVM.resumen ?? 'Sin resumen')
    : 'Sin minuta'"></p>
                    </div>
                    <div class="px-5 py-2 mb-5 border-b border-s rounded-s-4 rounded-t-0 rounded-sm">
                      <P class="text-h5"><b>Observaciones:</b></P>
                      <p class="" v-html="datosReunionesParaModalReuniones.minutasVM ?
    (datosReunionesParaModalReuniones.minutasVM.observaciones ?? 'Sin observaciones')
    : 'Sin minuta'"></p>
                    </div>
                  </div>

                  <div v-else>
                    <div class="ps-4">
                      <h2>Acta</h2>
                    </div>
                    <hr />
                    <div class="ps-5 ">
                      <div class="me-auto">
                        <p class="d-flex align-center mt-5 mb-2">
                        <h2>
                          Tema:
                          <span class="ms-3">{{ datosReunionesParaModalReuniones.reunionVM.tema
                            }}</span>
                        </h2>
                        </p>
                      </div>
                      <div class="me-auto">
                        <p class="d-flex align-center mb-6">
                          <VIcon icon="tabler-file-typography" size="25" />
                          <span class="ms-3">{{ datosReunionesParaModalReuniones.reunionVM.titulo }}</span>
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div class="d-flex my-4">
                      <div class="mx-3">
                        <label for="">Folio de acta</label>
                        <div class="border rounded px-3 px-3">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.minutasVM ?
    datosReunionesParaModalReuniones.minutasVM.folio
    : "Sin minuta" }}
                            <VIcon icon="tabler-folder" class="mx-4" />
                          </div>
                        </div>
                      </div>
                      <div class="mx-3">
                        <label for="">Fecha</label>
                        <div class="border rounded px-3 px-3">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.reunionVM.fechaViewMinutas }}
                            <VIcon icon="tabler-calendar-event" class="mx-4" />
                          </div>
                        </div>
                      </div>
                      <div class="mx-3">
                        <label for="">Hora</label>
                        <div class="border rounded">
                          <div class="px-3 py-2">
                            {{ datosReunionesParaModalReuniones.reunionVM.horaString }}
                            <VIcon icon="tabler-clock-hour-3" class="mx-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <VRow>
                      <VCol cols="12" md="12">
                        <VCard class="rounded-4">
                          <VCardText>
                            <div class="mb-5">
                              <VRow v-for="(item, key) in datosReunionesParaModalReuniones.listaOrdenReunioneVM">
                                <VCol class="1" md="1">
                                  <VChip size="large" label color="error">
                                    {{ item.numOrden }}
                                  </VChip>
                                </VCol>
                                <VCol class="11" md="11">
                                  <b>
                                    <h3 class="mb-0 text-primary">
                                      {{ _NumeroDeOrden(item.numOrden) }}
                                    </h3>
                                  </b>
                                  <p v-html="item.descripcion">
                                  </p>
                                  <p v-html="item.notaActa"></p>
                                  <VDivider />
                                </VCol>
                              </VRow>
                            </div>
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>
                  </div>

                </VWindowItem>

                <VWindowItem value="tab-2">
                  <div v-if="datosAcuerdosParaModalReuniones.length == 0" class="text-center">
                    Sin acuerdos
                  </div>
                  <div v-else>
                    <draggable v-model="datosAcuerdosParaModalReuniones" tag="ul" group="acuerdos-group"
                      :animation="300" style="list-style: none">

                      <template #item="{ element: meal }">
                        <li class="border mb-2 rounded">
                          <VCard>

                            <div class="px-5 my-3">
                              <div class="d-flex">
                                <VIcon class="tabler-bookmarks me-2" />
                                <p class="mb-1 ms-2">{{ meal?.listaAcuerdosMinutas[0]?.acuerdosMinutasVM?.folioAcuerdo
                                  }}
                                </p>
                              </div>
                            </div>
                          </VCard>
                        </li>
                      </template>
                    </draggable>
                  </div>

                </VWindowItem>

                <VWindowItem value="tab-3">
                  <VTable class="text-no-wrap">
                    <thead>
                      <tr>
                        <th class="text-uppercase">Nombre de columnas</th>
                        <th class="text-uppercase">Tiempo Inicial</th>
                        <th class="text-uppercase">Tiempo Subsecuente</th>
                      </tr>
                    </thead>
                    <tbody v-if="datosReunionesParaModalReuniones.metricasReunion.length == 0">
                      <tr>
                        <td class="text-center" colspan="3">
                          Sin métrica
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr v-for="(item, key) in datosReunionesParaModalReuniones.metricasReunion" :key="key">
                        <td>
                          {{ item.estatusTableroMinutasVM.estatus }}
                        </td>

                        <td>
                          {{ item.metricasVM.tiempoEsperaPrimeraVez }}
                        </td>
                        <td>
                          {{ item.metricasVM.tiempoEsperaSegundaVez }}
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </VWindowItem>

              </VWindow>
            </VCardText>
          </div>
        </VCard>

      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="isDialogTipoMA = false">
          Cerrar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="isModalTemas" class="v-dialog-lg">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isModalTemas = false" />

    <VCard>
      <VCardText>
        <VCard>
          <div class="">
            <div>
              <VTabs v-model="currentTab">
                <VTab>
                  <VIcon start icon="tabler-folder" />
                  <div v-if="ListaReuniones.reunionVM.length == 0">
                    Reuniones
                  </div>
                  <VBadge v-else :content="ListaReuniones.reunionVM.length" :offset-x="-18" :offset-y="6">
                    Reuniones
                  </VBadge>

                </VTab>

                <VTab>
                  <VIcon start icon="tabler-square-half" />
                  Metrica
                </VTab>
              </VTabs>
            </div>

            <VCardText>
              <VWindow v-model="currentTab" class="ms-3">
                <VWindowItem value="tab-1">
                  <div class=" my-3">
                    <div class="d-flex">
                      <VIcon size="25" class="custom-wizard-social-link mt-1" />
                      <p class="mb-0 ms-2 text-h3">{{ ListaReuniones.temaReunionVM.nombre }}</p>
                    </div>
                    <VDivider class="my-3" />
                    <p class="text-h5">Reuniones</p>
                    <!-- !ESTA ES LA PARTE DE MODAL CUANDO SE ABRE DEL TEMA  -->
                    <div v-if="ListaReuniones.reunionVM.length == 0">
                      {{ "Sin reuniones" }}
                    </div>
                    <div v-else>
                      <draggable v-model="ListaReuniones.reunionVM" tag="ul" group="reunion-group" :animation="300"
                        style="list-style: none">

                        <template #item="{ element: reunion }" class="list-group-item">
                          <li class="border mb-2 rounded">
                            <VCard v-if="reunion.minutasVM">
                              <VRow class="border-bottom">
                                <VCol cols="12" style="padding-right: 0">
                                  <VChip class="w-100 radio" label block style="margin-top: -2px">
                                    <p class="mb-0">
                                      {{ reunion.reunionVM.idTipoReunion == 1 ? "Minuta" : "Acta" }}
                                      <span>{{ reunion.reunionVM.id }}</span>
                                    </p>
                                  </VChip>
                                </VCol>
                              </VRow>
                              <VDivider></VDivider>
                              <div class="px-5 my-3">
                                <div class="d-flex">
                                  <VIcon class="tabler-folder" />
                                  <p class="mb-1 ms-2">{{ reunion.minutasVM.folio }}</p>
                                </div>
                                {{ reunion.reunionVM.titulo }}
                              </div>
                            </VCard>

                            <VCard v-else>
                              <VRow class="border-bottom">
                                <VCol cols="12" style="padding-right: 0">
                                  <VChip class="w-100" label block style="margin-top: -2px">
                                    <p class="mb-0">
                                      Reunión
                                      <span>{{ reunion.reunionVM.id }}</span>
                                    </p>
                                  </VChip>
                                </VCol>
                              </VRow>
                              <VDivider></VDivider>
                              <div class="px-5 my-3">
                                <div class="d-flex">
                                  <VIcon class="tabler-folder" />
                                  <p class="mb-1 ms-2">{{ reunion.reunionVM.fechaViewMinutas }}</p>
                                </div>
                                {{ reunion.reunionVM.titulo }}
                              </div>
                            </VCard>
                          </li>
                        </template>
                      </draggable>
                    </div>

                  </div>
                </VWindowItem>

                <VWindowItem value="tab-2">
                  <VTable class="text-no-wrap">
                    <thead>
                      <tr>
                        <th class="text-uppercase">Nombre de columnas</th>
                        <th class="text-uppercase">Tiempo Inicial</th>
                        <th class="text-uppercase">Tiempo Subsecuente</th>
                      </tr>
                    </thead>
                    <tbody v-if="ListaReuniones.metricasTema.length == 0">
                      <tr>
                        <td class="text-center" colspan="3">
                          Sin métrica
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr v-for="(item, key) in ListaReuniones.metricasTema" :key="key">
                        <td>
                          {{ item.estatusTableroMinutasVM.descripcion }}
                        </td>

                        <td>
                          {{ item.metricasVM.tiempoEsperaPrimeraVez }}
                        </td>
                        <td>
                          {{ item.metricasVM.tiempoEsperaSegundaVez }}
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </VWindowItem>
              </VWindow>
            </VCardText>
          </div>
        </VCard>

      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="isModalTemas = false">
          Cerrar
        </VBtn>

      </VCardText>
    </VCard>
  </VDialog>

  <!-- ?Eliminar Archivo -->

  <VDialog v-model="modalEliminarDocumento" max-width="500px">
    <VCard>
      <VCardTitle>¿Deseas eliminar el registro?
      </VCardTitle>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="modalEliminarDocumento = false">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="eliminarDocumentoAcuerdo">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalSpinner" persistent max-width="500px">
    <VCard>
      <VCardText>
        <VCardActions>
          <VSpacer />
          <VProgressLinear indeterminate color="primary" />
          <VSpacer />
        </VCardActions>
      </VCardText>

    </VCard>
  </VDialog>

  <VDialog v-model="modalDeleteTareaAcuerdo" max-width="500px">
    <VCard>
      <VCardTitle class="text-center mt-1 mb-1">¿Deseas eliminar el registro? </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="_cerrarModalEliminarTareaAcuerdo()">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="_deleteTareaAcuerdo()">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

</template>

<style scoped lang="scss">
.total-lista {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 25px;
  height: 20px;
  overflow: hidden;
  top: 0;
  left: 0;
  border-radius: 0 0 35px 0;
}

.icon-btn {
  display: flex;
  position: absolute;
  overflow: hidden;
  top: 10px;
  right: 15px;
}

.totalA {
  background-color: #dbe5f4;
  color: #2666be;
}

.conte {
  justify-content: end;
  display: flex;
}

.total-lista p {
  font-size: x-small;
  margin-top: 10px;
  margin-left: -4px;
}

.texto {
  writing-mode: vertical-lr;
  display: inline-block;
}

.texto p {
  text-orientation: mixed;
}

.conteChat {
  overflow: auto;
}

.conteChatNoComments {
  height: auto;
}

.conteChatWithComments {
  height: 60ch;
}

.img-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ProseMirror {
  block-size: 200px;
  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;
}

.selected {
  box-shadow: 10px 13px 38px -18px rgba(0, 0, 0, 1);
}

.posicion {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: #dbe5f4;
  opacity: 1;
}

.texto-en {

  text-align: right;
}

@media screen and (max-width: 960px) {
  .texto-en {

    text-align: left;
  }
}

.radio {
  border-radius: 0;
}

.mt-ac {
  margin-top: -2px;
}

.btn-conte {
  border-radius: 0;
  margin-bottom: -5px;
}

.altura {
  max-height: 450px;
  overflow-y: auto;
}
</style>

<style lang="scss">
.flatpickr-calendar {
  background-color: rgb(var(--v-theme-surface));
  inline-size: 16.625rem;
  margin-block-start: 0.1875rem;
  position: fixed;
  //   es prueba
}
</style>
