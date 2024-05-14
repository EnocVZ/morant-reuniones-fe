<script>
import historiaServices from "@/services/inbox/historias-services";
import acontecimientoServices from "@/services/inbox/acontecimientos-services";
import categoriaServices from "@/services/inbox/categoria-services";
import statusAcontecimientosServices from "@/services/inbox/status-acontecimientos-services";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VCardActions } from "vuetify/lib/components/index.mjs";
import { useToast } from "vue-toastification";

export default {
  components: {
    VDataTable,
    VCardActions,
  },
  data() {
    return {
      toast: useToast(),
      headers: [
        {
          title: "",
          key: "blank",
        },
        {
          title: "Historia",
          key: "titulo",
        },
        {
          title: "Acciones",
          key: "actions",
        },
      ],
      isDialogVisible: ref(false),
      isDialogVisible2: false,
      search: "",
      Acontecimiento: null,
      Historia: null,
      Acontecimientos: [],
      Historias: [],
      countAcontecimientos: null,
      modalLista: false,
      resumen: null,
      rangoFechas: "",
      inicio: "",
      fin: "",

      //----------------------//
      Municipios: [],
      Categorias: [],
      nMunicipio: "",
      idCategoria: "",

      //-------------------------
      tipo: "",
      EstadosAcontecimientos: [],
      Estados: [],
      Estados2: [],
      generandoResumen: false,
    };
  },
  methods: {
    // async getMunicipios() {
    //   var res = await municipiosServices.Municipios().then((data) => data.data);
    //   this.Municipios = res;
    // },
    async StatusAcontecimiento() {
      let res = await statusAcontecimientosServices
        .listaEstadosAcon()
        .then((data) => data);
      this.EstadosAcontecimientos = res.data;
    },

    async getCategorias() {
      var res = await categoriaServices
        .listaCategoria()
        .then((data) => data.data);
      this.Categorias = res;
    },

    async getHistorias() {
      let res = await historiaServices
        .listaHistorias()
        .then((data) => data.data);
      this.Historias = res.reverse();
      this.Historias2 = res.reverse();
    },

    async AcontecimientoByHistoria(id, tipo) {
      this.countAcontecimientos = null;
      this.Acontecimiento = null;
      this.Historia = null;
      var res = await acontecimientoServices
        .AcontecimientoByHistoria(id)
        .then((data) => data);
      if (res.status == 200) {
        this.Acontecimientos = res.data.data.sort((data, key) => {
          return data.idEstadoAcontecimiento - key.idEstadoAcontecimiento;
        });

        // this.Acontecimientos = this.Acontecimientos.filter((data) => {
        //   let fecha = new Date(data.fechaHora).toISOString().split("T")[0];

        //   / -------------------*/;

        //   if (
        //     this.nMunicipio != "" &&
        //     this.idCategoria == "" &&
        //     this.rangoFechas == ""
        //   ) {
        //     return data.nombreMunicipio == this.nMunicipio;
        //   }

        //   / -------------------*/;

        //   if (
        //     this.idCategoria != "" &&
        //     this.nMunicipio == "" &&
        //     this.rangoFechas == ""
        //   ) {
        //     return data.idCategoria == this.idCategoria;
        //   }

        //   / -------------------*/;

        //   if (
        //     this.rangoFechas != "" &&
        //     this.idCategoria == "" &&
        //     this.nMunicipio == ""
        //   ) {
        //     if (this.rangoFechas.split(" ")[2]) {
        //       return fecha >= this.inicio && fecha <= this.fin;
        //     } else {
        //       return fecha >= this.inicio;
        //     }
        //   }

        //   / -------------------*/;

        //   if (
        //     this.nMunicipio != "" &&
        //     this.idCategoria != "" &&
        //     this.rangoFechas == ""
        //   ) {
        //     return (
        //       data.nombreMunicipio == this.nMunicipio &&
        //       data.idCategoria == this.idCategoria
        //     );
        //   }

        //   / -------------------*/;

        //   if (
        //     this.nMunicipio != "" &&
        //     this.rangoFechas != "" &&
        //     this.idCategoria == ""
        //   ) {
        //     if (this.rangoFechas.split(" ")[2]) {
        //       return (
        //         fecha >= this.inicio &&
        //         fecha <= this.fin &&
        //         data.nombreMunicipio == this.nMunicipio
        //       );
        //     } else {
        //       return (
        //         fecha >= this.inicio && data.nombreMunicipio == this.nMunicipio
        //       );
        //     }
        //   }

        //   / -------------------*/;

        //   if (
        //     this.idCategoria != "" &&
        //     this.rangoFechas != "" &&
        //     this.nMunicipio == ""
        //   ) {
        //     if (this.rangoFechas.split(" ")[2]) {
        //       return (
        //         fecha >= this.inicio &&
        //         fecha <= this.fin &&
        //         data.idCategoria == this.idCategoria
        //       );
        //     } else {
        //       return (
        //         fecha >= this.inicio && data.idCategoria == this.idCategoria
        //       );
        //     }
        //   }

        //   / -------------------*/;
        //   if (
        //     this.nMunicipio != "" &&
        //     this.idCategoria != "" &&
        //     this.rangoFechas != ""
        //   ) {
        //     if (this.rangoFechas.split(" ")[2]) {
        //       return (
        //         fecha >= this.inicio &&
        //         fecha <= this.fin &&
        //         data.nombreMunicipio == this.nMunicipio &&
        //         data.idCategoria == this.idCategoria
        //       );
        //     } else {
        //       return (
        //         fecha >= this.inicio &&
        //         data.nombreMunicipio == this.nMunicipio &&
        //         data.idCategoria == this.idCategoria
        //       );
        //     }
        //   }

        //   return data;
        // });

        this.countAcontecimientos = res.data.data.filter(
          (data) => data.idHistoria == id
        ).length;

        if (tipo == 1) {
          this.tipo = "cerrar";
          this.Acontecimiento = res.data.data.at(-1);
          this.Acontecimiento.idEstadoAcontecimiento = 3;
        }
        if (tipo == 2) {
          this.tipo = "reabrir";

          this.Acontecimiento = res.data.data.filter(
            (data) => data.idHistoria == id && data.idEstadoAcontecimiento == 3
          )[0];
        }
      }
      this.Historia = this.Historias.filter((data) => data.idHistoria == id)[0];
      // if (tipo == 1) {
      //   this.Historia.idEstado = 3;
      // }
    },

    async updateHistoria() {
      if (this.tipo == "reabrir") {
        if (this.countAcontecimientos == 1) {
          this.Historia.idEstado = 1;
        } else {
          this.Historia.idEstado = 2;
        }
      } else {
        this.Historia.idEstado = 3;
      }
      let res = await historiaServices
        .updateHistoria(this.Historia)
        .then((data) => data);

      return res;
    },

    async updateAcontecimiento() {
      if (this.tipo == "cerrar") {
        this.generandoResumen = true;
        await this.Resumen(this.Historia.idHistoria);
        this.generandoResumen = false;
        this.Historia.resumen = this.resumen;
      } else {
        this.Historia.resumen = null;

        if (this.countAcontecimientos == 1) {
          this.Acontecimiento.idEstadoAcontecimiento = 1;
        } else {
          this.Acontecimiento.idEstadoAcontecimiento = 2;
        }
      }

      let res = await acontecimientoServices
        .updateDatosAcontecimiento(this.Acontecimiento)
        .then((data) => data);
      if (res.data.success) {
        let res = await this.updateHistoria();

        if (res.status == 200) {
          if (this.tipo == "cerrar") {
            this.toast.success("Historia cerrada correctamente.");
          }
          if (this.tipo == "reabrir") {
            this.toast.success("Historia reabierta correctamente.");
          }
          this.getHistorias();
        }
      }
    },

    async Guardar() {
      this.isDialogVisible = false;
      await this.updateAcontecimiento();
    },

    async reabrir(id, tipo) {
      await this.AcontecimientoByHistoria(id, tipo);
      this.isDialogVisible = true;
    },

    async abrirModal(item) {
      this.isDialogVisible2 = true;
      this.Acontecimientos = [];
      this.resumen = item.resumen;
      await this.AcontecimientoByHistoria(item.idHistoria);
      // await this.Resumen(id);
    },

    async Resumen(id) {
      var respuesta = await acontecimientoServices
        .getResumen({
          id_historia: id,
        })
        .then((data) => data);
      if (respuesta.status == 200) {
        this.resumen = respuesta.data.resumen;
      }
    },

    formatoFecha(date) {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
    },

    async _Editar(id) {
      console.log(id);
      this.$router.push({
        name: "apps/email/validar",
        params: { id: id, tipo: 2 },
      });
    },
    _Limpiar() {
      this.rangoFechas = "";
      this.Estados.length = 0;
    },
  },
  async created() {
    await this.getCategorias();
    await this.StatusAcontecimiento();

    watchEffect(async () => {
      if (this.rangoFechas != null) {
        if (this.rangoFechas.split(" ")[0]) {
          this.inicio = new Date(this.rangoFechas.split(" ")[0])
            .toISOString()
            .split("T")[0];
        }
        if (this.rangoFechas.split(" ")[2]) {
          this.fin = new Date(this.rangoFechas.split(" ")[2])
            .toISOString()
            .split("T")[0];
        }
        if (this.Acontecimiento) {
          if (this.Acontecimiento.idCategoria == 0) {
            this.Acontecimiento.idCategoria = null;
          }
        }

        / --------------------Filtros---------------------- */;

        if (this.Estados.length == 0 && this.rangoFechas == "") {
          await this.getHistorias();
          this.Historias = this.Historias2;
        }

        if (this.Estados.length != 0 && this.rangoFechas == "") {
          await this.getHistorias();

          this.Historias = this.Historias2.filter((data) => {
            return this.Estados.includes(data.idEstado);
          });
        }

        if (this.Estados.length != 0 && this.rangoFechas != "") {
          await this.getHistorias();

          this.Historias = this.Historias2.filter((data) => {
            let fecha = new Date(data.fechaAlt).toISOString().split("T")[0];

            if (this.rangoFechas.split(" ")[2]) {
              return (
                this.Estados.includes(data.idEstado) &&
                fecha >= this.inicio &&
                fecha <= this.fin
              );
            } else {
              return (
                this.Estados.includes(data.idEstado) && fecha >= this.inicio
              );
            }
          });
        }

        if (
          this.Estados.length == 0 &&
          this.rangoFechas != "" &&
          this.rangoFechas != null
        ) {
          await this.getHistorias();

          this.Historias = this.Historias2.filter((data) => {
            let fecha = new Date(data.fechaAlt).toISOString().split("T")[0];
            if (this.rangoFechas.split(" ")[2]) {
              return fecha >= this.inicio && fecha <= this.fin;
            } else {
              return fecha >= this.inicio;
            }
          });
        }
      }
    });
  },
};
</script>

<template>
  <div>
    <p class="text-2xl mc-6">
      <VIcon icon="tabler-history" color="primary" class="me-3" size="30" />Historia
    </p>
    <VRow>
      <VCol cols="12" md="4">
        <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
          single-line hide-details dense outlined />
      </VCol>

      <VCol cols="12" md="3">
        <AppDateTimePicker v-model="rangoFechas" placeholder="Seleccione un rango de fechas"
          :config="{ mode: 'range' }" />
      </VCol>

      <VCol :md="3">
        <VSelect placeholder="Selecione un estado acontecimiento " label="Estado acontecimiento" v-model="Estados"
          :items="EstadosAcontecimientos" item-title="nombre" item-value="id" multiple="true" />
      </VCol>

      <VBtn class="mt-3" :onclick="() => _Limpiar()" color="#00A99D">
        <VIcon class="tabler-eraser mx-1" />
        Limpiar
      </VBtn>
      <VCol cols="12" md="12">
        <VCard>
          <VDataTable :headers="headers" :items="Historias" :search="search">
            <template #item.actions="{ item }">
              <div class="d-flex justify-center gap-1">
                <VBtn :onclick="() => abrirModal(item)" color="cafe">
                  <VIcon class="tabler-eye mx-1" />
                  Ver
                </VBtn>
                <VBtn v-if="item.idEstado == 3" :onclick="() => reabrir(item.idHistoria, 2)" color="warning">
                  <VIcon class="tabler-lock-open mx-2" />
                  Reabrir
                </VBtn>

                <VBtn v-else :onclick="() => reabrir(item.idHistoria, 1)" class="colorBoton-rojo__tamaño" color="error">
                  <VIcon class="tabler-lock mx-2" />
                  Cerrar
                </VBtn>
              </div>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </div>

  <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <VCard class="text-center" :title="'¿Desea ' + tipo + ' la historia?'">
      <VCardText class="d-flex justify-center gap-3 flex-wrap">
        <VBtn color="error" variant="outlined" @click="isDialogVisible = false">
          No
        </VBtn>
        <VBtn color="success" variant="elevated" :onclick="() => Guardar()"> Si </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="generandoResumen" persistent class="v-dialog-sm">
    <VCard title="">
      <VCardText>Espere por favor estamos generando el resumen de la historia
      </VCardText>

      <VCardText class="d-flex justify-center gap-3 flex-wrap">
        <VProgressCircular :size="60" color="primary" indeterminate />
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="modalLista" persistent class="v-dialog-sm">
    <DialogCloseBtn @click="modalLista = !modalLista" />

    <VCard title="Lista de acontecimientos">
      <VCardText> </VCardText>
      <VRow>
        <div v-for="acontecimiento in Acontecimientos">
          <div class="mt-2 col ml-2">{{ acontecimiento.titulo }}</div>
        </div>
      </VRow>
    </VCard>
  </VDialog>

  <!-- MODAL PARA VER LOS ACONTECIMIENTOS -->
  <VDialog v-model="isDialogVisible2" persistent width="650">
    <DialogCloseBtn @click="isDialogVisible2 = !isDialogVisible2" />

    <VCard>
      <div class="mt-5 ml-2 mr-2" v-if="resumen">
        <span class="d-block text-high-emphasis font-weight-medium text-truncate">
          <VIcon class="tabler-file-pencil mb-1" color="#7367f0" />
          Resumen
        </span>
        <!-- <div v-if="resumen == null" class="border rounded px-3 py-3 text-center">
          <VProgressCircular :size="50" color="primary" indeterminate />
        </div> -->

        <div v-if="resumen != null" class="border rounded px-3 py-3 text-justify">
          <span class="text-sm text-disabled">
            {{ resumen }}
          </span>
        </div>
      </div>
      <h3 class="text-primary ml-5 mt-6 mb-3">
        <VIcon class="tabler-history" />Lista acontecimientos
      </h3>
      <VCardText v-if="Acontecimientos.length" v-for="acontecimiento in Acontecimientos">
        <VCardText class="rounded tarjetas-sombra">
          <div class="d-flex flex-wrap flex-grow-1">
            <div class="text-truncate">
              <span class="d-block text-high-emphasis font-weight-medium text-truncate mb-2">
                <VIcon class="tabler-file-text-ai mb-1" color="primary" />

                {{ acontecimiento.titulo }}
              </span>
            </div>
            <div class="mt-3">
              <p class="text-uppercase mb-1">
                <VIcon class="tabler-file-pencil mb-1" color="#7367f0" />
                Contenido
              </p>
              <div class="border rounded px-3 py-3 text-justify">
                <span class="text-sm text-disabled">
                  {{ acontecimiento.contexto }}
                </span>
              </div>
            </div>
          </div>
          <!-- FIN div 1 -->
          <div class="mt-8 mb-5">
            <div class="mt-8">
              <VRow>
                <VCol cols="6">
                  <p class="text-uppercase mb-1">
                    <VIcon class="tabler-timeline-event-text" color="#7367f0" />
                    Estado acontecimiento
                  </p>
                  <div>
                    <p class="border rounded text-center py-2">
                      {{
          acontecimiento.idEstadoAcontecimiento == 1
            ? "Inicio"
            : acontecimiento.idEstadoAcontecimiento == 2
              ? "Seguimiento"
              : "Cierre"
        }}
                    </p>
                  </div>
                </VCol>
                <VCol cols="6">
                  <p class="text-uppercase mb-1">
                    <VIcon class="tabler-building-bank" color="#7367f0" />
                    Municipio
                  </p>
                  <p class="border rounded text-center py-2">
                    {{ acontecimiento.nombreMunicipio }}
                  </p>
                </VCol>
                <VCol cols="6">
                  <p class="text-uppercase mb-1">
                    <VIcon class="tabler-calendar-month" color="#7367f0" />
                    Fecha
                  </p>
                  <p class="border rounded text-center py-2">
                    {{ formatoFecha(acontecimiento.fechaHora) }}
                  </p>
                </VCol>
                <VCol cols="6">
                  <p class="text-uppercase mb-1">
                    <VIcon class="tabler-calendar-month" color="#7367f0" />
                    Tema
                  </p>
                  <p class="border rounded text-center py-2">
                    {{
          Categorias.find(
            (data) => data.id == acontecimiento.idCategoria
          ).nombre
        }}
                  </p>
                </VCol>
              </VRow>
            </div>
            <div class="d-flex justify-end">
              <p v-if="acontecimiento.editado">{{ acontecimiento.editadoString }}</p>
              <VBtn class="mt-2 colorBoton-rojo__tamaño" @click="_Editar(acontecimiento.id)">
                <VIcon class="tabler-edit mx-2" />
                Editar
              </VBtn>
            </div>
          </div>
          <!-- FIN div 2 -->
        </VCardText>
      </VCardText>

      <div v-if="!Acontecimientos.length" class="border rounded px-3 py-3 text-center">
        <VProgressCircular :size="50" color="primary" indeterminate />
      </div>
    </VCard>
  </VDialog>
</template>

<style scoped>
.hover-1:hover {
  background-color: #8e304010;
}

.colorBoton__azul {
  background-color: #4269cc !important;
}

.colorBoton__verde {
  background-color: #376346 !important;
  width: 130px;
}

.colorBoton-rojo__tamaño {
  width: 130px;
}

.tarjetas-sombra {
  -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
}
</style>
