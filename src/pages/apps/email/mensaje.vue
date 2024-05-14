<script>
import acontecimientosServices from "@/services/inbox/acontecimientos-services";
import tipoAcontecimientoServices from "@/services/inbox/tipo-acontecimiento-services";
import municipiosServices from "@/services/inbox/municipios-services";
import grupoServices from "@/services/inbox/grupos-enviar-services";
import historiaServices from "@/services/inbox/historias-services";
import acontecimientoImagen from "@/services/inbox/acontecimientoImagen-services";
import "@styles/style.css";
import { TimeScale } from "chart.js";
import { useRoute } from "vue-router";
import { requiredValidator } from "@/@core/utils/validators";
import { form } from "@/views/demos/components/dialog/demoCodeDialog";
import { useToast } from "vue-toastification";
import { ref, watchEffect } from "vue";

export default {
  name: "Mensaje",
  components: {},
  data() {
    return {
      fechaActual: new Date(),
      route: useRoute(),
      form: "",
      refFormulario: "",
      toast: useToast(),
      dateTimePickerDialog: false,
      selectedDateTime: null,
      Id: "id" in this.$route.params ? this.$route.params.id : undefined,
      Tipo: "tipo" in this.$route.params ? this.$route.params.tipo : undefined,
      Acontecimiento: localStorage.getItem('acontecimiento') ? JSON.parse(localStorage.getItem('acontecimiento')).acontecimiento : {
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
        ubicacionGoogle: "",
        validado: null,
        fechaAlt: "",
        actores: "",
        info_add_message: false,
        mensajeEnviado: false,
        idCategoria: 0,
      },

      tipoAcontecimiento: {
        color: "",
        descripcion: "",
        emojis: "",
        id: 0,
      },
      EstadoAcontecimiento: {
        nombre: "",
      },
      estadosAcontecimientos: [],
      btn_editar: false,
      modalOpen: false,
      idGrupoEnviar: "",
      GruposEnviar: [],
      contextoAutomatizado: "",
      Municipios: [],
      btnGuardar: false,
      historia: localStorage.getItem('acontecimiento') ? JSON.parse(localStorage.getItem('acontecimiento')).historia : [],
      urlImagenAzure: '',
      acontecimientosImg: [],
      urlImagenDb: '',
      imagenbase64: '',
      imagenDatos: {
        imagenFile: '',
        id: 0
      },
      actualizarImagen: false,
      AcontecimientosPorHistoria: [],
    };
  },
  methods: {

    async obtenerAcontecimientoImagen() {
      let resultado = await acontecimientoImagen.getAconImagenByid(this.Id).then((res) => {
          this.imagenDatos.id = res.data.id
          this.urlImagenDb = res.data.urlImg;
          acontecimientoImagen.getImagenUrl(this.urlImagenDb, Date.now()).then((res) => {
            this.urlImagenAzure = res;
          })
      })
    },

    async updateAcontecimientoImagen() {

      if (this.imagenDatos.id == 0) {
        let formData = new FormData();
        formData.append('ImagenFile', this.imagenDatos.imagenFile);
        formData.append('UrlImg', this.imagen);
        formData.append('IdAcontecimiento', this.Id)
        let result = await acontecimientoImagen.addImagenAcon(formData);
        if (result.data.success) {
          this.toast.success("Se agregó la imagen");
        } else {
          console.error(result);
        }
      } else {
        let formData = new FormData();
        formData.append('ImagenFile', this.imagenDatos.imagenFile);
        formData.append('UrlImg', this.urlImagenDb);
        formData.append('Id', this.imagenDatos.id)
        let result = await acontecimientoImagen.updateImagenAcon(formData);
        if (result.data.success) {
          this.toast.success("Se actualizo la imagen");
        } else {
          console.error(result);
        }
      }
    },

    async gruposEnviar() {
      let result = await grupoServices.listaGrupos().then((res) => {
        this.GruposEnviar = res.data;
      });
    },

    async ListaGrupos() {
      var res = await acontecimientosServices
        .listaGrupos()
        .then((data) => data.grupos);
      // this.Numeros = res;
      // this.Grupos = res;
    },

    async getHistorias() {
      let result = await historiaServices.HistoriaById(this.Acontecimiento.idHistoria);
      this.historia = result;
    },

    async getAcontecimiento() {
      let respuesta = await acontecimientosServices
        .AcontecimientoById(this.Id)
        .then((data) => data);
      if (respuesta.status == 200) {
        if (respuesta.data) {
          this.Acontecimiento = { ...respuesta.data };
        }
      }
    },

    async getTipoAcontecimiento() {
      let respuesta = await tipoAcontecimientoServices
        .TipoAcontecimientoById(this.Acontecimiento.idTipoAcontecimiento)
        .then((data) => data);
      if (respuesta.status == 200) {
        if (respuesta.data) {
          this.tipoAcontecimiento = { ...respuesta.data };
        }
      }
    },

    async EstadoAcontecimientoById() {
      var res = await acontecimientosServices
        .EstadoAcontecimientoById(this.Acontecimiento.idEstadoAcontecimiento)
        .then((data) => data);
      if (res.status == 200) {
        this.EstadoAcontecimiento = { ...res.data };
      }
    },

    async AcontecimientoByHistoria() {
      var res = await acontecimientosServices
        .AcontecimientoByHistoria(this.Acontecimiento.idHistoria)
        .then((data) => data);
      if (res.status == 200) {
        this.AcontecimientosPorHistoria = res.data.data;
      }
    },

    async ListaEstadosAcontecimientos() {
      var respuesta = await acontecimientosServices
        .listaEstadosAcontecimientos()
        .then((data) => data);

      if (respuesta.status == 200) {
        this.estadosAcontecimientos = [];
        let countAcontecimientos = this.AcontecimientosPorHistoria.length;

        / --------------------------------------------- */;
        if (this.Acontecimiento.idEstadoAcontecimiento == 1) {
          if (this.historia.idEstado == 1 && countAcontecimientos == 1) {
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
          if (this.historia.idEstado == 2) {
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
          if (this.historia.idEstado == 3) {
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

    async updateHistoria() {
      this.historia.idEstado = this.Acontecimiento.idEstadoAcontecimiento;

      let result = await historiaServices
        .updateHistoria(this.historia)
        .then((data) => data);;
      return result;
    },
    async updateAcontecimiento() {
      let response = await acontecimientosServices.updateDatosAcontecimiento(
        this.Acontecimiento
      );
      if (response.data.success) {
        this.toast.success("Mensaje guardado correctamente");
        localStorage.removeItem('acontecimiento');
        localStorage.removeItem('todosAcontecimientoIndex');
      } else {
        this.toast.success("Algo salio mal, intentelo nuevamente");
      }
    },

    _Redirect() {
      if (this.Tipo == 1) {
        setTimeout(() => {
          this.$router.push({
            name: "apps-email",
          });
        }, 2000);
      }
      if (this.Tipo == 2) {
        setTimeout(() => {
          this.$router.push({
            name: "apps-email-historia",
          });
        }, 2000);
      }
    },

    async enviarMensaje() {
      this.GruposEnviar.map(async (data) => {
        var res = await acontecimientosServices
          .enviarMensaje({
            telefono: data.ultramsgID,
            mensaje: `${this.tipoAcontecimiento.emojis} \n\n ${this.Acontecimiento.nombreMunicipio} \n\n${this.Acontecimiento.titulo
              }  \n\n${this.formattedFechaHora} \n\n${this.Acontecimiento.contexto
              } 
              
               ${this.Acontecimiento.info_add_message == true
                ? "\n\n" + this.Acontecimiento.info_add
                : ""
              }  \n\n${this.estadosAcontecimientos.find(
                (data) => data.id == this.Acontecimiento.idEstadoAcontecimiento
              ).nombre
              }`,
            imagen_url: this.urlImagenAzure
          })
          .then((data) => data);
        if (res) {
          this.toast.success("Mensaje enviado al grupo " + data.nombre);
        } else {
          this.toast.error(
            "Algo salio mal con el grupo " +
            data.nombre +
            ", intentelo nuevamente"
          );
        }
      });
      this._Redirect()
    },

    Guardar() {
      this.btnGuardar = true;
    },

    async validarForm() {
      let form = await this.$refs.form.validate();
      if (form.valid) {
        if (this.btnGuardar) {
          this.Acontecimiento.validado = true
          if (this.actualizarImagen) {
            await this.updateAcontecimientoImagen();
          }
          await this.updateAcontecimiento();
          await this.updateHistoria();
          // setTimeout(() => {
          //   this.$router.push({
          //     name: "apps-email",
          //   });
          // }, 2000);
          this._Redirect()
        } else {
          if (this.actualizarImagen) {
            await this.updateAcontecimientoImagen();
          }
          await this.gruposEnviar();
          this.Acontecimiento.validado = true
          this.Acontecimiento.mensajeEnviado = true;
          await this.updateAcontecimiento();
          await this.updateHistoria();
          this.enviarMensaje();

          // this.idGrupoEnviar = "";
          // this.modalOpen = true;
          // await this.updateAcontecimiento();
        }
        this.btnGuardar = false;
      } else {
        this.toast.error("Tiene campos vacios");
      }
    },

    // async onSubmit() {
    //   this.modalOpen = false;
    //   let form = await this.$refs.refFormulario.validate();
    //   if (form.valid) {
    //     // this.Acontecimiento.mensajeEnviado = true;
    //     // await this.updateAcontecimiento();

    //     // if (
    //     //   this.Acontecimiento.idHistoria != null &&
    //     //   this.Acontecimiento.idEstadoAcontecimiento == 3 &&
    //     //   this.contextoAutomatizado == ""
    //     // ) {
    //     //   var respuesta = await acontecimientosServices
    //     //     .getResumen({
    //     //       id_historia: this.Acontecimiento.idHistoria,
    //     //     })
    //     //     .then((data) => data);
    //     //   this.contextoAutomatizado = "";
    //     //   if (respuesta.status == 200) {
    //     //     this.contextoAutomatizado = respuesta.data.resumen;
    //     //   }
    //     // }

    //     this.enviarMensaje();
    //   }
    // },

    async getMunicipios() {
      var res = await municipiosServices.Municipios().then((data) => data.data);
      this.Municipios = res;
    },

    // cerrar() {
    //   this.idGrupoEnviar = "";
    //   this.modalOpen = false;
    // },

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

    editarInfo() {
      this.btn_editar = true;
    },

    obtenerImagen(e) {
      let file = '';
      file = e.target.files[0];
      this.imagenDatos.imagenFile = file;
      this.actualizarImagen = true
      this.cargarImagen(file);
    },
    cargarImagen(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.urlImagenAzure = e.target.result;
      }
      reader.readAsDataURL(file);
    },
  },

  computed: {
    formattedFechaHora() {
      return this.formatDateTimeForDisplay(
        new Date(this.Acontecimiento.fechaHora)
      );
    },
    urlImagenAzure() {
      return this.urlImagenAzure;
    }
  },

  async created() {
    console.log(this.Tipo);
    if (!localStorage.getItem('acontecimiento')) {
      await this.getAcontecimiento();
      await this.getHistorias();
    }
    // await this.getAcontecimiento();
    // await this.getHistorias();
    await this.obtenerAcontecimientoImagen();
    await this.getTipoAcontecimiento();
    await this.EstadoAcontecimientoById();
    await this.AcontecimientoByHistoria()
    await this.ListaEstadosAcontecimientos();
    await this.ListaGrupos();
    await this.getMunicipios();
    watchEffect(async () => {
      // if (this.Acontecimiento.idEstadoAcontecimiento == 3) {
      //   var respuesta = await acontecimientosServices
      //     .getResumen({
      //       id_historia: this.Acontecimiento.idHistoria,
      //     })
      //     .then((data) => data);
      //   this.contextoAutomatizado = "";
      //   console.log(respuesta);
      //   if (respuesta.status == 200) {
      //     this.contextoAutomatizado = respuesta.data.resumen;
      //   }
      // } else {
      //   this.contextoAutomatizado = "";
      // }
    });
  },
};
</script>

<template>
  <VForm ref="form" @submit.prevent="() => validarForm()">
    <VRow class="justify-content-md-center d-flex">
      <VCol cols="12" md="12">
        <VCard>
          <VCardItem>

            <div class="mb-5">
              <div v-if="Acontecimiento.idEstadoAcontecimiento == 3" class="text-justify">
                <label class="form-label font-weight-black">Resumen</label>
                <!-- <span v-if="!contextoAutomatizado"
                    >Espere mientras carga el resumen
                  </span>
                  <br v-if="!contextoAutomatizado" />
                  <VProgressCircular
                    v-if="!contextoAutomatizado"
                    indeterminate
                    color="primary"
                  /> -->

                {{ historia.resumen }}
              </div>
            </div>

            <div class="d-flex justify-space-between">
              <v-btn class="btn-color mb-3" v-model="btn_editar" @click="editarInfo">Editar información</v-btn>

              <!-- <v-btn
                v-if="btn_editar"
                class="btn-color mb-3"
                v-model="btn_editar"
                @click="() => (this.btn_editar = false)"
                >Cancelar</v-btn
              > -->
            </div>
            <div class="border pa-4 rounded">
              <div class="mb-2" cols="6" v-if="urlImagenAzure">
                <img :src="urlImagenAzure" alt="imagen acon" width="250" height="150" />
              </div>
              <!-- <div class="mb-3" v-if="btn_editar">
                <input type="file" accept="image/*" id="fileInput" ref="fileInput" @change="obtenerImagen" />
              </div> -->

              <div>
                {{ tipoAcontecimiento.emojis }}
              </div>
              <div class="mt-3">
                <div v-if="!btn_editar">
                  <label class="form-label" for="">Municipio</label>
                  {{ Acontecimiento.nombreMunicipio }}
                </div>
                <VSelect v-if="btn_editar" placeholder="Selecione municipio " label="Municipio"
                  v-model="Acontecimiento.nombreMunicipio" :items="Municipios" item-title="nombre" item-value="nombre" />
                <br />
                <div v-if="!btn_editar || (btn_editar && Acontecimiento.idEstadoAcontecimiento !== 1)">
                  <label class="form-label" for="">Titulo</label>
                  {{ Acontecimiento.titulo }}
                </div>
                <VTextField v-if="btn_editar && Acontecimiento.idEstadoAcontecimiento == 1" label="Titulo"
                  v-model="Acontecimiento.titulo" validate-on="input" :rules="[requiredValidator]" />

                <br />
                <!-- <p> -->
                <div v-if="!btn_editar">
                  <label class="form-label" for="">Fecha</label>
                  {{ formattedFechaHora }}
                </div>
                <v-text-field v-if="btn_editar" label="Fecha y hora" v-model="formattedFechaHora"
                  placeholder="Seleccione una fecha y una hora" outlined @click="showDateTimePicker" />
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
                <!-- </p> -->
                <br />
                <div v-if="!btn_editar">
                  <label class="form-label text-justify">Contenido</label>
                  {{ Acontecimiento.contexto }}
                </div>
                <VTextarea class="text-justify" v-if="btn_editar" label="Contenido" v-model="Acontecimiento.contexto"
                  validate-on="input" :rules="[requiredValidator]" />
                <br />



                <div v-if="!btn_editar && Acontecimiento.info_add_message">
                  <br />
                  <label class="form-label text-justify">Informacion Adicional</label>
                  {{ Acontecimiento.info_add }}
                </div>
                <p v-if="Acontecimiento.info_add_message && btn_editar == true">
                  <br />
                  <VTextarea class="text-justify" label="Información adicional" v-model="Acontecimiento.info_add"
                    validate-on="input" :rules="[requiredValidator]" />
                </p>
                <br />
                <!-- <p></p> -->
                <div v-if="!btn_editar">
                  <label class="form-label">Estado acontecimiento</label>
                  {{ EstadoAcontecimiento.nombre }}
                </div>
                <VSelect v-if="btn_editar" label="Estado acontecimiento" class="text-justify"
                  placeholder="Selecione un estado" :items="estadosAcontecimientos" item-title="nombre" item-value="id"
                  v-model="Acontecimiento.idEstadoAcontecimiento" />
                <br />
                <!-- <p class="mt-5">ISP DGISP</p> -->
              </div>
            </div>
            <div class="text-center btn-enviar">
              <VBtn type="submit" class="btn-color mt-3 mr-5" @click="Guardar()">
                Guardar
              </VBtn>
              <VBtn type="submit" class="btn-color mt-3"> Enviar mensaje </VBtn>
            </div>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
  </VForm>
  <a onclick="history.back()" class="btn-flotante">
    <VIcon icon="tabler-arrow-narrow-left" />
  </a>

  <!-- <VDialog v-model="modalOpen" max-width="650px">
    <VCard>
      <VCardTitle> Seleccione a que grupo desea enviar el mensaje </VCardTitle>

      <VForm
        ref="refFormulario"
        @submit.prevent="
          () => {
            onSubmit();
          }
        "
      >
        <VRow class="mt-5 mb-5 ml-3 mr-3">
          <VCol cols="12" md="12">
            <VSelect
              label="Grupos"
              placeholder="Selecione un tipo"
              :items="GruposEnviar"
              item-title="nombre"
              item-value="ultramsgID"
              v-model="idGrupoEnviar"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol cols="12">
            <VCardActions>
              <VSpacer />
              <VBtn color="error" variant="outlined" @click="cerrar">
                Cerrar
              </VBtn>

              <VBtn color="success" type="submit"> Enviar </VBtn>
            </VCardActions>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </VDialog> -->
</template>

<style>
.btn-enviar {
  display: flex;
  justify-content: end;
}

.form-label {
  display: block;
  margin-bottom: 5px;
}
</style>
