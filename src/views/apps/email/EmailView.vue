<script>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useEmail } from "@/views/apps/email/useEmail";
import "@styles/style.css";
import { watchEffect, onMounted, ref } from "vue";
import acontecimientoServices from "@/services/inbox/acontecimientos-services";
import { useToast } from "vue-toastification";
import Mapa from "@/views/apps/email/MapaComponent.vue";
import TimeLineComponent from "./TimeLineComponent.vue";
export default {
  name: "",
  components: { Mapa, TimeLineComponent },
  props: {
    AcontecimientosVinculados: {
      type: Array,
    },
    listaHistorias: {
      type: Array,
    },
    emails: {
      type: Array,
    },
    email: {
      type: null,
      required: true,
    },
    emailMeta: {
      type: Object,
      required: true,
    },
  },

  emit: [
    "refresh",
    "navigated",
    "close",
    "trash",
    "unread",
    "read",
    "star",
    "unstar",
  ],
  data() {
    return {
      toast: useToast(),
      Id: "id" in this.$route.params ? this.$route.params.id : undefined,
      updateEmailLabels: useEmail(),
      coordenadas: [],
      labels: useEmail(),
      resolveLabelColor: useEmail(),
      emailMoveToFolderActions: useEmail(),
      shallShowMoveToActionFor: useEmail(),
      moveSelectedEmailTo: useEmail(),
      map: ref(null),
      mapContainer: ref(null),
      tab: null,
      tabconten: ["Acontecimiento", "Linea del tiempo"],
      AcontecimientoBase: [],
      AcontencimientosIdVincular: [],
    };
  },
  methods: {
    async Update() {
      var res = await acontecimientoServices
        .updateAcontecimiento(this.email)
        .then((data) => data.data);
      if (res.success) {
        var res = await acontecimientoServices
          .AcontecimientoById(res.updatedId)
          .then((data) => data);
        if (res.status == 200) {
          // this.email = res.data
          this.toast.success("Mensaje vinculado correctamente");
          // setTimeout(() => {
          this.$router.push({
            name: "apps/email/validar",
            params: { id: this.email.id, tipo: 1 },
          });
          // }, 2000);
        } else {
          this.toast.error(
            "No se pudo vincular el mensaje intentelo nuevamente"
          );
        }
      }
    },

    btnNext() {
      this.$router.push({
        name: "apps/email/mensaje",
        params: { id: this.email.id, tipo: 3 },
      });
    },

    Actualizar() {
      this.AcontecimientosVinculados.length = 0;
      this.AcontecimientoBase.length = 0;
      this.coordenadas = [];
      if (this.email) {
        if (!this.email.validado) {
          this.AcontecimientosVinculados.push(
            this.emails.find(
              (data) => data.listaAcontecimientos.id == this.email.id
            )
          );
        }

        this.emails.map((data) => {
          // if (data.listaAcontecimientos.id === this.email.id) {
          //   this.AcontecimientosVinculados.push(data);
          // }
          if (this.email.validado) {
            if (
              data.listaAcontecimientos.idHistoria == this.email.idHistoria &&
              data.listaAcontecimientos.idHistoria != null
            ) {
              this.AcontecimientosVinculados.push(data);
            }
          } else {
            if (
              data.listaAcontecimientos.idHistoria == this.email.idHistoria &&
              data.listaAcontecimientos.id != this.email.id &&
              data.listaAcontecimientos.idHistoria != null
            ) {
              this.AcontecimientosVinculados.push(data);
            }
          }
          if (
            data.listaAcontecimientos.idHistoria == this.email.idHistoria &&
            data.listaAcontecimientos.idHistoria != null
          ) {
            var coordenadasVinculadas = [];
            coordenadasVinculadas.push(data);
            coordenadasVinculadas.forEach((email) => {
              if (
                email.listaAcontecimientos.id &&
                email.listaAcontecimientos.latitud &&
                email.listaAcontecimientos.longitud
              ) {
                this.coordenadas.push({
                  id: email.listaAcontecimientos.id,
                  latitud: email.listaAcontecimientos.latitud,
                  longitud: email.listaAcontecimientos.longitud,
                  titulo: email.listaAcontecimientos.titulo,
                  fechaHora: email.listaAcontecimientos.fechaHora,
                  nombreMunicipio: email.listaAcontecimientos.nombreMunicipio,
                  ubicacion: email.listaAcontecimientos.ubicacion,
                  color: email.tipoAcontecimiento.color,
                  contexto: email.listaAcontecimientos.contexto
                });
              }
            });
          }
          if(data.listaAcontecimientos.id === this.email.id){
            this.AcontecimientoBase.push(data);
          }
        });
        // Agrega las coordenadas email a coordenadas si existen
        if (this.email && this.email.latitud && this.email.longitud) {
          const idExistente = this.coordenadas.some(
            (coord) => coord.id === this.email.id
          );
          if (!idExistente) {
            this.AcontecimientoBase.forEach((base) => {

              this.coordenadas.push({
                id: this.email.id,
                latitud: this.email.latitud,
                longitud: this.email.longitud,
                titulo: this.email.titulo,
                fechaHora: this.email.fechaHora,
                nombreMunicipio: this.email.nombreMunicipio,
                ubicacion: this.email.ubicacion,
                color: base.tipoAcontecimiento.color,
                contexto: this.email.contexto
              });

            })
          }
        }
      }
      // console.log(this.AcontecimientoBase, "$444");
    },

    formatDateFromDatabase(date) {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
    },

    formatDateFromDatabaseHora(date) {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
    },

    checkVincular(Id) {
      // console.log(Id);
      // let existe = this.AcontencimientosIdVincular.indexOf(Id);
      // console.log(existe, "--->>>>");
    },
    /************************ SCRIPT PARA RENDERIZAR EL MAPA DE LEAFLET ********************/

    // Mapa() {
    //   // Verifica que mapContainer.value exista
    //   if (this.$refs.mapContainer) {
    //     // Destruye el mapa si ya está inicializado
    //     if (this.map) {
    //       this.map.remove();
    //     }
    //     // Crea el mapa
    //     this.map = L.map(this.$refs.mapContainer).setView(
    //       [this.email.latitud, this.email.longitud],
    //       13
    //     );
    //     // Agrega la capa de azulejos (tiles)
    //     L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //       maxZoom: 19,
    //       attribution:
    //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //     }).addTo(this.map);

    //     this.addMarkers();
    //   }
    // },

    // addMarkers() {
    //   this.coordenadas.forEach((coordenadas) => {
    //     L.marker([
    //       coordenadas.listaAcontecimientos.latitud,
    //       coordenadas.listaAcontecimientos.longitud,
    //     ]).addTo(this.map);
    //   });
    // },
    /************************ TERMINA SCRIPT PARA RENDERIZAR EL MAPA DE LEAFLET ********************/
    ordenarPorCampo(array, campo) {
      return array.sort((a, b) => {
        // Asegurarse de que los valores sean comparables (pueden ser de diferentes tipos)
        const valorA = a.listaAcontecimientos[campo];
        const valorB = b.listaAcontecimientos[campo];

        if (valorA < valorB) {
          return -1;
        } else if (valorA > valorB) {
          return 1;
        } else {
          return 0;
        }
      });
    },
  },

  async created() {
    watchEffect(() => {
      this.Actualizar();
      this.ordenarPorCampo(this.AcontecimientosVinculados, "fechaHora");
      // this.AcontecimientosVinculados.reverse();
    });
  },
};
</script>

<template>
  <!-- ℹ️ calc(100% - 256px) => 265px is left sidebar width -->
  <VNavigationDrawer temporary :model-value="!!email" location="right" :scrim="false" floating class="email-view">
    <template v-if="email">
      <!-- 👉 header -->

      <div class="email-view-header d-flex align-center">
        <div class="d-flex align-center flex-wrap flex-grow-1 overflow-hidden gap-3">
          <h2 class="text-body-1 font-weight-medium text-high-emphasis text-truncate">
            {{ email.subject }}
          </h2>
          <div class="d-flex flex-wrap gap-1">
            <VChip v-for="label in email.labels" :key="label" :color="resolveLabelColor(label)" density="default"
              class="px-2 text-capitalize flex-shrink-0 me-2" label>
              {{ label }}
            </VChip>
          </div>
        </div>

        <div></div>
      </div>

      <VDivider />

      <!-- 👉 Action bar -->

      <VDivider />

      <!-- 👉 Mail Content -->
      <PerfectScrollbar tag="div" class="mail-content-container flex-grow-1" :options="{ wheelPropagation: false }">
        <VCard class="mx-5 my-4">
          <v-tabs v-model="tab">
            <v-tab class="content-tabs" value="email">Acontecimiento</v-tab>
            <v-tab class="content-tabs" value="lineaTmp">Linea del tiempo</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="email">
              <div class="d-flex align-start align-sm-center px-6 py-3">
                <IconBtn class="me-4" @click="$emit('close')">
                  <VIcon size="22" icon="tabler-chevron-left" class="flip-in-rtl" />
                </IconBtn>

                <div class="d-flex flex-wrap flex-grow-1 overflow-hidden">
                  <div class="text-truncate">
                    <span class="d-block text-high-emphasis font-weight-medium text-truncate">{{ email.titulo }}</span>
                    <span class="text-sm text-disabled">{{
                      email.contexto
                    }}</span>
                  </div>

                  <VSpacer />

                  <div class="d-flex align-center">
                    <!-- <span class="me-2">{{ formatDate(props.email.fechaHora) }}</span> -->
                    <span class="me-2">
                      {{ formatDateFromDatabase(email.fechaHora) }}
                    </span>
                  </div>
                </div>
              </div>

              <VDivider />

              <VCardText class="contenedorCorreo">
                <!-- eslint-disable vue/no-v-ht ml -->
                <VRow>
                  <VCol cols="12">
                    <!-- <AppSelect
                      :items="items"
                      label=""
                      :placeholder="props.email.titulo"
                    /> -->

                    <AppSelect v-if="email.activo && !email.validado" color="#b48d57" label=""
                      placeholder="Seleccione una historia" :items="listaHistorias" item-title="titulo"
                      item-value="idHistoria" v-model="email.idHistoria" />

                    <AppSelect v-if="email.activo && email.validado" color="#b48d57" label=""
                      placeholder="Seleccione una historia" :items="listaHistorias" item-title="titulo"
                      item-value="idHistoria" v-model="email.idHistoria" readonly />

                    <!-- Se quitara en caso de que digan que no se necesita -->
                    <AppSelect v-if="!email.activo" color="#b48d57" label="" placeholder="Selecciones la dependencia"
                      :items="listaHistorias" item-title="titulo" item-value="idHistoria" v-model="email.idHistoria"
                      readonly />
                  </VCol>
                </VRow>

                <!-- <div v-for="acontecimiento in AcontecimientosVinculados">
                  {{ acontecimiento.id }}
                </div> -->

                <VRow>
                  <VCol cols="4">
                    <!-- <div ref="mapContainer" style="width: 100%; height: 300px">
                      {{ Mapa() }}
                    </div> -->
                    <Mapa :coordenadas="coordenadas" :email="email" />
                    <VRow class="p-5 pa-3">
                      <!-- <VFileInput
                        show-size
                        counter
                        multiple
                        label="Insertar imagen"
                        class="mt-2"
                        block
                        color="secondary"
                      /> -->

                      <!-- v-if="props.email.activo" AGREGAR A LOS BOTONES DE ABAJO SI DICEN QUE LA IDEA ES BUENA-->

                      <VBtn v-if="!email.validado && email.activo" class="mt-2 btn-color" @click="Update" block>
                        Vincular mensaje
                      </VBtn>
                      <!-- <VBtn class="mt-2" block color="secondary">
                        Insertar imagen
                      </VBtn> -->
                      <!-- 
                      <VBtn
                        v-if="!email.validado && email.activo"
                        class="mt-2"
                        :to="{
                          name: 'apps-email-validar',
                          params: { id: email.id },
                        }"
                        block
                        color="success"
                      >
                        Revisar
                      </VBtn> -->
                    </VRow>
                  </VCol>
                  <!-- style="padding: 15px;"
                      cols="8"
                      class="text-base"
                      v-html="props.email.message" -->
                  <VCol cols="8">
                    <!-- ?Acontecimiento base  -->
                    <!-- <VRow
                      no-gutters
                      class="mt-2"
                      v-if="!email.validado"
                      v-for="acontecimiento in AcontecimientoBase"
                    >
                      <VCol cols="12" md="1" class="d-flex align-items-center">
                        <VIcon icon="tabler-circle-filled" :color="'#3c3c3c'" />
                      </VCol>
                      <VCol cols="12" md="11" class="d-flex align-items-center">
                        <VAlert variant="tonal" :color="'#3c3c3c'">
                          <p>
                            {{ acontecimiento.tipoAcontecimiento.descripcion }}
                            -
                            {{ acontecimiento.listaAcontecimientos.ubicacion }}
                            -
                            {{
                              formatDateFromDatabase(
                                acontecimiento.listaAcontecimientos.fechaHora
                              )
                            }}
                            {{
                              formatDateFromDatabaseHora(
                                acontecimiento.listaAcontecimientos.fechaHora
                              )
                            }}
                            - {{ acontecimiento.listaAcontecimientos.contexto }}
                          </p>
                        </VAlert>
                      </VCol>
                    </VRow> -->
                    <!-- ?Fin acontecimeinto base -->
                    <VRow no-gutters class="mt-2" v-for="acontecimiento in AcontecimientosVinculados">
                      <VCol cols="12" md="1" class="align-items-center">
                        <div>
                          <VIcon icon="tabler-circle-filled" :color="acontecimiento.listaAcontecimientos.validado
                            ? acontecimiento.tipoAcontecimiento.color
                            : acontecimiento.listaAcontecimientos.id ==
                              email.id
                              ? '#6a6e73'
                              : '#9b9b9b'
                            " />
                        </div>
                      </VCol>
                      <VCol cols="12" md="11" class="d-flex align-items-center">
                        <VAlert variant="tonal" :color="acontecimiento.listaAcontecimientos.validado
                          ? acontecimiento.tipoAcontecimiento.color
                          : acontecimiento.listaAcontecimientos.id ==
                            email.id
                            ? '#6a6e73'
                            : '#9b9b9b'
                          ">
                          <p>
                            {{ acontecimiento.tipoAcontecimiento.descripcion }}
                            -
                            {{ acontecimiento.listaAcontecimientos.ubicacion }}
                            -
                            {{
                              formatDateFromDatabase(
                                acontecimiento.listaAcontecimientos.fechaHora
                              )
                            }}
                            {{
                              formatDateFromDatabaseHora(
                                acontecimiento.listaAcontecimientos.fechaHora
                              )
                            }}
                            - {{ acontecimiento.listaAcontecimientos.contexto }}
                          </p>
                        </VAlert>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>
                <!-- eslint-enable -->
              </VCardText>
            </v-window-item>
            <v-window-item value="lineaTmp">
              <VCardText class="contenedorCorreo">
                <VRow>
                  <!-- LINEA DEL TIEMPO -->
                  <TimeLineComponent :AcontecimientosVinculados="coordenadas" />
                </VRow>
              </VCardText>
            </v-window-item>
          </v-window>
          <template>
            <VDivider />

            <VCardText class="d-flex flex-column gap-y-4 pt-4">
              <span>2 Attachments</span>
              <div class="d-flex align-center">
                <VImg aspect-ratio="1" max-height="24" max-width="24" class="me-2" />
                <span>{{}}</span>
              </div>
            </VCardText>
          </template>
          <a v-if="email.validado && !email.mensajeEnviado && email.activo" @click="btnNext()" class="btn-flotante">
            <VIcon icon="tabler-arrow-narrow-right" />
          </a>
        </VCard>
      </PerfectScrollbar>
    </template>
  </VNavigationDrawer>
</template>

<style lang="scss">
.email-view {
  inline-size: 100% !important;

  @media only screen and (min-width: 1280px) {
    inline-size: calc(100% - 256px) !important;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.email-view-action-bar {
  min-block-size: 56px;
}

.mail-content-container {
  background-color: rgb(var(--v-theme-background));

  .mail-header {
    margin-block: 12px;
    margin-inline: 24px;
  }
}

//  estilos de linea de tiempo

.scrollHorizontal {
  overflow-x: auto;
  // min-width: 1050px;
  width: auto;
  max-height: 280px;
  margin-bottom: 10px;
  margin-right: 0;
}

.scrollHorizontal::-webkit-scrollbar {
  background-color: rgba(133, 131, 131, 0.247);
  border-radius: 15px;
}

.scrollHorizontal::-webkit-scrollbar-thumb {
  background: #963545;
  border-radius: 15px;
}

.scrollHorizontal::-webkit-scrollbar-thumb:hover {
  background: #7a2a38;
}

.float {
  // flex: 9 9 auto;
  display: flex;
}

.Timeline {
  // position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 230px;
  // background-color: rgba(158, 158, 158, 0.1);
  box-shadow: inset 0 0 5px rgba(158, 158, 158, 0.64);
  border-radius: 10px;
  // background-color: rgba(255, 0, 0, 0.258);
}

.Timeline svg {
  width: 80px;
}

.Timeline::after {
  content: " ";
  width: 275px;
  border: 2px solid #b48d57;
  position: absolute;
  margin: 0 0px 0 13px;
  /* centra automaticamente la linea */
}

// .Timeline:last-of-type::after {
//   border: 2px solid red;
// }

.event1,
.event2,
.event3 {
  position: relative;
}

.event1Bubble {
  position: absolute;
  width: 139px;
  height: 70px;
  top: -81px;
  right: -22px;
  border-radius: 5px;
  // background-color: green;
  // box-shadow: inset 0 0 5px rgba(158, 158, 158, 0.64);
}

.event2Bubble {
  position: absolute;
  width: 139px;
  height: 60px;
  left: -37px;
  top: 38px;
  // left: -105px;
  // top: 33px;
  border-radius: 5px;
  // background-color: rgba(158, 158, 158, 0.1);
  // box-shadow: inset 0 0 5px rgba(158, 158, 158, 0.64);
}

// Triangulo blanco
/*.event1Bubble:after,
.event1Bubble:before,
.event2Bubble:after,
.event2Bubble:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
  border-bottom: 0;
}*/

.event1Bubble:before {
  bottom: -10px;
  left: 13x;
  border-top-color: rgba(222, 222, 222, 0.66);
  border-width: 12px;
}

.event1Bubble:after {
  bottom: -8px;
  left: 13px;
  border-top-color: #f6f6f6;
  border-width: 12px;
}

.event2Bubble:before {
  bottom: 59px;
  left: 103px;
  border-top-color: rgba(222, 222, 222, 0.66);
  border-width: 12px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.event2Bubble:after {
  bottom: 57px;
  left: 103px;
  border-top-color: #f6f6f6;
  border-width: 12px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.eventTime {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  height: auto;
  // background-color: red;
}

// acomoda el circulo del titulo
.tituloCirculo {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  // background-color: red;
}

.DayDigit {
  font-size: 20px;
  font-family: "Arial Black", Gadget, sans-serif;
  position: relative;
  // left: -50px;
  margin: 0;
  // background-color: greenyellow;
}

.Day {
  font-size: 11px;
  margin-left: 5px;
  font-weight: bold;
  margin-top: 10px;
  font-family: Arial, Helvetica, sans-serif;
  color: #4c4a4a;
}

.eventTitle {
  font-family: "Arial Black", Gadget, sans-serif;
  color: #b48d57;
  font-size: 11px;
  text-transform: uppercase;
  display: flex;
  flex: 1;
  align-items: center;
  margin-right: 15px;
  margin-top: 10px;
  width: 185px;
  max-height: 35px;
  overflow: hidden;
  // position: absolute;
}

.MonthYear {
  font-weight: 600;
  line-height: 11px;
  color: #9e9e9e;
  font-size: 10px;
  width: 185px;
  margin-left: 25px;
}

.time1 {
  position: absolute;
  top: 60px;
  left: -60px;
  margin-top: -20px;
  font-family: Arial, Helvetica, sans-serif;
  width: 200px;
  font-size: 16px;
  // margin-top: -3px;
  // margin-left: -5px;
  color: #9e9e9e;
  // background-color: red;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time2 {
  position: absolute;
  top: -70px;
  left: -60px;
  font-family: Arial, Helvetica, sans-serif;
  width: 200px;
  font-size: 16px;
  // margin-top: -75px;
  // margin-left: -5px;
  color: #9e9e9e;
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: blue;
}

.eventAuthor {
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  color: #9e9e9e;
  font-size: 8px;
  width: 100px;
  top: -8px;
  left: 63px;
}

.event2Author {
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  color: #9e9e9e;
  font-size: 8px;
  width: 100px;
  top: 96px;
  left: -32px;
}

.now {
  background-color: #004165;
  color: white;
  border-radius: 7px;
  margin: 5px;
  padding: 4px;
  font-size: 10px;
  font-family: Arial, Helvetica, sans-serif;
  border: 2px solid white;
  font-weight: bold;
  box-shadow: 0 0 0 2px #004165;
}

.futureGray {
  filter: grayscale(1);
  -webkit-filter: grayscale(1);
}

.futureOpacity {
  -webkit-filter: opacity(0.3);
  filter: opacity(0.3);
}

/* Estilos para el tab activo */
.content-tabs.v-tab--selected {
  background: linear-gradient(135deg,
      rgb(135, 38, 56) 0%,
      rgb(193, 78, 97) 100%);
  color: #ffffff !important;
  /* Establecer el color de texto deseado para el tab activo */
}

/* Estilos para el tab inactivo */
.content-tabs:not(.v-tab--active) {
  background-color: #ffffff;
  /* Establecer el color de fondo deseado para el tab inactivo */
  color: #000000;
  /* Establecer el color de texto deseado para el tab inactivo */
}
</style>
