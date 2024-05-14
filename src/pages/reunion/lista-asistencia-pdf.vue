<script>
import html2pdf from 'html2pdf.js';
import { PDFDocument, PDFImage, StandardFonts, rgb } from 'pdf-lib';
import reunionService from '@/services/reuniones-service'
import { useReunionesStore } from "@/stores/reuniones"
import { mapActions, mapState } from "pinia";
export default {
  data() {
    return {
      formRequest: {
        idReunion: 0,
        fecha: "",
        hora: "",
        lugar: "",
        listaOrden: [],
        listaParticipantes: [],
      },
      pdfObject: null,
    };
  },
  computed: {
    ...mapState(useReunionesStore, ['ParticipantesData'])
  },
  methods: {
    async _obtenerDatosActualizar(idReunion) {
      let result = await reunionService.obtenerDatosActualizar(idReunion);
      this.formRequest = result.data;
      this.formRequest.listaParticipantes = this.formRequest.listaParticipantes.filter(participant => participant.asistencia === true);
      console.log(this.formRequest);
    },
    async generatePDF() {
      const element = this.$refs.htmlContent;

      const options = {
        margin: [30, 10, 30, 10],
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        filename: 'archivo.pdf',
      };

      try {
        await new Promise((resolve) => setTimeout(resolve, 1));

        const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');

        if (pdfBlob instanceof Blob) {
          const pdfWithImage = await this.agregarImagenDeFondoAPDF(pdfBlob);
          const pdfUrlWithImage = URL.createObjectURL(pdfWithImage);

          this.pdfObject = pdfUrlWithImage;
        } else {
          console.error('PDF Blob no es válido.');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async agregarImagenDeFondoAPDF(pdfBlob) {
      try {
        const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
        const pages = pdfDoc.getPages();
        // const imageBytes = await fetch(
        //   `${import.meta.env.BASE_URL ?? "/"}images/logos/Lista-04.png`
        // ).then((res) => res.arrayBuffer());
        const imageBytes = await fetch(
          `${import.meta.env.BASE_URL ?? "/"}images/logos/Back--04.png `
        ).then((res) => res.arrayBuffer());
        //Lista-04.png
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
            blendMode: 'Multiply',
          });
        }

        const pdfBytes = await pdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
      } catch (error) {
        console.error(error);
        return null;
      }
    },


  },
  async created() {
    try {
      let url = new URLSearchParams(window.location.search);
      let param = url.get("id");

      if (param != null) {
        await this._obtenerDatosActualizar(param);
        this.formRequest.listaParticipantes = this.formRequest.listaParticipantes.filter(participant => participant.asistencia === true);
        this.generatePDF();
        console.log(this.ParticipantesData);
        console.log(this.formRequest.listaParticipantes)
      }
    } catch (error) {
      console.error(error);
    }
  }

}

</script>
<template>
  <VRow>
    <VCol cols="12" md="12">
      <VBtn :to="{ name: 'reunion-reuniones' }" size="38" color="cafe">
        <VIcon icon="tabler-arrow-left" size="22" />
      </VBtn>

    </VCol>
    <VCol cols="12" md="12"></VCol>
  </VRow>
  <iframe :src="pdfObject" style="width: 100%; height: 800px;"></iframe>
  <div style="display: none;">
    <div ref="htmlContent">
      <div class="conte-texto">
        <div class="titulo">
          <p>"{{ formRequest.titulo }}"</p>
        </div>

        <p>Lugar: {{ formRequest.lugar }}</p>
        <p>Fecha: {{ formRequest.fechaString }}</p>
        <p>Hora: {{ formRequest.hora }}</p>
      </div>
      <table style="text-align: center; ">
        <thead>
          <tr>
            <th>No.</th>
            <th>NOMBRE</th>
            
            <th>CARGO Y DEPENDENCIA</th>
            <!-- <th>TELEFONO</th> -->
            <th>FIRMA</th>
          </tr>
        </thead>
        <tbody style="text-align: center; border-collapse: collapse; ">
          <tr v-for="(participante, index) in ParticipantesData" :key="index" style="page-break-inside: avoid;">
            <td style="text-align: center; font-weight: bold; ">{{ index + 1 }}.
            </td>
            <td class="conte-orden" v-if="participante.representador == null">
              <p class="titular"><b>{{ participante.persona }}</b></p>
              <p v-if="participante.idInvitante > 0"> Invitado</p>
            </td>
            <td class="conte-orden" v-else>
              <p class="titular"><b>{{ participante.representador?.persona }}</b><br><small>Representante</small></p> 
            </td>
            
            <td>
              <div v-if="participante.dependencia != ''">
                <p v-if="participante.cargoPersona" class="titular"><b>{{ participante.cargoPersona }}</b></p>
                <p v-if="participante.cargo" class="titular"><b>{{ participante.cargo }}</b></p>
                <p class="titular">{{ participante.dependencia }} </p>
              </div>
              <div v-else>
                <p class="titular"><b>Sociedad Civil</b></p>
              </div>

            </td>

            <!-- <td style="width: 180px;">
              <p class="titular" v-if="participante.telefono != 'string' && participante.gama == 'Normal'"> {{ participante.telefono }}</p>
            </td> -->
            <td style="width: 180px;">

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
html {
  font-family: 'Public Sans', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #000;
}

.contain {
  text-align: center;
  margin-top: auto;
  font-weight: bold;
  font-size: 1rem;
  color: #000;
}

th {
  background-color: #a5a5a5e0;
}

th,
td {
  border: 1px solid #242323;
  padding: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: black;
}

.conte-texto {
  margin-bottom: 10px;
  font-family: 'Public Sans', sans-serif;

}

.conte-texto p {
  margin-bottom: 0%;
  color: rgb(67, 67, 67);
  font-weight: bold;
  font-family: 'Public Sans', sans-serif;
}

.titulo {
  display: block;
  text-align: center;
  width: 600px;
  height: auto;
  margin-left: 10em;
  font-size: 25px;
  overflow: hidden;
  word-wrap: break-word;
  white-space: normal;
}
</style>