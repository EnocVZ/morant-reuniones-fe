<script>
import reunionService from "@/services/reuniones-service";
import documentoMinutaService from "@/services/documento-minuta-service";
import { useReunionesStore } from "@/stores/reuniones";
import { mapActions, mapState } from "pinia";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VCardActions } from "vuetify/lib/components/index.mjs";

export default {
  components: {
    VDataTable,
    VCardActions,
  },
  data() {
    return {
      toast: useToast(),
      search: "",
      page: 1,
      itemsPerPage: 12,
      hasMoreItems: true,
      loading: false,
      totalConsultas: 0,
      isDialogVisible: false,
      ListaReuniones: [],
      ListaMinutas: [],
      fromMinutas: {
        idMinuta: 0,
        idReunion: undefined,
        folio: "",
        fecha: "",
        hora: "",
        resumen: "",
        observacione: "",
        idActorResponsable: "",
        idActorSupervisor: "",
        rqActa: false,
      },
      formRequestReunion: {
        idReunion: 0,
        titulo: "",
        fecha: "",
        hora: "",
        tema: "",
        rqActa: false,
        idLugar: null,
        idModalidad: 1,
        idEstatus: 0,
        idReunionVinculada: null,
        listaOrden: [],
        listaParticipantes: [],
      },
      formMinuta: {
        idReunion: 0,
      },
      frmMinutas: "",
      SelectReunion: [],
      dependencia: [],
      evidencias: [], // Lista de archivos subidos
      evidenciasHeaders: [
        { title: "Nombre del Archivo", key: "nombre" },
        { title: "Extensión", key: "extension" },
        { title: "Acciones", key: "actions" },
      ],
      isDialogEvidenciasVisible: false,
      idEliminarDocumento: 0,
      modalEliminarDocumento: false,
      idMinutaVisualizarDocumentos: 0,
      nombreModal: "",
      fileData: ref([]),
      formularioEnviado : false,
    };
  },
  watch: {
    SelectReunion: function (val) {
      this.fromMinutas.fecha = val.fechaString;
      this.fromMinutas.hora = val.horaString;
      this.fromMinutas.idReunion = val.idReunion;
      this.formRequestReunion = val;
      console.log("Selecc -", val);
      console.log(this.fromMinutas);
    },
  },
  methods: {
    ...mapActions(useReunionesStore, ["setMinutaData"]),




    async _ObtenerListaReuniones() {
      let result = await reunionService
        .obtenerReunionesNoVinculadasEnMinutas()
        .then((res) => {
          this.ListaReuniones = res;
        });
    },
    async _ObtenerListaMinutas() {
      let result = await reunionService.obtenerMinuta().then((res) => {
        this.ListaMinutas = res.data;
      });
    },

    async _ObtenerListaMinutasV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        let result = await reunionService
          .obtenerMinutasV2(payload)
          .then((res) => {
            this.ListaMinutas =
              this.page == 1 ? res.data : [...this.ListaMinutas, ...res.data];
            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },

    async masDatos() {
      this.page++;
      await this._ObtenerListaMinutasV2();
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
      if (this.search.trim() !== "" && this.loading == false) {
        let payload = {
          buscar: this.search.trim(),
          page: 1,
          take: this.totalConsultas,
        };
        let result = await reunionService.obtenerMinutasV2(payload);
        this.ListaMinutas = result.data;
        this.loading = false;
        this.hasMoreItems = false;
      } else {
        this.hasMoreItems = true;
        await this._ObtenerListaMinutasV2(1);
      }
    },

    async actualizar() {
      this.SelectReunion = []
      await this._ObtenerListaReuniones();
      this.isDialogVisible = true;
    },
    async AgregarMinuta() {
      let result = await reunionService.agregarMinuta(this.formMinuta);
    },
    PaginasMinutas(RequierdeActa, idReunion, idMinuta) {
      console.log("IdTipodeReunion = ", RequierdeActa);
      if (RequierdeActa == 2)
        this.$router.push({
          name: "reunion-acta-minuta",
          params: { idReunion: idReunion, idMinuta: idMinuta },
        });
      else
        this.$router.push({
          name: "reunion-crear-minuta",
          params: { idReunion: idReunion, idMinuta: idMinuta },
        });
    },
    async ValidarFrmMinutas() {
      let res = await this.$refs.frmMinutas.validate();
      if (res.valid) {
        console.log("Estoys aqui");
        this.formMinuta.idReunion = this.formRequestReunion.idReunion;
        if (this.formRequestReunion.idEstatus == 2) {
          // Deshabilitar el botón de guardar
          this.formularioEnviado = true;

          let result = await reunionService.agregarMinuta(this.formMinuta);
          console.log("Resultado Actual", result);
          if (result.data.success) {
            //this.setMinutaData(result.data.data)
            console.log("Resulsd ", result);
            this.PaginasMinutas(
              this.formRequestReunion.idTipoReunion,
              this.formRequestReunion.idReunion,
              result.data.data.idMinuta
            );
          }
          this.formularioEnviado = false;
          console.log("Datos de la reunion", this.formRequestReunion);
        } else {
          this.toast.warning('La reunion todavia no esta completa');
        }

      }
    },
    async abrirDialogoEvidencias(Minuta) {
      await this.obtenerDocumentoMinuta(Minuta.idMinuta);
      this.isDialogEvidenciasVisible = true;
      this.idMinutaVisualizarDocumentos = Minuta.idMinuta;
      this.nombreModal = Minuta.rqActaOMinuta;
      console.log("Minuta ID", Minuta.idMinuta);
    },
    async handleButtonClick(idMinuta) {
      console.log("idMinuta:", idMinuta);
      let fileInput = document.createElement("input");
      fileInput.type = "file";

      fileInput.onchange = (e) => {
        let file = e.target.files[0];
        if (!file) {
          console.log("No se seleccionó archivo.");
          return;
        }
        this.uploadFileToAPI(file, idMinuta);
      };
      fileInput.click();
    },
    async uploadFileToAPI(file, idMinuta) {
      if (!file) {
        return;
      }

      let formData = new FormData();
      const extension = file.name.split(".").pop();
      const nombreOriginal = file.name.replace(
        new RegExp(`.${extension}$`),
        ""
      );
      formData.append("IdMinuta", idMinuta);
      formData.append("File", file);
      formData.append("Extension", extension);
      formData.append("NombreOriginal", nombreOriginal);

      try {
        const response = await documentoMinutaService.subirDocumentoMinuta(
          formData
        );
        if (response.data.success) {
          this.toast.success("Archivo subido con éxito");
          await this.obtenerDocumentoMinuta(idMinuta);
        } else {
          this.toast.error("No se pudo subir el archivo");
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
    },
    async editarDocumentoMinuta(idDocumento) {
      const documentoEditar =
        await documentoMinutaService.obtenerDocumentoMinutaById(idDocumento);

      const nombre = documentoEditar.nombre;
      const idMinuta = documentoEditar.idMinuta;

      let fileInput = document.createElement("input");
      fileInput.type = "file";

      fileInput.onchange = (e) => {
        let file = e.target.files[0];
        if (!file) {
          console.log("No se seleccionó archivo.");
          return;
        }
        this.uploadFileEditar(file, idMinuta, documentoEditar);
      };
      fileInput.click();
    },
    async uploadFileEditar(file, idMinuta, documentoEditar) {
      if (!file) {
        return;
      }

      let formData = new FormData();
      const extension = file.name.split(".").pop();
      //this.abrirDialogoEvidencias()
      const nombreOriginal = file.name.replace(
        new RegExp(`.${extension}$`),
        ""
      );
      formData.append("Id", documentoEditar.id);
      formData.append("IdMinuta", documentoEditar.idMinuta);
      formData.append("File", file);
      formData.append("Nombre", documentoEditar.nombre);
      formData.append("Extension", extension);
      formData.append("NombreOriginal", nombreOriginal);

      try {
        const response = await documentoMinutaService.editarDocumentoMinuta(
          formData
        );
        await this.obtenerDocumentoMinuta(idMinuta);
        if (response.data.success) {
          this.toast.success("Archivo editado con éxito");
        } else {
          this.toast.error("No se pudo editar el archivo");
        }
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
    },
    async obtenerDocumentoMinuta(idMinuta) {
      try {
        const response = await documentoMinutaService.obtenerDocumentoMinuta(
          idMinuta
        );
        this.evidencias = [];
        if (Array.isArray(response.data)) {
          for (const evidencia of response.data) {
            evidencia.link = await documentoMinutaService.obtenerDocumentoAzure(
              evidencia.nombre
            );
            evidencia.extension = evidencia.extension
              ? evidencia.extension.toUpperCase()
              : "";
          }
          this.evidencias = response.data;
          console.log("Evidencias:", this.evidencias);
        }
      } catch (error) {
        console.error("Error al obtener el archivo:", error);
      }
    },
    async OpenEliminarDocumentoMinuta(idDocumento) {
      try {
        const response =
          await documentoMinutaService.obtenerDocumentoMinutaById(idDocumento);
        this.modalEliminarDocumento = true;
        this.idEliminarDocumento = response.id;
      } catch (error) {
        console.error("Error al obtener el archivo:", error);
      }
    },
    async eliminarDocumentoMinuta(id) {
      try {
        console.log(id)
        const response = await documentoMinutaService.eliminarDocumentoMinuta(
          id
        );
        if (response.data.success) {
          this.toast.success("Documento eliminado con éxito");
          this.modalEliminarDocumento = false;
          this.idEliminarDocumento = 0;
          this.isDialogEvidenciasVisible = false;
          await this.obtenerDocumentoMinuta(this.MinutaModal.id);
        } else {
          this.toast.error("No se pudo eliminar el documento");
        }
      } catch (error) {
        console.error("Error al eliminar el archivo:", error);
      }
    },
    async descargarDocumento(item) {
      if (item.link) {
        if (
          item.extension.toLowerCase() == "pdf" ||
          this.esImagen(item.extension.toLowerCase())
        ) {
          window.open(item.link, "_blank");
        } else {
          const link = document.createElement("a");
          link.href = item.link;
          link.setAttribute("download", item.nombreOriginal);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.toast.success("Descarga exitosa");
        }
      }
    },
    esImagen(extension) {
      const formatosImagen = ["png", "jpg", "jpeg", "bmp", "gif", "svg"];
      return formatosImagen.includes(extension.toLowerCase());
    },
  },

  async created() {
    // await this._ObtenerListaMinutas()
    await this._ObtenerListaMinutasV2();
    await this._ObtenerListaReuniones();
    console.log(this.ListaReuniones);
    console.log(this.ListaMinutas);
  },

  mounted() {
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
      <VIcon icon="tabler-table-minus" color="primary" class="me-3" size="30" />
      Minutas
    </p>
  </div>
  <VRow>
    <VCol cols="12" md="4">
      <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
        single-line hide-details dense outlined @input="buscarResultados" />
    </VCol>
    <VCol cols="12" md="8">
      <VBtn color="cafe" size="40" rounded="pill" @click="actualizar()" title="Crear Minuta">
        <VIcon class="tabler-plus" size="32" />
      </VBtn>
    </VCol>
  </VRow>

  <VDialog v-model="isDialogVisible" class="v-dialog-sm">
    <DialogCloseBtn @click="isDialogVisible = false" />
    <VCard>
      <VCardTitle class="pa-6">Crear Minuta</VCardTitle>
      <VCardText class="pt-0 pb-0">
        <VWindow>
          <VWindowItem>
            <VForm ref="frmMinutas" @submit.prevent="ValidarFrmMinutas()">
              <VRow>
                <VCol cols="12" md="12">
                  <AppCombobox color="#b48d57" v-model="SelectReunion" :items="this.ListaReuniones" item-title="titulo"
                    item-value="idReunion" label="Seleccionar Reunión" density="compact" placeholder="Seleccionar Reunión"
                    :rules="[requiredValidator]" />
                </VCol>
                
              </VRow>
              <VRow class="pl-1">
                <VCol cols="12" md="4">
                  <div class="d-flex flex-column gap-1">
                    <label for="fecha">Fecha</label>
                    <strong>{{ this.fromMinutas.fecha }}</strong>
                    <!-- <strong>12-03-2024</strong> -->
                  </div>
                </VCol>
                <VCol cols="12" md="4">
                  <div class="d-flex flex-column gap-1">
                    <label for="hora">Hora</label>
                    <strong>{{ this.fromMinutas.hora }}</strong>
                    <!-- <strong>12:28 a.m.</strong> -->
                  </div>
                </VCol>
                <VCol cols="12" md="4">
                  <div class="d-flex flex-column gap-1">
                    <label for="acta">Tipo Reunión</label>
                    <strong>{{ this.formRequestReunion.tipoReunionString }}</strong>
                    <!-- <strong>Minuta</strong> -->
                  </div>
                </VCol>
              </VRow>
              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn color="error" variant="outlined" @click="isDialogVisible = false">
                  Cancelar
                </VBtn>
                <VBtn color="success" :disabled="formularioEnviado" variant="elevated" type="submit"> Guardar </VBtn>
              </VCardText>
            </VForm>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </VDialog>

  <VRow class="scroll_Tarjetas">
    <VCol cols="12" md="4" v-for="(MinutasR, index) in this.ListaMinutas" :key="index">
      <VCard>
        <VCardText>
          <VRow class="mb-1">
            <VCol cols="6">
              <VIcon icon="tabler-table-minus" color="primary" class="me-3" />
              {{ MinutasR.nombreTipoReunion }} {{ MinutasR.idMinuta }}
            </VCol>
            <VCol cols="6">
              <div class="d-flex justify-end">
                <VBtn class="me-2" title="Cargar Documentos" size="30" color="primary"
                  @click="abrirDialogoEvidencias(MinutasR)">
                  <VIcon icon="tabler-file-upload" size="20" />
                </VBtn>
                <VBtn title="Editar" size="30" color="success" @click="
                  PaginasMinutas(
                    MinutasR.idTipoReunion,
                    MinutasR.idReunion,
                    MinutasR.idMinuta
                  )
                  ">
                  <VIcon icon="tabler-edit" size="20" />
                </VBtn>
                <!-- <VBtn title="Eliminar" size="30" color="error" class="botonEliminar">
                                    <VIcon icon="tabler-trash" size="20" />
                                </VBtn> -->
              </div>
            </VCol>
          </VRow>
          <hr />
          <VCardText class="pl-0">
            <div class="me-auto">
              <p class="d-flex align-center mb-6">
                <VIcon color="primary" icon="tabler-folder" size="22" />
                <span class="ms-3">{{ MinutasR.folio }}</span>
              </p>
            </div>
            <div class="me-auto">
              <p class="d-flex align-center mb-6">
                <VIcon color="primary" icon="custom-wizard-social-link" size="22" />
                <span class="ms-3">{{ MinutasR.nombreReunion }}</span>
              </p>
            </div>
            <VRow class="mb-1">
              <VCol cols="9" class="d-flex gap-x-3 align-center">
                <VIcon color="primary" icon="tabler-calendar" />
                <div>
                  <h6 class="text-h6 text-high-emphasis">
                    {{ MinutasR.fechaReunion }}
                  </h6>
                  <div class="text-sm">Fecha</div>
                </div>
              </VCol>
              <VCol cols="3" class="d-flex gap-x-3 align-center">
                <VIcon icon="tabler-clock" />
                <div>
                  <h6 class="text-h6 text-high-emphasis">
                    {{ MinutasR.horaReunion }}
                  </h6>
                  <div class="text-sm">Horario</div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <!-- Diálogo para CRUD de Evidencias -->
  <VDialog width="850" v-model="isDialogEvidenciasVisible" persistent>
    <DialogCloseBtn @click="isDialogEvidenciasVisible = false" />
    <VCol cols="12" md="12">
      <VCard class="d-flex flex-column">
        <VCardTitle class="text-h5 py-4">
          <VIcon icon="tabler-file-text mr-3" size="25" />
          Documentos de {{ nombreModal }}
        </VCardTitle>

        <!-- <VCardItem class="text-h6 text-primary py-4 align-center">
          <VBtn
            @click="handleButtonClick(this.idMinutaVisualizarDocumentos)"
            size="35"
            class="me-3"
          >
            <VIcon icon="tabler-upload" size="30"></VIcon>
          </VBtn>
          Cargar documento
        </VCardItem> -->
        <VCardText>
          <div class="flex">
            <div class="w-full h-auto relative">
              <div class="cursor-pointer mb-5" @click="handleButtonClick(this.idMinutaVisualizarDocumentos)">
                <div class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone">
                  <IconBtn variant="tonal" class="rounded-sm">
                    <VIcon icon="tabler-upload" />
                  </IconBtn>
                  <div class="text-base text-high-emphasis font-weight-medium">
                    Suelte los archivos aquí o haga clic para cargarlos
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap">
                  <VRow class="match-height w-100">
                    <template v-for="index in evidencias" :key="index">
                      <VCol cols="12" sm="3">
                        <VCard :ripple="false" border>
                          <VCardText class="d-flex flex-column">
                            <div class="justify-center d-flex">
                              <div v-if="index.extension == 'PDF'">
                                <img src="../../assets/images/logos/PDF.png" width="80" height="80" />
                              </div>
                              <div v-if="index.extension == 'DOCX' ||
                                index.extension == 'DOC'
                                ">
                                <img src="../../assets/images/logos/docx.png" width="80" height="80" />
                              </div>
                              <div v-if="index.extension == 'PPTX'">
                                <img src="../../assets/images/logos/pptx.png" width="80" height="80" />
                              </div>
                              <div v-if="index.extension == 'XLSX'">
                                <img src="../../assets/images/logos/xlsx.png" width="80" height="80" />
                              </div>
                              <div v-if="index.extension == 'GIF'">
                                <img src="../../assets/images/logos/Img.png" width="60" height="80" />
                              </div>
                              <div v-if="index.extension == 'JPG' ||
                                index.extension == 'PNG' ||
                                index.extension == 'SVG' ||
                                index.extension == 'JPEG' ||
                                index.extension == 'SVG' ||
                                index.extension == 'BMB'
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
                            <!-- <VBtn @click="editarDocumentoMinuta(index.idDocumento)" size="30" color="success" class="mx-1"
                              title="Editar documento">
                              <VIcon icon="tabler-edit" size="20" />
                            </VBtn> -->
                            <VBtn @click="eliminarDocumentoMinuta(index.idDocumento)" size="30" color="error" class="mx-1"
                              title="Eliminar documento">
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
        </VCardText>
        <!-- <VCardItem>
          <VDataTable :headers="evidenciasHeaders" :items="evidencias">
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <VBtn
                  @click="editarDocumentoMinuta(item.id)"
                  size="30"
                  color="success"
                  class="me-3"
                  title="Editar documento"
                >
                  <VIcon icon="tabler-edit" size="20" />
                </VBtn>
                <VBtn
                  @click="OpenEliminarDocumentoMinuta(item.id)"
                  size="30"
                  color="error"
                  class="me-3"
                  title="Eliminar documento"
                >
                  <VIcon icon="tabler-trash" size="20" />
                </VBtn>
                <VBtn
                  @click="descargarDocumento(item)"
                  size="30"
                  color="gray"
                  class="me-3"
                  title="Descargar documento"
                >
                  <VIcon icon="tabler-download" size="20" />
                </VBtn>
              </div>
            </template>
            <template #item.nombre="{ item }">
            
              {{ item.nombreOriginal ? item.nombreOriginal : "Documento" }}
            </template>
            <template #item.extension="{ item }">
              {{ item.extension }}
            </template>
          </VDataTable>
        </VCardItem> -->
      </VCard>
    </VCol>
  </VDialog>
  <VDialog v-model="modalEliminarDocumento" max-width="500px">
    <VCard>
      <VCardTitle>¿Deseas eliminar el registro?</VCardTitle>

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
</template>

<style scoped>

</style>
