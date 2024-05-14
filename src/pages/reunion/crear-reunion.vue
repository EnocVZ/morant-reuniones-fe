<script>
import dependeciaServices from '@/services/dependencia-service'
import reunionService from '@/services/reuniones-service'
import directorioService from '@/services/directorio-service'
import lugarReunionService from "@/services/lugar-reunion-service";
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useToast } from 'vue-toastification'
import "vue-toastification/dist/index.css";
import FormParticipante from "@/views/pages/reunion/form-participante.vue"
import temaReunionServices from '@/services/tema-reunion-services';
import checklistService from '@/services/checklist-service';

export default {
  components: {
    VDataTable,
    "form-participante": FormParticipante,
  },
  data() {
    return {
      toast: useToast(),
      numberedSteps: [
        {
          title: 'Datos generales',
          subtitle: 'Datos de la reunión',
        },
        {
          title: 'Orden del día',
          subtitle: 'Intervenciones y momentos',
        },
        {
          title: 'Participante',
          subtitle: 'Agregar participante',
        },
        {
          title: 'CheckList',
          subtitle: 'CheckList',
        }
      ],
      currentStep: 0,
      formRequest: {
        idReunion: 0,
        titulo: '',
        fecha: new Date(),
        hora: this.getCurrentTime(),
        tema: '',
        idTema: null,
        rqActa: false,
        idLugar: null,
        idModalidad: 1,
        idReunionVinculada: null,
        listaOrden: [],
        listaParticipantes: [],
        idTipoReunion: 1,
        listaCheckList: []
      },
      formRequestDefalut: {
        idReunion: 0,
        titulo: '',
        fecha: new Date(),
        hora: this.getCurrentTime(),
        tema: '',
        idTema: 0,
        idLugar: null,
        idModalidad: 1,
        idReunionVinculada: null,
        rqActa: false,
        listaOrden: [],
        listaParticipantes: [],
        idTipoReunion: 1,
        listaCheckList: []
      },
      headersOrden: [
        {
          title: '',
          key: 'data-table-expand',
        },
        // {
        //   title: 'IDOrden',
        //   key: 'idOrden',
        // },
        {
          title: '# Orden',
          key: 'numOrden',
        },
        {
          title: 'Descripción',
          key: 'descripcion',
        },
        {
          title: 'Inicia',
          key: 'horaInicio',
        },
        {
          title: 'Termina',
          key: 'horaFinal',
        },
        {
          title: 'Eliminar',
          key: 'actions',
        }
      ],
      formOrden: {
        id: 0,
        idOrden: 0,
        idReunion: 0,
        descripcion: '',
        idDependencia : 0,
        listaPersona: [],
        horaInicio: '',
        horaFinal: '',
        numOrden: '',
      },
      formOrdenEditar: {
        id: 0,
        idOrden: 0,
        idReunion: 0,
        descripcion: '',
        listaPersona: [],
        horaInicio: '',
        horaFinal: '',
        numOrden: '',
      },
      formOrdenDefault: {
        id: 0,
        idOrden: 0,
        idReunion: 0,
        descripcion: '',
        listaPersona: [],
        horaInicio: '',
        horaFinal: '',
      },
      headersPersona: [
        {
          title: 'ID',
          sortable: false,
          key: 'idOrdenPersona',
        },
        {
          title: 'Persona a cargo',
          key: 'persona',
        },
        {
          title: 'Cargo',
          key: 'cargo',
        },
        {
          title: 'Eliminar',
          key: 'actions',
        },
      ],
      listaDetallePersona: {
        idOrdenPersona: 0,
        idOrden: 0,
        idPersona: 0,
        persona: '',
        cargo: '',
        numOrden: 0,
      },
      listaDetallePersonaDefault: {
        idOrdenPersona: 0,
        idOrden: 0,
        idPersona: 0,
        persona: '',
        cargo: '',
        numOrden: 0,
      },
      headersParticipante: [
        {
          title: 'ID',
          sortable: false,
          key: 'idParticipante',
        },
        {
          title: 'Dependencia',
          key: 'dependencia',
        },
        {
          title: 'Participante',
          key: 'persona',
        },
        {
          title: 'Representante',
          key: 'representante',
        },
        {
          title: 'Eliminar',
          key: 'actions',
        },
      ],
      fromParticipante: {
        idParticipante: 0,
        idReunion: 0,
        idPersona: undefined,
        idDependencia : null,
        persona: '',
        invitacion: false,
        dependencia: '',
        representante: '',
        cargo: '',
      },
      fromParticipanteDefault: {
        idParticipante: 0,
        idReunion: 0,
        idPersona: undefined,
        persona: '',
        invitacion: false,
        dependencia: '',
        representante: '',
        cargo: '',
      },
      idPersonaSelectOrden: [],
      idPersonaSelecParticipante: [],
      dependeciaLista: [],
      directoriolista: [],
      directorioxIdDependencia: [],
      refFromGeneral: '',
      refFromOrden: '',
      refFromParticipante: '',
      refFromAgregarOrden: '',
      refFromAgregarParticipante: '',
      isCurrentStepValid: true,
      currentYear: new Date().getFullYear(),
      currentMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      currentDay: new Date().getDate().toString().padStart(2, '0'),
      openEliminar: false,
      idEliminarRows: 0,
      expandedRows: [],
      numOrden: 1,
      horaInicio: '',
      horaFinal: '',
      openRepresentante: false,
      Representante: '',
      Cargo: '',
      ListaLugares: '',
      AsientosLugar: 0,
      idLugarSelect: [],
      ListaModalidad: '',
      ListaReunionAVincular: [],
      SelectModalidad: [],
      SelectidReunionViculada: [],
      ListaTipoReunion: [],
      SelectTipoReunion: [],
      ListaTipoDirectorio: [],
      SelectTipoDirectorio: [],
      IdTipoDirectorio: 1,
      SelectTipoDirectorioPartic: [],
      IdTipoFrom: 0,


      //Temas y checklist
      refFromChecklist: "",

      ChecksSelecionados: [],
      Temas: [],
      Checks: [],
      refFormularioTema: "",
      temaDefault: {
        id: 0,
        nombre: "",
        proceso: true
      },
      tema: {
        id: 0,
        nombre: "",
        proceso: true
      },
      open: false,
      actualizar: false,
      modalEditarOrden:false,
      modalEliminarOrdenPersona :false,
      modalEditarPersona : false,
      idPersonaOrden : null,
      ordenPersonaIndex : null,
      numOrdenAntiguo: null,
      descripcionAntiguo : "",
      indexRegistro : null,
      bandera : false,
      personaOrden : null,
      datosGeneralesValidos: false,
      btnPreGuardaRunion: false
    }

  },

  watch: {
    "fromParticipante.idDependencia": function (val) {
      if (val != undefined)
        this.handleSelectChange();
    },
    "idLugarSelect": function (val) {
      this.AsientosLugar = val.asientos;
      this.formRequest.idLugar = val.id
    },
    "SelectModalidad": function (val) {
      this.formRequest.idModalidad = val.id
    },
    "SelectidReunionViculada": function (val) {
      this.formRequest.idReunionVinculada = val.idReunion
    },
    "SelectTipoReunion": function (val) {
      this.formRequest.idTipoReunion = val.id
    },
    "SelectTipoDirectorio": async function (val) {
      this.IdTipoDirectorio = val.id
      if (val.id == 2) {
        this.directoriolista = []
        this.idPersonaSelectOrden = [];
        this.directorioxIdDependencia = [];
        this.idPersonaSelecParticipante = [];
        await this._ObtenerDirectorio(val.id, this.IdTipoFrom);

      }
      else {
        this.directoriolista = []
        this.idPersonaSelectOrden = [];
        if (this.fromParticipante.idDependencia != undefined)
          this.handleSelectChange();
      }

    }

  },
  methods: {

    async _getTemas() {
      try {
        let res = await temaReunionServices.Temas().then(data => data)
        if (res?.data) {
          this.Temas = res.data
        }
      } catch (error) {
        console.log(error);
      }
    },

    async _Checklist() {
      try {
        let res = await checklistService.obtenerCheckList().then(data => data)
        if (res?.data) {
          res?.data.map(data => {
            data.tipo = data.emoji + " " + data.actividad
          })
          this.Checks = res.data
          console.log(this.Checks);
        }
      } catch (error) {
        console.log(error);
      }
    },

    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      // Formateamos la hora en formato de 24 horas (HH:mm:ss)
      return `${hours}:${minutes}:${seconds}`;
    },
    AgregarOrden() {
      const currentTime = new Date();
      const minutosOrden = this.formOrden.minutes;

      const horaInicioHora = parseInt(this.horaInicio.split(':')[0]);
      const horaInicioMinutos = parseInt(this.horaInicio.split(':')[1]);

      const horaInicioDate = new Date(currentTime.getTime());
      horaInicioDate.setHours(horaInicioHora);
      horaInicioDate.setMinutes(horaInicioMinutos);

      const horaFinDate = new Date(horaInicioDate.getTime() + minutosOrden * 60000);
      this.horaFinal = `${horaFinDate.getHours().toString().padStart(2, '0')}:${horaFinDate.getMinutes().toString().padStart(2, '0')}`;

      // Validamos si el número de orden ya existe en la lista
      const existeOrden = this.formRequest.listaOrden.some(item => item.numOrden === this.numOrden);
      if (!existeOrden) {
        this.formOrden.numOrden = this.numOrden;
        this.formOrden.horaInicio = this.horaInicio;
        this.formOrden.horaFinal = this.horaFinal;
        this.formOrden.id = this.numOrden;
        this.idPersonaSelectOrden.forEach(element => {
          let listaDetallePersona = {
            idOrden: 0,
            idOrdenPersona: 0,
            idPersona: element.id,
            persona: element.persona,
            cargo: element.cargo,
            numOrden: this.numOrden,
            idDependencia : this.fromParticipante.idDependencia
          };
          this.formOrden.listaPersona.push(listaDetallePersona);
        });

        this.formRequest.listaOrden.push(this.formOrden);

        this.formOrden = { ...this.formOrdenDefault }
        this.formOrden.listaPersona = []
        this.idPersonaSelectOrden = []
        this.numOrden++;
        this.horaInicio = this.horaFinal
        this.horaFinal = this.horaFinal;
      }
      else
        this.toast.error("El número de orden que intentas insertar ya existe en la lista");
    },

    async openEditarOrden(item,index){
      this.indexRegistro = index;
      this.formOrdenEditar = {...item};
      this.numOrdenAntiguo = this.formOrdenEditar.numOrden
      if(this.formOrdenEditar.listaPersona.length > 0){
        let ListaDefult = await directorioService.ObtenerDirectorioIdDependecias(this.formOrdenEditar.listaPersona[0].idDependencia);
        this.directoriolista = ListaDefult.data;
      }
      this.modalEditarOrden = true;
    },
    CerrarModalEditarOrden(){
      this.modalEditarOrden = false;
    },
    ModificarOrden() {
      // Verificar si formRequest.listaOrden es un array y si tiene elementos
      if (Array.isArray(this.formRequest.listaOrden) && this.formRequest.listaOrden.length > 0) {
        // Mapear cada elemento de la lista de órdenes
        this.formRequest.listaOrden.forEach((orden,index) => {
          if(this.formOrdenEditar.numOrden == orden.numOrden){
            this.horaInicioAntiguo = orden.horaInicio;
            this.horaFinalAntiguo = orden.horaFinal;
            this.descripcionAntiguo = orden.descripcion
            orden.numOrden = this.numOrdenAntiguo;
            orden.horaInicio = this.formOrdenEditar.horaInicio;
            orden.horaFinal = this.formOrdenEditar.horaFinal;
            this.bandera = true;
           
          }
        });

        this.formRequest.listaOrden.forEach((orden,index) => {
          if(this.bandera == true && index == this.indexRegistro){
            orden.descripcion = this.formOrdenEditar.descripcion;
            orden.numOrden = this.formOrdenEditar.numOrden;
            orden.horaInicio = this.horaInicioAntiguo;
            orden.horaFinal = this.horaFinalAntiguo;
            // this.formOrdenEditar.descripcion = this.formOrdenEditar.descripcion;
            if (Array.isArray(orden.listaPersona)) {
              this.formOrdenEditar.listaPersona.forEach((nuevaPersona) => {

                const personaExistente = orden.listaPersona.find(persona => persona.idPersona === nuevaPersona?.id || nuevaPersona?.idPersona);
                
                if (!personaExistente) {
                  orden.listaPersona.push({
                    apMaterno : nuevaPersona.apMaterno ,
                    apPaterno :nuevaPersona.apPaterno,
                    cargo     :nuevaPersona.cargo,
                    idDependencia:nuevaPersona.idDependencia,
                    idOrden : orden.idOrden,
                    // idOrdenPersonal : null,
                    idPersona : nuevaPersona?.id || nuevaPersona?.idPersona,
                    nombres : nuevaPersona.nombres,
                    persona : nuevaPersona.persona
                  });
                } 
              });
            }
          }
        });
      }
      this.modalEditarOrden = false;
      
    },


    cancelarEliminarOrdenPersona(){
      this.modalEliminarOrdenPersona = false;
    },
    abrirDialogoEliminarOrdenPersona(orden,idPersona) {
      
      this.idPersonaOrden = idPersona
      this.formOrdenEditar = orden;
      this.modalEliminarOrdenPersona = true;
    },
    eliminarOrdenPersona() {
      const  idOrden = this.formOrdenEditar.idOrden
      this.formRequest.listaOrden.forEach((listaPer)=>{
        if(listaPer.idOrden == idOrden){
          let index = listaPer.listaPersona.findIndex(participante => participante.idPersona === this.idPersonaOrden);
          if (index !== -1) {
            listaPer.listaPersona.splice(index, 1);
            this.toast.success("Participante eliminado");
            this.modalEliminarOrdenPersona = false
            this.formOrdenEditar = [];
          }else{
            this.toast.error("No se encontro al participante");
          }
        }
       
      })
    },

    async editarOrdenPersona(itemPersona,index){
      console.log(itemPersona);
      
      this.formOrdenEditar = itemPersona;
      let ListaDefult = await directorioService.ObtenerDirectorioIdDependecias(this.formOrdenEditar.listaPersona[0].idDependencia);
      this.directoriolista = ListaDefult.data;
      this.ordenPersonaIndex = index,
      this.personaOrden = itemPersona.listaPersona[index];
      this.modalEditarPersona = true;
    },

    cancelarEdicionPersona(){
      this.modalEditarPersona = false;
    },

    confirmarModificacionPersona() {
      // Verificar si formRequest.listaOrden es un array y si tiene elementos
      if (Array.isArray(this.formRequest.listaOrden) && this.formRequest.listaOrden.length > 0) {
       
        // Mapear cada elemento de la lista de órdenes
        this.formRequest.listaOrden.forEach((orden) => {
        
          if(orden.idOrden == this.formOrdenEditar.idOrden){
            orden.descripcion = this.formOrdenEditar.descripcion;
            if (Array.isArray(orden.listaPersona)) {
              
              if(this.personaOrden){
               
                const personaAnterior = this.ordenPersonaIndex;
                if(personaAnterior !== -1){

                  orden.listaPersona.splice(personaAnterior,1)
                }
                orden.listaPersona.push({
                  apMaterno : this.personaOrden.apMaterno ,
                  apPaterno :this.personaOrden.apPaterno,
                  cargo     :this.personaOrden.cargo,
                  idDependencia:this.personaOrden.idDependencia,
                  idOrden : this.personaOrden.idOrden,
                  // idOrdenPersonal : null,
                  idPersona : this.personaOrden?.id || this.personaOrden?.idPersona,
                  nombres : this.personaOrden.nombres,
                  persona : this.personaOrden.persona
                })
              }
            }
          }
        });
      }
      this.modalEditarPersona = false;
      
    },

    AgregarParticipante() {

      if (this.idPersonaSelecParticipante.length != 1) {
        this.fromParticipante.representante = '';
        this.fromParticipante.cargo = '';
      }
      this.idPersonaSelecParticipante.forEach(element => {
        this.fromParticipante.idPersona = element.id;
        this.fromParticipante.idParticipante = 0;
        this.fromParticipante.idReunion = 0;
        this.fromParticipante.invitacion = false;
        this.fromParticipante.persona = element.persona;
        this.fromParticipante.dependencia = element.dependencia;
        this.fromParticipante.representante = this.fromParticipante.representante;
        this.fromParticipante.cargo = this.fromParticipante.cargo;
        let existe = this.formRequest.listaParticipantes.some(item => item.idPersona === element.id)
        if (!existe) {

          this.formRequest.listaParticipantes.push(this.fromParticipante);
          this.fromParticipante = { ... this.fromParticipanteDefault }
          this.toast.success("Los participantes se agrego correctamente a la lista");
        }
        else
          this.toast.error("El participante ya se encuentra en la lista" + ' ' + element.persona);
      });
      this.idPersonaSelecParticipante = [];

    },
    async _ObtenerListaModalidad() {
      let result = await reunionService.obtenerListaModalidad();
      if (result) {
        this.ListaModalidad = result.data;
      }
    },
    async _ObtenerTipoReunion() {
      let result = await reunionService.obtenerTipoReunion();
      if (result)
        this.ListaTipoReunion = result.data;
    },
    async _ObtenerTipoDirectorio() {
      let result = await directorioService.ObtenerTipoDirectorio();
      if (result)
        this.ListaTipoDirectorio = result.data;

      console.log("Tipo directorio", this.ListaTipoDirectorio);
    },
    async _ObtenerListaReuniosAVicular() {
      let result = await reunionService.ObtenerReunionesNoVinculadas();
      if (result) {
        this.ListaReunionAVincular = result;
      }
    },
    async _ObtenerListaLugares() {
      let result = await lugarReunionService.ObtenerLugaresReunion();
      if (result)
        this.ListaLugares = result;
    },
    async _ObtenerDependecia() {
      let result = await dependeciaServices.obtenerDependencias();
      this.horaInicio = this.actualizar ? this.horaInicio : this.formRequest.hora;
      if (result.data)
        this.dependeciaLista = result.data;
    },
    async _ObtenerDirectorio(IdTipo, IdTipoLista) {
      let resultDirectorio = await directorioService.obtenerDirectorioIdDependencia();
      if (resultDirectorio.data) {
        if (IdTipoLista == 2)
          this.directoriolista = resultDirectorio.data.filter(x => x.idTipoDirectorio == IdTipo);
        else {
          this.directorioxIdDependencia = [];
          this.idPersonaSelecParticipante = [];
          this.directorioxIdDependencia = resultDirectorio.data.filter(x => x.idTipoDirectorio == IdTipo);
        }
      }
    },
    async handleSelectChange() {
      this.directorioxIdDependencia = [];
      this.directoriolista = [];
      this.idPersonaSelectOrden = [];
      this.idPersonaSelecParticipante = [];
      let ListaDefult = await directorioService.ObtenerDirectorioIdDependecias(this.fromParticipante.idDependencia);
      this.directorioxIdDependencia = ListaDefult.data;
      this.directoriolista = ListaDefult.data;
    },
    async GuardarReunion() {
      if (this.formRequest.idReunion == 0) {
        let result = await reunionService.agregarReunion(this.formRequest);
        if (result.data.success) {
          this.toast.success(result.data.message)
          this.$router.push({ name: 'reunion-reuniones' });
        } else {
          this.toast.error(result.data.message)
        }
      } else {
        let result = await reunionService.actualizarReunion(this.formRequest);
        console.log(this.formRequest)
        if (result.data.success) {
          this.toast.success(result.data.message)
          this.$router.push({ name: 'reunion-reuniones' });
        } else {
          this.toast.error(result.data.message)
        }
      }
    },
    async _obtenerDatosActualizar(id) {
      let result = await reunionService.obtenerDatosActualizar(id)
      this.formRequest = result.data
      if (this.formRequest.listaOrden.length > 0) {
        this.actualizar = true;
        const ultimoValor = this.formRequest.listaOrden[this.formRequest.listaOrden.length - 1]
        if (ultimoValor.numOrden != null) {
          this.numOrden = ultimoValor.numOrden + 1;
        }
        this.horaInicio = ultimoValor.horaFinal
      }
      this.SelectModalidad = this.ListaModalidad.find(x => x.id == this.formRequest.idModalidad);
      this.idLugarSelect = this.ListaLugares.find(x => x.id == this.formRequest.idLugar);
      this.SelectTipoReunion = this.ListaTipoReunion.find(x => x.id == this.formRequest.idTipoReunion);
      let index = this.ListaReunionAVincular.indexOf(this.ListaReunionAVincular.find(x => x.idReunion == this.formRequest.idReunion));
      if (index != -1)
        this.ListaReunionAVincular.splice(index, 1);
      if (this.formRequest.idReunionVinculada != null) {
        let resulReunionVinculada = await reunionService.ObtenerReunionesVinculada(this.formRequest.idReunionVinculada)
        if (resulReunionVinculada != null) {
          this.ListaReunionAVincular.push(resulReunionVinculada);
        }
        this.SelectidReunionViculada = this.ListaReunionAVincular.find(x => x.idReunion == this.formRequest.idReunionVinculada)
      }

      //CheckList ----------------
      if (this.formRequest?.listaCheckList.length > 0) {
        this.ChecksSelecionados = []
        this.formRequest?.listaCheckList.map(data => {
          this.ChecksSelecionados.push(data.idCheckList)
        })
      }
    },
    openEliminarRows(id, item) {
      this.idEliminarRows = id;
      if (this.idEliminarRows == 1)
        this.formOrden = item;
      else if (this.idEliminarRows == 2)
        this.fromParticipante = item;

      this.openEliminar = true;
    },
    openRepresentanteModal(item) {
      this.fromParticipante = item;
      this.openRepresentante = true;
    },
    ModificarRowsParticipante() {
      let indexeRows = this.formRequest.listaParticipantes.indexOf(this.fromParticipante)
      if (indexeRows !== -1) {
        this.formRequest.listaParticipantes[indexeRows].representante = this.Representante;
        this.formRequest.listaParticipantes[indexeRows].cargo = this.Cargo;
        this.CerrarModalAgregarPparticipante()
      } else {
        this.toast.info("El elemento no se encuentra en las lista")
        this.CerrarModalAgregarPparticipante()
      }
    },
    CerrarModalAgregarPparticipante() {
      this.Cargo = '';
      this.Representante = '';
      this.fromParticipante = { ... this.fromParticipanteDefault }
      this.openRepresentante = false
    },
    CerrarEliminar() {
      this.idEliminarRows = 0
      this.formOrden = { ... this.formOrdenDefault }
      this.formOrden.listaPersona = []
      this.fromParticipante = { ... this.fromParticipanteDefault }
      this.openEliminar = false
    },
    eliminarRow() {
      if (this.idEliminarRows == 1) {
        this.numOrden = this.formOrden.numOrden;
        let indexeRows = this.formRequest.listaOrden.indexOf(this.formOrden)
        let rows = this.formRequest.listaOrden.splice(indexeRows, 1);
        if (rows) {
          this.toast.success("Se a eliminado correctamente")
          this.CerrarEliminar();
        }
        else {
          this.toast.error("No se pudo eliminar")
          this.CerrarEliminar();
        }

      }
      else if (this.idEliminarRows == 2) {
        let indeceRows = this.formRequest.listaParticipantes.indexOf(this.fromParticipante)
        let row = this.formRequest.listaParticipantes.splice(indeceRows, 1);
        if (row) {
          this.toast.success("Se a eliminado correctamente")
          this.CerrarEliminar();
        }
        else {
          this.toast.error("No se pudo eliminar")
          this.CerrarEliminar();
        }
      }
    },
    async validarFromGeneral() {
      let res = await this.$refs.refFromGeneral.validate();
      if (res.valid) {
        this.IdTipoFrom = 2
        this.currentStep++
        this.isCurrentStepValid = true
        this.horaInicio = this.actualizar ? this.horaInicio : this.formRequest.hora;
        this.horaFinal = this.formRequest.hora;
        await this._ObtenerDependecia()
      } else {
        this.isCurrentStepValid = false
      }
    },
    async validarFromOrden() {
      let res = await this.$refs.refFromOrden.validate();
      if (res.valid) {
        if (this.formRequest.listaOrden.length > 0) {
          this.IdTipoFrom = 3
          this.currentStep++
          this.isCurrentStepValid = true
          this.SelectTipoDirectorio = this.ListaTipoDirectorio.find(x => x.id == 1);
        }
        else
          this.toast.info("La lista de orden al meno tiene que tener un registro")

      } else {
        this.isCurrentStepValid = false
      }
    },
    async validarFromParticipante(listaParticipantes) {
      if (listaParticipantes.length == 0) {
        this.isCurrentStepValid = false;
        this.toast.info("Agregar por lo menos un participante a la reunion");
      } else {
        this.formRequest.listaParticipantes = listaParticipantes;
        this.currentStep++
        this.isCurrentStepValid = true

      }
    },
    async validarFromAgregarOrden() {
      let res = await this.$refs.refFromAgregarOrden.validate();
      if (res.valid)
        this.AgregarOrden()
    },
    async validarFromAgregarPaticipante() {
      let res = await this.$refs.refFromAgregarParticipante.validate()
      console.log('aqui')
      if (res.valid)
        console.log('aqui 2')
      this.AgregarParticipante()
    },
    async SelectDefault() {
      this.SelectModalidad = this.ListaModalidad.find(x => x.id == this.formRequest.idModalidad);
      this.SelectTipoReunion = this.ListaTipoReunion.find(x => x.id == this.formRequest.idTipoReunion);
    },


    //------------------------------------Checklist / Reunion
    OpenAgregar() {
      this.tema = { ...this.temaDefault };
      this.open = true;
    },

    CerrarModal() {
      this.tema = { ...this.temaDefault };
      this.open = false;
    },

    async Guardar() {
      let result = await temaReunionServices.addTema(this.tema);

      if (result?.data) {
        this.open = false;
        await this._getTemas();
        this.formRequest.idTema = parseInt(result.data.createdId)

      } else {
        this.toast.error(result?.response?.data?.message)
        this.open = false;
        console.log(result);
      }
    },

    async onSubmit() {
      let form = await this.$refs.refFormularioTema.validate();
      if (form.valid) {
        this.Guardar();
      }
    },

    async validarFromCheckList() {
      let res = await this.$refs.refFromChecklist.validate();
      if (res.valid) {
        this.formRequest.listaCheckList = []

        this.ChecksSelecionados.map(data => {
          console.log(data);
          this.formRequest.listaCheckList.push({
            IdCheck: 0,
            IdReunion: this.formRequest.idReunion ?? 0,
            IdCheckList: data,
            Check: false
          })
        })


        this.currentStep++
        this.isCurrentStepValid = true
        await this.GuardarReunion();
      } else {
        this.isCurrentStepValid = false
      }
    },
    async preGuardaRunion() {
      let res = await this.$refs.refFromGeneral.validate();
      if (res.valid) {
        this.btnPreGuardaRunion = true
        this.formRequest.listaCheckList = []
        this.ChecksSelecionados.forEach(data => {
          this.formRequest.listaCheckList.push({
            idCheck: 0,
            idReunion: this.formRequest.idReunion ?? 0,
            idCheckList: data,
            check: false
          })
        })

        await this.GuardarReunion();
      } else {
        this.currentStep = 0
        this.toast.error("Complete los datos generales")
        //this.isCurrentStepValid = false
      }


    },
    async validarDatosGenerales() {
      this._ObtenerDependecia()
      let res = await this.$refs.refFromGeneral.validate();
      if (res.valid) {
        this.datosGeneralesValidos = true
      } else {
        this.datosGeneralesValidos = false
        // this.toast.error("Complete los datos generales")
      }
    }
  },
  async created() {
    await this._ObtenerListaReuniosAVicular()
    await this._ObtenerListaModalidad()
    await this._ObtenerTipoReunion()
    await this._ObtenerListaLugares()
    await this._ObtenerTipoDirectorio()
    await this._getTemas()
    await this._Checklist()
    this.SelectTipoDirectorio = this.ListaTipoDirectorio.find(x => x.id == this.IdTipoDirectorio);
    let param = this.$route.params.id
    if (param > 0)
      await this._obtenerDatosActualizar(param)
    else
      this.SelectDefault()

    //await this._ObtenerDirectorio()

    watchEffect(() => {
      if (this.formRequest.idTema != 0) {
        this.formRequest.tema = this.Temas.find(data => data.id == this.formRequest.idTema)?.nombre ?? ""
      }
    })
  }
}
</script>

<template>
  <div style="overflow-x: hidden;">
    <VRow class="pt-5 pb-5">
      <VCol cols="12" md="6">
        <RouterLink :to="{ name: 'reunion-reuniones' }">
          <VBtn color="#b48d57">
            <VIcon start icon="tabler-arrow-left" />
            salir
          </VBtn>
        </RouterLink>
      </VCol>
      <VCol cols="12" md="6">
        <VBtn @click="preGuardaRunion()" class="text-none float-end bg-success" :loading="btnPreGuardaRunion">
          <VIcon start icon="tabler-save-left" />
          Guardar y salir
        </VBtn>
      </VCol>
    </VRow>
    <VCard>
      <VRow>
        <VCol cols="12" md="3" :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'">
          <VCardText>

            <!-- 👉 Stepper -->
            <AppStepper v-if="formRequest.idReunion == 0" v-model:current-step="currentStep" direction="vertical"
              :items="numberedSteps" class="align-content-start" :is-active-step-valid="isCurrentStepValid"
              @click="validarDatosGenerales" />

            <AppStepper v-else v-model:current-step="currentStep" direction="vertical" :items="numberedSteps"
              class="align-content-start" @click="() => _ObtenerDependecia()" />
          </VCardText>
        </VCol>
        <!-- 👉 stepper content -->
        <VCol style=" overflow-y: scroll;" cols="12" md="9"> <!-- height: 80vh; -->
          <VCardText>
            <VWindow v-model="currentStep" class="disable-tab-transition">
              <VWindowItem>
                <VForm ref="refFromGeneral" @submit.prevent="validarFromGeneral()">
                  <VRow>
                    <VCol cols="12">
                      <h6 class="text-h6 font-weight-medium">
                        Datos generales
                      </h6>
                      <p class="mb-0">
                        Ingrese los datos de la reunión
                      </p>
                    </VCol>

                    <VCol cols="12" md="12">
                      <AppTextarea color="#b48d57" v-model="formRequest.titulo" label="Título" rows="3"
                        :rules="[requiredValidator]" placeholder="Ingrese el título de la reunión" />
                    </VCol>
                    <!-- <VCol cols="12" md="12">
                      <AppCombobox color="#b48d57" v-model="SelectidReunionViculada" :items="this.ListaReunionAVincular"
                        item-title="titulo" item-value="idReunion" label="Reunión a vincular"
                        placeholder="Seleccione la reunión a vincular" />
                    </VCol> -->

                    <VCol cols="12" md="8">

                      <VRow>
                        <VCol cols="11">
                          <!-- <label>Temas</label> -->
                          <VSelect color="#b48d57" v-model="formRequest.idTema" :items="Temas" item-title="nombre"
                            label="Temas" density="compact" item-value="id"
                            placeholder="Selecciones los participante por dependencia" :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="1" class="px-0">
                          <VBtn color="cafe" @click="OpenAgregar" size="35" rounded="pill">
                            <VIcon class="tabler-plus" size="27" />
                          </VBtn>
                        </VCol>
                      </VRow>


                      <!-- <AppTextField color="#b48d57" v-model="formRequest.tema" label="Tema" density="compact"
                        placeholder="Ingrese el tema de la reunión" :rules="[requiredValidator]" /> -->
                    </VCol>

                    <VCol cols="12" md="6">
                      <AppCombobox color="#b48d57" v-model="SelectModalidad" :items="this.ListaModalidad"
                        item-title="descripcion" item-value="id" label="Modalidad" :rules="[requiredValidator]"
                        placeholder="Seleccione la modalidad" />
                    </VCol>


                    <VCol cols="12" md="6"> <!-- style="margin-top: 12px;" -->
                      <AppCombobox color="#b48d57" v-model="SelectTipoReunion" :items="this.ListaTipoReunion"
                        item-title="nombre" item-value="id" label="Tipo reunión" :rules="[requiredValidator]"
                        placeholder="Seleccione el tipo de reunión" />
                      <!-- <VCheckbox color="#b48d57" v-model="formRequest.rqActa">
                                                <template #label>
                                                    <div>
                                                        Requiere acta
                                                    </div>
                                                </template>
</VCheckbox> -->
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppDateTimePicker color="#b48d57" v-model="formRequest.fecha" label="Fecha"
                        :rules="[requiredValidator]" placeholder="Selecciones la fecha reunión"
                        v-if="formRequest.idReunion === 0" :config="{
          dateFormat: 'Y-m-d',
          minDate: `${this.currentYear}-${this.currentMonth}-${this.currentDay}`,
        }" />
                      <AppDateTimePicker color="#b48d57" v-model="formRequest.fecha" label="Fecha"
                        :rules="[requiredValidator]" placeholder="Selecciones la fecha reunión"
                        v-else="formRequest.idReunion != 0" :disabled="true" />
                      <!--  -->

                    </VCol>
                    <VCol cols="12" md="6">
                      <AppDateTimePicker color="#b48d57" v-model="formRequest.hora" label="Hora"
                        :rules="[requiredValidator]" placeholder="Selecciones la hora"
                        :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" />
                    </VCol>
                    <VCol cols="12" md="9">
                      <AppCombobox color="#b48d57" v-model="idLugarSelect" :items="ListaLugares" item-title="lugar"
                        item-value="id" label="Lugar de la reunión" density="compact"
                        placeholder="Seleccione el lugar de la reunión" :rules="[requiredValidator]" />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField color="#b48d57" v-model="this.AsientosLugar" label="Total sillas" density="compact"
                        placeholder="Sillas" :disabled="true" />
                    </VCol>
                    <VCol cols="12" md="12">
                      <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                        <VBtn color="secondary" variant="tonal" disabled>
                          <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                          Anterior
                        </VBtn>

                        <VBtn color="#b48d57" type="submit">
                          Siguiente
                          <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                        </VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem>
                <VForm ref="refFromOrden" @submit.prevent="validarFromOrden()">
                  <VRow>
                    <VForm ref="refFromAgregarOrden" @submit.prevent="validarFromAgregarOrden()">
                      <VRow>
                        <VCol cols="12">
                          <h6 class="text-h6 font-weight-medium">
                            Orden del día
                          </h6>
                          <p class="mb-0">
                            Intervenciones y momentos
                          </p>
                        </VCol>
                        <VCol cols="12" md="2">
                          <AppTextField color="#b48d57" v-model="numOrden" label="# Orden" prefix="#" type="number"
                            placeholder="0" :rules="[requiredValidator, integerValidator]" />
                        </VCol>
                        <VCol cols="12" md="4"> <!-- style="margin-top: 12px;" -->
                          <AppCombobox color="#b48d57" v-model="SelectTipoDirectorio" :items="ListaTipoDirectorio"
                            item-title="nombre" item-value="id" label="Tipo directorio" :rules="[requiredValidator]"
                            placeholder="Seleccione el tipo directorio" />
                        </VCol>
                        <VCol cols="12" md="6" v-if="IdTipoDirectorio == 1">
                          <AppSelect color="#b48d57" v-model="fromParticipante.idDependencia" label="Dependencia"
                            placeholder="Selecciones la dependencia" :items="dependeciaLista" item-title="nombre"
                            item-value="id" />
                        </VCol>


                        <VCol cols="12" md="6">
                          <AppCombobox color="#b48d57" v-model="idPersonaSelectOrden" :items="directoriolista"
                            item-title="persona" item-value="id" label="Persona a cargo" density="compact"
                            placeholder="Seleccione la persona a cargo" multiple />
                        </VCol>
                        <VCol cols="12" md="9">
                          <AppTextarea color="#b48d57" v-model="formOrden.descripcion" label="Descripción" rows="1"
                            :rules="[requiredValidator]" placeholder="Ingrese una descripción del orden" />
                        </VCol>
                        <VCol cols="12" md="3">
                          <AppTextField color="#b48d57" v-model="formOrden.minutes" label="Tiempo"
                            :rules="[requiredValidator, integerValidator]" placeholder="Ingrese el tiempo en minutos" />
                        </VCol>

                        <VCol cols="12" md="6">
                          <VBtn color="#b48d57" type="submit">
                            Agregar
                            <VIcon end icon="tabler-checkbox" />
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                    <VCol cols="12" md="12">
                      <VDataTable :headers="headersOrden" :items="formRequest.listaOrden" expand-on-click>
                        <template #item.actions="{ item,index  }">
                          <div class="d-flex gap-1">
                            <IconBtn @click="openEditarOrden(item,index )" >
                              <VIcon icon="tabler-edit" />
                            </IconBtn>
                            <IconBtn @click="openEliminarRows(1, item)">
                              <VIcon icon="tabler-trash" />
                            </IconBtn>
                          </div>
                        </template>
                        <template #expanded-row="slotProps">
                          <tr class="v-data-table__tr">
                            <td :colspan="headersOrden.length">
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
                                    <td>
                                      <div class="d-flex gap-1">
                                        <IconBtn @click="editarOrdenPersona(slotProps.item,index)">
                                            <VIcon icon="tabler-edit" />
                                        </IconBtn>
                                        <IconBtn @click="abrirDialogoEliminarOrdenPersona(slotProps.item,persona.idPersona)">
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
                    <VCol cols="12">
                      <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                        <VBtn color="secondary" variant="tonal" @click="currentStep--">
                          <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                          Anterior
                        </VBtn>

                        <VBtn color="#b48d57" type="submit">
                          Siguiente
                          <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                        </VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem>
                <form-participante :dependeciaLista="dependeciaLista" :onSave="validarFromParticipante"
                  :valoresBD="this.formRequest" @onChange="(e) => { this.formRequest.listaParticipantes = e; }">
                  <template v-slot:footer>
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" variant="tonal" @click="currentStep--">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" /> Anterior
                      </VBtn>
                      <VBtn color="#b48d57" type="submit">
                        Siguiente
                        <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                      </VBtn>
                    </div>
                  </template>
                </form-participante>
              </VWindowItem>


              <VWindowItem>
                <VForm ref="refFromChecklist" @submit.prevent="validarFromCheckList()">
                  <VRow>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Seleccione los checklist
                        </h6>
                        <!-- <p class="mb-0">
                            Selecciones un tema
                          </p> -->
                      </VCol>

                      <VCol>
                        <VRow>
                          <VCol cols="12" md="4" lg="4" v-for="(check, key ) in Checks" :key="key" :loading="loading">
                            <VCard>
                              <VCardText>
                                <div class="d-flex">
                                  <!-- @click="_Permisos(permiso2)" -->
                                  <VCheckbox v-model="ChecksSelecionados" true-icon="tabler-check" false-icon="tabler-x"
                                    :value="check.id" color="cafe" />
                                  <p class="mb-0 mt-1">{{ check.tipo }}</p>
                                </div>
                              </VCardText>
                            </VCard>
                            <!-- <VSelect color="#b48d57" v-model="ChecksSelecionados" :items="Checks" item-title="tipo"
                          item-value="id" label="Seleccione los checkList" density="compact"
                          placeholder="Selecciones checklist" multiple /> -->
                          </VCol>

                        </VRow>
                      </VCol>


                    </VRow>

                  </VRow>
                  <VCol cols="12">
                    <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                      <VBtn color="secondary" variant="tonal" @click="currentStep--">
                        <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                        Anterior
                      </VBtn>
                    </div>
                  </VCol>
                </VForm>
              </VWindowItem>


            </VWindow>
          </VCardText>
        </VCol>
      </VRow>
    </VCard>
  </div>

  <VDialog v-model="modalEditarOrden" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Editar la orden</span>
      </VCardTitle>
      <VCardText>
        <!-- {{ dependenciaGuardar.nombre }} -->
        <VContainer>
          <VCol cols="12" md="12">
            <VTextField color="#b48d57" v-model="formOrdenEditar.descripcion" label="Descripcion" validate-on="input" />
          </VCol>
          <VCol cols="12" md="12">
            <VTextField color="#b48d57" v-model="formOrdenEditar.numOrden" label="orden" validate-on="input" />
          </VCol>
          <VCol v-if="formOrdenEditar.listaPersona.length == 0" cols="12" md="12"> <!-- style="margin-top: 12px;" -->
            <AppCombobox color="#b48d57" v-model="SelectTipoDirectorio" :items="ListaTipoDirectorio"
              item-title="nombre" item-value="id" label="Tipo directorio" :rules="[requiredValidator]"
              placeholder="Seleccione el tipo directorio" />
          </VCol>
          <VCol cols="12" md="12" v-if="IdTipoDirectorio == 1 && formOrdenEditar.listaPersona.length == 0 ">
            <AppSelect color="#b48d57" v-model="fromParticipante.idDependencia" label="Dependencia"
              placeholder="Selecciones la dependencia" :items="dependeciaLista" item-title="nombre"
              item-value="id" />
          </VCol>

          <VCol cols="12" md="12">
            <AppCombobox color="#b48d57" v-model="formOrdenEditar.listaPersona" :items="directoriolista"
              item-title="persona" item-value="id" label="Persona a cargo" density="compact"
              placeholder="Seleccione la persona a cargo" multiple />
          </VCol>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="CerrarModalEditarOrden()">
          Cerrar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="ModificarOrden()">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalEditarPersona" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Editar Persona</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>      
            <VCol cols="12" md="10">
              <AppCombobox color="#b48d57" v-model="personaOrden" :items="directoriolista"
                item-title="persona" item-value="idPersona" label="Invitado" density="compact"
                placeholder="Seleccione al participante" />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="() => cancelarEdicionPersona()">
          Cerrar
        </VBtn>
        <VBtn  color="success" variant="elevated" @click="confirmarModificacionPersona()">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalEliminarOrdenPersona" max-width="500px">
    <VCard>
      <VCardTitle class="align-self-center">¿Deseas eliminar el participante?</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="cancelarEliminarOrdenPersona()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="eliminarOrdenPersona()">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="openRepresentante" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">"Agregar representante"</span>
      </VCardTitle>
      <VCardText>
        <!-- {{ dependenciaGuardar.nombre }} -->
        <VContainer>
          <VCol cols="12" md="12">
            <VTextField color="#b48d57" v-model="Representante" label="Representante" validate-on="input" />
          </VCol>
          <VCol cols="12" md="12">
            <VTextField color="#b48d57" v-model="Cargo" label="Cargo" validate-on="input" />
          </VCol>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="CerrarModalAgregarPparticipante()">
          Cerrar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="ModificarRowsParticipante()">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="openEliminar" max-width="500px">
    <VCard>
      <VCardTitle>¿Deseas eliminar el registro?</VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn color="error" variant="outlined" @click="CerrarEliminar()">
          Cancelar
        </VBtn>
        <VBtn color="success" variant="elevated" @click="eliminarRow()">
          Aceptar
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>




  <!-- ? Modal agregar Temas -->

  <VDialog v-model="open" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Agregar tema</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="refFormularioTema" @submit.prevent="() => {
          onSubmit();
        }
          ">
          <VRow>

            <VCol cols="12" md="12">
              <VTextField v-model="tema.nombre" label="Nombre del tema" validate-on="input"
                :rules="[requiredValidator]" />
            </VCol>


            <!-- <VCol cols="12" md="12">
              <VCheckbox v-model="tema.proceso" label="Proceso" validate-on="input" />
            </VCol> -->

            <VCol cols="12">
              <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" @click="CerrarModal">
                  Cerrar
                </VBtn>

                <VBtn color="success" type="submit"> Guardar </VBtn>
              </VCardActions>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>