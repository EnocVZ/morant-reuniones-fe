<script>
import configuracionService from "@/services/configuracion-service"
import lugarService from "@/services/lugar-reunion-service"
import { VCardText, VCol, VDivider, VIcon } from 'vuetify/lib/components/index.mjs';
import html2pdf from 'html2pdf.js';
import { PDFDocument, rgb, drawText, PDFImage, StandardFonts } from 'pdf-lib';
import reunionService from "@/services/reuniones-service";
import draggable from 'vuedraggable';
import "@styles/style.css";
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VCardActions } from "vuetify/lib/components/index.mjs"
const tempPath = `${import.meta.env.BASE_URL ?? "/"}wordTemplates/Acta.docx`;
//const tempPath = "/src/assets/wordTemplates/Acta.docx" //Ruta de la plantilla
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

export default {
    name: "custom-clone",
    display: "Custom Clone",
    order: 3,
    components: {
        VDataTable,
        VCardActions,
        draggable,
    },
    data() {
        return {
            toast: useToast(),
            numberedSteps: [],
            formRequest: {
                idReunion: 0,
                titulo: '',
                fecha: '',
                hora: '',
                lugar: '',
                tema: '',
                rqActa: false,
                listaOrden: [],
                listaParticipantes: []
            },
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
                listaOrden: []
            },
            dependencias: [],
            DatosVinculado: [],
            AcuerdoModal: undefined,
            ListaTareaAcuerdoModal: [],
            currentStep: ref(0),
            isDialogVisible: false,
            includeFiles: ref(true),
            date: null,
            pdfObject: null,
            acuerdosList: [],
            dependenciaSeleccionada: [],
            acuerdoSeleccionado: {
                index: 0,
                acuerdo: '',
                fecha: '',
                dependencia: '',
            },
            Configuraciones: {
                id: 1,
                titulo: '',
                instanciaW: '',
                tokenW: ''
            },
            seccionDeshabilitada: false,
            acuerdoDeshabilitado: true,
            contadorA: 1,
            dialogPDF: false,
            idDependenciaSelec: 0,
            NombreDependenciaSelec: '',
            isVistasDatos: ref(false),
            isModalAcuerdo: false,
            isOrdenFirma: false,
            listaParticipantesFiltrados: [],
            yuckyMeals: ref([
                { id: 1, name: 'Blgo. Marcos Eduardo Olmos Tomasini', description: 'Start your day with a good breakfast.' },
                { id: 2, name: 'Lunch', description: 'Enjoy a delicious lunch.' },
                { id: 3, name: 'Dinner', description: 'End your day with a hearty dinner.' },
                { id: 4, name: 'Snack', description: 'Grab a quick snack when you feel hungry.' },
            ]),
            evidencias: [], // Lista de archivos subidos
            evidenciasHeaders: [
                { title: 'Nombre del Archivo', key: 'nombre' },
                { title: 'Extensión', key: 'extension' },
                { title: 'Acciones', key: 'actions' },
            ],
            isDialogEvidenciasVisible: false,
            idEliminarDocumento: 0,
            modalEliminarDocumento: false,
            FormAcuerdoActa: '',
            EditorTextoValidar: false,
            IdReunion: 0,
            showDialogConfirm: false,
            confirmacionParticipantes: false,
            direccionLugar: {
                id: 0,
                lugar: '',
                direccion: '',
                asientos: 0
            },
            splittedDataContador: []
        }
    },
    watch: {
        "dependenciaSeleccionada": function (val) {
            console.log('Asignacion de Modalidad', val);
            this.idDependenciaSelec = val.id
            this.NombreDependenciaSelec = val.nombre
        },
        'formRequest.listaParticipantes': {
            handler(newList) {
                this.actualizarListaFirmantes();
            },
            deep: true
        }
    },
    computed: {
        agruparPorDependencia() {
            const participantesPorDependencia = {};
            let contador = 1;
            this.formRequest.listaParticipantes.forEach((participante) => {
                const dependencia = participante.dependencia;
                if (!dependencia) {
                    if (!participantesPorDependencia["Sociedad Civil"]) {
                        participantesPorDependencia["Sociedad Civil"] = [];
                    }
                    participantesPorDependencia["Sociedad Civil"].push(participante);

                } else {
                    if (!participantesPorDependencia[dependencia]) {
                        participantesPorDependencia[dependencia] = [];
                    }
                    participantesPorDependencia[dependencia].push(participante);

                }
            });
            return participantesPorDependencia;
        },
        fechaFormatoActa() {
            const fecha = this.formatoFecha(this.formRequest.fecha)
            return fecha
        },
        AcuerdosFechaFormateadoa() {
            const fechaFormateadaAcuerdos = this.FormMinuta.listaAcuerdoRequest.map((acuerdo) => {
                if (acuerdo.fecha != null) {
                    acuerdo.fecha = this.formatoFecha(acuerdo.fecha);

                } else {
                    acuerdo.fecha = "Sin fecha";
                }
                return acuerdo;
            });
            return fechaFormateadaAcuerdos;
        }

    },
    methods: {
        // fechasWord(fecha) {
        //     if (fecha) {
        //         console.log("Fecha recibida:", fecha);
        //         const options = { day: "numeric", month: "long", year: "numeric" };
        //         const [year, month, day] = fecha.split('-').map(Number);
        //         const fechaUTC = new Date(Date.UTC(year, month - 1, day));
        //         return new Intl.DateTimeFormat("es-ES", options).format(fechaUTC);
        //     }
        //     return null;
        // },


        //MODIFIED//////////////////////////////////////////////////////////////
        renderDoc() {
            const Sfecha = this.fechaFormatoActa;
            const Shora = this.formRequest.hora;
            const Slugar = this.formRequest.lugar;
            const Slista = this.formRequest.listaParticipantes;
            const Stitulo = this.formRequest.titulo;
            const Sfolio = this.FormMinuta.folio;
            const Smodalidad = this.formRequest.modalidad;
            const Sdireccion = this.direccionLugar.direccion;
            const Sminuta = this.AcuerdosFechaFormateadoa;
            // var Sasuntos = this.FormMinuta.resumen;
            var Sobservaciones = this.FormMinuta.observaciones;
            const SlistaOrden = this.FormMinuta.listaOrden;
            const SnumberedStep = this.numberedSteps;
            const Syear = `${new Date().getFullYear()}`;
            const etiquetas = ["<p>", "</p>", "<strong>", "</strong>", "<em>", "</em>", "<s>", "</s>", "<u>", "</u>", "<mark>", "</mark>", "<li>", "</li>", '<p style="text-align: justify">', "<ol>", "</ol>", '<p style="text-align: right">', '<p style="text-align: justify">', '<p style="text-align: center">', '<ul>', '</ul>'];

            // Sasuntos = Sasuntos.replace("<p>", "");
            // Sasuntos = Sasuntos.replace("</p>", "");
            Sobservaciones = Sobservaciones ? Sobservaciones : 'Sin observaciones';
            etiquetas.forEach(etiqueta => {
                Sobservaciones = Sobservaciones.replace(new RegExp(etiqueta, 'g'), "");
            });
            etiquetas.forEach(etiqueta => {
                Sminuta.forEach((idunno2) => {
                    idunno2.acuerdo = idunno2.acuerdo.replace(new RegExp(etiqueta, 'g'), "");
                });
            });
            SnumberedStep.forEach((idunno3) => {
                etiquetas.forEach(etiqueta => {
                    idunno3.notaActa = idunno3.notaActa.replace(new RegExp(etiqueta, 'g'), "");
                });
            });
            //const Stitulo = `${this.Configuraciones.titulo}`; //{titulo} UNUSED

            console.log("list is");
            console.log(Slista);
            console.log("2nd list is");
            console.log(Sminuta);
            console.log("And the 3rd is");
            console.log(SlistaOrden);
            console.log("and the 4th is tho");
            console.log(SnumberedStep);
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
                    ordenes: []
                };
                var Help4 = {
                    LABESTIA: "",
                    ordenes: []
                }
                var num = 1;
                var num2 = 1;
                Slista.forEach((idunno) => {
                    console.log("list item");
                    idunno.userAsistencia = num;
                    console.log(idunno);
                    Help.participantes.push(idunno);
                    num = num + 1;
                });
                Sminuta.forEach((idunno2) => {
                    Help2.acuerdos.push(idunno2);
                });
                SnumberedStep.forEach((idunno3) => {

                    Help3.ordenes.push(idunno3);
                });
                if (Help3.ordenes.length != 0) {
                    console.log(Help3.ordenes.length);
                    Help3.ordenes.splice(Help3.ordenes.length - 1, 1,);

                    console.log("Corte el array");
                }
                console.log("and we got...");
                console.log(Help3);//En serio no me creo que esto haya funcionado :V
                /* var tempDepend='';
                 var tempArray2=[{nombreDependencia:'',dependientes:[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}]}];
                 
                 var SlistOrdered = [{dependencias:[{nombreDependencia:'',dependientes:[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}]}]}];
                 test.forEach((Getdependencia) => {
                   console.log("Whatever im trying here");
                   console.log(Getdependencia);
                 var tempArray=[{numeroDependiente:0,nombreDependiente:'',representanteDependiente:'',cargoDependiente:''}];
                   //Getdependencia.forEach((Getparticipante) => {
                     tempDepend=Getdependencia.dependencia;
                     tempArray.push({numeroDependiente:Getdependencia.numeroPar,nombreDependiente:Getdependencia.persona,representanteDependiente:Getdependencia.personaRepresentar,cargoDependiente:Getdependencia.cargoPersona});
                 //});
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
                    direccion: Sdireccion,
                    modalidad: Smodalidad,
                    participantes: Help.participantes,
                    acuerdos: Help2.acuerdos,
                    firmantes: Help.participantes,
                    //asuntos: Sasuntos,
                    observaciones: Sobservaciones,
                    ordenes: Help3.ordenes
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
        onSubmit() {
            console.log(formData.value)
        },

        async obtenerLugarReunion(idLugar) {
            console.log(idLugar)
            let result = await lugarService.ObtenerLugarReunion(idLugar)
            this.direccionLugar = result.data
        },
        async generatePDF() {
            const element = this.$refs.htmlContent;

            const options = {
                margin: [32, 0, 25, 0],
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                filename: 'archivo.pdf',
                pagebreak: { mode: 'avoid-all' }
            };

            try {
                //await new Promise((resolve) => setTimeout(resolve, 1));

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
                const totalPages = pdfDoc.getPageCount();
                const pages = pdfDoc.getPages();
                // const imageBytes = await fetch('/src/assets/images/logos/back_acta 1.png').then(res => res.arrayBuffer());
                //const imageBytes = await fetch(`${import.meta.env.BASE_URL ?? '/'}images/logos/back_acta 1.png`).then(res => res.arrayBuffer());
                const imageBytes = await fetch(`${import.meta.env.BASE_URL ?? '/'}images/logos/Actas_Mesa de trabajo 1.png`).then(res => res.arrayBuffer());
                const imagen = await pdfDoc.embedPng(imageBytes);
                const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    const { width, height } = page.getSize();
                    const dims = { width, height };

                    const imageY = dims.height - imagen.height - 20 - 20;
                    const drawHeader = () => {
                        const additionalText = ` ${this.Configuraciones.titulo} `;
                        const maxWidth = 223; // Ancho máximo permitido para el texto en puntos (ajusta según sea necesario)
                        const lineSpacing = -4; // Espaciado adicional entre líneas

                        const splitTextIfNeeded = (text, maxWidth) => {
                            const words = text.split(' ');
                            let lines = [''];
                            let currentLine = 0;

                            for (const word of words) {
                                const width = boldFont.widthOfTextAtSize(word, 12);
                                if (width > maxWidth) {
                                    const wordParts = word.match(new RegExp(`.{1,${Math.floor(maxWidth / 5)}}`, 'g'));
                                    lines[currentLine] += wordParts[0];

                                    for (let i = 1; i < wordParts.length; i++) {
                                        lines.push('');
                                        currentLine++;
                                        lines[currentLine] += wordParts[i];
                                    }
                                } else if (boldFont.widthOfTextAtSize(lines[currentLine] + word, 12) > maxWidth) {
                                    lines.push('');
                                    currentLine++;
                                    lines[currentLine] += word;
                                } else {
                                    lines[currentLine] += (lines[currentLine] ? ' ' : '') + word;
                                }
                            }

                            return lines.reverse().join('\n');
                        };

                        const dividedText = splitTextIfNeeded(additionalText, maxWidth);

                        const textLines = dividedText.split('\n');
                        const textHeightH = boldFont.heightAtSize(12) * textLines.length;
                        const startYAdditional = height - textHeightH - 30;
                        const startYAdditional2 = height - textHeightH - 8;
                        const startX = 370; // Alineado a la izquierda

                        for (let i = 0; i < textLines.length; i++) {
                            const line = textLines[i];
                            const textWidth = boldFont.widthOfTextAtSize(line, 12);
                            const startXLine = startX;
                            const startXLine2 = startX - 115;
                            const defaultTextColor = { color: rgb(0, 0, 0) };

                            page.drawText(line, {
                                x: startXLine + 5,
                                y: startYAdditional + i * (boldFont.heightAtSize(12) + lineSpacing),
                                size: 6,
                                font: boldFont,
                                lineHeight: 16,
                                ...defaultTextColor,
                            });
                        }

                        const yearText = `${new Date().getFullYear().toString()}.`;
                        const yearWidth = boldFont.widthOfTextAtSize(yearText, 30);
                        const startXYear = 375;

                        page.drawText(yearText, {
                            x: startXYear,
                            y: startYAdditional2,
                            size: 20,
                            font: boldFont,
                            lineHeight: 16,
                            color: rgb(0.5019607843137255, 0.5019607843137255, 0.5019607843137255),
                        });
                        const pageNumberText = `${i + 1}`;
                        const pageNumberTextWidth = boldFont.widthOfTextAtSize(pageNumberText, 8);
                        const pageNumberX = 480; // Ajusta la posición x del número de página

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

        async obtenerConfiguraciones(id) {
            try {
                let result = await configuracionService.listarConfiguracionPorId(id);
                this.Configuraciones = result.data
                console.log(this.Configuraciones)
            } catch (error) {
                console.log(error)
            }
        },
        async _ObtnerDatosReunionMinutas(id) {
            await this._ObtenerDatosReunionesVinculadas(id)
            let result = await reunionService.ObtenerDatosReunionMinutasIdReunion(id);
            if (result != null) {
                this.formRequest = result
                // if (result.idReunionVinculada !== null)

            }
            console.log(this.formRequest);
        },
        async _ObtnerDatosMinutasId(id) {
            let result = await reunionService.ObtenerDatosMinutasId(id);
            if (result != null) {
                this.FormMinuta = result

                var result3 = result.listaAcuerdoRequest[result.listaAcuerdoRequest.length - 1]?.folioAcuerdo;

                if (result3)
                    this.contadorA += parseInt(result3.split('-')?.[1])
            }
        },
        async ObtenerDependencias(idReunion) {
            let result = await reunionService.obtenerDependenciasPorIdReunion(idReunion).then((res) => {
                this.dependencias = res
            });
            this.dependenciaN = this.dependencias.map(dependencia => dependencia.nombre)
        },
        async _ObtenerDatosReunionesVinculadas(id) {
            let result = await reunionService.obtenerDatosReunionesVinculadasConMinutas(id);
            if (result != null) {
                //console.log('Resulta de Vinculacion', result.reunionVM.idReunionVinculada);
                this.DatosVinculado.push(result)
                // if (result.reunionVM.idReunionVinculada != 0)
                //     await this._ObtenerDatosReunionesVinculadas(result.reunionVM.idReunionVinculada)
            }
        },
        async _obtenerDatosReunionCompetos(IdReunion) {
            let result = await reunionService.obtenerDatosActualizar(IdReunion);
            let resultPart = await reunionService.obtenerListaParticipanteIdReunionMesa(IdReunion);
            if (result != null) {
                this.formRequest = result.data
                this.formRequest.listaParticipantes = [];
                this.formRequest.listaParticipantes = resultPart;
                //this.numberedSteps = result.data.listaOrden;
                this.numberedSteps = result.data.listaOrden.map((valor, index) => ({
                    //title: "Orden " + valor.numOrden,
                    subtitle: valor.descripcion,
                    id: valor.idOrden,
                    ListaPersona: valor.listaPersona,
                    notaActa: valor.notaActa,
                    minutos: valor.minutos,
                    Datos: "Participantes del orden " + valor.numOrden,
                    numOrden: valor.numOrden,
                    // Puedes añadir más propiedades según sea necesario
                }));
                this.numberedSteps.push(this.crearOrden(this.numberedSteps.length + 1))
            }
        },
        crearOrden(count) {
            return {
                //title: "Orden " + count,
                subtitle: "Datos Participante",
                id: count,
                ListaPersona: [],
                notaActa: "",
                minutos: 0,
                numOrden: count
            };
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
            if (item.link) {
                if (item.extension.toLowerCase() == "pdf" || this.esImagen(item.extension.toLowerCase())) {
                    window.open(item.link, '_blank');
                } else {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.setAttribute('download', item.nombreOriginal);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.toast.success('Descarga exitosa');
                }
            }
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
                    elemento.minutasDTOVM.listaAcuerdosVM.forEach((elementoAcuerdo) => {
                        if (elementoAcuerdo.acuerdosMinutasVM.idAcuerdo === Item.idAcuerdo)
                            elementoAcuerdo.acuerdosMinutasVM.estatusAcuerdo = "Finalizado"
                    });
                });
                this.toast.success(result.data.message);
            } else {
                this.toast.success(result.data.message);
            }
        },
        Next() {
            this.currentStep++
        },
        async validarFromGeneral() {
            let res = await this.$refs.FormAcuerdoActa.validate();
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
            let mes = fechaFolio.getMonth() + 1;
            let year = fechaFolio.getFullYear();
            let folioAcuerdo;

            if (this.formRequest.idTipoReunion == 1)
                folioAcuerdo = `M-${this.contadorA}-${dia}-${mes}-${year}`;
            else if (this.formRequest.idTipoReunion == 2)
                folioAcuerdo = `A-${this.contadorA}-${dia}-${mes}-${year}`;

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
                this.contadorA++;
                this.toast.success("Se a agrego correctamente")
            }

            this.seccionDeshabilitada = false;
            this.acuerdoDeshabilitado = true;
            this.acuerdo = '';
            this.date = null;
            this.dependenciaSeleccionada = [];
            this.acuerdoSeleccionado = null;
            this.isModalAcuerdo = false;
        },
        editarAcuerdo(AcuerdoCompleto) {
            this.acuerdoSeleccionado = AcuerdoCompleto;
            this.acuerdo = this.acuerdoSeleccionado.acuerdo;
            this.date = this.acuerdoSeleccionado.fecha == '0001-01-01T00:00:00' ? null : this.acuerdoSeleccionado.fecha;
            this.isModalAcuerdo = true;
            this.dependenciaSeleccionada = this.dependencias.find(x => x.id == this.acuerdoSeleccionado.idDependencia);
            this.acuerdoDeshabilitado = false;
            this.seccionDeshabilitada = true;
        },
        eliminarAcuerdo(AcuerdoCompleto) {
            this.acuerdoSeleccionado = AcuerdoCompleto;
            var IndexEliminar = this.FormMinuta.listaAcuerdoRequest.indexOf(this.acuerdoSeleccionado)
            let row = this.FormMinuta.listaAcuerdoRequest.splice(IndexEliminar, 1);
            if (row) {
                console.log("eliminar", row);
                this.toast.success("se a eliminar correscto")
            }
            else {
                this.toast.error("no se pudo eliminar")
            }
        },
        async ActualizarEstatusAcuerdo(IdAcuerdo, Estatus) {

        },
        abrirOrdenDeFirmas() {
            this.FormMinuta.listaParticipantes = this.formRequest.listaParticipantes
                .filter(participante => participante.firma == true)
                .sort((a, b) => a.ordenFirmar - b.ordenFirmar);
            if (this.FormMinuta.listaParticipantes.length == 0) {
                this.toast.warning('No hay participantes seleccionados para firmar');
            } else {
                this.isOrdenFirma = true;
            }
            // console.log(this.FormMinuta.listaParticipante);
        },
        guardarOrden() {
            this.FormMinuta.listaParticipantes.forEach((participante, index) => {
                participante.ordenFirmar = index + 1;
            });
            this.isOrdenFirma = false;
            this.toast.success('Orden de firma guardado');
        },
        actualizarListaFirmantes() {
            this.FormMinuta.listaParticipantes = this.formRequest.listaParticipantes
                .filter(participante => participante.firma)
                .sort((a, b) => a.ordenFirmar - b.ordenFirmar);

            this.FormMinuta.listaParticipantes.forEach((participante, index) => {
                participante.ordenFirmar = index + 1;
            });
        },
        actualizarEstadoFirma(participante) {
            if (participante.firma) {
                participante.ordenFirmar = this.FormMinuta.listaParticipantes.length + 1;
                this.FormMinuta.listaParticipantes.push(participante);
            } else {
                this.FormMinuta.listaParticipantes = this.FormMinuta.listaParticipantes
                    .filter(p => p.id !== participante.id) // suponiendo que cada participante tiene un ID único
                    .sort((a, b) => a.ordenFirmar - b.ordenFirmar);

                this.FormMinuta.listaParticipantes.forEach((p, index) => {
                    p.ordenFirmar = index + 1;
                });
            }
        },
        continuarSinParticipantes() {
            // this.FormMinuta.listaParticipantes = this.formRequest.listaParticipantes;
            // for (let i = 0; i < this.FormMinuta.listaParticipantes.length; i++) {
            //     this.FormMinuta.listaParticipantes[i].firma = true;
            //     this.FormMinuta.listaParticipantes[i].ordenFirmar = i + 1;
            // }
            this.confirmacionParticipantes = true;
            this.ActualizarActa();
        },
        async ActualizarActa() {
            try {
                this.FormMinuta.listaOrden = this.crearListaOrdenActualizar(this.numberedSteps);
                this.FormMinuta.listaAcuerdo = this.FormMinuta.listaAcuerdoRequest;
                this.FormMinuta.idEstatusMinuta = 0; //PREGUNTAR
                if (!this.confirmacionParticipantes && (!this.FormMinuta.listaParticipantes || this.FormMinuta.listaParticipantes.length == 0)) {
                    this.showDialogConfirm = true;
                    return;
                }
                this.FormMinuta.resumen = 'A';
                let result = await reunionService.actualizarActaMinuta(this.FormMinuta);
                if (result.data?.success) {
                    this.dialogPDF = true;
                    this.generatePDF();
                    this.toast.success(result.data.message);

                } else {
                    this.toast.success(result.data.message);
                }
            } catch (error) {
                console.error("!Error¡", error);
            }
        },
        crearListaOrdenActualizar(ordenes) {
            let listaOrden = [];
            let ordenesASubir = ordenes.slice(0, -1);

            ordenesASubir.forEach((orden) => {
                listaOrden.push({
                    idOrden: orden.id,
                    idReunion: this.IdReunion,
                    notaActa: orden.notaActa
                });
            });

            return listaOrden;
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
        getPositionString(NumOrden) {
            switch (NumOrden) {
                case 1:
                    return "PRIMER PUNTO";
                case 2:
                    return "SEGUNDO PUNTO";
                case 3:
                    return "TERCER PUNTO";
                case 4:
                    return "CUARTO PUNTO";
                case 5:
                    return "QUINTO PUNTO";
                case 6:
                    return "SEXTO PUNTO";
                case 7:
                    return "SEPTIMO PUNTO";
                case 8:
                    return "OCTAVO PUNTO";
                case 9:
                    return "NOVENO PUNTO";
                case 10:
                    return "DECIMO PUNTO";
                case 11:
                    return "UNDECIMO PUNTO";
                case 12:
                    return "DUODECIMO PUNTO";
                case 13:
                    return "DECIMOTERCERO PUNTO";
                case 14:
                    return "DECIMOCUARTO PUNTO";
                case 15:
                    return "DECIMOQUINTO PUNTO";
                case 16:
                    return "DECIMOSEXTO PUNTO";
                case 17:
                    return "DECIMOSEPTIMO PUNTO";
                case 18:
                    return "DECIMOOCTAVO PUNTO";
                case 19:
                    return "DECIMONOVENO PUNTO";
                case 20:
                    return "VIGESIMO PUNTO";
                default:
                    return "Orden no manejada";
            }
        },

    },
    async created() {
        const params = this.$route.params
        let url = new URLSearchParams(window.location.search)
        let IdReunion = params.idReunion
        this.IdReunion = IdReunion;
        let IdMinuta = params.idMinuta
        if (IdReunion != null && IdMinuta != null) {
            await this._ObtnerDatosReunionMinutas(IdReunion)
            await this._ObtnerDatosMinutasId(IdMinuta)
            await this.ObtenerDependencias(IdReunion);
            await this._obtenerDatosReunionCompetos(IdReunion)
            await this.obtenerConfiguraciones(this.Configuraciones.id);
            await this.obtenerLugarReunion(this.formRequest.idLugar)

        }
    },
}



</script>

<template>
    <VRow class="justify-center">
        <VCol cols="12" md="12">
            <VCard>

            </VCard>
            <VCard>

                <VCardText class="rounded-4">
                    <VWindow>
                        <VWindowItem>
                            <VForm>
                                <h2>
                                    <p><b>Crear Acta</b></p>
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
                                            <VCardText>
                                                <!-- 👉 Stepper -->
                                                <AppStepper style="align-self:flex-start;"
                                                    v-model:current-step="currentStep" :items="numberedSteps" />
                                            </VCardText>
                                            <VDivider />
                                            <VCol cols="12" md="9">
                                                <VCardText>
                                                    <!-- 👉 stepper content (step, index) in numberedSteps-->
                                                    <VForm>
                                                        <VWindow v-model="currentStep" class="disable-tab-transition">
                                                            <VWindowItem v-for="(step, index) in numberedSteps"
                                                                :key="index">
                                                                <!-- Condición para mostrar el contenido específico solo en el último registro -->

                                                                <template v-if="index === numberedSteps.length - 1">
                                                                    <VRow>
                                                                        <!-- Contenido específico para el último registro -->
                                                                        <VCol cols="12" md="8" class="px-0">
                                                                            <h6 class="text-h4 font-weight-medium">
                                                                                Seleccionar a los participantes para
                                                                                firma
                                                                                de acta
                                                                            </h6>
                                                                            <p>
                                                                                <!-- <h3>Firma de acta</h3> -->
                                                                            </p>
                                                                        </VCol>
                                                                        <VCol>
                                                                            <VBtn class="font-weight-medium"
                                                                                @click="abrirOrdenDeFirmas()">
                                                                                Orden de firma
                                                                                <VIcon end icon="tabler-checkbox" />
                                                                            </VBtn>
                                                                        </VCol>
                                                                        <VCol cols="12" md="12"
                                                                            v-for="(participantesPorDependencia, dependencia) in agruparPorDependencia"
                                                                            :key="dependencia">
                                                                            <div>
                                                                                <h4 class="text-primary">
                                                                                    <p>{{ dependencia }}</p>
                                                                                </h4>
                                                                                <VRow>
                                                                                    <VCol cols="12" md="6"
                                                                                        v-for="(participante, indexpp) in participantesPorDependencia"
                                                                                        :key="indexpp">
                                                                                        <VRow>
                                                                                            <VCol sm="1" cols="2"
                                                                                                class="d-flex align-end"
                                                                                                style="height: fit-content;">
                                                                                                <VCheckbox
                                                                                                    color="success"
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
                                                                                                    representación de
                                                                                                </P>
                                                                                                <P v-if="participante.idRepresentado > 0"
                                                                                                    class="mb-0"><b>{{
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
                                                                        <!-- Fin del contenido específico para el último registro -->
                                                                    </VRow>
                                                                </template>
                                                                <!-- VRow original (sin cambios) para los registros anteriores al último -->

                                                                <template v-else>
                                                                    <VRow class="mb-3">
                                                                        <VCol cols="12">
                                                                            <h3 class="text-h4 font-weight-medium">
                                                                                <b>{{ getPositionString(step.numOrden)
                                                                                    }}</b>
                                                                            </h3>
                                                                            <!-- <p class="mb-0"
                                                                                v-for="(part, indexp) in step.ListaPersona"
                                                                                :key="indexp">
                                                                                {{ part.persona }}
                                                                            </p>
                                                                            <p>{{ step.minutos }}</p> -->
                                                                            <VRow>
                                                                                <VCol cols="9">
                                                                                    <VList>
                                                                                        <VListItem
                                                                                            v-for="(part, indexp) in step.ListaPersona"
                                                                                            :key="indexp"
                                                                                            rounded="shaped">
                                                                                            <template #prepend>
                                                                                                <VIcon
                                                                                                    icon="tabler-user" />
                                                                                            </template>
                                                                                            <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                                                                                            <VListItemTitle /> {{
                                            part.persona }}
                                                                                        </VListItem>
                                                                                    </VList>
                                                                                </VCol>
                                                                                <VCol cols="3">
                                                                                    <VListItem>
                                                                                        <VBtn size="38"
                                                                                            color="secondary"
                                                                                            class="mx-3">
                                                                                            <VIcon
                                                                                                icon="tabler-clock-hour-7"
                                                                                                size="22" />
                                                                                        </VBtn>

                                                                                        {{ step.minutos }} minutos
                                                                                    </VListItem>
                                                                                    <p></p>
                                                                                </VCol>
                                                                            </VRow>
                                                                        </VCol>
                                                                        <VCol cols="12" md="12" class="">
                                                                            <VCardText class="px-0 py-0">
                                                                                <label for="">Descripción de
                                                                                    Orden</label>
                                                                                <TiptapEditor
                                                                                    v-model="numberedSteps[currentStep].notaActa"
                                                                                    class="border rounded mt-4"
                                                                                    placeholder="Descripción de Orden" />

                                                                            </VCardText>
                                                                        </VCol>
                                                                    </VRow>
                                                                </template>
                                                            </VWindowItem>

                                                        </VWindow>
                                                        <div
                                                            class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                                                            <VBtn color="secondary" variant="tonal"
                                                                :disabled="currentStep === 0" @click="currentStep--">
                                                                <VIcon icon="tabler-arrow-left" start
                                                                    class="flip-in-rtl" />
                                                                Anterior
                                                            </VBtn>
                                                            <VBtn @click="Next()">
                                                                Siguiente
                                                                <VIcon icon="tabler-arrow-right" end
                                                                    class="flip-in-rtl" />
                                                            </VBtn>
                                                        </div>
                                                    </VForm>
                                                </VCardText>
                                            </VCol>
                                            <VCol cols="12" md="3" class="">
                                                <div class="contedidoAcuerdo px-5 py-5 bg-var-theme-background">
                                                    <div>
                                                        <div class="pin-sas">
                                                            <VIcon icon="tabler-pinned-filled" />
                                                        </div>
                                                        <VDialog v-model="isModalAcuerdo" persistent width="650">
                                                            <!-- Dialog Activator -->

                                                            <template #activator="{ props }">
                                                                <span>Acuerdo</span>
                                                                <VBtn v-bind="props" color="cafe" size="25"
                                                                    rounded="pill" title="Crear Acuerdo" class="mx-3"
                                                                    @click="MostrarContenido()">
                                                                    <VIcon class="tabler-plus" size="15" />
                                                                </VBtn>
                                                            </template>
                                                            <!-- Dialog close btn -->
                                                            <DialogCloseBtn @click="isModalAcuerdo = !isModalAcuerdo" />
                                                            <!-- Dialog Content -->
                                                            <VForm ref="FormAcuerdoActa">
                                                                <VCard title="Crear Acuerdo"
                                                                    :class="{ 'deshabilitado': acuerdoDeshabilitado }">
                                                                    <VCardText>
                                                                        <VRow>
                                                                            <VCol cols="12" sm="12" md="12">
                                                                                <VCardText class="px-0 py-0">
                                                                                    <label for="">Acuerdo</label>
                                                                                    <TiptapEditor v-model="acuerdo"
                                                                                        placeholder="Acuerdo"
                                                                                        class="border rounded mt-4" />

                                                                                </VCardText>
                                                                            </VCol>
                                                                            <VCol cols="12" sm="8" md="8">
                                                                                <AppCombobox
                                                                                    v-model="dependenciaSeleccionada"
                                                                                    :items="dependencias"
                                                                                    label="Dependencias"
                                                                                    placeholder="Seleccione la dependencia"
                                                                                    item-title="nombre" item-value="id"
                                                                                    :rules="[requiredValidator]">
                                                                                </AppCombobox>
                                                                            </VCol>
                                                                            <VCol cols="12" md="4">
                                                                                <AppDateTimePicker v-model="date"
                                                                                    label="Fecha"
                                                                                    placeholder="Selecciona la fecha" />
                                                                            </VCol>

                                                                        </VRow>
                                                                    </VCardText>
                                                                    <VCardText
                                                                        class="d-flex justify-end gap-3 flex-wrap">
                                                                        <VBtn color="secondary" variant="tonal"
                                                                            @click="isModalAcuerdo = false">
                                                                            Cancelar
                                                                        </VBtn>
                                                                        <VBtn @click="validarFromGeneral()">
                                                                            Guardar
                                                                        </VBtn>
                                                                    </VCardText>
                                                                </VCard>
                                                            </VForm>
                                                        </VDialog>
                                                    </div>
                                                    <div>
                                                        <VTable class="text-no-wrap" height="100%">
                                                            <tbody>
                                                                <tr v-for="(acuerdo, index) in FormMinuta.listaAcuerdoRequest"
                                                                    :key="index">
                                                                    <td>
                                                                        {{ acuerdo.folioAcuerdo }}
                                                                    </td>
                                                                    <td>
                                                                        <VBtn title="Editar" size="25" color="success"
                                                                            class="mx-2"
                                                                            @click="editarAcuerdo(acuerdo)">
                                                                            <VIcon icon="tabler-edit" size="15" />
                                                                        </VBtn>
                                                                        <VBtn size="25" color="error"
                                                                            @click="eliminarAcuerdo(acuerdo)">
                                                                            <VIcon icon="tabler-trash" size="15" />
                                                                        </VBtn>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </VTable>
                                                    </div>
                                                </div>
                                            </VCol>

                                        </VRow>
                                    </VCardText>
                                </div>
                                <!-- <div class="contenido">
                                    <VCardText>
                                        <label for="">Resumen de Minuta</label>
                                        <TiptapEditor v-model="this.FormMinuta.resumen" class="border rounded mt-4" />

                                    </VCardText>
                                </div> -->
                                <div class="contenido">
                                    <VCardText>
                                        <label for="">Observaciones</label>
                                        <TiptapEditor v-model="this.FormMinuta.observaciones"
                                            class="border rounded mt-4" />

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
                                    <VBtn @click="isVistasDatos = true" size="35" color="cafe">
                                        <VIcon size="25" icon="tabler-eye" />
                                    </VBtn>
                                    <VBtn color="error" @click="regresarMinutas()">
                                        Cancelar
                                    </VBtn>
                                    <VBtn color="success" @click="ActualizarActa()">
                                        Guardar
                                    </VBtn>
                                </VCardText>
                            </VForm>
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
                    <div class="ps-4">
                        <h2>Acta</h2>
                    </div>
                    <hr />
                    <div class="ps-5 ">
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
                    <hr />
                    <div class="d-flex my-4">
                        <div class="mx-3">
                            <label for="">Folio de acta</label>
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
                        <VCol cols="12" md="12" v-for="(OrdenItem, index) in this.numberedSteps" :key="index">
                            <VCard class="rounded-4" v-if="index !== numberedSteps.length - 1">
                                <VCardText>
                                    <div class="mb-5">
                                        <VRow>
                                            <VCol class="1" md="1">
                                                <VChip size="large" label color="error">
                                                    {{ OrdenItem.numOrden }}
                                                </VChip>
                                            </VCol>
                                            <VCol class="11" md="11">
                                                <b>
                                                    <h3 class="mb-0 text-primary">{{
                                            this.getPositionString(OrdenItem.numOrden) }}</h3>
                                                </b>
                                                <p>{{ OrdenItem.subtitle }}
                                                </p>
                                                <p v-html="OrdenItem.notaActa"></p>
                                                <div v-if="index == numberedSteps.length - 3">
                                                    <VTable class="">
                                                        <thead>
                                                            <tr>
                                                                <th class="text-uppercase">
                                                                    No. de acuerdo
                                                                </th>
                                                                <!-- <th class="text-uppercase">
                                                                    Dependencia
                                                                </th> -->
                                                                <th class="text-uppercase">
                                                                    Fecha
                                                                </th>
                                                                <th class="text-uppercase">
                                                                    Acuerdo
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(AcuerdoItem, indexA) in this.FormMinuta.listaAcuerdoRequest"
                                                                :key="indexA">
                                                                <td class="w-25">
                                                                    {{ AcuerdoItem.folioAcuerdo }}
                                                                </td>
                                                                <!-- <td class="w-25">
                                                                    {{ AcuerdoItem.nombreDependencia }}
                                                                </td> -->
                                                                <td class="w-25">
                                                                    {{ AcuerdoItem.fecha && AcuerdoItem.fecha !==
                                            '0001-01-01T00:00:00' ?
                                            this.formatoFecha(AcuerdoItem.fecha) : 'Sin fecha'
                                                                    }}
                                                                </td>
                                                                <td class="w-50">
                                                                    <p class="my-2" v-html="AcuerdoItem.acuerdo"></p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </VTable>
                                                </div>

                                            </VCol>
                                        </VRow>
                                    </div>
                                </VCardText>
                            </VCard>
                        </VCol>

                        <!--                         
                        <VCol cols="12" md="12">
                            <VCard class="rounded-4">
                                <VCardText >
                                    <div class="mb-5">
                                        <VRow>
                                            <VCol class="1" md="1">
                                                <VChip size="large"
                                                label
                                                color="error"
                                                >
                                                    4
                                                </VChip>
                                            </VCol>
                                            <VCol class="11" md="11">
                                                <b><h3 class="mb-0 text-primary">Cuarto punto</h3></b>
                                                <p>Lectura de acuerdos</p>
                                                <VTable class="">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-uppercase">
                                                                No. de acuerdo
                                                            </th>
                                                            <th class="text-uppercase">
                                                                Acuerdo
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="w-25">
                                                                1-/23/11/2024
                                                            </td>
                                                            <td class="w-75">
                                                                <p class="my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam eum eaque neque animi ex voluptates, voluptate deleniti obcaecati? Assumenda minus sint, illo quas est dolorem culpa praesentium non natus voluptatum!</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </VTable>
                                            </VCol>
                                        </VRow>
                                    </div>   
                                </VCardText>
                            </VCard>
                        </VCol> -->
                        <!-- <VCol cols="12" md="12">
                            <VCard class="rounded-4">
                                <VCardText >
                                    <div class="mb-5">
                                        <VRow>
                                            <VCol class="1" md="1">
                                                <VChip size="large"
                                                label
                                                color="error"
                                                >
                                                    5
                                                </VChip>
                                            </VCol>
                                            <VCol class="11" md="11">
                                                <b><h3 class="mb-0 text-primary">Quinto punto</h3></b>
                                                <p class="mb-8">Orden de Firmas</p>
                                                <VRow>
                                                    <VCol cols="12" md="6">
                                                        <div class="px-5 text-center">
                                                            <hr />
                                                            <p class="mb-0">Nombre y apellido</p>
                                                            <p>Cargo</p>
                                                        </div>
                                                    </VCol>
                                                    <VCol cols="12" md="6">
                                                        <div class="px-5 text-center">
                                                            <hr />
                                                            <p class="mb-0">Nombre y apellido</p>
                                                            <p>Cargo</p>
                                                        </div>
                                                    </VCol>
                                                     <VCol cols="12" md="6">
                                                            <div class="px-5 text-center">
                                                                <hr />
                                                                <p class="mb-0">Nombre y apellido</p>
                                                                <p>Cargo</p>
                                                            </div>
                                                        </VCol>
                                                        <VCol cols="12" md="6">
                                                            <div class="px-5 text-center">
                                                                <hr />
                                                                <p class="mb-0">Nombre y apellido</p>
                                                                <p>Cargo</p>
                                                            </div>
                                                        </VCol>
                                                </VRow>
                                            </VCol>
                                        </VRow>
                                    </div>   
                                </VCardText>
                            </VCard>
                        </VCol> -->
                        <!-- <VCol cols="12" md="12">
                            <VCard class="rounded-4">
                                <VCardText >
                                    <div class="mb-5">
                                        <VRow>
                                            <VCol class="1" md="1">
                                                <VChip size="large"
                                                label
                                                color="error"
                                                >
                                                    6
                                                </VChip>
                                            </VCol>
                                            <VCol class="11" md="11">
                                                <b><h3 class="mb-0 text-primary">Sexto punto</h3></b>
                                                <p>Cierre de sessión</p>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tempora suscipit accusantium iusto expedita dolorum corporis asperiores enim. Neque voluptatibus, adipisci modi expedita saepe accusantium molestias sint eveniet quas labore.
                                            </VCol>
                                        </VRow>
                                    </div>   
                                </VCardText>
                            </VCard>
                        </VCol> -->

                    </VRow>
                    <h3 style="text-align:center;" class="text-primary">Firma Participantes</h3>
                    <VRow class="justify-content-center">

                        <VCol cols="10" md="6" v-for="(participante, index) in FormMinuta.listaParticipantes"
                            :key="index">
                            <VCard>
                                <VCardText>
                                    <div class="px-2  text-center">
                                        <p style="margin: 0;"><b>{{ participante.persona }}</b></p>
                                        <p style="margin: 0;">{{ participante.cargoPersona }}</p>
                                        <P v-if="participante.idRepresentado > 0" class="mb-0 mt-2">En representación de
                                        </P>
                                        <P v-if="participante.idRepresentado > 0" class="mb-0"><b>{{
                                            participante.personaRepresentar
                                        }}</b>
                                        </P>

                                        <P v-if="participante.idInvitante > 0" class="mb-0 mt-2">Invitado por</P>
                                        <P v-if="participante.idInvitante > 0" class="mb-0"><b>{{
                                            participante.invitadoPor
                                        }}</b>
                                        </P>
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
    <VDialog v-model="isOrdenFirma" class="v-dialog-sm">
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isOrdenFirma = false" />

        <VCard title="Orden de firma">
            <VCardText>
                <div>
                    <draggable v-model="FormMinuta.listaParticipantes" tag="ul" group="meals" :animation="300"
                        style="list-style: none;">

                        <template #item="{ element: meal }">
                            <li class="border py-3 mb-2 rounded ">
                                <VRow>
                                    <VCol cols="2" md="2" variant="tonal" class="text-center">
                                        <VAvatar color="secondary" icon="tabler-user" />
                                    </VCol>
                                    <VCol cols="10" md="10">
                                        <strong>{{ meal.persona }}</strong> <br>
                                        {{ meal.cargoPersona }}
                                        <P v-if="meal.idRepresentado > 0" class="mb-0 mt-2">En representación de</P>
                                        <P v-if="meal.idRepresentado > 0" class="mb-0"><b>{{
                                            meal.personaRepresentar
                                        }}</b>
                                        </P>
                                        <p v-if="meal.idInvitante > 0" class="mb-0 mt-2">Invitado por</p>
                                        <P v-if="meal.idInvitante > 0" class="mb-0"><b>{{
                                            meal.invitadoPor
                                        }}</b>
                                        </P>
                                    </VCol>
                                </VRow>

                            </li>
                        </template>
                    </draggable>
                </div>
            </VCardText>
            <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn variant="tonal" color="secondary" @click="isOrdenFirma = false">
                    Cancelar
                </VBtn>
                <VBtn @click="guardarOrden()">
                    Guardar
                </VBtn>
            </VCardText>
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

    <a onclick="history.back()" class="btn-flotante">
        <VIcon icon="tabler-arrow-narrow-left" />
    </a>
    <div>
        <div style="display: none"><!--style="display: none"-->
            <div ref="htmlContent">
                <div>
                    <div class="acta">
                        <p>ACTA</p>
                    </div>
                    <div class="titulos" style="text-align: center; ">
                        <h2 style="margin:0;  color:gray;"><b>{{ formRequest.titulo }}</b></h2>
                    </div>
                    <div class="titulos">
                        En {{ direccionLugar.direccion }} siendo las {{ formRequest.hora }} horas del dia {{
                                            this.formatoFecha(formRequest.fecha) }}
                        en la modalidad {{ formRequest.modalidad }} dio inicio la {{ formRequest.titulo }}, en el {{
                                            formRequest.lugar }}
                    </div>
                    <div class="titulos" style="margin-top: 20px;">
                        <h3 style="margin: 0; color: gray;">Asistencia</h3>
                        <ol style="list-style-type:disc; margin:0;">
                            <li v-for="(participantes, index) in formRequest.listaParticipantes" :key="index">
                                <p style=" margin-left:3px;"> <b>{{ participantes.persona }}</b>, {{
                                            participantes.cargoPersona
                                        }} de {{
                                                participantes.dependencia
                                            }}</p>
                                <p v-if="participantes.idRepresentado > 0">
                                    como representante de <b>{{ participantes.personaRepresentar }}</b>
                                </p>
                                <p v-if="participantes.idInvitante > 0">
                                    como invitado de <b>{{ participantes.invitadoPor }}</b>
                                </p>
                            </li>

                        </ol>
                    </div>
                </div>
                <div style="page-break-before: always; " class="titulos">
                    <p style="text-align: left; "><b>Desahogo de la reunión/sesión</b></p>
                    <p style="page-break-inside: avoid;" v-html="FormMinuta.observaciones"></p>
                </div>
                <div class="titulos " style="page-break-before: always; ">
                    <div>
                        <p style="text-align: center;  color: gray; "><b>ACUERDOS</b></p>
                        <div v-for="(OrdenItem, index) in this.numberedSteps" :key="index">

                            <div v-if="index !== numberedSteps.length - 1" style="page-break-before: always;">
                                <div class="mb-5">
                                    <div>
                                        <b>
                                            <h3 class="mb-0 ">{{
                                            this.getPositionString(OrdenItem.numOrden) }}</h3>
                                        </b>
                                        <b>
                                            <p>{{ OrdenItem.subtitle }}</p>
                                        </b>
                                        <p v-html="OrdenItem.notaActa"></p>
                                        <div v-if="index == numberedSteps.length - 3">
                                            <table class="">
                                                <thead>
                                                    <tr>
                                                        <th class="colorCeldas text-uppercase">
                                                            No. de acuerdo
                                                        </th>
                                                        <!-- <th class="text-uppercase">
                                                                        Dependencia
                                                                    </th> -->
                                                        <th class="colorCeldas text-uppercase">
                                                            Fecha
                                                        </th>
                                                        <th class="colorCeldas text-uppercase">
                                                            Acuerdo
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(AcuerdoItem, indexA) in this.FormMinuta.listaAcuerdoRequest"
                                                        :key="indexA">
                                                        <td class="w-25">
                                                            {{ AcuerdoItem.folioAcuerdo }}
                                                        </td>
                                                        <!-- <td class="w-25">
                                                                        {{ AcuerdoItem.nombreDependencia }}
                                                                    </td> -->
                                                        <td class="w-25">
                                                            {{ AcuerdoItem.fecha && AcuerdoItem.fecha !==
                                                            '0001-01-01T00:00:00' ?
                                                            this.formatoFecha(AcuerdoItem.fecha) : 'Sin fecha'
                                                            }}
                                                        </td>
                                                        <td class="w-50">
                                                            <p class="my-2" v-html="AcuerdoItem.acuerdo"></p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="titulos">
                    <div class="mt-8" style="page-break-before: always;">
                        <div class="hojaLegal">
                            <h2 style="color:gray; margin-bottom: 30px;">HOJA LEGAL DE FIRMAS</h2>
                        </div>
                        <VRow class="justify-content-center">
                            <VCol cols="10" md="6" v-for="(participante, index) in FormMinuta.listaParticipantes"
                                :key="index">
                                <div class="px-5 my-6 text-center">
                                    <hr />
                                    <p v-if="participante.firma == true " style="margin: 0;"><b>{{ participante.persona
                                            }}</b></p>
                                    <p v-if="participante.firma == true " style="margin: 0;">{{
                                        participante.cargoPersona }}
                                    </p>

                                    <P v-if="participante.idRepresentado > 0 " class="mb-0 mt-2">En Representación de
                                    </P>
                                    <P v-if="participante.idRepresentado > 0 " class="mb-0"><b>{{
                                            participante.personaRepresentar
                                            }}</b>
                                    </P>
                                    <P v-if="participante.idInvitante > 0  " class="mb-0 mt-2">Invitado por</P>
                                    <P v-if="participante.idInvitante > 0 " class="mb-0"><b>{{
                                            participante.invitadoPor
                                            }}</b>
                                    </P>
                                    <p style="margin: 0;">{{ participante.dependencia }}</p>
                                </div>
                            </VCol>
                        </VRow>
                    </div>
                    <!-- <div class="firmasFlex" >
                        <div v-for="(participante, index) in listaParticipantesFiltrados" :key="index" class="spanA">
                            <div class="firmasA">
                                <p style="width: 240px; border-bottom: 1px solid black"></p>
                                <p style="margin: 0;"><b>{{ participante.persona }}</b></p>
                                <p style="margin: 0;">{{ participante.cargoPersona }}</p>
                                <p style="margin: 0;">{{ participante.dependencia }}</p>
                            </div>
                        </div>
                    </div> -->
                    <p style="text-align: left; "><em>{{ formRequest.lugar }}</em></p>
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
                <VCol>
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


<style lang="scss">
.hojaLegal {
    color: rgba(176, 176, 176, 0.841);
    text-align: center;
}

.firmasFlex {
    display: grid;
    grid-template-columns: 50% 50%;
}

.colorCeldas {
    background-color: rgb(98, 98, 98);
    color: white;
}

.firmasA {
    margin: 0;
    width: 250px;
    text-align: center;
    word-wrap: break-word;
    overflow: hidden;
    vertical-align: top;
}

.spanA {
    display: inline-block;
    margin-right: 50px;
    margin-top: 130px;

}

.contenido {
    margin-top: 25px;
    border: 1px solid #050508;
    border-radius: 15px;
}

.titulo {
    text-align: left;
}

.contedidoAcuerdo {
    border-radius: 25px;
    padding: 15px;
    padding-top: 25px;
    position: relative;
    max-height: 80% !important;
    height: auto;
    overflow-y: auto;
}

.text-no-wrap {
    background-color: transparent !important;
}

.pin-sas {
    position: absolute;
    right: 8%;
    top: 20px;

}

.celdas {
    border: 1px solid #ddd;
    padding: 4px;
    text-align: center;
    width: auto;
}

.conte-titulo {
    align-self: self-start;
}

.w-conte {
    width: 700px;
    max-width: 700px;
}

.elemento {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 5px;
    cursor: grab;
}

.category-navigation-drawer {
    .ProseMirror {
        padding: 0.5rem;
        min-block-size: 15vh;

        p {
            margin-block-end: 0;
        }

        p.is-editor-empty:first-child::before {
            block-size: 0;
            color: #adb5bd;
            content: attr(data-placeholder);
            float: inline-start;
            pointer-events: none;
        }
    }

    .is-active {
        background-color: rgba(var(--v-theme-primary), var(--v-activated-opacity));
        color: rgb(var(--v-theme-primary));
    }

    .ProseMirror-focused {
        outline: none !important;
    }
}


.acta {
    height: 50px;
    width: 128px;
    border-radius: 10px;
    background-color: rgb(94, 94, 94);
    margin-left: 336px
}

.acta>p {
    position: absolute;
    top: 25px;
    left: 400px;
    transform: translate(-50%, -50%);
    margin: 0;
    color: rgb(255, 255, 255);
    font-size: 40px;
    z-index: 1;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 600;
    letter-spacing: 1px;
}

.titulos {
    border-collapse: collapse;
    color: black;
    width: 600px;
    height: auto;
    margin: auto;
    word-wrap: break-word;

}


.flatpickr-calendar {
    background-color: rgb(var(--v-theme-surface));
    inline-size: 16.625rem;
    margin-block-start: 0.1875rem;
    position: fixed;
    //   es prueba
}
</style>