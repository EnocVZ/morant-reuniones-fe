<script>
import html2pdf from 'html2pdf.js';
import { PDFDocument, PDFImage, StandardFonts, rgb } from 'pdf-lib';
import reunionService from '@/services/reuniones-service'
import configuracionService from "@/services/configuracion-service"
export default {
  data() {
    return {
      formRequest: {
        idRunion: 0,
        titulo: '',
        fecha: '',
        hora: '',
        lugar: '',
        tema: '',
        rqActa: false,
        listaOrden: [],
        listaParticipantes: []
      },
      pdfObject: null,
      totalSillasIndependientes: 0, // Reemplaza con el valor real
      totalSillasMesa: 0, // Reemplaza con el valor real
      sillasIndependientes: [], // Reemplaza con tus datos reales
      sillasIzquierda: [],
      sillasDerecha: [],
      contadorTotalParticipantes: 0,
      listaParticipantes: [],
      listaParticipanteOrdenMesa: [],
      NombreLugar: null,
      Configuraciones: {
        id: 1,
        titulo: '',
        instanciaW: '',
        tokenW: ''
      }
    };
  },
  computed: {
    agruparPorDependencia() {
      const participantesPorDependencia = [];

      this.formRequest.listaParticipantes.forEach(participante => {
        const dependencia = participante.dependencia || 'Sociedad Civil';

        const dependenciaExistente = participantesPorDependencia.find(item => item.nombre === dependencia);

        if (!dependenciaExistente) {
          participantesPorDependencia.push({
            OrdenDependencia: participante.ordenDependencia != null ? participante.ordenDependencia : participantesPorDependencia.length + 1,
            nombre: dependencia,
            participantes: [{
              IdParticipante: participante.id,
              persona: participante.persona || participante.nombres,
              IdDependencia: participante.idDependencia,
              IdReunion: participante.idReunion,
              OrdenMesa: participante.ordenMesa,
              OrdenParticipante: participante.ordenParticipante != null ? participante.ordenParticipante : null,
              firma: participante.firma,
              id: participante.id,
              ordenFirmar: participante.ordenFirmar,
              cargoPersona: participante.cargoPersona,
              idRepresentado: participante.idRepresentado,
              personaRepresentar: participante.personaRepresentar,
              invitadoPor: participante.invitadoPor,
              idInvitante: participante.idInvitante,
              numeroPar: this.formRequest.listaParticipantes.length
            }]
          });
        } else {
          dependenciaExistente.participantes.push({
            IdParticipante: participante.id,
            persona: participante.persona || participante.nombres,
            IdDependencia: participante.idDependencia,
            IdReunion: participante.idReunion,
            OrdenMesa: participante.ordenMesa,
            OrdenParticipante: participante.ordenParticipante != null ? participante.ordenParticipante : null,
            firma: participante.firma,
            id: participante.id,
            ordenFirmar: participante.ordenFirmar,
            cargoPersona: participante.cargoPersona,
            idRepresentado: participante.idRepresentado,
            personaRepresentar: participante.personaRepresentar,
            invitadoPor: participante.invitadoPor,
            idInvitante: participante.idInvitante
          });
        }
      });

      participantesPorDependencia.sort((a, b) => a.OrdenDependencia - b.OrdenDependencia);

      participantesPorDependencia.forEach(dependencia => {
        dependencia.participantes.sort((a, b) => a.OrdenParticipante - b.OrdenParticipante);
      });

      return participantesPorDependencia;
    }
  },
  methods: {
    getContadorParticipantes(participantesPorDependencia, index) {
      let contador = 0;
      for (let i = 0; i < this.agruparPorDependencia.length; i++) {
        if (this.agruparPorDependencia[i] === participantesPorDependencia) {
          contador += index + 1;
          break;
        } else {
          contador += this.agruparPorDependencia[i].participantes.length;
        }
      }
      return contador;
    },

    async _obtenerDatosActualizar(id) {
      let result = await reunionService.obtenerDatosActualizarPar(id)
      this.formRequest = result.data
      this.generatePDF();
    },
    async obtenerConfiguraciones(id) {
      try {
        let result = await configuracionService.listarConfiguracionPorId(id);
        this.Configuraciones = result.data
        console.log(this.Configuraciones)
      } catch (error) {
        console.log(error)
      }

    },

    /*async _obtenerOrden(id) {
        let result = await reunionService.obtenerListaOrdenXIdReunion(id)
        this.formRequest = result.data
        console.log(this.formRequest)
        this.generatePDF();
    },*/
    async generatePDF() {
      const element = this.$refs.htmlContent;

      const options = {
        margin: [55, 0, 25, 0],
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        filename: 'archivo.pdf',
        //pagebreak: { mode: 'always' }
      };

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

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
        const totalPages = pdfDoc.getPageCount();
        //const imageBytes = await fetch('/src/assets/images/logos/Back_Mesa_2_Gris.png').then(res => res.arrayBuffer());
        const imageBytes = await fetch(`${import.meta.env.BASE_URL ?? '/'}images/logos/Back_Mesa_2_Gris.png`).then(res => res.arrayBuffer());
        const imagen = await pdfDoc.embedPng(imageBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Fuente en negrita

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();
          const dims = { width, height };

          const imageY = dims.height - imagen.height - 20 - 20;

          // Dibujar encabezado en cada página
          const drawHeader = () => {
            const textWidth = font.widthOfTextAtSize('Subsecretaría General de Gobierno', 10);
            const textHeight = font.heightAtSize(10);
            // const textWidth2 = font.widthOfTextAtSize('Secretaría Particular', 9);
            // const textHeight2 = font.heightAtSize(9);

            const startY = height - textHeight - 140; // Iniciar en esta coordenada
            const xOffset = 40; // Desplazamiento hacia la derecha

            page.drawText('Subsecretaría General de Gobierno', {
              x: width - textWidth - 75 + xOffset,
              y: startY,
              size: 8,
              //font: boldFont, // Usar la fuente en negrita
              color: rgb(0.5019607843137255, 0.5019607843137255, 0.5019607843137255)
            });

            // page.drawText('Secretaría Particular', {
            //   x: width - textWidth2 - 75 + xOffset,
            //   y: startY - textHeight - 5, // Ajustar la posición para alinear el texto
            //   size: 9,
            //   font: boldFont,
            // });

            // const text3 = `Tema: ${this.formRequest.tema}`;
            // const textWidth3 = font.widthOfTextAtSize(text3, 8);
            // const textHeight3 = font.heightAtSize(8);
            // page.drawText(text3, {
            //   x: width - textWidth3 - 70 + xOffset,
            //   y: startY - textHeight - textHeight3 - 10, // Ajustar la posición para alinear el texto
            //   size: 8,
            //   font: font,
            // });

            // const text4 = `Fecha: ${this.formRequest.fechaString}`;
            // const textWidth4 = font.widthOfTextAtSize(text4, 7);
            // const textHeight4 = font.heightAtSize(7);
            // page.drawText(text4, {
            //   x: width - textWidth4 - 70 + xOffset,
            //   y: startY - textHeight - textHeight3 - textHeight4 - 15, // Ajustar la posición para alinear el texto
            //   size: 7,
            //   font: font,
            // });
            const additionalText = `${new Date().getFullYear()}    . ${this.Configuraciones.titulo} `;
            const maxWidth = 375; // Ancho máximo permitido para el texto en puntos (ajusta según sea necesario)
            const lineSpacing = 2; // Espaciado adicional entre líneas
            // Función para dividir el texto si es demasiado largo
            const splitTextIfNeeded = (text, maxWidth) => {
              const words = text.split(' ');
              let lines = [''];
              let currentLine = 0;

              for (const word of words) {
                const width = boldFont.widthOfTextAtSize(word, 12);
                if (width > maxWidth) {
                  // Si la palabra es más ancha que el ancho máximo permitido, dividirla
                  const wordParts = word.match(new RegExp(`.{1,${Math.floor(maxWidth / 5)}}`, 'g'));
                  lines[currentLine] += wordParts[0]; // Agrega la primera parte a la línea actual

                  for (let i = 1; i < wordParts.length; i++) {
                    lines.push(''); // Crea una nueva línea
                    currentLine++;
                    lines[currentLine] += wordParts[i]; // Agrega el resto de las partes a nuevas líneas
                  }
                } else if (boldFont.widthOfTextAtSize(lines[currentLine] + word, 12) > maxWidth) {
                  // Si agregar la palabra excede el ancho máximo permitido, pasa a una nueva línea
                  lines.push('');
                  currentLine++;
                  lines[currentLine] += word;
                } else {
                  lines[currentLine] += (lines[currentLine] ? ' ' : '') + word; // Agrega la palabra a la línea actual
                }
              }

              return lines.reverse().join('\n'); // Invertimos el orden de las líneas
            };

            // Divide el texto si es demasiado largo y lo muestra en el orden correcto
            const dividedText = splitTextIfNeeded(additionalText, maxWidth);

            // Calcula la altura del texto dividido y establece la posición vertical para dibujar el texto en la parte superior
            const textLines = dividedText.split('\n');
            const textHeightH = boldFont.heightAtSize(12) * textLines.length;
            const startYAdditional = height - textHeightH - 110; // Cambia esta posición según sea necesario
            const startX = width / 2;

            for (let i = 0; i < textLines.length; i++) {
              const line = textLines[i];
              const textWidth = boldFont.widthOfTextAtSize(line, 12);
              const startXLine = startX - textWidth / 2; // Calcula el inicio para centrarlo

              // Dibuja cada línea centrada horizontalmente con el espaciado adicional
              const defaultTextColor = { color: rgb(0.5019607843137255, 0.5019607843137255, 0.5019607843137255) }; // Color por defecto para el texto

              // Si la línea contiene el texto del año, reemplaza solo el color del año
              let textColor = defaultTextColor; // Asigna el color por defecto por si no se cambia

              if (line.includes(new Date().getFullYear().toString())) {
                const yearIndex = line.indexOf(new Date().getFullYear().toString());
                const yearText = line.substring(yearIndex, yearIndex + new Date().getFullYear().toString().length);
                const beforeYear = line.substring(0, yearIndex);
                const afterYear = line.substring(yearIndex + yearText.length);
                const beforeWidth = boldFont.widthOfTextAtSize(beforeYear, 12);
                const yearWidth = boldFont.widthOfTextAtSize(yearText, 12);

                page.drawText(beforeYear, {
                  x: startXLine - beforeWidth / 2,
                  y: startYAdditional + i * (boldFont.heightAtSize(12) + lineSpacing),
                  size: 10,
                  font: boldFont,
                  lineHeight: 16,
                  ...defaultTextColor,
                });

                page.drawText(yearText, {
                  x: startXLine - beforeWidth / 2 + yearWidth / 2,
                  y: startYAdditional + i * (boldFont.heightAtSize(12) + lineSpacing),
                  size: 10,
                  font: boldFont,
                  lineHeight: 16,
                  color: rgb(0.5019607843137255, 0.5019607843137255, 0.5019607843137255)
                });

                page.drawText(afterYear, {
                  x: startXLine - beforeWidth / 2 + yearWidth,
                  y: startYAdditional + i * (boldFont.heightAtSize(12) + lineSpacing),
                  size: 10,
                  font: boldFont,
                  lineHeight: 16,
                  ...defaultTextColor,
                });

                continue; // Continuar al siguiente ciclo sin dibujar la línea completa al final
              }

              // Si no se trata del año, se dibuja la línea completa con el color por defecto
              page.drawText(line, {
                x: startXLine,
                y: startYAdditional + i * (boldFont.heightAtSize(12) + lineSpacing),
                size: 10,
                font: boldFont,
                lineHeight: 16,
                ...defaultTextColor,
              });
            }
          };

          drawHeader();
          const pageNumberText = `${i + 1}`;
          const pageNumberTextWidth = boldFont.widthOfTextAtSize(pageNumberText, 8);
          const pageNumberX = 390; // Ajusta la posición x del número de página

          page.drawText(pageNumberText, {
            x: pageNumberX,
            y: 20,
            size: 12,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
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
    crearSilla(numeroSilla) {
      return {
        ordenMesa: numeroSilla,
        nombre: `Nombre ${numeroSilla}`,
        descripcion: `Descripción ${numeroSilla}`,
        idParticipante: 0,
        idPersona: 0,
        idReunion: 0,
        idGenero: 0,
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
          const actParticipant = this.formRequest.listaParticipantes.find(
            (actParticipant) =>
              actParticipant.idParticipante ===
              participanteSeleccionado.idParticipante
          );
          actParticipant.ordenMesa = silla.ordenMesa;
        } else {
          const silla = lista.find((silla) => silla.ordenMesa === numSilla);
          if (silla !== undefined) {
            let ListaDatos = this.formRequest.listaParticipantes.filter(
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
              const actParticipant = this.formRequest.listaParticipantes.find(
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
    },
    async OpenMesa() {

      this.AsiganarParticipantesAListaOrdenMesa();
      console.log("Datos de lista");
      console.log(this.formRequest.listaParticipantes);
      this.NombreLugar = this.formRequest.lugar;
      this.totalSillasIndependientes = this.formRequest.listaParticipantes.length;
      this.totalSillasMesa = this.formRequest.totalLugares;
      this.generarSillasEnColumnas();
      this.generarSillasIndependientes();
      //Verificar si se edito la lista de particiantes que se agregar a la lista listaParticipanteOrdenMesa
      this.listaParticipanteOrdenMesa.forEach((elemento) => {
        if (elemento.ordenMesa != null && elemento.ordenMesa !== 0)
          this.actualizarValoresSillas(elemento.ordenMesa, elemento);
      });
      this.formRequest.listaParticipantes.forEach(participante => {
        console.log('------------------>>>><', participante?.representador)
        if (participante?.representador !== null) {
          this.totalSillasIndependientes--;
        }
      });
      console.log("Silla Independientes");
      console.log(this.sillasIndependientes);
      console.log("Sillas de la derecha");
      console.log(this.sillasDerecha);
      console.log("Silla de la Izquierda");
      console.log(this.sillasIzquierda);
      console.log(this.formRequest.lugar);
      console.log("Da " + this.NombreLugar);
      console.log(this.totalSillasMesa);
      console.log(this.totalSillasIndependientes);
    },
    AsiganarParticipantesAListaOrdenMesa() {
      this.formRequest.listaParticipantes.forEach((elemento) => {
        this.listaParticipanteOrdenMesa.push(elemento);
      });
    },
    // CerrarOrdenMesa() {
    //     this.totalSillasIndependientes = 0; // Reemplaza con el valor real
    //     this.totalSillasMesa = 0; // Reemplaza con el valor real
    //     this.sillasIndependientes = []; // Reemplaza con tus datos reales
    //     this.sillasIzquierda = [];
    //     this.sillasDerecha = [];
    //     this.listaParticipantes = [];
    //     this.listaParticipanteOrdenMesa = [];
    //     this.NombreLugar = "";
    // }
  },
  async created() {
    const params = this.$route.params
    await this.obtenerConfiguraciones(this.Configuraciones.id)
    let url = new URLSearchParams(window.location.search)
    let param = params.idReunion
    if (param != null)
      await this._obtenerDatosActualizar(param)
    this.contadorTotalParticipantes = this.formRequest.listaParticipantes.length;
    await this.OpenMesa()
  }
}
</script>
<template>
  <VRow>
    <VCol cols="12" md="12">
      <RouterLink :to="{ name: 'reunion-reuniones' }">
        <!-- <VBtn color="#b48d57">
          <VIcon start icon="tabler-arrow-left" />
        </VBtn> -->
      </RouterLink>
      <VBtn :to="{ name: 'reunion-reuniones' }" size="38" color="cafe">
        <VIcon icon="tabler-arrow-left" size="22" />
      </VBtn>
    </VCol>
    <VCol cols="12" md="12"></VCol>
  </VRow>
  <iframe :src="pdfObject" style="width: 100%; height: 1500px;"></iframe>
  <!-- style="display: none" -->
  <div style="display: none">
    <div ref="htmlContent">
      <div class="contain">
        <div class="main-pdf">
          <div class="conte">
            <section style="/*page-break-after: always*/">
              <p class="titulo-b" style="text-align: center;"><b>{{ formRequest.titulo }}</b></p>
              <table>
                <tbody class="tabla-body">
                  <tr>
                    <td>Fecha:</td>
                    <td>{{ formRequest.fechaString }}</td>
                  </tr>
                  <tr>
                    <td>Hora:</td>
                    <td>{{ formRequest.hora }} horas.</td>
                  </tr>
                  <tr>
                    <td>Lugar:</td>
                    <td>{{ formRequest.lugar }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="orden">
                <b>ORDEN DEL DÍA</b>
              </p>
              <div>
                <table style="text-align: center; border-collapse: collapse; ">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Intervenciones y momentos</th>
                      <th>Tiempos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(orden, index) in formRequest.listaOrden" :key="index">
                      <td style="text-align: center;">{{ orden.numOrden }}</td>
                      <td class="conte-orden" style="table-layout: auto;">
                        <p class="titular"><b>{{ orden.descripcion }}</b></p>
                        <div v-for="(persona, personaIndex) in orden.listaPersona" :key="personaIndex">
                          <p class="titular"><b>{{ persona.persona }}</b></p>
                          <p class="titular">{{ persona.cargo }}</p>
                          <!-- <div v-if="persona.representador?.idPersona > 0">
                            <b>Representante</b>
                            <p class="titular"><b>{{ persona.representador?.persona }}</b></p>
                          </div>
                          <div v-if="persona.invitado != null">
                            <b>Invitado</b>
                            <p class="titular"><b>{{ persona.invitado?.persona }}</b></p>
                          </div> -->
                        </div>
                      </td>
                      <td style="text-align: center; ">
                        <p class="horas">{{ orden.minutos }}</p>
                        <p style="white-space: nowrap;" class="horas">{{
        orden.inicioString
      }} a {{ orden.finalString }}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="page-break-before: always;">
                <p class="orden">
                  <b>PARTICIPANTES</b>
                </p>
                <div v-for="(participantesPorDependencia, dependencia) in agruparPorDependencia" :key="dependencia">
                  <p class="parti">
                    <b>{{ participantesPorDependencia.nombre }}</b>
                  </p>
                  <table style="text-align: center;">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody style="text-align: center; border-collapse: collapse;">
                      <tr v-for="(participante, index) in participantesPorDependencia.participantes" :key="index">
                        <td style="text-align: right; font-weight: bold;">{{
        getContadorParticipantes(participantesPorDependencia, index) }}.
                        </td>
                        <td class="conte-orden">
                          <div v-if="participante.personaRepresentar == null || participante.personaRepresentar == ''">
                            <p class="titular"><b>{{ participante.persona }}</b></p>
                            <p class="titular">{{ participante.cargoPersona }}</p>
                          </div>
                          <div v-else>
                            <p class="titular">
                            <p class="titular"><b>{{ participante.persona }}</b></p>
                            <p class="titular">{{ participante.cargoPersona }}</p>
                            <br>
                            <b>En
                              representación
                              de:</b>
                            <br>
                            <b>{{ participante.personaRepresentar }}</b> <br>
                            </p>
                          </div>
                          <div v-if="participante.idInvitante > 0">
                            <b>Invitado por {{ participante.invitadoPor }}</b><br>
                          </div>


                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
              <div style="page-break-before: always; ">
                <div style="width:800px; max-width: 100%;">
                  <div class="text-center">
                    <p class="sub-titulo" color="cafe">
                      <b>Asignación de lugares en la Sala de Juntas.<br>
                        {{ this.NombreLugar }}</b>
                    </p>
                  </div>

                  <VRow class="conte-texto centross" style="padding-top: 0;">

                    <VCol cols="2" v-if="totalSillasIndependientes > totalSillasMesa">
                      <div class="mafe">
                        <div style="margin-right:100px;">
                          <div class="independiente" style="margin-right: 100px;">
                            <div class="persona-indepe" v-for="(silla, index) in sillasIndependientes" :key="index">
                              <p class="mb-0">
                                <b>{{ silla.nombre }}</b>
                              </p>
                              <p class="mb-0">{{ silla.descripcion }}</p>
                              <p v-if="silla.idRepresentado > 0 && silla.idRepresentado !== null"><b>Representante de {{
        silla.personaRepresentar }}</b></p>
                              <p v-if="silla.idInvitante > 0 && silla.idInvitante !== null"><b>Invitado de {{
        silla.invitadoPor }}</b></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </VCol>
                    <VCol cols="10" style=" padding-left: 100px;">
                      <div class="text-center conte-perso">
                        <div class="contenidoPersona">
                          <div v-if="this.sillasIzquierda.length > 0">
                            <p>
                              <b>{{ this.sillasIzquierda[0].nombre }}</b>
                            </p>
                            <p>{{ this.sillasIzquierda[0].descripcion }}</p>
                            <VIcon class="">
                              <img class="" width="15" src="../../assets/images/logos/Icono_rojo.png" alt="">
                            </VIcon>
                          </div>
                        </div>
                      </div>
                      <VRow>
                        <VCol cols="5" class="contenidoSilla">
                          <div v-for="silla in sillasIzquierda.slice(1)" :key="silla.ordenMesa">
                            <VRow>
                              <VCol cols="10" class="text-center ps-0">
                                <div>
                                  <p class="mb-0">
                                    <b>{{ silla.nombre }}</b>
                                  </p>
                                  <p class="mb-0">{{ silla.descripcion }}</p>
                                  <p v-if="silla.idRepresentado > 0 && silla.idRepresentado !== null"><b>Representante
                                      de
                                      {{ silla.personaRepresentar }}</b></p>
                                  <p v-if="silla.idInvitante > 0 && silla.idInvitante !== null"><b>Invitado de
                                      {{ silla.invitadoPor }}</b></p>
                                </div>
                              </VCol>
                              <VCol cols="2" class="ps-0">
                                <div class="conte-silla d-flex">
                                  <div v-if="silla.idGenero == 1">
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso-3.ico"
                                        alt="">
                                    </VIcon>
                                  </div>
                                  <div v-else-if="silla.idGenero == 2">
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso-1(1).ico"
                                        alt="">
                                    </VIcon>
                                  </div>
                                  <div v-else>
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso-2(1).ico"
                                        alt="">
                                    </VIcon>
                                  </div>
                                  <div>
                                    <VBtn size="18" color="primary">
                                      <span size="12">{{ silla.ordenMesa }}</span>
                                    </VBtn>
                                  </div>
                                </div>
                              </VCol>
                            </VRow>
                          </div>
                        </VCol>
                        <VCol cols="2">
                          <div class="ms" ref="msElement"></div>
                        </VCol>
                        <VCol cols="5" class="contenidoSilla" style="padding-left:25px;">
                          <div v-for="silla in sillasDerecha" :key="silla.ordenMesa">
                            <VRow>
                              <VCol cols="2" class="sill2">
                                <div class="conte-silla d-flex">
                                  <div>
                                    <VBtn size="18" color="primary" class="" title="Silla libre">
                                      <span size="12">{{ silla.ordenMesa }}</span>
                                    </VBtn>
                                  </div>
                                  <div v-if="silla.idGenero == 1">
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso H12.png"
                                        alt="">
                                    </VIcon>
                                  </div>
                                  <div v-else-if="silla.idGenero == 2">
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso M14.png"
                                        alt="">
                                    </VIcon>
                                  </div>
                                  <div v-else>
                                    <VIcon class="">
                                      <img class="" width="15" src="../../assets/images/icons/file/Recurso 13.png"
                                        alt="">
                                    </VIcon>
                                  </div>
                                </div>
                              </VCol>
                              <VCol cols="10" class="text-center">
                                <div>
                                  <p class="mb-0">
                                    <b>{{ silla.nombre }}</b>
                                  </p>
                                  <p class="mb-0">{{ silla.descripcion }}</p>
                                  <p v-if="silla.idRepresentado > 0 && silla.idRepresentado !== null"><b>Representante
                                      de
                                      {{ silla.personaRepresentar }}</b></p>
                                  <p v-if="silla.idInvitante > 0 && silla.idInvitante !== null"><b>Invitado de {{
                                      silla.invitadoPor }}</b></p>
                                </div>
                              </VCol>
                            </VRow>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div class="filler"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}

.mafe {
  /* Margen izquierdo */
 /* Ajusta el valor según sea necesario */
  /* Float */
  float: left;

  /* Flexbox */
  align-self: flex-start; /* Alinea el elemento hacia el principio del contenedor flex */

  /* Grid layout */
  justify-self: start; /* Alinea el elemento hacia el principio del contenedor grid */
}

.horas {
  font-size: 12px;
  font-weight: bold;
  margin: 0%;
}

header {
  text-align: center;
  margin-top: 28px;
}


.tabla-body,
tr td {
  text-align: left;
}

tr {
  page-break-inside: avoid;
  height: auto;

}

.orden {
  margin: 28px;
  text-align: center;
}

.titulo-b b,
.orden b {
  font-size: 15px;
  color: #595959;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: black;
}

th,
td {
  border: 1px solid #ddd;
  padding: 4px;
  text-align: center;
}

.conte-orden {
  text-align: left;
}

.conte-orden img {
  display: block;
  /* Otros estilos opcionales para la imagen */
  /* width: 100%; */
  /* Opcional: haz que la imagen ocupe el ancho del contenedor */
  /* height: auto; */
  /* Opcional: mantiene la proporción de la imagen */
}

th {
  background-color: #dbdad9c4;
}

.titular {
  margin-bottom: 0%;
}

.parti {
  color: #8e8c8c;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 15px;
}

.sub-titulo {
  font-size: 15px;
  margin-top: 25px;
  color: #7b7b7b;
}

.sub-titulo {
  font-size: 15px;
  margin-top: 25px;
  justify-content: center;
  align-items: center;
}

/* /////////////////////////////////////////////////////////////////////////////////////////*/
/* //////////////////////////////////   mesa con la silla //////////////////////////////////*/
/* /////////////////////////////////////////////////////////////////////////////////////////*/

.ms {
  border: 25px solid #8e3040;
  width: 70px;
  min-height: 100%;
  transition: height 0.5s ease;
  border-radius: 12px;
  position: relative;
  margin: auto;
}

.conte-texto {
  color: #000;
}

.conte-texto p {
  margin-bottom: 0;
  font-family: c;
}

.text-center div p {
  margin-bottom: 0;
  font-family: Calibri;
  font-size: 12px;
}

.conte-silla {
  height: 100%;
  margin-top: 17px;
}

.contenidoSilla {
  height: auto;
}

.conte-perso {
  justify-content: center;
  display: flex;
}

.contenidoPersona {
  width: 300px;
  height: 100%;
  padding: 15px;
  padding-top: 0;
  padding-bottom: 5px;
}

.persona-indepe {
  text-align: center;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 12px;
  width: 120px;
  color: black;
  margin-bottom: 15px;
}

.independiente {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-left: 0;
}

.sill2 {
  padding-left: 0;
}

.centross {
  justify-content: center;
  display: flex;
}

.main-pdf {
  margin-left: 80px;
  margin-right: 60px;
}
</style>