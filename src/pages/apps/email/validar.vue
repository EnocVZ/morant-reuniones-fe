<script>
import acontecimientoServices from "@/services/inbox/acontecimientos-services";
import historiaServices from "@/services/inbox/historias-services";
import grupoServices from "@/services/inbox/grupos-services";
import categoriaServices from "@/services/inbox/categoria-services";
import municipiosServices from "@/services/inbox/municipios-services";
import tipoServices from "@/services/inbox/tipo-acontecimiento-services.js";
import imagenServices from "@/services/inbox/acontecimientoImagen-services";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
import "@styles/style.css";
import { requiredValidator } from "@/@core/utils/validators";
import { form } from "@/views/demos/components/dialog/demoCodeDialog";
import { useToast } from "vue-toastification";
import Mapaview from "@/pages/apps/email/mapa.vue";
import TiptapEditor from "@/@core/components/TiptapEditor.vue";
import directorioactoresService from "@/services/DirectorioActores/directorioactores-service";

export default {
  name: "Revisar",
  components: { Mapaview, TiptapEditor },
  data() {
    return {
      toast: useToast(),
      form: "",
      route: useRoute(),
      Id: "id" in this.$route.params ? this.$route.params.id : undefined,
      Tipo: "tipo" in this.$route.params ? this.$route.params.tipo : undefined,
      Acontecimiento: {
        activo: null,
        contexto: "",
        cosine_similarity: null,
        fechaHora: "",
        id: 0,
        idEstadoAcontecimiento: 0,
        idGrupo: 0,
        info_add: "",
        idHistoria: 0,
        idTipoAcontecimiento: 0,
        latitud: "",
        leido: null,
        longitud: "",
        mensajeOriginal: "",
        nombreMunicipio: "",
        numeroInformante: "",
        titulo: "",
        ubicacion: "",
        cantidadPersonas: 0,
        ubicacionGoogle: "",
        validado: null,
        actores: "",
        fechaAlt: "",
        info_add_message: false,
        mensajeEnviado: false,
        idCategoria: null,
        listaActores: [],
      },
      GruposBase: [],
      tipoAcontecimiento: [],
      estadosAcontecimientos: [],

      Grupos: [],
      // idGrupo: "",
      contextoAutomatizado: "",
      modal: false,
      dateTimePickerDialog: false,
      selectedDateTime: null,
      Municipios: [],
      Historia: {
        idHistoria: 0,
        titulo: "",
        idEstado: 0,
        resumen: "",
        fechaAlt: "",
      },
      Categorias: [],
      AcontecimientosPorHistoria: [],
      actualizarHistoria: false,
      spiner: true,
      imagenDatos: {
        imagenFile: "",
        urlImagen: "",
        idAcontecimiento: 0,
      },
      loadImagen: "",
      urlImagenDb: "",
      existeImagen: false,
      fileData: ref([]),
      DirectorioActores: [],

      ///Variables directorio actores
      actorDefault: {
        id: 0,
        nombre: "",
        apellidoP: "",
        apellidoM: "",
        dependencia: "",
        cargo: "",
      },
      actor: {
        id: 0,
        nombre: "",
        apellidoP: "",
        apellidoM: "",
        dependencia: "",
        cargo: "",
      },
      open: false,
      refFormulario: "",
    };
  },
  methods: {
    async _Actores() {
      let result = await directorioactoresService.Actores().then((res) => {
        this.DirectorioActores = res.data;
        // console.log(res.data);
      });
    },

    async obtenerAcontecimientoImagenporId() {
      try {
        let resultado = await imagenServices.getAconImagenByid(this.Id).then((res) => {
          console.log(res)
          if (res?.data) {
            this.urlImagenDb = res.data.urlImg;
            this.imagenDatos.idAcontecimiento = res.data.id
            imagenServices.getImagenUrl(this.urlImagenDb, Date.now()).then((result) => {
              this.loadImagen = result;
              this.existeImagen = true;
            })
          }
        })

      } catch (error) {
        console.log(error);
      }

    },

    async _ActoresAcontecimiento(id) {
      try {
        let res = await acontecimientoServices
          .ActoresAcontecimiento(id)
          .then((data) => data);
        if (res?.data) {
          this.Acontecimiento.listaActores = res?.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getResumen() {
      if (
        this.Acontecimiento.idHistoria != null &&
        this.Acontecimiento.idEstadoAcontecimiento == 3
      ) {
        var respuesta = await acontecimientoServices
          .getResumen({
            id_historia: this.Acontecimiento.idHistoria,
          })
          .then((data) => data);
        // this.contextoAutomatizado = "";
        if (respuesta.status == 200) {
          this.Historia.resumen = respuesta.data.resumen;
          this.spiner = false;
        }
      }
    },

    async getMunicipios() {
      var res = await municipiosServices.Municipios().then((data) => data.data);
      this.Municipios = res;
    },

    async getCategorias() {
      var res = await categoriaServices
        .listaCategoria()
        .then((data) => data.data);
      this.Categorias = res;
    },

    async AcontecimientoByHistoria() {
      var res = await acontecimientoServices
        .AcontecimientoByHistoria(this.Acontecimiento.idHistoria)
        .then((data) => data);
      if (res.status == 200) {
        this.AcontecimientosPorHistoria = res.data.data;
      }
    },

    async AcontecimientoById() {
      var res = await acontecimientoServices
        .AcontecimientoById(this.Id)
        .then((data) => data);
      if (res.status == 200) {
        this.Acontecimiento = { ...res.data };
      }
    },
    async ListaGrupos() {
      // var res = await acontecimientoServices
      //   .listaGrupos()
      //   .then((data) => data.grupos);
      // this.Grupos = res;
      // console.log(res);

      var respuesta = await grupoServices
        .listaGrupos()
        .then((data) => data.data);
      this.GruposBase = respuesta;

      // let id = this.GruposBase.find(
      //   (item) => item.id == this.Acontecimiento.idGrupo
      // );
      // this.idGrupo = id.ultramsgID;
    },

    async getHistoria() {
      let res = await historiaServices
        .HistoriaById(this.Acontecimiento.idHistoria)
        .then((data) => data);
      this.Historia = res;
    },

    async ListaEstadosAcontecimientos() {
      var respuesta = await acontecimientoServices
        .listaEstadosAcontecimientos()
        .then((data) => data);
      if (respuesta.status == 200) {
        this.estadosAcontecimientos = [];

        // let countAcontecimientos = this.AcontecimientosPorHistoria.filter(
        //   (data) => data.id != this.Acontecimiento.id
        // ).length;
        let countAcontecimientos = this.AcontecimientosPorHistoria.length;

        / --------------------------------------------- */;
        if (this.Acontecimiento.idEstadoAcontecimiento == 1) {
          if (this.Historia.idEstado == 1 && countAcontecimientos == 1) {
            respuesta.data.data.map((data) => {
              // if (countAcontecimientos == 1) {
              if (data.id != 2) {
                this.actualizarHistoria = true;
                this.estadosAcontecimientos.push(data);
              }
            });
          } else {
            respuesta.data.data.map((data) => {
              if (data.id == 1) {
                this.estadosAcontecimientos.push(data);
              }
            });
          }
        }

        / --------------------------------------------- */;
        if (this.Acontecimiento.idEstadoAcontecimiento == 2) {
          if (this.Historia.idEstado == 2) {
            respuesta.data.data.map((data) => {
              if (data.id != 1) {
                this.estadosAcontecimientos.push(data);
                this.actualizarHistoria = true;
              }
            });
          } else {
            respuesta.data.data.map((data) => {
              if (data.id == 2) {
                this.estadosAcontecimientos.push(data);
              }
            });
          }
        }

        / --------------------------------------------- */;
        if (this.Acontecimiento.idEstadoAcontecimiento == 3) {
          if (this.Historia.idEstado == 3) {
            respuesta.data.data.map((data) => {
              if (countAcontecimientos == 1) {
                this.actualizarHistoria = true;
                if (data.id != 2) {
                  this.estadosAcontecimientos.push(data);
                }
              }
              if (countAcontecimientos > 1) {
                this.actualizarHistoria = true;
                if (data.id != 1) {
                  this.estadosAcontecimientos.push(data);
                }
              }
            });
          } else {
            respuesta.data.data.map((data) => {
              if (data.id == 3) {
                this.estadosAcontecimientos.push(data);
              }
            });
          }
        }
      }
    },

    async ListaTipo() {
      var res = await tipoServices.listaTipoAcon().then((data) => data.data);
      this.tipoAcontecimiento = res.map((data) => {
        data.descripcion = data.emojis + " " + data.descripcion;
        return data;
      });
    },

    async updateHistoria() {
      let respuesta = await historiaServices
        .updateHistoria(this.Historia)
        .then((data) => data);
      return respuesta;
    },

    async UpdateDatos() {
      // let res = await acontecimientoServices
      //   .updateDatosAcontecimiento(this.Acontecimiento)
      //   .then((res) => res);
      // if (res.data.success) {
      //   if (this.actualizarHistoria == true) {
      //     this.Historia.idEstado = this.Acontecimiento.idEstadoAcontecimiento;
      //     let respuesta = await this.updateHistoria();
      //   }
      //   this.toast.success("Mensaje validado correctamente.");
      //   // setTimeout(() => {
      //   this.$router.push({
      //     name: "apps/email/mensaje",
      //     params: { id: this.Acontecimiento.id },
      //   });
      //   // }, 2000);
      // }
      // this.toast.success("Mensaje validado correctamente.");
      // setTimeout(() => {
      this.$router.push({
        name: "apps/email/mensaje",
        params: { id: this.Acontecimiento.id, tipo: this.Tipo },
      });
    },

    async updateImagenAcon() {
      let formData = new FormData();
      formData.append('ImagenFile', this.imagenDatos.imagenFile);
      formData.append('UrlImg', this.urlImagenDb);
      formData.append('Id', this.imagenDatos.idAcontecimiento)
      let result = await imagenServices.updateImagenAcon(formData);
      if (result.data.success) {
        this.toast.success("Se actualizo la imagen");
      } else {
        console.error(result);
      }
    },

    async validarForm() {
      let form = await this.$refs.form.validate();
      if (form.valid) {
        if (this.actualizarHistoria == true) {
          this.Historia.idEstado = this.Acontecimiento.idEstadoAcontecimiento;
        }
        if (
          this.Acontecimiento.idEstadoAcontecimiento != 3 &&
          this.Historia.idEstado != 3
        ) {
          this.Historia.resumen = "";
        }
        if (!this.Acontecimiento.cantidadPersona) {
          this.Acontecimiento.cantidadPersonas = 0;
        }

        // this.Acontecimiento.validado = true;
        if (this.Tipo == 2) {
          this.Acontecimiento.editado = true
        }
        // Guarda los datos  local
        localStorage.setItem(
          "acontecimiento",
          JSON.stringify({
            acontecimiento: this.Acontecimiento,
            historia: this.Historia,
          })
        );


        if (this.existeImagen && this.imagenDatos.imagenFile !== "") {
          await this.updateImagenAcon();
        } else {
          if (this.imagenDatos.imagenFile !== "") {
            let formData = new FormData();
            formData.append("ImagenFile", this.imagenDatos.imagenFile);
            formData.append("UrlImg", this.imagenDatos.imagen);
            formData.append(
              "IdAcontecimiento",
              this.Id
            );
            let result = await imagenServices.addImagenAcon(formData);
            if (result.data.success) {
              this.toast.success("Se agregó la imagen");
            } else {
              console.error(result);
            }
          }
        }

        // this.modal = true;
        await this.UpdateDatos();
        // this.Guardar();
      }
    },
    Cambiar(valor) {
      return valor ? "Si" : "No";
    },

    /************************SCRIPT PARA EDITAR LA HORA DEL ACONTECIMIENTO *******************/
    showDateTimePicker() {
      this.dateTimePickerDialog = true;
    },

    closeDateTimePickerDialog() {
      this.dateTimePickerDialog = false;
    },

    handleDateTimeSelection() {
      // Verificar si this.selectedDateTime es una cadena y convertirlo a una instancia de Date
      const selectedDate =
        typeof this.selectedDateTime === "string"
          ? new Date(this.selectedDateTime)
          : this.selectedDateTime;
      // Formatear la fecha seleccionada solo para la base de datos
      const formattedDateTimeForDB = this.formatDateTimeForDB(selectedDate);
      // Asignar la fecha formateada para la base de datos
      this.Acontecimiento.fechaHora = formattedDateTimeForDB;

      // Mantener la fecha formateada para mostrarla en el campo de texto
      this.formattedFechaHora = this.formatDateTimeForDisplay(selectedDate);

      // Cerrar el diálogo después de la selección
      this.dateTimePickerDialog = false;
    },
    formatDateTimeForDB(dateTime) {
      const year = dateTime.getFullYear();
      const month = this.padZero(dateTime.getMonth() + 1);
      const day = this.padZero(dateTime.getDate());
      const hours = this.padZero(dateTime.getHours());
      const minutes = this.padZero(dateTime.getMinutes());
      const seconds = this.padZero(dateTime.getSeconds());

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },
    formatDateTimeForDisplay(dateTime) {
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return dateTime.toLocaleDateString("es-ES", options);
    },

    padZero(value) {
      return value < 10 ? `0${value}` : value;
    },

    obtenerImagen(e) {
      let file = "";
      file = e.target.files[0];
      this.imagenDatos.imagenFile = file;
      this.cargarImagen(file);
    },
    cargarImagen(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.loadImagen = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    botonAtras() {
      if (this.Tipo == 1) {
        this.$router.push({ name: "email", params: { id: this.Id } });
      }
      if (this.Tipo == 2) {
        this.$router.go(-1);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    //Apartado de directorio actores ----------------------

    OpenAgregar() {
      this.actor = { ...this.actorDefault };
      console.log(this.actor);
      this.open = true;
    },

    CerrarModal() {
      this.actor = { ...this.actorDefault };
      this.open = false;
    },

    async Guardar() {
      console.log(this.actor);

      let result = await directorioactoresService.addActor(this.actor);

      if (result?.data) {
        this.toast.success(result?.data?.message);
        this.open = false;
        await this._Actores();
        // await this.listaInformanteV2(1);
      } else {
        this.toast.error(result.response.data.message);
        this.open = false;
        console.log(result);
      }
    },

    async onSubmit() {
      let form = await this.$refs.refFormulario.validate();
      if (form.valid) {
        this.Guardar();
      }
    },
  },

  computed: {
    formattedFechaHora() {
      return this.formatDateTimeForDisplay(
        new Date(this.Acontecimiento.fechaHora)
      );
    },
    loadImagen() {
      return this.loadImagen;
    },
  },

  /************************TERMINA SCRIPT PARA EDITAR LA HORA DEL ACONTECIMIENTO *******************/

  async created() {
    await this.AcontecimientoById();
    await this.getHistoria();
    // console.log(this.Historia.idEstado);
    // console.log(this.Acontecimiento.idEstadoAcontecimiento);
    await this.AcontecimientoByHistoria();
    await this.ListaEstadosAcontecimientos();
    await this.getCategorias();
    // await this.getMunicipios();
    // await this.AcontecimientoById();
    await this.ListaGrupos();
    await this.ListaTipo();
    await this._Actores();
    await this.obtenerAcontecimientoImagenporId();
    if (this.Acontecimiento?.id) {
      await this._ActoresAcontecimiento(this.Acontecimiento.id);
    }

    watchEffect(async () => {
      // console.log(this.Acontecimiento.listaActores, "###");
      if (this.Acontecimiento.idCategoria == 0) {
        this.Acontecimiento.idCategoria = "";
      }
      if (
        this.Acontecimiento.idEstadoAcontecimiento == 3 &&
        !this.Historia.resumen
      ) {
        this.getResumen();
      }

      // if (this.contextoAutomatizado != "") {
      //   this.Historia.resumen = this.contextoAutomatizado;
      // }

      if (this.Acontecimiento.idEstadoAcontecimiento !== 3) {
        this.spiner = true;
        this.contextoAutomatizado = "";
      }
    });
  },
};
</script>

<template>
  <div>
    <VRow style="margin: 0;">
      <VCol cols="12" md="7" class="titulo_altura">
        <div class="d-flex">
          <VIcon color="primary" class="tabler-brand-whatsapp ma-3" size="40" />
          <Vp class="">
            <h2><b> Informes WhatsApp</b></h2>
            <h3>Editor de mensajes</h3>
          </Vp>
        </div>
      </VCol>
      <VCol cols="12" md="12">
        <VForm ref="form" @submit.prevent="() => validarForm()">
          <VRow>
            <VCol cols="12" md="12">
              <VCard>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6" lg="6">
                      <VTextField label="Título" v-model="Acontecimiento.titulo" prepend-icon="tabler-file-typography"
                        auto-grow validate-on="input" :rules="[requiredValidator]" single-line
                        :readonly="Acontecimiento.idEstadoAcontecimiento !== 1" />
                    </VCol>

                    <VCol cols="12" md="6" lg="6">
                      <VSelect label="Grupos" :items="GruposBase" item-title="nombre" item-value="id"
                        v-model="Acontecimiento.idGrupo" placeholder="Selecionar Grupos"
                        prepend-icon="tabler-users-group" readonly />
                    </VCol>
                    <VCol cols="12" md="6" lg="6">
                      <VSelect label="Tipo de mensaje" placeholder="Selecione un tipo" :items="tipoAcontecimiento"
                        item-title="descripcion" item-value="id" v-model="Acontecimiento.idTipoAcontecimiento"
                        prepend-icon="tabler-alert-triangle" @click="ListaTipo()" />
                    </VCol>
                    <VCol cols="12" md="6" lg="6">
                      <VSelect placeholder="Selecione municipio " label="Municipio" prepend-icon="tabler-tag"
                        v-model="Acontecimiento.nombreMunicipio" :items="Municipios" item-title="nombre"
                        item-value="nombre" @click="getMunicipios()" />
                    </VCol>
                    <VCol cols="12" md="6" lg="6">
                      <v-text-field label="Fecha y hora" v-model="formattedFechaHora"
                        placeholder="Seleccione una fecha y una hora" prepend-icon="tabler-calendar-time" outlined
                        @click="showDateTimePicker" />
                      <v-dialog v-model="dateTimePickerDialog" persistent style="max-width: 350px; top: -55px">
                        <DialogCloseBtn @click="dateTimePickerDialog = !dateTimePickerDialog" />
                        <v-card>
                          <v-card-title>
                            <span class="headline">Selecciona una fecha y hora</span>
                          </v-card-title>
                          <v-card-text>
                            <AppDateTimePicker :config="{
          enableTime: true,
          dateFormat: 'Y-m-d H:i',
        }" v-model="selectedDateTime" placeholder="Seleccione una fecha y una hora" />
                          </v-card-text>
                          <v-card-actions>
                            <v-btn class="mr-0" @click="handleDateTimeSelection">Aceptar</v-btn>
                            <v-btn class="ml-auto" @click="closeDateTimePickerDialog">Cancelar</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </VCol>

                    <VCol cols="12" md="6" lg="6" class="pb-0">
                      <label class="ml-9 text-caption">Sugerencia de actores</label>
                      <div class="d-flex">
                        <VIcon class="tabler-list-letters mt-2"></VIcon>
                        <p class="px-2 py-1 ms-2 text-justify mb-0">
                          {{ Acontecimiento.actores }}
                        </p>
                      </div>

                      <!-- <VTextField label="Sugerencia de actores" v-model="Acontecimiento.actores"
                      prepend-icon="tabler-file-typography" validate-on="input" class="mb-3" readonly /> -->
                    </VCol>
                    <!-- <VCol cols="12" md="6" lg="6">
                  </VCol>

                  <VCol cols="12" md="6" lg="6">
                    <VTextField label="Sugerencia de actores" v-model="Acontecimiento.actores"
                      prepend-icon="tabler-file-typography" validate-on="input" class="mb-3" readonly />

                    <VRow>
                      <VCol cols="11">
                        <VSelect label="Actores" :items="DirectorioActores" item-title="nombreCompleto" item-value="id"
                          v-model="Acontecimiento.listaActores" placeholder="Selecionar actores" multiple
                          prepend-icon="tabler-users-group" />
                      </VCol>
                      <VCol cols="1" class="px-0">
                        <VBtn color="cafe" @click="OpenAgregar" size="35" rounded="pill">
                          <VIcon class="tabler-plus" size="27" />
                        </VBtn>
                      </VCol>
                    </VRow>
                  </VCol> -->
                    <!-- resumen  -->
                    <VCol cols="12" md="12" lg="12">
                      <label for="">
                        <VIcon class="tabler-analyze" />
                        {{
          Acontecimiento.idEstadoAcontecimiento !== 3
            ? "Resumen no disponible"
            : "Resumen"
        }}
                      </label>
                      <!-- <VProgressCircular v-if="Acontecimiento.idEstadoAcontecimiento == 3 &&
                      spiner == true" 
                      :size="50" color="primary" indeterminate class="spiner" /> -->
                      <VCol v-if="Acontecimiento.idEstadoAcontecimiento == 3 &&
          spiner == true &&
          !Historia.resumen
          " class="positionAbsolute" cols="12" md="12" lg="12">
                        <div class="skeleton-contenedor datagrid__row">
                          <div class="animacion-skeleton datagrid__row" style="width: 96%; background-color: #ddddddf8">
                          </div>
                          <div class="animacion-skeleton datagrid__row delay2" style="width: 94%"></div>
                          <div class="animacion-skeleton datagrid__row delay3" style="width: 97%"></div>
                          <div class="animacion-skeleton datagrid__row delay4" style="width: 94%"></div>
                          <div class="animacion-skeleton datagrid__row delay5" style="width: 96%"></div>
                        </div>
                      </VCol>
                      <VTextarea v-model="Historia.resumen" class="border rounded mt-4 " style="text-align: justify;"
                        validate-on="input" placeholder="" readonly="true" auto-grow />
                    </VCol>

                    <!-- ////////////////////////////// -->
                    <VCol cols="12" md="8">
                      <VRow>
                        <VCol cols="12">
                          <VTextField label="Dirección" validate-on="input" v-model="Acontecimiento.ubicacion"
                            placeholder="Escriba su dirección" prepend-icon="tabler-map-pin"
                            :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="12">
                          <VSelect v-if="Tipo == 1" label="Estado acontecimiento" placeholder="Selecione un estado"
                            :items="estadosAcontecimientos" item-title="nombre" item-value="id"
                            v-model="Acontecimiento.idEstadoAcontecimiento" prepend-icon="tabler-alert-triangle" />

                          <VSelect v-else label="Estado acontecimiento" placeholder="Selecione un estado"
                            :items="estadosAcontecimientos" item-title="nombre" item-value="id"
                            v-model="Acontecimiento.idEstadoAcontecimiento" prepend-icon="tabler-alert-triangle"
                            readonly />
                        </VCol>
                        <VCol cols="6">
                          <VSelect label="Tema" placeholder="Selecione un tema" :items="Categorias" item-title="nombre"
                            item-value="id" v-model="Acontecimiento.idCategoria" prepend-icon="tabler-note"
                            @click="getCategorias()" :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="6">
                          <VTextField label="Cantidad de personas" validate-on="input"
                            v-model="Acontecimiento.cantidadPersonas" placeholder="Cantidad de personas"
                            prepend-icon="tabler-user" />
                        </VCol>
                      </VRow>
                    </VCol>
                    <VCol cols="12" md="4">
                      <Mapaview :Acontecimiento="Acontecimiento" />
                    </VCol>

                    <VCol cols="12">
                      <label for="">
                        <VIcon class="tabler-mail" /> Contenido
                      </label>
                      <TiptapEditor v-model="Acontecimiento.contexto" class="border rounded text-justify"
                        validate-on="input" placeholder="Escriba su contenido" prepend-icon="tabler-mail"
                        :rules="[requiredValidator]" />
                    </VCol>
                    <VCol cols="12">
                      <label for="">
                        <VIcon icon="tabler-info-circle" /> Información Adicional
                      </label>
                      <VTextarea class="text-justify" v-model="Acontecimiento.info_add" auto-grow validate-on="input"
                        placeholder="Escriba su información adicional" />
                    </VCol>
                    <VCol cols="12">
                      <div style="align-items: center">
                        <div class="">Agregar al mensaje:</div>
                        <div class="d-flex align-end">
                          <VCheckbox v-model="Acontecimiento.info_add_message"
                            :label="Cambiar(Acontecimiento.info_add_message)" />
                        </div>
                      </div>
                    </VCol>
                    <div class=" w-100 d-flex justify-center">
                      <VCol cols="6">
                        <div class="flex">
                          <div class="w-full h-auto relative">
                            <div class="cursor-pointer mb-5">
                              <div
                                class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone">
                                <IconBtn for="fileInput" variant="tonal" class="rounded-sm" @click="triggerFileInput">
                                  <VIcon for="fileInput" icon="tabler-upload" />
                                </IconBtn>
                                <input type="file" accept="image/*" id="fileInput" ref="fileInput"
                                  @change="obtenerImagen" style="display: none;" />
                                <div class="text-base text-high-emphasis font-weight-medium">

                                  Haga clic para agregar una imagen

                                </div>
                                <VImg class="image-left" :src="loadImagen"
                                  src="../../../assets/images/logos/1Recurso 2.png" alt="Imagen" width="250" height="80"
                                  v-if="loadImagen" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </VCol>
                    </div>

                    <VCol cols="12">
                      <div class="d-flex justify-end mx-8">
                        <VBtn type="submit" class="btn-color w-25" :disabled="Acontecimiento.idEstadoAcontecimiento == 3 &&
          spiner == true &&
          !Historia.resumen
          ">
                          Guardar
                          <VIcon end icon="tabler-checkbox" />
                        </VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VForm>
      </VCol>
    </VRow>
  </div>

  <a @click="botonAtras()" class="btn-flotante">
    <VIcon icon="tabler-arrow-narrow-left" />
  </a>

  <!-- <VDialog v-model="modal" max-width="650px">
    <VCard>
      <VCardTitle>
        ¿Esta seguro de guardar, una vez guardado no podrá volver a esta vista?
      </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="() => (modal = false)">
          Cancelar
        </VBtn>

        <VBtn
          color="success"
          variant="elevated"
          @click="async () => ((this.modal = false), await this.UpdateDatos())"
        >
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog> -->

  <VDialog v-model="open" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">Agregar actor</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="refFormulario" @submit.prevent="() => {
          onSubmit();
        }
          ">
          <VRow>
            <VCol cols="12" md="12">
              <VTextField v-model="actor.nombre" label="Nombre (s)" validate-on="input" :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField v-model="actor.apellidoP" label="Apellido paterno" validate-on="input"
                :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField v-model="actor.apellidoM" label="Apellido materno" validate-on="input"
                :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField v-model="actor.dependencia" label="Dependencia" validate-on="input"
                :rules="[requiredValidator]" />
            </VCol>

            <!-- <VCol cols="12" md="12">
                            <VTextField v-model="informanteDatos.numeroTelefono" label="Telefono" validate-on="input"
                                :rules="[
                                    requiredValidator,
                                    lengthValidator(informanteDatos.numeroTelefono, 10),
                                    integerValidator,
                                ]" />
                        </VCol> -->
            <VCol cols="12" md="12">
              <VTextField v-model="actor.cargo" label="Cargo" validate-on="input" :rules="[requiredValidator]" />
            </VCol>

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

<style scoped>
/* margin top del boton GUARDAR */
.margin-gur {
  justify-content: end;
  display: flex;
  padding-right: 100;
}

.margin-top {
  margin-top: 5px;
}

.titulo_altura {
  padding: 3px 0;
}

.vrow-flex {
  display: flex;
  justify-content: space-between;
  /* margin-top: 5px; */
}

.vrow-flex-end {
  display: flex;
  justify-content: flex-end;
  padding-right: 75px;
  /* background-color: rgba(0, 0, 255, 0.416); */
}

.item-gap {
  margin-bottom: 10px;
}

.item-gap2 {
  margin-bottom: 0px;
}

.map-align {
  /* background-color: red; */
  justify-content: flex-end;
  padding-bottom: 0;
}

.modal-mapa {
  padding-top: 0;
}

.padreItem {
  position: relative;
  /* background-color: red; */
}

/* .item::before {
  content: " ";
  border-left: 2px solid rgba(165, 164, 164, 0.473);
  position: absolute;
  left: 23px;
  top: 50px;
  height: 55px;
}

.item2::before {
  content: " ";
  border-left: 2px solid rgba(165, 164, 164, 0.473);
  position: absolute;
  left: 22px;
  top: 45px;
  height: 100px;
}

.item2_01::before {
  content: " ";
  border-left: 2px solid rgba(165, 164, 164, 0.473);
  position: absolute;
  left: 22px;
  top: 45px;
  height: 80px;
}

.item3::before {
  content: " ";
  border-left: 2px solid rgba(165, 164, 164, 0.473);
  position: absolute;
  left: 46px;
  top: 80px;
  height: 195px;
} */

/* Esta propiedad es la clase de la etiqueta VCardItem */
.v-card-item {
  height: 650px;
  margin-top: 0;
  /* padding-top: 0; */
}

.spiner {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.positionAbsolute {
  position: absolute;
  top: 19%;
  left: 0%;

  width: 98%;
  margin-left: 15px;
}

.skeleton-contenedor {
  height: 200px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.animacion-skeleton {
  /* width: 95%; */
  height: 10px;
  margin-top: 5px;
  margin-left: 15px;
  border-radius: 5px;
  /* animation: pulse-bg 2s infinite; */
}

.datagrid__row {
  animation: aniVertical 3s ease;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  opacity: 0;
  /* background-color: #ddddddf8; */
}

.delay2 {
  background-color: #ddddddf8;
  animation-delay: 0.25s;
}

.delay3 {
  background-color: #ddddddf8;
  animation-delay: 0.5s;
}

.delay4 {
  background-color: #ddddddf8;
  animation-delay: 0.75s;
}

.delay5 {
  background-color: #ddddddf8;
  animation-delay: 1s;
}

@keyframes pulse-bg {
  0% {
    background-color: #ddddddef;
  }

  50% {
    background-color: #d0d0d0ee;
  }

  100% {
    background-color: #ddddddf8;
  }
}

@keyframes aniVertical {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
