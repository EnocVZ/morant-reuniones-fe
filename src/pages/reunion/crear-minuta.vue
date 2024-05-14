<script>
import configuracionService from "@/services/configuracion-service"
import html2pdf from 'html2pdf.js';
import lugarService from "@/services/lugar-reunion-service"
import { PDFDocument, PDFImage, StandardFonts, rgb } from 'pdf-lib';
import { VCardText, VCol, VDivider, VIcon } from 'vuetify/lib/components/index.mjs';
import reunionService from "@/services/reuniones-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import draggable from 'vuedraggable';
import { VCardActions } from "vuetify/lib/components/index.mjs";
import "vue-toastification/dist/index.css";
import "@styles/style.css";
import { useToast } from "vue-toastification";
import { useCookie } from "@/@core/composable/useCookie";
// <-----------------PARA WORD ----------------->
const tempPath = `${import.meta.env.BASE_URL ?? '/'}wordTemplates/minuta.docx`;  //Ruta de la plantilla
//const tempPath = "/src/assets/wordTemplates/minuta.docx"  //Ruta de la plantilla
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}
// <-----------------PARA WORD ----------------->
export default {
    components: {
        VDataTable,
        VCardActions,
        draggable,
    },
    data() {
        return {
            toast: useToast(),
            currentStep: ref(0),
            isDialogVisible: false,
            includeFiles: ref(true),
            Minutas: [],
            FormMinuta: {
                idMinuta: 0,
                idReunion: 0,
                folio: '',
                resumen: '',
                observaciones: '',
                idEstatusMinuta: 0,
                idEstatusTablero: 0,
                idActorSupervisor: 0,
                listaAcuerdoRequest: [],
                listaParticipantes: [],
            },
            formRequest: {
                idReunion: 0,
                titulo: "",
                fecha: "",
                hora: "",
                lugar: "",
                tema: "",
                rqActa: false,
                listaOrden: [],
                listaParticipantes: [],
                modalidad: ''
            },
            mostrarBtn: false,
            listaParticipantes: [],
            acuerdo: '',
            DatosVinculado: [],
            dependencias: [],
            contador: 1,
            AcuerdoModal: undefined,
            ListaTareaAcuerdoModal: [],
            mostrarContenido: false,
            date: null,
            pdfObject: null,
            acuerdosList: [],
            dialogPDF: false,
            seccionDeshabilitada: false,
            acuerdoDeshabilitado: true,
            dependenciaSeleccionada: [],
            idDependenciaSelec: 0,
            NombreDependenciaSelec: '',
            mostrarPDF: false,
            FormAcuerdoMinuta: '',
            EditorTextoValidar: false,
            ValueEditor: '',
            acuerdoSeleccionado: {
                idAcuerdo: 0,
                acuerdo: '',
                fecha: '',
                dependencia: '',
                nombreDependencia: '',
                idDependencia: 0
            },
            Configuraciones: {
                id: 1,
                titulo: '',
                instanciaW: '',
                tokenW: ''
            },
            isVistasDatos: ref(false),
            evidencias: [], // Lista de archivos subidos
            evidenciasHeaders: [
                { title: 'Nombre del Archivo', key: 'nombre' },
                { title: 'Extensión', key: 'extension' },
                { title: 'Acciones', key: 'actions' },
            ],
            isDialogEvidenciasVisible: false,
            idEliminarDocumento: 0,
            modalEliminarDocumento: false,
            fileData: ref([]),
            isDialogParticipantes: false,
            rerenderKey: 0,
            showDialogConfirm: false,
            participantesParaFirmar: [],
            confirmacionParticipantes: false,
            direccionLugar: {
                id: 0,
                lugar: '',
                direccion: '',
                asientos: 0
            },
        }
    },
    watch: {
        "dependenciaSeleccionada": function (val) {
            console.log('Asignacion de Modalidad', val);
            this.idDependenciaSelec = val.id
            this.NombreDependenciaSelec = val.nombre
        },
        'participantesParaFirmar': {
            handler(newList) {
                this.cambiarOrden();
            },
        },
        'formRequest.listaParticipantes': {
            handler(newList) {
                this.actualizarListaFirmantes();
            },
        },
    },
    computed: {
        agruparPorDependencia() {
            const participantesPorDependencia = [];
            this.formRequest.listaParticipantes.forEach(participante => {
                const dependencia = participante.dependencia || 'Sociedad Civil';

                // Busca si ya existe una entrada para la dependencia en el array dependenciasAgrupadas
                const dependenciaExistente = participantesPorDependencia.find(item => item.nombre === dependencia);

                if (!dependenciaExistente) {
                    // Si la dependencia no existe, crea una nueva entrada para ella
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
                            idInvitante: participante.idInvitante
                        }]
                    });
                } else {
                    // Si la dependencia ya existe, agrega el participante a su lista de participantes
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
                        cargoPersona: participante.cargoPersona, idRepresentado: participante.idRepresentado,
                        personaRepresentar: participante.personaRepresentar,
                        invitadoPor: participante.invitadoPor,
                        idInvitante: participante.idInvitante


                    });
                }
            });

            // Ordenar las dependencias por el campo ordenDependencia
            participantesPorDependencia.sort((a, b) => a.OrdenDependencia - b.OrdenDependencia);

            // Ordenar los participantes dentro de cada dependencia por el campo OrdenMesa
            participantesPorDependencia.forEach(dependencia => {
                dependencia.participantes.sort((a, b) => a.OrdenParticipante - b.OrdenParticipante);
            });
            return participantesPorDependencia;
        },
        AcuerdosFechaFormateadoa() {
            const fechaFormateadaAcuerdos = this.FormMinuta.listaAcuerdoRequest.map((acuerdo) => {
                if (acuerdo.fecha) {
                    acuerdo.fecha = this.formatoFecha(acuerdo.fecha);
                } else {
                    acuerdo.fecha = "Sin fecha";
                }
                return acuerdo;
            });
            return fechaFormateadaAcuerdos;
        }
    },
    // computed:{
    //     ...mapState(useReunionesStore,['MinutaData'])
    // },
    methods: {
        //MODIFIED//////////////////////////////////////////////////////////////
        renderDoc() {
            const Sfecha = this.formRequest.fechaString;
            const Shora = this.formRequest.hora;
            const Slugar = this.formRequest.lugar;
            const Slista = this.formRequest.listaParticipantes;
            const Stitulo = this.formRequest.titulo;
            const Sfolio = this.FormMinuta.folio;
            const Smodalidad = this.formRequest.modalidad;
            const SDepenPar = this.agruparPorDependencia;
            const Sdireccion = this.direccionLugar.direccion;
            const Sminuta = this.AcuerdosFechaFormateadoa;
            const encaOficina = useCookie('nombreOficina').value;
            var Sasuntos = this.FormMinuta.resumen;
            const Syear = `${new Date().getFullYear()}`;
            Sasuntos = Sasuntos ? Sasuntos : 'Sin Resumen';
            const etiquetas = ["<p>", "</p>", "<strong>", "</strong>", "<em>", "</em>", "<s>", "</s>", "<u>", "</u>", "<mark>", "</mark>", "<li>", "</li>", '<p style="text-align: justify">', "<ol>", "</ol>", '<p style="text-align: right">', '<p style="text-align: justify">', '<p style="text-align: center">', '<ul>', '</ul>'];

            etiquetas.forEach(etiqueta => {
                Sasuntos = Sasuntos.replace(new RegExp(etiqueta, 'g'), "");
            });
            etiquetas.forEach(etiqueta => {
                Sminuta.forEach((idunno2) => {
                    idunno2.acuerdo = idunno2.acuerdo.replace(new RegExp(etiqueta, 'g'), "");
                });
            });
            //const Stitulo = `${this.Configuraciones.titulo}`; //{titulo} UNUSED

            console.log("list is");
            console.log(SDepenPar);
            console.log("2nd list is");
            console.log(Sminuta);
            loadFile(tempPath, function (
                error,
                content
            ) {
                if (error) {
                    throw error;
                }
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
                var Help = {
                    LABESTIA: "",
                    participantes: []
                };
                var Help2 = {
                    LABESTIA: "",
                    acuerdos: []
                };
                var Help3 = {
                    LABESTIA: "",
                    participantesDependencia: []
                }
                var num = 1;
                Slista.forEach((idunno) => {
                    console.log("list item");
                    idunno.userAsistencia = num;
                    console.log(idunno);
                    Help.participantes.push(idunno);
                    num = num + 1;
                });
                SDepenPar.forEach((idunno) => {
                    console.log("list itemDEPPPP");
                    idunno.userAsistencia = num;
                    console.log(idunno);
                    Help3.participantesDependencia.push(idunno);
                    num = num + 1;
                });
                Sminuta.forEach((idunno2) => {
                    Help2.acuerdos.push(idunno2);
                });
                console.log("and we got...");

                console.log(Help2);//En serio no me creo que esto haya funcionado :V
                /* var tempDepend='';
                 var tempArray2=[{nombreDependencia:'',dependientes:[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}]}];
                 
                 var SlistOrdered = [{dependencias:[{nombreDependencia:'',dependientes:[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}]}]}];
                 test.forEach((Getdependencia) => {
                   console.log("Whatever im trying here");
                   console.log(Getdependencia);
                 var tempArray=[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}];
                   Getdependencia.forEach((Getparticipante) => {
                     tempDepend=Getdependencia.dependencia;
                     tempArray.push({numeroDependiente:Getdependencia.numeroPar,nombreDependiente:Getdependencia.persona,representanteDependiente:Getdependencia.personaRepresentar,cargoDependiente:Getdependencia.cargoPersona});
                 });
                   tempArray2.push({nombreDependencia:tempDepend,dependientes:tempArray});
               });
                 console.log("Mah list");
                 console.log(SlistOrdered);
                 SlistOrdered=[{dependencias:tempArray2}];*/
                doc.render({
                    fecha: Sfecha,
                    hora: Shora,
                    lugar: Slugar,
                    tema: Stitulo,
                    folio: Sfolio,
                    year: Syear,
                    oficina: encaOficina,
                    direccion: Sdireccion,
                    modalidad: Smodalidad,
                    participantesDependencia: Help3.participantesDependencia,
                    acuerdos: Help2.acuerdos,
                    firmantes: Help.participantes,
                    asuntos: Sasuntos
                });
                var titleDoc = Stitulo + ".docx";
                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType:
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                });
                // Output the document using Data-URI

                saveAs(out, titleDoc);
            });
            this.$router.push({ name: 'reunion-minutas' });
            this.dialogPDF = false;
        },
        ////
        onSubmit() {
            console.log('-----', formData.value)
        },
        // datosMinuta() {
        //     console.log('Estoy aqui html ---->', this.FormMinuta.resumen)
        //     document.querySelector('.resumen').innerHTML = this.FormMinuta.resumen
        // },
        async obtenerLugarReunion(idLugar) {
            // console.log(idLugar)
            let result = await lugarService.ObtenerLugarReunion(idLugar)
            // console.log('lugar result', result)
            this.direccionLugar = result.data
            // console.log('lugar result', result)

            // console.log('----->', this.direccionLugar)
            // console.log(this.direccionLugar.direccion)
        },
        async generatePDF() {
            const element = this.$refs.htmlContent;
            const options = {
                margin: [52, 0, 25, 0],
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                filename: 'archivo.pdf',

            };

            try {
                const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');


                // Agregar imagen de fondo al PDF combinado
                const pdfWithImage = await this.agregarImagenDeFondoAPDF(pdfBlob);
                const pdfUrlWithImage = URL.createObjectURL(pdfWithImage);
                this.pdfObject = pdfUrlWithImage;
            } catch (error) {
                console.error(error);
            }
        },

        async contarPaginas(pdfBlob) {
            try {
                const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
                const pages = pdfDoc.getPages();
                const totalPages = pages.length; // Obtener el número total de páginas
                return totalPages; // Devolver el número total de páginas
            } catch (error) {
                console.error(error);
                return 0; // En caso de error, devolver 0 páginas
            }
        },

        async agregarImagenDeFondoAPDF(pdfBlob) {
            try {
                const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
                const pages = pdfDoc.getPages();
                const totalPages = pdfDoc.getPageCount();
                //const imageBytes = await fetch('/src/assets/images/logos/Back_1_Mesa de trabajo 1.png').then(res => res.arrayBuffer());
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
                        const textWidth2 = font.widthOfTextAtSize(useCookie('nombreOficina').value, 9);
                        const textHeight2 = font.heightAtSize(9);

                        const startY = height - textHeight - 60; // Iniciar en esta coordenada
                        const xOffset = 4; // Desplazamiento hacia la derecha

                        page.drawText('Subsecretaría General de Gobierno', {
                            x: width - textWidth - 75 + xOffset,
                            y: startY,
                            size: 10,
                            font: boldFont, // Usar la fuente en negrita
                        });

                        page.drawText(useCookie('nombreOficina').value, {
                            x: width - textWidth2 - 75 + xOffset,
                            y: startY - textHeight - 5, // Ajustar la posición para alinear el texto
                            size: 9,
                            font: boldFont,
                        });

                        const text3 = `Tema: ${this.formRequest.tema}`;
                        const textWidth3 = font.widthOfTextAtSize(text3, 8);
                        const textHeight3 = font.heightAtSize(8);
                        page.drawText(text3, {
                            x: width - textWidth3 - 70 + xOffset,
                            y: startY - textHeight - textHeight3 - 10, // Ajustar la posición para alinear el texto
                            size: 8,
                            font: font,
                        });

                        const text4 = `Fecha: ${this.formRequest.fechaString}`;
                        const textWidth4 = font.widthOfTextAtSize(text4, 7);
                        const textHeight4 = font.heightAtSize(7);
                        page.drawText(text4, {
                            x: width - textWidth4 - 70 + xOffset,
                            y: startY - textHeight - textHeight3 - textHeight4 - 15, // Ajustar la posición para alinear el texto
                            size: 7,
                            font: font,
                        });
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
                            const defaultTextColor = { color: rgb(0, 0, 0) }; // Color por defecto para el texto

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
                                    color: rgb(0.5019607843137255, 0.5019607843137255, 0.5019607843137255),
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
                    };

                    drawHeader();

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

        async ObtenerAcuerdo() {
            let result = await reunionService.obtenerMinuta().then((res) => {
                this.Minutas = res.data;
            });
        },
        async ObtenerDependencias(idReunion) {
            let result = await reunionService.obtenerDependenciasPorIdReunion(idReunion).then((res) => {
                this.dependencias = res
            });
        },
        async _obtenerDatosActualizar(id) {
            let result = await reunionService.obtenerDatosActualizar(id)
            this.formRequest = result.data
        },
        async _ObtenerDatosReunionesVinculadas(id) {
            let result = await reunionService.obtenerDatosReunionesVinculadasConMinutas(id);
            if (result != null) {
                this.DatosVinculado.push(result)
                // if (result.reunionVM.idReunionVinculada != null)
                //     await this._ObtenerDatosReunionesVinculadas(result.reunionVM.idReunionVinculada)
            }
        },
        async _ObtnerDatosReunionMinutas(id) {
            let result = await reunionService.ObtenerDatosReunionMinutasIdReunion(id);
            if (result != null) {
                this.formRequest = result
                let url = new URLSearchParams(window.location.search)

                if (id != null) {
                    console.log();
                    await this._ObtenerDatosReunionesVinculadas(id)
                }
            }
        },
        async _ObtnerDatosMinutasId(id) {
            let result = await reunionService.ObtenerDatosMinutasId(id);
            if (result != null) {
                // console.log("Datos Actualizar Lista Acuerdo ", result);
                this.FormMinuta = {
                    ...result,
                    listaAcuerdoRequest: result.listaAcuerdoRequest || [], // Asegurar que listaAcuerdoRequest esté presente
                };
                var result3 = result.listaAcuerdoRequest[result.listaAcuerdoRequest.length - 1]?.folioAcuerdo;

                if (result3)
                    this.contador += parseInt(result3.split('-')?.[1])
            }
        },
        ModaldeAcuerdoTareas(Acuerdo, TareaAcuerdo) {
            this.isDialogVisible = true
            this.AcuerdoModal = Acuerdo
            this.ListaTareaAcuerdoModal = TareaAcuerdo

        },
        MostrarContenido() {
            this.acuerdoDeshabilitado = false;
        },
        async abrirDialogoEvidencias(Acuerdo) {
            this.AcuerdoModal = Acuerdo;
            await this.obtenerDocumentoAcuerdo(Acuerdo.id);
            this.isDialogEvidenciasVisible = true;

        },
        async handleButtonClick(idAcuerdo) {
            let fileInput = document.createElement('input');
            fileInput.type = 'file';

            fileInput.onchange = e => {
                let file = e.target.files[0];
                if (!file) {
                    console.log('No se seleccionó archivo.');
                    return;
                }
                this.uploadFileToAPI(file, idAcuerdo);
            };
            fileInput.click();
        },

        async uploadFileToAPI(file, idAcuerdo) {
            if (!file) {
                return;
            }

            let formData = new FormData();
            const extension = file.name.split('.').pop();
            const nombreOriginal = file.name.replace(new RegExp(`.${extension}$`), '');
            formData.append('IdAcuerdo', idAcuerdo);
            formData.append('File', file);
            formData.append('Extension', extension);
            formData.append('NombreOriginal', nombreOriginal);

            try {
                const response = await reunionService.subirDocumentoAcuerdo(formData);
                if (response.data.success) {
                    this.toast.success('Archivo subido con éxito');
                    await this.obtenerDocumentoAcuerdo(idAcuerdo);
                } else {
                    this.toast.error('No se pudo subir el archivo');
                }

            } catch (error) {
                console.error('Error al subir el archivo:', error);

            }
        },


        async editarDocumentoAcuerdo(idDocumento) {
            const documentoEditar = await reunionService.obtenerDocumentoAcuerdoById(idDocumento);

            const nombre = documentoEditar.nombre;
            const idAcuerdo = documentoEditar.idAcuerdo;

            let fileInput = document.createElement('input');
            fileInput.type = 'file';

            fileInput.onchange = e => {
                let file = e.target.files[0];
                if (!file) {
                    console.log('No se seleccionó archivo.');
                    return;
                }
                this.uploadFileEditar(file, idAcuerdo, documentoEditar);
            };
            fileInput.click();
        },


        async uploadFileEditar(file, idAcuerdo, documentoEditar) {
            if (!file) {
                return;
            }

            let formData = new FormData();
            const extension = file.name.split('.').pop();
            const nombreOriginal = file.name.replace(new RegExp(`.${extension}$`), '');
            formData.append('Id', documentoEditar.id);
            formData.append('IdAcuerdo', documentoEditar.idAcuerdo);
            formData.append('File', file);
            formData.append('Nombre', documentoEditar.nombre);
            formData.append('Extension', extension);
            formData.append('NombreOriginal', nombreOriginal);

            try {
                const response = await reunionService.editarDocumentoAcuerdo(formData);
                await this.obtenerDocumentoAcuerdo(idAcuerdo);
                if (response.data.success) {
                    this.toast.success('Archivo editado con éxito');
                } else {
                    this.toast.error('No se pudo editar el archivo');
                }

            } catch (error) {
                console.error('Error al subir el archivo:', error);

            }
        },


        async obtenerDocumentoAcuerdo(idAcuerdo) {
            try {
                const response = await reunionService.obtenerDocumentoAcuerdo(idAcuerdo);
                this.evidencias = [];
                if (Array.isArray(response.data)) {
                    for (const evidencia of response.data) {
                        evidencia.link = await reunionService.obtenerDocumentoAzure(evidencia.nombre);
                        evidencia.extension = evidencia.extension ? evidencia.extension.toUpperCase() : "";
                    }
                    this.evidencias = response.data;
                    console.log('Evidencias:', this.evidencias);
                }
            } catch (error) {
                console.error('Error al obtener el archivo:', error);

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
                    await this.obtenerDocumentoAcuerdo(this.AcuerdoModal.id);
                } else {
                    this.toast.error('No se pudo eliminar el documento');
                }
            } catch (error) {
                console.error('Error al eliminar el archivo:', error);

            }
        },
        async descargarDocumento(item) {
            console.log(item);
            // if (item.link) {
            //     if (item.extension.toLowerCase() == "pdf" || this.esImagen(item.extension.toLowerCase())) {
            //         window.open(item.link, '_blank');
            //     } else {
            //         const link = document.createElement('a');
            //         link.href = item.link;
            //         link.setAttribute('download', item.nombreOriginal);
            //         document.body.appendChild(link);
            //         link.click();
            //         document.body.removeChild(link);
            //         this.toast.success('Descarga exitosa');
            //     }
            // }
        },
        esImagen(extension) {
            const formatosImagen = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg'];
            return formatosImagen.includes(extension.toLowerCase());
        },
        async FinalizarAcuerdoReunion(Item) {
            const payload = {
                idAcuerdo: Item.idAcuerdo,
                estatusAcuerdo: 3,
            };
            let result = await reunionService.actualizarEstatusAcuerdo(payload);
            if (result.data.success) {
                this.DatosVinculado.forEach((elemento) => {
                    elemento.map(data => {
                        data.minutasDTOVM.listaAcuerdosVM.forEach((elementoAcuerdo) => {
                            if (elementoAcuerdo.acuerdosMinutasVM.idAcuerdo === Item.idAcuerdo)
                                elementoAcuerdo.acuerdosMinutasVM.estatusAcuerdo = "Finalizado"
                        });

                    })

                });
                this.toast.success(result.data.message);
            } else {
                this.toast.success(result.data.message);
            }
        },
        async validarFromGeneral() {
            let res = await this.$refs.FormAcuerdoMinuta.validate();
            if (res.valid) {
                if (this.acuerdo || this.acuerdo.trim()) {
                    this.EditorTextoValidar = false
                    this.agregarAcuerdo();
                }
                else
                    this.EditorTextoValidar = true
            }
        },
        agregarAcuerdo() {
            let nuevoAcuerdo;
            let fechaFolio = new Date();

            let dia = fechaFolio.getDate();
            let mes = fechaFolio.getMonth() + 1; // se suma 1 porque los meses van de 0 a 11
            let año = fechaFolio.getFullYear();
            let folioAcuerdo = "";
            //let folioAcuerdo = `M-${this.contadorA}-${dia}-${mes}-${year}`;
            if (this.formRequest.idTipoReunion == 1)
                folioAcuerdo = `M-${this.contador}-${dia}-${mes}-${año}`;
            else if (this.formRequest.idTipoReunion == 2)
                folioAcuerdo = `A-${this.contador}-${dia}-${mes}-${año}`;

            let indexeRows = this.FormMinuta.listaAcuerdoRequest.indexOf(this.acuerdoSeleccionado)
            if (indexeRows !== -1) {
                this.FormMinuta.listaAcuerdoRequest[indexeRows].idDependencia = this.idDependenciaSelec;
                this.FormMinuta.listaAcuerdoRequest[indexeRows].acuerdo = this.acuerdo;
                this.FormMinuta.listaAcuerdoRequest[indexeRows].nombreDependencia = this.NombreDependenciaSelec;
                this.FormMinuta.listaAcuerdoRequest[indexeRows].fecha = this.date;
                this.toast.success("Se actualizo correctamente")
            } else {
                nuevoAcuerdo = {
                    idAcuerdo: 0,
                    acuerdo: this.acuerdo,
                    fecha: this.date,
                    idDependencia: this.idDependenciaSelec,
                    folioAcuerdo: folioAcuerdo,
                    nombreDependencia: this.NombreDependenciaSelec
                };
                this.FormMinuta.listaAcuerdoRequest.push(nuevoAcuerdo);
                this.contador++;
                this.toast.success("Se a agrego correctamente")
            }

            this.seccionDeshabilitada = false;
            this.acuerdoDeshabilitado = true;
            this.acuerdo = '';
            this.date = null;
            this.dependenciaSeleccionada = [];
            this.acuerdoSeleccionado = null;
            this.mostrarContenido = false;

        },
        editarAcuerdo(AcuerdoCompleto) {
            this.acuerdoSeleccionado = AcuerdoCompleto;
            this.acuerdo = this.acuerdoSeleccionado.acuerdo;
            this.date = this.acuerdoSeleccionado.fecha == '0001-01-01T00:00:00' ? null : this.acuerdoSeleccionado.fecha;
            this.mostrarContenido = true;
            this.dependenciaSeleccionada = this.dependencias.find(x => x.id == this.acuerdoSeleccionado.idDependencia);
            this.seccionDeshabilitada = true;
            this.acuerdoDeshabilitado = false;
        },
        eliminarAcuerdo(AcuerdoCompleto) {
            this.acuerdoSeleccionado = AcuerdoCompleto;
            var IndexEliminar = this.FormMinuta.listaAcuerdoRequest.indexOf(this.acuerdoSeleccionado)
            let row = this.FormMinuta.listaAcuerdoRequest.splice(IndexEliminar, 1);
            if (row) {
                this.toast.success("Se a eliminado correctamente")
            }
            else {
                this.toast.error("No se pudo eliminar")
            }
        },
        async ActualizarMinuta() {
            try {
                // if (!this.confirmacionParticipantes && (!this.participantesParaFirmar || this.participantesParaFirmar.length == 0)) {
                //     this.showDialogConfirm = true;
                //     return;
                // }
                this.FormMinuta.listaParticipantes = this.participantesParaFirmar;
                let result = await reunionService.actualizarMinuta(this.FormMinuta);
                if (result.data?.success) {
                    this.toast.success(result.data.message);
                    this.dialogPDF = true;
                    this.generatePDF();
                } else {
                    this.toast.success(result.data.message);
                }
            } catch (error) {
                console.error("!Error¡", error);
            }
        },
        async obtenerDatosActualizar(Id) {
            let result = await reunionService.obtenerDatosActualizar(Id);
            this.formRequest = result.data
            // console.log('---->', this.formRequest)
        },
        async obtenerConfiguraciones(id) {
            try {
                let result = await configuracionService.listarConfiguracionPorId(id);
                this.Configuraciones = result.data
                // console.log(this.Configuraciones)
            } catch (error) {
                console.log(error)
            }
        },
        abrirDialogoParticipantes() {
            this.isDialogParticipantes = true;
            this.FormMinuta.listaParticipantes = this.formRequest.listaParticipantes
                .map(participante => ({ ...participante }));
        },
        async obtenerListaParticipantes(IdReunion) {
            let result = await reunionService.obtenerListaParticipanteIdReunionMesa(IdReunion);
            if (result) {
                this.formRequest.listaParticipantes = result;
                this.participantesParaFirmar = this.formRequest.listaParticipantes
                    .filter(participante => participante.firma)
                    .sort((a, b) => a.ordenFirmar - b.ordenFirmar)
                    .map((participante, index) => ({
                        ...participante,
                        ordenFirmar: index + 1
                    }));
            } else {
                console.error('No se pudieron cargar los participantes para la reunión', IdReunion);
            }
        },
        guardarOrden() {
            this.participantesParaFirmar.forEach((participante, index) => {
                participante.ordenFirmar = index + 1;
            });
            if (this.participantesParaFirmar.length == 0) {
                this.toast.warning('No se seleccionaron participantes para firmar');
            } else {
                this.toast.success('Orden de firma guardado');

            }
            this.isDialogParticipantes = false;
            this.actualizarListaPrincipal();
        },
        actualizarListaPrincipal() {
            this.formRequest.listaParticipantes.forEach(participante => {
                participante.ordenFirmar = null;
                participante.firma = false;
            });

            this.participantesParaFirmar.forEach((participanteFirmante) => {
                let participante = this.formRequest.listaParticipantes.find(p => p.id === participanteFirmante.id);
                if (participante) {
                    participante.ordenFirmar = participanteFirmante.ordenFirmar;
                    participante.firma = true;
                }
            });
        },
        actualizarListaFirmantes() {
            if (this.formRequest.listaParticipantes != null) {
                this.participantesParaFirmar = this.formRequest.listaParticipantes
                    .filter(participante => participante.firma)
                    .sort((a, b) => a.ordenFirmar - b.ordenFirmar)
                    .map((participante, index) => ({
                        ...participante
                    }));
                this.participantesParaFirmar.forEach((participante, index) => {
                    participante.ordenFirmar = index + 1;
                });
                this.participantesParaFirmar = this.participantesParaFirmar
                    .sort((a, b) => a.ordenFirmar - b.ordenFirmar);
            }
        },
        cambiarOrden() {
            for (let i = 0; i < this.participantesParaFirmar.length; i++) {
                this.participantesParaFirmar[i].ordenFirmar = i + 1;
            }
            this.actualizarListaPrincipal();
        },
        actualizarEstadoFirma(participante) {
            console.log(participante)
            const index = this.participantesParaFirmar.findIndex(p => p.id === participante.id);
            if (participante.firma) {
                participante.ordenFirmar = this.participantesParaFirmar.length + 1;
                if (index !== -1) {
                    this.participantesParaFirmar[index].ordenFirmar = this.participantesParaFirmar.length + 1;
                } else {
                    this.participantesParaFirmar.push(participante);
                }
            } else {
                this.participantesParaFirmar = this.participantesParaFirmar
                    .filter(p => p.id !== participante.id)
                    .sort((a, b) => a.ordenFirmar - b.ordenFirmar);
                this.participantesParaFirmar.forEach((p, index) => {
                    p.ordenFirmar = index + 1;
                });
            }
            this.actualizarListaPrincipal();
        },
        continuarSinParticipantes() {
            // this.participantesParaFirmar = this.formRequest.listaParticipantes;
            // for (let i = 0; i < this.participantesParaFirmar.length; i++) {
            //     this.participantesParaFirmar[i].firma = true;
            //     this.participantesParaFirmar[i].ordenFirmar = i + 1;
            // }
            this.confirmacionParticipantes = true;
            this.ActualizarMinuta();
        },
        abrirPDF() {
            this.dialogPDF = true;
            this.generatePDF();
        },
        regresarMinutas() {
            this.$router.push({ name: 'reunion-minutas' });
        },

        formatoFecha(date) {
            if (date) {

                // Verificar si la cadena de fecha ya tiene el formato esperado (AAAA-MM-DDT00:00:00Z)
                if (!date.includes("T00:00:00")) {
                    // Si no tiene el formato esperado, agregar el componente de hora y zona horaria UTC
                    date += "T00:00:00";
                }
                const options = { day: "numeric", month: "long", year: "numeric" };
                const fechaUTC = new Date(date);
                return new Intl.DateTimeFormat("es-ES", options).format(fechaUTC);
            }
        },

        cerrarPDF() {
            this.$router.push({ name: 'reunion-minutas' });
            this.dialogPDF = false;
        },

        onDrop(DroppedFiles) {
            DroppedFiles?.forEach(file => {
                if (file.type.slice(0, 6) !== 'image/') {
                    alert('Only image files are allowed')

                    return
                }
                fileData.value.push({
                    file,
                    url: useObjectUrl(file).value ?? '',
                })
            })
        }

    },
    async created() {
        const params = this.$route.params
        let url = new URLSearchParams(window.location.search)
        let IdReunion = params.idReunion
        let IdMinuta = params.idMinuta
        if (IdReunion != null && IdMinuta != null) {

            await this._ObtnerDatosReunionMinutas(IdReunion)
            await this._ObtnerDatosMinutasId(IdMinuta)
            await this.ObtenerDependencias(IdReunion);
            await this.obtenerDatosActualizar(IdReunion)
            await this.obtenerConfiguraciones(this.Configuraciones.id)
            await this.obtenerListaParticipantes(IdReunion);
            await this.obtenerLugarReunion(this.formRequest.idLugar)
        }
    },
}
</script>

<template>
    <VRow style="overflow-y: hidden;" class="justify-center"> <!-- overflow -->
        <VCol cols="12" md="12">
            <VCard>
                <VCardText class="rounded-4">
                    <VWindow>
                        <VWindowItem>
                            <VForm>
                                <h2>
                                    <p><b>Crear Minuta</b></p>
                                </h2>
                                <hr />
                                <div class="me-auto mt-2">
                                    <p class="d-flex align-center mb-2">
                                        Tema:
                                        <span class="ms-3">{{ this.formRequest.tema }}</span>
                                    </p>
                                </div>
                                <div class="me-auto">
                                    <p class="d-flex align-center mb-6">
                                        <VIcon icon="custom-wizard-social-link" size="22" />
                                        <span class="ms-3">{{ this.formRequest.titulo }}</span>
                                    </p>
                                </div>
                                <hr />
                                <VRow class="mt-3">
                                    <VCol cols="12" md="3">
                                        <VRow>
                                            <VCol cols="12" md="12" lg="12">
                                                <!-- Mostrar Folio de la Minuta -->
                                                <AppTextField :value="this.FormMinuta.folio" placeholder="Folio"
                                                    label="Folio" readonly />
                                                <!-- Mostrar Fecha y Hora de la Reunión -->
                                                <AppTextField :value="this.formRequest.fechaString" placeholder="Fecha"
                                                    label="Fecha" readonly />
                                                <AppTextField :value="this.formRequest.horaString" placeholder="Hora"
                                                    label="Hora" readonly />
                                            </VCol>
                                        </VRow>
                                    </VCol>
                                    <VCol cols="12" md="9">
                                        <div class="titulo mt-1">
                                            <b>Reuniones vinculadas</b>
                                        </div>
                                        <VExpansionPanels v-for="(data, key) in this.DatosVinculado" :key="key"
                                            multiple>

                                            <!-- <VExpansionPanel v-for="i in 3" :key="i"> -->
                                            <!-- <div v-for="(data, key) in this.DatosVinculado" :key="key"> -->
                                            <VExpansionPanel v-for="(Vinculado, index) in data" :key="index">
                                                <VExpansionPanelTitle>
                                                    <b> {{ Vinculado?.minutasDTOVM.minutasVM?.folio }} - {{
                                                        Vinculado?.reunionVM?.titulo }}</b>
                                                </VExpansionPanelTitle>
                                                <VExpansionPanelText>
                                                    <VTable class="text-no-wrap">
                                                        <tbody>
                                                            <tr v-for="(Acuerdo, indexA) in Vinculado?.minutasDTOVM?.listaAcuerdosVM"
                                                                :key="indexA">
                                                                <td>
                                                                    <span class="mx-2">Folio:</span>
                                                                    <b>{{ Acuerdo?.acuerdosMinutasVM?.folioAcuerdo
                                                                        }}</b>
                                                                </td>
                                                                <td>
                                                                    {{ Acuerdo?.acuerdosMinutasVM?.fechaString }}
                                                                </td>
                                                                <td>
                                                                    {{ Acuerdo?.acuerdosMinutasVM?.estatusAcuerdo }}
                                                                    <!-- <VIcon icon="tabler-circle-filled"
                                                                        class="mx-2" title="Status del acuerdo" /> -->
                                                                    <!-- <VIcon color="warning" icon="tabler-circle-filled" class="mx-2" title="En proceso"/>
                                                                    <VIcon color="success" icon="tabler-circle-filled" class="mx-2" title="Finalizado"/> -->
                                                                </td>
                                                                <td>
                                                                    <VBtn
                                                                        @click="ModaldeAcuerdoTareas(Acuerdo.acuerdosMinutasVM, Acuerdo.tareaAcuerdosVM)"
                                                                        title="Ver Acuerdo" size="25" color="success"
                                                                        class="mx-2">
                                                                        <VIcon icon="tabler-eye" size="15" />
                                                                    </VBtn>
                                                                    <!-- Dialog -->
                                                                    <VDialog v-model="isDialogVisible"
                                                                        class="v-dialog-sm">
                                                                        <!-- Dialog close btn -->
                                                                        <DialogCloseBtn
                                                                            @click="isDialogVisible = false" />

                                                                        <VCard title="Acuerdo de la reunión">
                                                                            <VCardText>
                                                                                <p>
                                                                                    Folio: <b>{{
                                                                                        this.AcuerdoModal.folioAcuerdo
                                                                                    }}</b>
                                                                                </p>
                                                                                <VRow class="mb-3">
                                                                                    <VCol cols="6">Fecha: <b>{{
                                                                                        this.AcuerdoModal.fechaString
                                                                                            }}</b></VCol>
                                                                                    <VCol cols="6">
                                                                                        Status:
                                                                                        <b>{{
                                                                                            this.AcuerdoModal.estatusAcuerdo
                                                                                        }}</b>
                                                                                        <!-- <VIcon color="#7367f0"
                                                                                            icon="tabler-circle-filled"
                                                                                            class="mx-2" title="Inicio" /> -->
                                                                                        <!-- <VIcon color="warning" icon="tabler-circle-filled" class="mx-2" title="En proceso"/>
                                                                                        <VIcon color="success" icon="tabler-circle-filled" class="mx-2" title="Finalizado"/> -->
                                                                                    </VCol>
                                                                                </VRow>
                                                                                <VExpansionPanels multiple class="mb-5">
                                                                                    <VExpansionPanel v-for="i in 1"
                                                                                        :key="i">
                                                                                        <VExpansionPanelTitle>
                                                                                            Acuerdo <p
                                                                                                style="display: none;">
                                                                                                {{ i
                                                                                                }}</p>
                                                                                        </VExpansionPanelTitle>
                                                                                        <VExpansionPanelText
                                                                                            class="px-4 py-4">
                                                                                            <p
                                                                                                v-html="this.AcuerdoModal.acuerdo">
                                                                                            </p>
                                                                                        </VExpansionPanelText>
                                                                                    </VExpansionPanel>
                                                                                </VExpansionPanels>
                                                                                <div>
                                                                                    <p><b>Estatus</b></p>
                                                                                    <VExpansionPanels multiple class="">
                                                                                        <!-- v-for="(orden, index) in formRequest.listaOrden" :key="index" -->
                                                                                        <!-- <VExpansionPanel v-for="i in 3"
                                                                                            :key="i"> -->
                                                                                        <VExpansionPanel
                                                                                            v-for="(TareaAcuedo, indexT) in this.ListaTareaAcuerdoModal"
                                                                                            :key="indexT">
                                                                                            <VExpansionPanelTitle>
                                                                                                <VRow>
                                                                                                    <VCol cols="6">
                                                                                                        <VIcon
                                                                                                            color="#0055cc"
                                                                                                            icon="tabler-copy-check"
                                                                                                            class="me-4" />
                                                                                                        Tarea {{ indexT
                                                                                                        }}
                                                                                                    </VCol>
                                                                                                    <VCol cols="6">
                                                                                                        <span>Inicio</span>
                                                                                                        <!-- <VIcon
                                                                                                            color="#7367f0"
                                                                                                            icon="tabler-circle-filled"
                                                                                                            class="mx-2"
                                                                                                            title="Inicio" /> -->
                                                                                                    </VCol>
                                                                                                </VRow>
                                                                                            </VExpansionPanelTitle>
                                                                                            <VExpansionPanelText
                                                                                                class="pt-4">
                                                                                                <VRow>
                                                                                                    <VCol cols="6">
                                                                                                        Fecha:
                                                                                                        <p><b>{{ TareaAcuedo.fechaString
                                                                                                                }}</b>
                                                                                                        </p>
                                                                                                    </VCol>
                                                                                                    <!-- <VCol cols="6">
                                                                                                        Actores
                                                                                                        Responsables:
                                                                                                        <p><b>Nombre</b></p>
                                                                                                    </VCol> -->
                                                                                                    <VCol>
                                                                                                        <p>Tarea</p>
                                                                                                        <p>
                                                                                                            {{
                                                                                                                TareaAcuedo.tarea
                                                                                                            }}
                                                                                                        </p>
                                                                                                    </VCol>
                                                                                                </VRow>
                                                                                            </VExpansionPanelText>
                                                                                        </VExpansionPanel>
                                                                                    </VExpansionPanels>
                                                                                </div>
                                                                            </VCardText>
                                                                            <VCardText class="d-flex justify-end">
                                                                                <VBtn @click="isDialogVisible = false">
                                                                                    Cerrar
                                                                                </VBtn>
                                                                            </VCardText>
                                                                        </VCard>
                                                                    </VDialog>
                                                                    <!-- <VBtn title="Subir evidencia" color="primary"
                                                                        @click="handleButtonClick(Acuerdo.acuerdosMinutasVM)"
                                                                        class="mx-2" size="small">
                                                                        <VIcon icon="tabler-cloud-upload" size="15" />
                                                                    </VBtn> -->
                                                                    <!-- Botón para abrir el diálogo de evidencias -->
                                                                    <VBtn color="primary" class="mx-2" size="small"
                                                                        @click="abrirDialogoEvidencias(Acuerdo.acuerdosMinutasVM)">
                                                                        <VIcon icon="tabler-cloud-upload" size="15" />
                                                                    </VBtn>

                                                                    <!-- Diálogo para CRUD de Evidencias -->
                                                                    <VDialog width="850"
                                                                        v-model="isDialogEvidenciasVisible" persistent>
                                                                        <DialogCloseBtn
                                                                            @click="isDialogEvidenciasVisible = false" />

                                                                        <VCard class="d-flex flex-column">
                                                                            <VCardTitle class="text-h5 py-4">
                                                                                <VIcon icon="tabler-file-text mr-3"
                                                                                    size="25" />
                                                                                Documentos Acuerdos
                                                                            </VCardTitle>

                                                                            <VCardText>
                                                                                <div class="flex">
                                                                                    <div class="w-full h-auto relative">
                                                                                        <div class="cursor-pointer mb-5"
                                                                                            @click="handleButtonClick(this.AcuerdoModal.idAcuerdo)">
                                                                                            <div
                                                                                                class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone">
                                                                                                <IconBtn variant="tonal"
                                                                                                    class="rounded-sm">
                                                                                                    <VIcon
                                                                                                        icon="tabler-upload" />
                                                                                                </IconBtn>
                                                                                                <div
                                                                                                    class="text-base text-high-emphasis font-weight-medium">
                                                                                                    Suelte los archivos
                                                                                                    aquí
                                                                                                    o haga clic para
                                                                                                    cargarlos
                                                                                                </div>
                                                                                                <!-- <span class="text-disabled">or</span>
                                                                                                    <VBtn variant="tonal">
                                                                                                    Browse Images
                                                                                                    </VBtn> -->
                                                                                            </div>

                                                                                        </div>
                                                                                        <div>
                                                                                            <div
                                                                                                class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap">
                                                                                                <VRow
                                                                                                    class="match-height w-100">
                                                                                                    <template
                                                                                                        v-for="index in evidencias"
                                                                                                        :key="index">
                                                                                                        <VCol cols="12"
                                                                                                            sm="3">
                                                                                                            <VCard
                                                                                                                :ripple="false"
                                                                                                                border>
                                                                                                                <VCardText
                                                                                                                    class="d-flex flex-column">
                                                                                                                    <div
                                                                                                                        class="justify-center d-flex">
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'PDF'">
                                                                                                                            <img src="../../assets/images/logos/PDF.png"
                                                                                                                                width="80"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'DOCX' || index.extension == 'DOC'">
                                                                                                                            <img src="../../assets/images/logos/docx.png"
                                                                                                                                width="80"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'PPTX'">
                                                                                                                            <img src="../../assets/images/logos/pptx.png"
                                                                                                                                width="80"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'XLSX'">
                                                                                                                            <img src="../../assets/images/logos/xlsx.png"
                                                                                                                                width="80"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'GIF'">
                                                                                                                            <img src="../../assets/images/logos/Img.png"
                                                                                                                                width="60"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                        <div
                                                                                                                            v-if="index.extension == 'JPG' || index.extension == 'PNG' || index.extension == 'SVG' || index.extension == 'JPEG' || index.extension == 'SVG' || index.extension == 'BMB'">
                                                                                                                            <img src="../../assets/images/logos/Img.png"
                                                                                                                                width="60"
                                                                                                                                height="80" />
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div
                                                                                                                        class="mt-2 text-center overflow-hidden flex-wrap flex-grow-1">
                                                                                                                        <div
                                                                                                                            class="text-truncate">
                                                                                                                            <span
                                                                                                                                class="clamp-text text-wrap text-truncate">
                                                                                                                                {{
                                                                                                                                    index.nombreOriginal
                                                                                                                                }}
                                                                                                                            </span>
                                                                                                                            <span
                                                                                                                                class="text-disabled">
                                                                                                                                {{
                                                                                                                                    index.extension
                                                                                                                                }}
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </VCardText>
                                                                                                                <hr />
                                                                                                                <div
                                                                                                                    class="demo-space-x py-3 justify-center d-flex">
                                                                                                                    <VBtn
                                                                                                                        @click="descargarDocumento(index)"
                                                                                                                        size="30"
                                                                                                                        color="secondary"
                                                                                                                        class="mx-1"
                                                                                                                        title="Descargar documento">
                                                                                                                        <VIcon
                                                                                                                            icon="tabler-download"
                                                                                                                            size="20" />
                                                                                                                    </VBtn>
                                                                                                                    <VBtn
                                                                                                                        @click="editarDocumentoAcuerdo(index.id)"
                                                                                                                        size="30"
                                                                                                                        color="success"
                                                                                                                        class="mx-1"
                                                                                                                        title="Editar documento">
                                                                                                                        <VIcon
                                                                                                                            icon="tabler-edit"
                                                                                                                            size="20" />
                                                                                                                    </VBtn>
                                                                                                                    <VBtn
                                                                                                                        @click="OpenEliminarDocumentoAcuerdo(index.id)"
                                                                                                                        size="30"
                                                                                                                        color="error"
                                                                                                                        class="mx-1"
                                                                                                                        title="Eliminar documento">
                                                                                                                        <VIcon
                                                                                                                            icon="tabler-trash"
                                                                                                                            size="20" />
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

                                                                            <!-- <VCardItem class="text-h6 text-primary py-4 align-center">
                                                                                    <VBtn @click="handleButtonClick(this.AcuerdoModal.idAcuerdo)" size="35" class="me-3" >
                                                                                        <VIcon icon="tabler-upload" size="30"></VIcon>
                                                                                    </VBtn>
                                                                                    Cargar documento
                                                                                </VCardItem>                                                                               
                                                                            
                                                                                <VCardItem>
                                                                                    <VDataTable :headers="evidenciasHeaders" :items="evidencias">
                                                                                        <template #item.actions="{ item }">
                                                                                            <div class="d-flex gap-1">
                                                                                                <VBtn @click="editarDocumentoAcuerdo(item.id)" size="30" color="success" class="me-3" title="Editar documento">
                                                                                                    <VIcon icon="tabler-edit" size="20"/>
                                                                                                </VBtn>
                                                                                                <VBtn @click="OpenEliminarDocumentoAcuerdo(item.id)" size="30" color="error" class="me-3" title="Eliminar documento">
                                                                                                    <VIcon icon="tabler-trash" size="20"/>
                                                                                                </VBtn>
                                                                                                <VBtn @click="descargarDocumento(item)" size="30" color="gray" class="me-3" title="Descargar documento">
                                                                                                    <VIcon icon="tabler-download" size="20"/>
                                                                                                </VBtn>
                                                                                            </div>
                                                                                        </template>
                                                                                        <template #item.nombre="{ item }">
                                                                                            <a :href="item.link" target="_blank">{{item.nombreOriginal}}</a> -
                                                                                            {{ item.nombreOriginal ? item.nombreOriginal : "Documento" }}
                                                                                        </template>
                                                                                        <template #item.extension="{ item }">
                                                                                            {{ item.extension }}
                                                                                        </template>
                                                                                    </VDataTable>
                                                                                </VCardItem> -->
                                                                        </VCard>

                                                                    </VDialog>
                                                                    <VDialog v-model="modalEliminarDocumento"
                                                                        max-width="500px">
                                                                        <VCard>
                                                                            <VCardTitle>¿Deseas eliminar el registro?
                                                                            </VCardTitle>

                                                                            <VCardActions>
                                                                                <VSpacer />
                                                                                <VBtn color="error" variant="outlined"
                                                                                    @click="modalEliminarDocumento = false">
                                                                                    Cancelar
                                                                                </VBtn>
                                                                                <VBtn color="success" variant="elevated"
                                                                                    @click="eliminarDocumentoAcuerdo">
                                                                                    Aceptar
                                                                                </VBtn>
                                                                                <VSpacer />
                                                                            </VCardActions>
                                                                        </VCard>
                                                                    </VDialog>
                                                                    <VBtn title="Finalizar Acuerdo" color="warning"
                                                                        @click="FinalizarAcuerdoReunion(Acuerdo.acuerdosMinutasVM)"
                                                                        variant="tonal" size="small">
                                                                        Finalizar
                                                                    </VBtn>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </VTable>
                                                </VExpansionPanelText>
                                            </VExpansionPanel>
                                            <!-- </div> -->
                                        </VExpansionPanels>
                                    </VCol>
                                </VRow>
                                <div class="contenido">
                                    <VCardText>
                                        <VRow>
                                            <VCol cols="12" md="4" :class="{ 'deshabilitado': seccionDeshabilitada }">
                                                <div class="contenido-acuerdo bg-var-theme-background">
                                                    <div class="my-3">
                                                        <span>Acuerdo</span>
                                                        <VBtn color="cafe" size="25" rounded="pill"
                                                            title="Crear Acuerdo" class="mx-3" type="reset">
                                                            <VIcon class="tabler-plus" size="15"
                                                                @click="MostrarContenido()" />
                                                        </VBtn>
                                                    </div>
                                                    <VDivider />
                                                    <div>
                                                        <VTable class="text-no-wrap" height="380">
                                                            <tbody>
                                                                <tr v-for="(acuerdos, index) in FormMinuta.listaAcuerdoRequest"
                                                                    :key="index">
                                                                    <td>
                                                                        <div>
                                                                            {{ acuerdos.folioAcuerdo }}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <VBtn title="Editar" size="25" color="success"
                                                                            class="mx-2"
                                                                            @click="editarAcuerdo(acuerdos)">
                                                                            <VIcon icon="tabler-edit" size="15" />
                                                                        </VBtn>
                                                                        <VBtn size="25" color="error"
                                                                            @click="eliminarAcuerdo(acuerdos)">
                                                                            <VIcon icon="tabler-trash" size="15" />
                                                                        </VBtn>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </VTable>
                                                    </div>
                                                </div>
                                            </VCol>
                                            <VCol cols="12" md="8">
                                                <VForm ref="FormAcuerdoMinuta" @submit.prevent="validarFromGeneral()">
                                                    <div class="contenido"
                                                        :class="{ 'deshabilitado': acuerdoDeshabilitado }">
                                                        <VCardText>
                                                            <label for="">Acuerdo</label>
                                                            <TiptapEditor v-model="acuerdo"
                                                                class="border rounded mt-4" />
                                                            <div v-if="this.EditorTextoValidar" class="primary">El campo
                                                                es requerido</div>
                                                        </VCardText>

                                                        <!-- <AppTextarea clearable clear-icon="tabler-circle-x" placeholder="Acuerdos"
                                                    rows="10" class="bg-var-theme-background" /> -->
                                                        <VRow class="mt-3 px-5">
                                                            <VCol cols="12" md="6">
                                                                <AppCombobox v-model="dependenciaSeleccionada"
                                                                    :items="dependencias"
                                                                    label="Dependencia responsable"
                                                                    placeholder="Seleccione la dependencia"
                                                                    item-title="nombre" item-value="id"
                                                                    :rules="[requiredValidator]">
                                                                </AppCombobox>
                                                            </VCol>
                                                            <VCol cols="12" md="6">
                                                                <AppDateTimePicker v-model="date" label="Fecha"
                                                                    placeholder="Seleccionar Fecha" class="p-auto" />
                                                            </VCol>
                                                        </VRow>
                                                        <VCardText class="d-flex justify-end flex-wrap gap-3 pb-4 px-5">
                                                            <VBtn color="#b48d57" type="submit">
                                                                Guardar
                                                                <VIcon icon="tabler-device-floppy" size="18"
                                                                    class="mx-1" />
                                                            </VBtn>
                                                        </VCardText>
                                                    </div>
                                                </VForm>
                                            </VCol>
                                        </VRow>
                                    </VCardText>
                                </div>
                                <div class="contenido">
                                    <VCardText>
                                        <label for="">Resumen de Minuta</label>
                                        <TiptapEditor v-model="FormMinuta.resumen" class="border rounded mt-4" />
                                    </VCardText>
                                </div>
                                <div class="contenido">
                                    <VCardText>
                                        <label for="">Observaciones</label>
                                        <TiptapEditor v-model="FormMinuta.observaciones" class="border rounded mt-4" />
                                    </VCardText>
                                </div>
                                <!-- <VRow class="mt-2">

                                    <VCol cols="12" md="6">
                                        <AppSelect
                                            label="Actores Supervisor"
                                            placeholder="Actores Supervisor"
                                            tem-title="Actores Supervisor" item-value=""
                                            :rules="[requiredValidator]"
                                        >
                                        </AppSelect>
                                    </VCol>
                                </VRow> -->

                                <VCardText class="d-flex justify-end flex-wrap gap-3">
                                    <VBtn @click="abrirDialogoParticipantes()">
                                        <VIcon icon="tabler-user" size="25" />
                                        <span class="me-2">Participantes</span>
                                    </VBtn>
                                    <VBtn @click="isVistasDatos = true" size="35" color="cafe">
                                        <VIcon size="25" icon="tabler-eye" />
                                    </VBtn>
                                    <div>
                                        <VBtn @click="abrirPDF" v-if="mostrarBtn">
                                            Mostrar PDF
                                        </VBtn>
                                    </div>
                                    <VBtn color="error" @click="regresarMinutas">
                                        Cancelar
                                    </VBtn>
                                    <VBtn color="success" @click="ActualizarMinuta">
                                        Guardar
                                    </VBtn>
                                </VCardText>
                            </VForm>
                            <VDialog v-model="isDialogParticipantes" class="v-dialog-xl" height="500">
                                <DialogCloseBtn @click="isDialogParticipantes = false" />
                                <VCard>
                                    <VRow>
                                        <VCol cols="12" md="7">
                                            <VCard height="500">
                                                <VCardText>
                                                    <!-- Contenido específico para el último registro -->
                                                    <VCol cols="12" md="12" class="px-0">
                                                        <h6 class="text-h4 font-weight-medium">
                                                            Seleccionar a los participantes para firma de minuta
                                                        </h6>
                                                    </VCol>
                                                    <div class="scrollable-content"
                                                        style="max-height: 500px; overflow-y: auto; padding-bottom: 200px;">
                                                        <!-- Iterar sobre los participantesPorDependencia -->
                                                        <VCol cols="12" md="12"
                                                            v-for="(participantesPorDependencia, dependencia) in agruparPorDependencia"
                                                            :key="dependencia">
                                                            <div>
                                                                <h4 class="text-primary">
                                                                    <p>{{ participantesPorDependencia.nombre }}</p>
                                                                </h4>
                                                                <VRow>
                                                                    <VCol cols="12" md="6"
                                                                        v-for="(participante, indexpp) in participantesPorDependencia.participantes"
                                                                        :key="indexpp">
                                                                        <VRow>
                                                                            <VCol sm="1" cols="2"
                                                                                class="d-flex align-end"
                                                                                style="height: fit-content;">
                                                                                <VCheckbox color="success"
                                                                                    v-model="participante.firma"
                                                                                    @change="() => actualizarEstadoFirma(participante)" />
                                                                            </VCol>
                                                                            <VCol sm="11" cols="10">
                                                                                <P class="mb-0">
                                                                                    <b>{{
                                                                                        participante.persona
                                                                                    }}</b>
                                                                                </P>
                                                                                <P class="mb-0">{{
                                                                                    participante.cargoPersona
                                                                                }}
                                                                                </P>
                                                                                <P v-if="participante.idRepresentado > 0"
                                                                                    class="mb-0 mt-2">En
                                                                                    representacion de </P>
                                                                                <P v-if="participante.idRepresentado > 0"
                                                                                    class="mb-0">
                                                                                    <b>{{
                                                                                        participante.personaRepresentar
                                                                                    }}</b>
                                                                                </P>

                                                                                <P v-if="participante.idInvitante > 0"
                                                                                    class="mb-0 mt-2">
                                                                                    Invitado por</P>
                                                                                <P v-if="participante.idInvitante > 0"
                                                                                    class="mb-0"><b>{{
                                                                                        participante.invitadoPor
                                                                                    }}</b>
                                                                                </P>
                                                                            </VCol>
                                                                        </VRow>
                                                                    </VCol>
                                                                </VRow>
                                                            </div>
                                                        </VCol>
                                                    </div>
                                                </VCardText>
                                            </VCard>
                                        </VCol>
                                        <VCol cols="12" md="5" height="500">
                                            <VCard>
                                                <VCardText>
                                                    <VCol cols="12" md="12" class="px-0">
                                                        <h6 class="text-h4 font-weight-medium">
                                                            Orden para firmar
                                                        </h6>
                                                    </VCol>
                                                    <div class="scrollable-content py-0"
                                                        style="height: 340px; overflow-y: auto;">
                                                        <VCol>
                                                            <div>
                                                                <draggable item-key="id"
                                                                    v-model="participantesParaFirmar" tag="ul"
                                                                    group="meals" :animation="300"
                                                                    style="list-style: none;">

                                                                    <template #item="{ element: meal }">
                                                                        <li class="border py-3 mb-2 rounded"
                                                                            style="padding:10px;">
                                                                            <VRow>
                                                                                <VCol cols="2" md="2" variant="tonal"
                                                                                    class="text-center">
                                                                                    <VAvatar color="secondary"
                                                                                        icon="tabler-user" />
                                                                                </VCol>
                                                                                <VCol cols="10" md="10">
                                                                                    <strong>{{ meal.persona }}</strong>
                                                                                    <br>
                                                                                    {{ meal.cargoPersona }}<br>
                                                                                    <P v-if="meal.idRepresentado > 0"
                                                                                        class="mb-0 mt-2">En
                                                                                        representación de</P>
                                                                                    <P v-if="meal.idRepresentado > 0"
                                                                                        class="mb-0"><b>{{
                                                                                            meal.personaRepresentar
                                                                                        }}</b>
                                                                                    </P>
                                                                                    <p v-if="meal.idInvitante > 0"
                                                                                        class="mb-0 mt-2">Invitado por
                                                                                    </p>
                                                                                    <P v-if="meal.idInvitante > 0"
                                                                                        class="mb-0"><b>{{
                                                                                            meal.invitadoPor
                                                                                        }}</b>
                                                                                    </P>
                                                                                </VCol>
                                                                            </VRow>
                                                                        </li>
                                                                    </template>
                                                                </draggable>
                                                            </div>
                                                        </VCol>
                                                    </div>
                                                    <VCardActions class="justify-end flex-wrap gap-3 mt-5 py-0 mr-5">
                                                        <VBtn variant="tonal" color="secondary"
                                                            @click="isDialogParticipantes = false">
                                                            Cancelar
                                                        </VBtn>
                                                        <VBtn variant="elevated" color="primary"
                                                            @click="guardarOrden()">
                                                            Guardar
                                                        </VBtn>
                                                    </VCardActions>
                                                </VCardText>
                                            </VCard>
                                        </VCol>
                                    </VRow>
                                </VCard>
                            </VDialog>
                            <VDialog v-model="showDialogConfirm" class="v-dialog-sm">
                                <VCard>
                                    <VCardTitle class="headline">Advertencia</VCardTitle>
                                    <VCardText>
                                        No has seleccionado participantes para firmar la minuta.
                                    </VCardText>
                                    <VCardActions>
                                        <VSpacer></VSpacer>
                                        <VBtn color="red darken-1" text @click="showDialogConfirm = false;">
                                            Regresar
                                        </VBtn>
                                    </VCardActions>
                                </VCard>
                            </VDialog>
                        </VWindowItem>
                    </VWindow>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>

    <VDialog v-model="isVistasDatos" width="900">
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isVistasDatos = false" />
        <VCard title="">
            <VCardText>
                <div class="">
                    <div class="ps-5 mt-2">
                        <div class="me-auto">
                            <p class="d-flex align-center mt-5 mb-2">
                            <h2>
                                Tema:
                                <span class="ms-3">{{ this.formRequest.tema }}</span>
                            </h2>
                            </p>
                        </div>
                        <div class="me-auto">
                            <p class="d-flex align-center mb-6">
                                <VIcon icon="tabler-file-typography" size="25" />
                                <span class="ms-3">{{ this.formRequest.titulo }}</span>
                            </p>
                        </div>
                    </div>
                    <hr>
                    <div class="d-flex my-4">
                        <div class="mx-3">
                            <label for="">Folio de Minuta</label>
                            <div class="border rounded px-3 px-3">
                                <div class="px-3 py-2">
                                    {{ this.FormMinuta.folio }}
                                    <VIcon icon="tabler-folder" class="mx-4" />
                                </div>
                            </div>
                        </div>
                        <div class="mx-3">
                            <label for="">Fecha</label>
                            <div class="border rounded px-3 px-3">
                                <div class="px-3 py-2">
                                    {{ this.formRequest.fechaString }}
                                    <VIcon icon="tabler-calendar-event" class="mx-4" />
                                </div>
                            </div>
                        </div>
                        <div class="mx-3">
                            <label for="">Hora</label>
                            <div class="border rounded">
                                <div class="px-3 py-2">
                                    {{ this.formRequest.horaString }}
                                    <VIcon icon="tabler-clock-hour-3" class="mx-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <VRow>
                        <VCol cols="12" md="12">
                            <VCard class="rounded-4">
                                <VCardText>
                                    <div class="mb-10" v-for="(acuerdos, index) in FormMinuta.listaAcuerdoRequest"
                                        :key="index">
                                        <p class="d-flex align-center mb-3 text-primary" size="15">
                                            <VIcon icon="tabler-file-description" size="30" />
                                            <span class="ms-3">Acuerdo {{ acuerdos.folioAcuerdo }}</span>
                                        </p>
                                        <div class="d-flex">
                                            <P class="pe-16">Responsable: <b>{{ acuerdos.nombreDependencia }}</b></P>
                                            <p class="ps-16">Fecha: <b>{{ acuerdos.fecha && acuerdos.fecha !==
                                                '0001-01-01T00:00:00' ?
                                                formatoFecha(acuerdos.fecha) : 'Sin fecha' }}</b></p>
                                        </div>
                                        <div v-html="acuerdos.acuerdo"></div>
                                    </div>
                                </VCardText>
                            </VCard>
                        </VCol>
                        <VCol cols="12" md="12">
                            <VCard>
                                <VCardText>
                                    <div class="mb-10">
                                        <p class="d-flex align-center mb-3 text-primary" size="15">
                                            <VIcon icon="tabler-align-box-left-top" size="30" />
                                            <span class="ms-3">Resumen de Minuta</span>
                                        </p>
                                        <p v-html="FormMinuta.resumen"></p>
                                    </div>
                                    <div class="mb-10">
                                        <p class="d-flex align-center mb-3 text-primary" size="15">
                                            <VIcon icon="tabler-search" size="30" />
                                            <span class="ms-3">Observaciones</span>
                                        </p>
                                        <p v-html="FormMinuta.observaciones"></p>
                                    </div>
                                </VCardText>
                            </VCard>
                        </VCol>
                    </VRow>
                    <h3 style="text-align:center; margin-top:20px;" class="text-primary">Firma Participantes</h3>
                    <VRow class="justify-content-center">

                        <VCol cols="10" md="6" v-for="(participante, index) in participantesParaFirmar" :key="index">
                            <VCard>
                                <VCardText>
                                    <div class="px-2 text-center">
                                        <p style="margin: 0;"><b>{{ participante.persona }}</b></p>
                                        <p style="margin: 0;">{{ participante.cargoPersona }}</p>

                                        <div v-if="participante.idRepresentado > 0">
                                            <p class="mb-0 mt-2">En representación de</p>
                                            <p class="mb-0"><b>{{ participante.personaRepresentar }}</b></p>
                                        </div>

                                        <div v-if="participante.idInvitante > 0">
                                            <p class="mb-0 mt-2">Invitado de </p>
                                            <p class="mb-0"><b>{{ participante.invitadoPor }}</b></p>
                                        </div>

                                        <p style="margin: 0;">{{ participante.dependencia }}</p>
                                    </div>
                                </VCardText>
                            </VCard>
                        </VCol>
                    </VRow>
                </div>
            </VCardText>
            <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn variant="tonal" color="secondary" @click="isVistasDatos = false">
                    Cerrar
                </VBtn>

            </VCardText>
        </VCard>
    </VDialog>
    <a onclick="history.back()" class="btn-flotante">
        <VIcon icon="tabler-arrow-narrow-left" />
    </a>

    <div>
        <div style="display: none"><!--style="display: none"-->
            <div ref="htmlContent">
                <div class="titulos text-justify">
                    <p style="margin:0;"><strong>MINUTA</strong></p>
                    <p style="margin:0;"><b>{{ formRequest.titulo }}</b></p>
                    <p style="margin:0;"><em>{{ this.formatoFecha(formRequest.fecha) }} a las {{ formRequest.hora }}
                            horas</em>
                    </p>
                    <p style="margin:0;">{{ formRequest.lugar }} {{ direccionLugar.direccion }}</p>
                    <p style="margin:0;">Siendo las {{ formRequest.hora }} horas del dia {{
                        this.formatoFecha(formRequest.fecha) }}, en el Estado de Mexico, se
                        reunieron de manera {{ formRequest.modalidad }}</p>
                </div>
                <br>
                <div class="participantes">
                    <div v-for="(participantesPorDependencia, dependencia) in agruparPorDependencia" :key="dependencia">
                        <p>
                            <b>{{ participantesPorDependencia.nombre }}:</b>
                        </p>
                        <ul style="margin: 0;"
                            v-for="(participante, index) in participantesPorDependencia.participantes" :key="index">
                            <li style=" margin: 0; list-style-type:disc 100px; padding-left: 15px;">
                                <p>{{ participante.persona }}, {{ participante.cargoPersona }}, {{
                                    participante.dependencia
                                }}
                                <p v-if="participante.idRepresentado > 0"> en representación de {{
                                    participante.personaRepresentar }}
                                </p>
                                <p v-if="participante.idInvitante > 0"> como invitado de {{ participante.invitadoPor }}
                                </p>

                                </p>

                            </li>
                        </ul>
                    </div>
                </div>
                <div class="titulos" style="page-break-before: always;">
                    <p style="text-align: center; page-break-inside: avoid;"><b>ASUNTOS TRATADOS</b></p>
                    <p style="page-break-inside: avoid;" v-html="FormMinuta.resumen"></p>
                </div>
                <!-- <div class="titulos">
                    <p style="text-align: center; page-break-inside: avoid;"><b>DURANTE LA REUNION</b></p>
                    <p style="page-break-inside: avoid;"></p>
                </div> -->

                <div class="titulos">
                    <p style="text-align: center"><b>ACUERDOS</b></p>
                    <div class="titulos">
                        <table style="border-collapse: collapse; ">
                            <thead>
                                <tr class="tabla">
                                    <th class="celdas colorCeldas">Dependencia</th>
                                    <th class="celdas colorCeldas">Fecha</th>
                                    <th class="celdas colorCeldas">Acuerdo</th>
                                </tr>
                            </thead>
                            <tbody style="border-collapse: collapse; page-break-inside: avoid;"
                                v-for="(acuerdo, index) in FormMinuta.listaAcuerdoRequest" :key="index">
                                <tr class="tabla">
                                    <td class="celdas">
                                        <p>{{ acuerdo.nombreDependencia }}</p>
                                    </td>
                                    <td class="celdas">
                                        <p>{{ acuerdo.fecha && acuerdo.fecha !== '0001-01-01T00:00:00' ?
                                            this.formatoFecha(acuerdo.fecha) : 'Sin fecha' }}</p>
                                    </td>
                                    <td style="width: 300px;" class="celdas text-justify">
                                        <p v-html="acuerdo.acuerdo"></p>
                                    </td>
                                </tr>
                            </tbody>

                        </table>

                    </div>
                </div>
                <div class="mt-8" v-if="participantesParaFirmar.length != 0"
                    style="color:black; margin: 0 100px; page-break-before: always;">
                    <div class="hojaLegal">
                        <h2 style="color:gray; margin-bottom: 30px;">HOJA LEGAL DE FIRMAS</h2>
                    </div>
                    <VRow class="justify-content-center">
                        <VCol cols="10" md="6" v-for="(participante, index) in participantesParaFirmar" :key="index">
                            <div class="px-5 my-6 text-center">
                                <hr />
                                <p v-if="participante.firma == true" style="margin: 0;">
                                    <b>{{ participante.persona }}</b>
                                </p>
                                <p v-if="participante.firma == true" style="margin: 0;">
                                    {{ participante.cargoPersona }}</p>

                                <P v-if="participante.idRepresentado > 0" class="mb-0 mt-2">En Representación de</P>
                                <P v-if="participante.idRepresentado > 0" class="mb-0">
                                    <b>{{
                                        participante.personaRepresentar
                                    }}</b>
                                </P>
                                <P v-if="participante.idInvitante > 0" class="mb-0 mt-2">Invitado por</P>
                                <P v-if="participante.idInvitante > 0" class="mb-0">
                                    <b>{{
                                        participante.invitadoPor
                                    }}</b>
                                </P>
                                <p style="margin: 0;">{{ participante.dependencia }}</p>
                            </div>
                        </VCol>
                    </VRow>
                </div>
            </div>
        </div>
    </div>
    <VDialog v-model="dialogPDF" persistent>
        <VCard>
            <VRow>
                <VCol>
                    <div style="position: fixed;">
                        <a @click="cerrarPDF()" class="btn-flotante">
                            <VIcon icon="tabler-x" />
                        </a>
                    </div>

                </VCol>
            </VRow>
            <VRow>
                <VCol class="d-block">
                    <VBtn @click="renderDoc" class="mb-4 mx-3" color="#3b82f6">
                        <div class="d-flex justify-content-between">
                            <span> Descargar en WORD</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-file-earmark-word ms-3" viewBox="0 0 16 16">
                                <path
                                    d="M5.485 6.879a.5.5 0 1 0-.97.242l1.5 6a.5.5 0 0 0 .967.01L8 9.402l1.018 3.73a.5.5 0 0 0 .967-.01l1.5-6a.5.5 0 0 0-.97-.242l-1.036 4.144-.997-3.655a.5.5 0 0 0-.964 0l-.997 3.655L5.485 6.88z" />
                                <path
                                    d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                        </div>
                    </VBtn>
                    <!-- <CButton @click="renderDoc" color="primary"
                        style="background-color:#0088AA;border: 5px inset #08a;padding:3px;border-radius:3px ">Descargar
                        en
                        WORD</CButton><br><br> -->
                    <iframe :src="pdfObject" style="width: 100%; height: 800px;"></iframe>
                </VCol>
            </VRow>
        </VCard>
    </VDialog>
</template>

<style scoped>
.hojaLegal {
    color: rgb(114, 7, 7);
    text-align: center;
}

.contenido {
    margin-top: 25px;
    border: 1px solid #050508;
    border-radius: 15px;
}

.celdas {
    border: 1px solid #ddd;
    padding: 4px;
    text-align: center;
    width: auto;
}

.colorCeldas {
    background-color: #e0dfdf;
}

tr td {
    text-align: left;
}

tr {
    page-break-inside: avoid;
    height: auto;

}

.ProseMirror {
    block-size: 200px;
    outline: none;
    overflow-y: auto;
    padding-inline: 0.5rem;

}

.deshabilitado {
    pointer-events: none;
    opacity: 0.6;
}

.participantes {
    color: black;
    width: 700px;
    height: auto;
    margin: auto;
    padding-left: 100px;
    word-wrap: break-word;
    display: inline-block;
}

li {
    margin-left: 20px;
    font-weight: 500;
}

.titulos {
    border-collapse: collapse;

    color: black;
    width: 600px;
    height: auto;
    margin: auto;
    word-wrap: break-word;
    overflow: hidden;
}

.contenido-acuerdo {
    padding: 20px;
    border-radius: 25px;
}

.text-no-wrap {
    background-color: transparent;
}
</style>
