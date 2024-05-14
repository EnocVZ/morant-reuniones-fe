<script>
import html2pdf from "html2pdf.js";
import { PDFDocument, PDFImage, StandardFonts, rgb } from "pdf-lib";
import reunionService from "@/services/reuniones-service";
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { VCardItem } from "vuetify/lib/components/index.mjs";
export default {
  components: {
    VDataTable,
  },
  data() {
    return {
      formRequest: {
        idRunion: 0,
        listaParticipantes: [],
      },
      headersAsistencia: [
        {
          title: "",
          key: "data-table-expand",
        },
        {
          title: "Imprimir PDF",
          key: "actions",
        },
        {
          title: "Persona",
          key: "persona",
        },
        {
          title: "Imprimir PDF R",
          key: "actionsR",
        },
        {
          title: "Representante",
          key: "representador.persona"
        },

        //{
        //  title: 'Inasistencia',
        //key: 'accion'
        // }
      ],
      pdfObject: null,
      search: "",
      selectedParticipantId: null,
      idParticipante: null,
      IdReunion: null,
      listaParticipants: [],
      listaPersonificadores: [],
      participants: [],
      isPDFActive: false,
      selectedParticipants: [],
      selectedInvitados: [],
      selectedRepresentantes: [],
      showDropdown: true,
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
    };
  },
  methods: {
    async _obtenerDatosActualizar(idParticipante) {
      let result = await reunionService.obtenerDatosActualizar(idParticipante);
      this.formRequest = result.data;
      console.log(this.formRequest);
    },
    async generatePDF() {
      const element = this.$refs.htmlContent;
      this.showDropdown = false;
      await  this.PersonificadorTrue();
      this.listaParticipants.forEach((item) => {

        item.selected = false;
        if (item.representador) {
          item.representador.representanteSelected = false;
        }
        if (item.invitado) {
          item.invitado.forEach((x) => {
          x.invitadoSelected = false
        });
        }

      });
      setTimeout(() => {
        this.selectedParticipants = [];
        this.selectedRepresentantes = [];
        this.selectedInvitados = [];
      }, 1000);
      const options = {
        margin: 0,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        filename: "archivo.pdf",
      };

      try {
        const pdfBlob = await html2pdf()
          .from(element)
          .set(options)
          .outputPdf("blob");

        if (pdfBlob instanceof Blob) {
          const pdfWithImage = await this.agregarImagenDeFondoAPDF(pdfBlob);
          const pdfUrlWithImage = URL.createObjectURL(pdfWithImage);
          this.pdfObject = pdfUrlWithImage;
          await this._obtenerDatosActualizar(param);
        } else {
          console.error("PDF Blob no es válido.");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async agregarImagenDeFondoAPDF(pdfBlob) {
      try {
        const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
        const pages = pdfDoc.getPages();
        //const imageBytes = await fetch('/src/assets/images/logos/Personificadores-gris.png').then(res => res.arrayBuffer());
        const imageBytes = await fetch(`${import.meta.env.BASE_URL ?? '/'}images/logos/Personificadores-gris.png`).then(res => res.arrayBuffer());
        const imagen = await pdfDoc.embedPng(imageBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Fuente en negrita

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();
          const dims = { width, height };

          const imageY = dims.height - imagen.height - 20 - 20;

          page.drawImage(imagen, {
            x: 0,
            y: imageY >= 0 ? imageY : 0,
            width: dims.width,
            height: dims.height,
            opacity: 1,
            blendMode: "Multiply",
          });
        }

        const pdfBytes = await pdfDoc.save();
        return new Blob([pdfBytes], { type: "application/pdf" });
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    /* async Dialog(idParticipante) {
            const participant = this.listaParticipants.find(p => p.idParticipante === idParticipante);
            if (participant) {
                this.selectedParticipantId = idParticipante;
                this.selectedParticipants = this.listaParticipants.filter(participant => participant.selected);
                this.selectedParticipants = [participant]; // Actualiza la lista de participantes seleccionados
                this.selectedParticipantId = idParticipante; // Actualiza el participante seleccionado
                this.showDropdown = false;
                await this.$nextTick();
                const contentDiv = this.$refs.htmlContent;
                this.generatePDF();
            }
        },*/
    async updateSelectedParticipants(participant) {
      console.log(participant)
      if (participant.selected) {
        // Si se selecciona un participante, se agrega a la lista de seleccionados
        this.selectedParticipants.push(participant);
        this.listaPersonificadores.push(participant)
      } else {
        // Si se deselecciona, se busca y elimina de la lista de seleccionados
        const index = this.selectedParticipants.findIndex(
          (p) => p.idPersona === participant.idPersona
        );
        if (index !== -1) {
          this.selectedParticipants.splice(index, 1);
        }
      }
    },
    async updateSelectedRepresentantes(representante) {
      console.log(representante)
      if (representante.representanteSelected) {
        // Si se selecciona un representante, se agrega a la lista de seleccionados
        console.log('aqui')
        this.selectedRepresentantes.push(representante);
        this.listaPersonificadores.push(representante)
        console.log(this.selectedRepresentantes)
      } else {
        // Si se deselecciona, se busca y elimina de la lista de seleccionados
        const index = this.selectedRepresentantes.findIndex(
          (r) => r.idPersona === representante.idPersona
        );
        if (index !== -1) {
          this.selectedRepresentantes.splice(index, 1);
        }
      }
    },
    async updateSelectedInvitados(invitado) {
      if (invitado.invitadoSelected) {
        // Si se selecciona un invitado, se agrega a la lista de seleccionados
        console.log('aqui', invitado)
        this.selectedInvitados.push(invitado);
        this.listaPersonificadores.push(invitado)
      } else {
        console.log('aqui2', invitado)
        // Si se deselecciona, se busca y elimina de la lista de seleccionados
        const index = this.selectedInvitados.findIndex(
          (i) => i.idInvitado === invitado.idInvitado
        );
        if (index !== -1) {
          this.selectedInvitados.splice(index, 1);
        }
      }
    },
    async PersonificadorTrue() {
      console.log('personificadores a enviar', this.listaPersonificadores)
      let result = await reunionService.ActualizarPersonificador(this.listaPersonificadores)

    },
    async AsistenciaParticipantesTrue(id) {
      this.IdReunion = id;
      let listaParticipante = await reunionService
        .obtenerListaParticipanteIdReunio(id)
        .then((res) => {
          this.listaParticipants = res;
        });
      console.log('tal de',this.listaParticipants)
      // = this.listaParticipants.filter(
      //   (x) => x.asistencia == true
      // );
    },
    /* async CambiarAsistenciaParticipante(idParticipante) {
            try {

                this.formRequest.listaParticipantes = this.formRequest.listaParticipantes.map(participant => {
                    if (participant.id === idParticipante) {
                        participant.asistencia = !participant.asistencia;
                    }
                    return participant;
                });
                this.participants = this.formRequest.listaParticipantes.filter(participant => participant.asistencia === true);

                this.toast.success(result.data.message);

            } catch (error) {
                console.error(error);
                this.toast.error("Hubo un error al cambiar la asistencia del participante.");
            }
        },

        async Asitencia(idParticipante) {
            try {
                await this.CambiarAsistenciaParticipante(idParticipante);
            } catch (error) {
                console.error(error);
                this.toast.error("Hubo un error al cambiar la asistencia del participante.");
            }
        }, */
  },
  async created() {
    try {
      const params = this.$route.params
      let url = new URLSearchParams(window.location.search);
      let param = params.idReunion
      if (param != null) {
        await this._obtenerDatosActualizar(param);
        await this.AsistenciaParticipantesTrue(param);
        // this.participants = this.formRequest.listaParticipantes.filter(
        //   (participant) => participant.asistencia === true
        // );
        this.formRequest.listaParticipantes
        // = this.participants;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<template>
  <VRow>
    <VCol style="position: absolute;" cols="1">
      <VBtn :to="{ name: 'reunion-reuniones' }" size="38" color="cafe">
        <VIcon icon="tabler-arrow-left" size="22" />
      </VBtn>
      <!-- <RouterLink :to="{ name: 'reunion-reuniones' }">
                <VBtn color="#b48d57">
                    <VIcon start icon="tabler-arrow-left" />
                </VBtn>
            </RouterLink> -->
    </VCol>
    <VCol cols="12">
      <div class="d-flex justify-center">
        <div class="dropdown">

          <VBtn class=" dropbtn" style="background-color: #b48d57; color: #8e3040" @mouseenter="showDropdown = true">
            Seleccionar participante</VBtn>
          <div style="left: 25%;" class="dropdown-content" v-if="showDropdown">
            <VCard>

              <VCol cols="12" md="12">
                <AppTextField v-model="search" density="compact" placeholder="Buscar..."
                  append-inner-icon="tabler-search" single-line hide-details dense outlined class="input-buscar" />
              </VCol>



              <VCardItem>
                <VCol cols="12" md="12">
                  <VDataTable :headers="headersAsistencia" :items="listaParticipants" :search="search">
                    <template #item.actions="{ item }">
                      <VCheckbox v-if="item.asistencia == true && item.representador == null" v-model="item.selected"
                        @change="updateSelectedParticipants(item)" class="checkbox-selected" />
                    </template>
                    <template #expanded-row="slotProps">
                      <tr class="v-data-table__tr">
                        <td :colspan="headersAsistencia.length">
                          <table class="table" style="width:100%;text-align:center">
                            <thead>
                              <tr>
                                <th>Invitado</th>
                                <th>Cargo</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody v-for="(persona, index) in slotProps" :key="index">
                              <tr v-for="(invitado, keyInvitado) in persona?.invitado" :key="keyInvitado">

                                <td v-if="invitado.asistencia != false">{{ invitado?.persona }}
                                <small> <p v-if="invitado.personificador == true">Ya se generó Personificador de esta persona</p></small>
                                </td>
                                <td v-if="invitado.asistencia != false">{{ invitado?.cargo }} </td>
                                <td v-if="invitado.asistencia != false">
                                  <VCheckbox v-if="persona.invitado != null"
                                    v-model="invitado.invitadoSelected"
                                    @change="updateSelectedInvitados(invitado)" class="checkbox-selected" />
                                  <span v-else></span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </template>
                    <template #item.persona="{ item }">
                      <td v-if="item.asistencia == true">
                        <p v-if="item.representador == null">{{ item.persona }}
                        <p v-if="item.personificador == true"><small>Ya se generó Personificador de esta persona</small></p>
                        </p>
                        <p v-else><strike>{{ item.persona }}</strike><br><small>Solo se generara personificador del
                            representante</small></p>
                      </td>
                      <td v-else>
                        <p v-if="item.representador == null"><b>{{ item.persona }}</b> No ah pasado su asistencia</p>
                        <p v-else><strike>{{ item.persona }}</strike> <br><small>Solo se generara personificador del
                            representante</small></p>
                      </td>
                    </template>
                    <template #item.representador.persona="{ item }">
                      <td v-if="item.representador != null">
                        <p v-if="item.representador?.asistencia == true">{{ item.representador?.persona }}
                          <p v-if="item.representador?.personificador == true"><small>Solo se generara personificador del
                            representante</small></p>
                        </p>
                        <p v-else><b>{{ item.representador?.persona }}</b> No ah pasado su asistencia</p>
                      </td>
                      <td v-else>
                        Sin representante
                      </td>

                    </template>

                    <!-- <template #item.invitado.persona="{ item }">
                      <td v-if="item.invitado != null">
                        <p v-if="item.invitado?.asistencia == true">{{ item.invitado?.persona }}</p>
                        <p v-else><b>{{ item.invitado?.persona }}</b> no ah pasado su asistencia</p>
                      </td>
                      <td v-else>
                        Sin invitado
                      </td>
                    </template> -->

                    <template #item.actionsR="{ item }">
                      <VCheckbox v-if="item.representador != null && item.representador?.asistencia != false"
                        v-model="item.representador.representanteSelected"
                        @change="updateSelectedRepresentantes(item.representador)" class="checkbox-selected" />
                      <span v-else></span>
                    </template>
<!-- 
                    <template #item.actionsI="{ item }">
                      <VCheckbox v-if="item.invitado != null && item.invitado?.asistencia != false"
                        v-model="item.invitado.invitadoSelected" @change="updateSelectedInvitados(item.invitado)"
                        class="checkbox-selected" />
                      <span v-else></span>
                    </template> -->
                  </VDataTable>
                </VCol>
              </VCardItem>
              <VCardActions>
                <VSpacer />
                <VBtn color="success" @click="generatePDF()" variant="outlined">
                  Imprimir
                </VBtn>
                <VSpacer />
              </VCardActions>
            </VCard>
          </div>
        </div>
      </div>
    </VCol>
  </VRow>

  <iframe :src="pdfObject" style="width: 100%; height: 800px"></iframe>
  <div style="display: none" >
    <div ref="htmlContent">
      <div v-for="(participant, index) in selectedParticipants" :key="index">
        <div class="contain-all" >
          <!-- style="background-color: hsl(0, 0%, 53%)" -->
          <div class="container">
            <div class="contain2">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }} </b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">{{participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; ">{{ participant.cargo }}</div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>

              </div>
            </div>
            <div class="contain">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }}</b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">{{
        participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; ">{{ participant.cargo }}</div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(participant, index) in selectedRepresentantes" :key="index">
        <div class="contain-all" >
          <!-- style="background-color: hsl(0, 0%, 53%)" -->
          <div class="container">
            <div class="contain2">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }} </b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">
                  {{ participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; ">{{ participant.cargo }}</div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>

              </div>
            </div>
            <div class="contain">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }}</b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">{{participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; "> {{ participant.cargo }} </div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(participant, index) in selectedInvitados" :key="index">
        <div class="contain-all" >
          <!-- style="background-color: hsl(0, 0%, 53%)" -->
          <div class="container">
            <div class="contain2">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }} </b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">{{
        participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; ">{{ participant.cargo }}</div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>

              </div>
            </div>
            <div class="contain">
              <div style="width: 280px;  height: 105px">

                <p class="p1-nombre">
                  <b>{{ participant.nombres }}</b>
                </p>
                <p class="p1-nombre">
                  <b>{{ participant.apPaterno }} {{ participant.apMaterno }}</b> <br>
                <div v-if="participant.cargoPersona != null" style="font-size: 10px; width: 400px; ">{{
        participant.cargoPersona }}</div>
                <div v-else style="font-size: 10px; width: 400px; ">{{ participant.cargo }}</div>
                </p>
              </div>
              <div style="width: 350px">
                <div class="p2-cargo" style=" font-size: 15px;"  v-if="participant.idDependencia != null || participant.idDependencia != 0 || participant.dependencia != '' ">
                  <b>{{ participant.dependencia }}</b>
                </div>
                <div class="p2-cargo" style=" font-size: 15px" v-if="participant.dependencia == null || participant.dependencia == '' || participant.idDependencia == 0 || participant.idDependencia == null">
                  <b>Sociedad Civil</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.p2-cargo {
  color: black;
}

/* Estilo del botón principal */
.dropbtn {
  margin-right: 400px;
  background-color: #f1f1f1;
  color: #333;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  width: 685px;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* Estilo del contenido desplegable */
.dropdown-content {

  display: none;
  position: fixed;

  /* Comentar esta línea para quitar la posición fija */
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 3;
  width: 1200px;
  max-height: 500px;
  /* o cualquier otra altura máxima deseada */
  overflow-y: auto;
  /* Agregar overflow-y para permitir el scroll */
}


/* Mostrar el contenido al pasar el mouse por el botón */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Asegurarse de que la lista se cierre al hacer clic fuera de ella */
.dropdown-content:focus-within {
  display: block;
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 1122px;
  width: 100%;
}

.contain {
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 660px;
  width: 47%;
  padding-bottom: 150px;
}

.contain2 {
  transform: rotate(180deg);
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  padding-top: 660px;
  width: 47%;
  padding-bottom: 150px;
}

.contain-all {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.p1-nombre {
  font-size: 1.5rem;
  color: #000000;
  margin: 0;
}
</style>
