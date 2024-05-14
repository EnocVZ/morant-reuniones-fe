<script setup>
const imagenBase = useGenerateImageVariant(imagen2, true)

</script>
<script>
import gradoService from "@/services/grado-service";
import dependenciaService from '@/services/dependencia-service'
import generoService from '@/services/genero-service'
import gamaService from '@/services/gama-service'
import directorioService from '@/services/directorio-service'
import municipiosServices from "@/services/inbox/municipios-services";
import paisesService from '@/services/paises-service'
import { $apiService } from "@/utils/api-service";
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import imagen2 from '@images/logos/1Recurso 2.png'
import { requiredValidator } from '@/@core/utils/validators'




export default {
  name: 'Directorio',
  components: {
    VDataTable
  },
  data() {
    return {
      search: "",
      toast: useToast(),
      page: 1,
      itemsPerPage: 8,
      hasMoreItems: true,
      loading: false,
      headers: [
        // { title: 'Id', key: 'id' },
        { title: 'Persona', key: 'persona' },
        { title: 'Cargo', key: 'cargo' },
        { title: 'Dependencia', key: 'dependencia' },
        { title: 'Contacto', key: 'numContacto' },
        { title: 'Lada', key: 'Lada' },
        { title: 'Genero', key: 'genero' },
        { title: 'Gama', key: 'gama' },
        { title: 'Imagen', key: 'imagen' },
        { title: 'ImageFile', key: 'ImagenFile' },
        { title: "Acciones", key: "actions" },
      ],
      directorios: [],
      directorioDefault: {
        id: 0,
        persona: '',
        nombres: '',
        apPaterno: '',
        apMaterno: '',
        cargo: null,
        correoElectronico: '',
        comunidad: null,
        municipio: null,
        procedencia: null,
        idTipoDirectorio: null,
        idGrado: null,
        cargo: '',
        idDependencia: null,
        numContacto: '',
        Lada: '+52',
        idGenero: null,
        idGama: null,
        imagen: '',
        ImagenFile: null,
      },
      directorioEditar: {

      },
      directorioGuardar: {
        id: 0,
        persona: '',
        nombres: '',
        apPaterno: '',
        apMaterno: '',
        cargo: null,
        correoElectronico: '',
        comunidad: null,
        municipio: null,
        procedencia: null,
        idTipoDirectorio: null,
        idGrado: null,
        cargo: '',
        idDependencia: null,
        numContacto: '',
        Lada: '+52',
        idGenero: null,
        idGama: null,
        imagen: '',
        ImagenFile: null,
      },
      refFrom: '',
      grado: [],
      tipoDirectorio: [],
      dependencias: [],
      generos: [],
      idDirectorioEliminar: 0,
      open: false,
      openEliminar: false,
      imagenMiniatura: '',
      paises: [],
      totalConsultas: 0,
      StorageEdomexURL: '',
      Municipios: [],
      DependenciasSematizar: [],
    }
  },
  computed: {

  },
  watch: {
    "DependenciasSematizar.id": function (newVal, oldVal) {
      if (this.DependenciasSematizar.id != 0 && this.DependenciasSematizar.id != undefined ) {
        if (newVal !== oldVal) {

          this.page = 1;
          this.itemsPerPage = 8;
          this.ListarDirectoriosV2idDependencia();
        }
      } else {

        this.page = 1;
        this.itemsPerPage = 8;
        this.hasMoreItems = true;
        this.ListarDirectoriosV2();
      }

    },
  },

  methods: {
    listaDependenciasConTodos() {
      // Clona el array original para evitar mutaciones no deseadas4
      this.DependenciasSematizar = [...this.dependencias];
      // Agrega la opción "Todos" al inicio de la lista
      this.DependenciasSematizar.unshift({ id: 0, nombre: 'Todos' });

    },
    async getMunicipios() {
      var res = await municipiosServices.Municipios().then((data) => data.data);
      this.Municipios = res;
    },
    async guardarDirectorio() {

      if (this.directorioGuardar.Lada == '') {
        this.directorioGuardar.Lada = '+52';
      }
      if(this.directorioGuardar.numContacto == ""){
        this.directorioGuardar.Lada = '';
      }
      if (/*this.validarDirectorio() &&*/ this.validarFormatoNumero(this.directorioGuardar.numContacto)) {
        try {
          if (this.directorioGuardar.id === 0) {
            const nombrePersona = this.directorioGuardar.persona.trim();

            const personaRepetida = this.directorios.some(directorio => directorio.persona.trim().toLowerCase() === nombrePersona.toLowerCase());

            if (personaRepetida) {
              this.toast.error('Ya existe una persona con este nombre en el directorio', {
                position: 'top-right',
                timeout: 3000,
                closeOnClick: true,
              });
            } else {
              let formData = new FormData();
              let gradoAbreviado = '';
              for (const tipoDirectorio of this.grado) {
                if (this.directorioGuardar.idGrado === tipoDirectorio.id) {
                  gradoAbreviado = tipoDirectorio.abreviatura;
                  break;
                }
              }
              formData.append('persona', `${gradoAbreviado}. ${this.directorioGuardar.nombres} ${this.directorioGuardar.apPaterno} ${this.directorioGuardar.apMaterno}`);
              formData.append('nombres', this.directorioGuardar.nombres);
              formData.append('apPaterno', this.directorioGuardar.apPaterno);
              formData.append('apMaterno', this.directorioGuardar.apMaterno ? this.directorioGuardar.apMaterno : '');
              formData.append('cargo', this.directorioGuardar.cargo ? this.directorioGuardar.cargo : this.directorioGuardar.cargo = '');
              formData.append('comunidad', this.directorioGuardar.comunidad ? this.directorioGuardar.comunidad : '');
              formData.append('municipio', this.directorioGuardar.municipio ? this.directorioGuardar.municipio : '');
              // formData.append('procedencia', this.directorioGuardar.procedencia ? this.directorioGuardar.procedencia : '');
              formData.append('correoElectronico', this.directorioGuardar.correoElectronico ? this.directorioGuardar.correoElectronico : '');
              formData.append('idGrado', this.directorioGuardar.idGrado);
              formData.append('idTipoDirectorio', this.directorioGuardar.idTipoDirectorio);
              formData.append('idDependencia', this.directorioGuardar.idDependencia != null ? this.directorioGuardar.idDependencia : this.directorioGuardar.idDependencia = '');
              formData.append('numContacto', `${this.directorioGuardar.Lada}${this.directorioGuardar.numContacto}`);
              formData.append('idGenero', this.directorioGuardar.idGenero);
              formData.append('idGama', this.directorioGuardar.idGama);
              formData.append('ImagenFile', this.directorioGuardar.ImagenFile);
              formData.append('Imagen', this.directorioGuardar.imagen != null ? this.directorioGuardar.imagen : '');

              let result = await directorioService.agregarDirectorio(formData);
              if (result.data.success) {
                this.toast.success("registro agregado al directorio correctamente");
                this.open = false;
                if (this.DependenciasSematizar.id > 0) {
                  await this.ListarDirectoriosV2idDependencia(1);
                } else {
                  await this.ListarDirectoriosV2(1);
                }
              } else {
                console.error(result);
              }

              // Agregar Directorio



            }
          } else { // Si se está actualizando un directorio existente
            // Actualizar Directorio
            let formData = new FormData();
            let gradoAbreviado = '';

            for (const tipoDirectorio of this.grado) {

              if (this.directorioGuardar.idGrado === tipoDirectorio.id) {
                gradoAbreviado = tipoDirectorio.abreviatura;
                break;
              }
            }

            formData.append('id', this.directorioGuardar.id);
            formData.append('persona', `${gradoAbreviado}. ${this.directorioGuardar.nombres} ${this.directorioGuardar.apPaterno} ${this.directorioGuardar.apMaterno}`);
            formData.append('nombres', this.directorioGuardar.nombres);
            formData.append('apPaterno', this.directorioGuardar.apPaterno);
            formData.append('apMaterno', this.directorioGuardar.apMaterno ? this.directorioGuardar.apMaterno : '');
            formData.append('cargo', this.directorioGuardar.cargo ? this.directorioGuardar.cargo : '');

            formData.append('comunidad', this.directorioGuardar.comunidad ? this.directorioGuardar.comunidad : '');

            formData.append('municipio', this.directorioGuardar.municipio ? this.directorioGuardar.municipio : '');

            formData.append('procedencia', this.directorioGuardar.procedencia ? this.directorioGuardar.procedencia : '');

            formData.append('correoElectronico', this.directorioGuardar.correoElectronico ? this.directorioGuardar.correoElectronico : '');
            formData.append('idGrado', this.directorioGuardar.idGrado);
            formData.append('idTipoDirectorio', this.directorioGuardar.idTipoDirectorio);
            formData.append('idDependencia', this.directorioGuardar.idDependencia != null ? this.directorioGuardar.idDependencia : this.directorioGuardar.idDependencia = '');

            formData.append('numContacto', `${this.directorioGuardar.Lada}${this.directorioGuardar.numContacto}`);
            formData.append('idGenero', this.directorioGuardar.idGenero);
            formData.append('idGama', this.directorioGuardar.idGama);
            formData.append('ImagenFile', this.directorioGuardar.ImagenFile);
            formData.append('Imagen', this.directorioGuardar.imagen != null ? this.directorioGuardar.imagen : '');
            let result = await directorioService.actualizarDirectorio(formData);

            if (result.data.success) {
              this.toast.success('El registro ha sido actualizado correctamente');
              this.open = false;
              if (this.DependenciasSematizar.id > 0) {
                await this.ListarDirectoriosV2idDependencia(1);
              } else {
                await this.ListarDirectoriosV2(1);
              }

            } else {
              console.error(result);
            }
          }
        } catch (error) {
          console.error('Error al guardar directorio:', error);
        }
      }
    },


    /*validarDirectorio() {
        let valido = true;

        if (this.directorioGuardar.persona.trim() === '' ||
            this.directorioGuardar.cargo.trim() === '' ||
            this.directorioGuardar.idDependencia === '' ||
            this.directorioGuardar.numContacto.trim() === ''
        ) {

            valido = false;
            this.mostrarMensajeError();
        }

        return valido;
    },*/
    async ListarDirectorio() {
      try {
        let result = await directorioService.listarDirectorio();
        this.directorios = result;
      } catch (error) {
        console.error(error);
      }
    },
    async ListarDirectoriosV2(page) {
      this.loading = true;

      if (this.hasMoreItems) {
        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
        };
        let result = await directorioService.listarDirectorioV2(payload)
          .then((res) => {
            this.directorios = this.page == 1 ? res.data : [...this.directorios, ...res.data];

            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;

          }).catch((err) => {
            console.log(err);
            this.loading = false;
          })
      }
    },
    async ListarDirectoriosV2idDependencia(page) {

      this.loading = true;
      if (this.hasMoreItems) {

        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
          idDependencia: this.DependenciasSematizar.id
        };
        let result = await directorioService.listarDirectorioV2idDependencia(payload)
          .then((res) => {

            this.directorios = this.page == 1 ? res.data : [...this.directorios, ...res.data];

            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;

          }).catch((err) => {

            this.loading = false;
          })
      } else if (this.DependenciasSematizar.id > 0) {

        this.page = page ? page : this.page;

        let payload = {
          buscar: "",
          page: this.page,
          take: this.itemsPerPage,
          idDependencia: this.DependenciasSematizar.id
        };
        let result = await directorioService.listarDirectorioV2idDependencia(payload)
          .then((res) => {

            this.directorios = this.page == 1 ? res.data : [...this.directorios, ...res.data];

            this.totalConsultas = res.total;
            this.hasMoreItems = res.total > this.page * this.itemsPerPage;
            this.loading = false;

          }).catch((err) => {
            console.log(err);
            this.loading = false;
          })
      }


    },

    async masDatos() {
      this.page++
      if (this.DependenciasSematizar.id > 0) {
        await this.ListarDirectoriosV2idDependencia();
      } else {
        await this.ListarDirectoriosV2();
      }

    },

    async scrolling({ target }) {
      const { scrollingElement } = target;
      const gap = 10;
      if (scrollingElement.scrollTop + scrollingElement.clientHeight + gap >= scrollingElement.scrollHeight) {
        $('#btn-mas').click();
      }
    },
    /*async verificarDatos() {
        try {
            // Llama al método para obtener las dependencias
            await this._ObtenerDependencias();
            console.log('Dependencias obtenidas:', this.dependencias);
        } catch (error) {
            console.error('Error al obtener las dependencias:', error);
        }
    },*/
    OpenEliminar(id) {
      this.idDirectorioEliminar = id,
        this.openEliminar = true

    },
    async EliminarDirectorio() {
      let result = await directorioService.eliminarDirectorio(this.idDirectorioEliminar);
      if (result.data.success) {
        this.toast.success("El registro ha sido eliminado correctamente")
        this.cerrarEliminar();
        if (this.DependenciasSematizar.id > 0) {
          await this.ListarDirectoriosV2idDependencia(1);
        } else {
          await this.ListarDirectoriosV2(1);
        }
      } else {
        this.toast.success("Error")
      }

    },

    openAgregar() {
      console.log(this.directorioDefault)
      console.log(this.directorioGuardar)
      this.directorioGuardar = { ...this.directorioDefault }
      this.open = true


    },
    async OpenEditar(Id) {
      this.directorioGuardar = { ...Id };
      this.open = true
      if (this.directorioGuardar.imagen != null) {
        await directorioService.obtenerImagenUrl(this.directorioGuardar.imagen, Date.now()).then((value) => {
          this.imagenMiniatura = value
          // console.log(this.imagenMiniatura);
        });
      }
      if (this.directorioGuardar.numContacto.length > 10) {
        this.directorioGuardar.Lada = this.directorioGuardar.numContacto.slice(this.directorioGuardar.length, -10);
        this.directorioGuardar.numContacto = this.directorioGuardar.numContacto.slice(-10);
      }
      else {
        this.directorioGuardar.Lada = "+52";
      }
      // console.log(this.directorioGuardar);

    },
    cerrarEliminar() {
      this.idDirectorioEliminar = 0,
        this.openEliminar = false
    },
    cerrar() {
      this.directorioGuardar = { ...this.directorioDefault }
      this.open = false;
      this.imagenMiniatura = null;
    },

    async _ObtenerDependencias() {
      let result = await dependenciaService.obtenerDependencias();
      if (result.data)
        this.dependencias = result.data
    },
    async _ObtenerGrado() {
      let result = await gradoService.obtenerGradoV1().then((res) => {
        // console.log(res);
        this.grado = res;
      });

    },
    async _ObtenerTipoDirectorio() {
      let result = await directorioService.ObtenerTipoDirectorio().then((res) => {
        // console.log(res);
        this.tipoDirectorio = res.data;
      });
    },
    async onSubmit() {
      let res = await this.$refs.refFrom.validate();
      if (res.valid) {
        this.guardarDirectorio()
      }
    },
    async _ObtenerGeneros() {
      let result = await generoService.obtenerGeneros();
      if (result.data)
        this.generos = result.data
    },
    async _ObtenerGamas() {
      let result = await gamaService.obtenerGamas();
      if (result.data)
        this.gamas = result.data
    },
    async buscarResultados() {
      if (this.search.trim() !== '' && this.loading == false) {
        if (this.DependenciasSematizar.id > 0) {
          let payload = {
            buscar: this.search.trim(),
            page: 1,
            take: this.totalConsultas,
            idDependencia: this.DependenciasSematizar.id
          };
          let result = await directorioService.listarDirectorioV2idDependencia(payload);
          this.directorios = result.data;
        } else {
          let payload = {
            buscar: this.search.trim(),
            page: 1,
            take: this.totalConsultas,
          };

          let result = await directorioService.listarDirectorioV2(payload);
          this.directorios = result.data;
        }
        this.loading = false;
        this.hasMoreItems = false;

      } else {
        this.hasMoreItems = true;
        if (this.DependenciasSematizar.id > 0) {
          await this.ListarDirectoriosV2idDependencia(1);
        } else {
          await this.ListarDirectoriosV2(1);
        }

      }
    },

    /*mostrarMensajeError() {
        this.toast.error('Se requiere que llenes todos los campos', {
            position: 'top-right',
            timeout: 3000, // Duración del mensaje en milisegundos
            closeOnClick: true,
        });
    },*/
    validarFormatoNumero(numero) {
      let validar = true;
      if (/^\d{10}$/gi.test(numero) == false) {
        validar = false
      }
      if(validar == false){
        //this.toast.error('Campo de numero incorrecto o vacio');
      }
      return true;
    },
    limpiarCampos() {
      this.directorioGuardar = { ...directorioDefault };
    },
    obtenerImagen(e) {
      let file = '';
      file = e.target.files[0];
      this.directorioGuardar.ImagenFile = file;
      this.cargarImagen(file);
    },
    cargarImagen(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imagenMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },

    async _ObtenerPaises() {
      let result = await paisesService.obtenerPaises();
      if (result.data)
        this.paises = result.data
    }
  },

  computed: {
    imagen() {
      return this.imagenMiniatura;
    }
  },
  async created() {
    // await this.ListarDirectorio();4
    if (this.DependenciasSematizar.id != 0 && this.DependenciasSematizar.id != undefined) {

      this.ListarDirectoriosV2idDependencia();
    } else {
      await this.ListarDirectoriosV2();
    }

    await this._ObtenerGeneros();
    await this._ObtenerGamas();
    await this._ObtenerDependencias();
    this.listaDependenciasConTodos();
    await this._ObtenerPaises();
    await this._ObtenerGrado();
    await this._ObtenerTipoDirectorio();

    this.StorageEdomexURL = $apiService.urlAzureBlobStorage + "directorio/";
  },

  mounted() {
    window.addEventListener('scroll', this.scrolling);
  },

  unmounted() {
    window.removeEventListener('scroll', this.scrolling);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrolling);
  },
}
</script>

<template>
  <div>
    <a href="" id="btn-mas" style="display: none;" @click.prevent="masDatos()"></a>

    <p class="text-2xl mb-6">
      <VIcon icon="tabler-notebook" color="primary" class="me-3" size="30" />
      Directorio
    </p>
    <VRow>
      <VCol cols="12" md="4">
        <AppTextField v-model="search" density="compact" placeholder="Buscar..." append-inner-icon="tabler-search"
          single-line hide-details dense outlined @input="buscarResultados" />
      </VCol>
      <VCol cols="12" md="8">
        <VBtn color="cafe" @click="openAgregar" size="40" rounded="pill">
          <VIcon class="tabler-plus" size="32" />
        </VBtn>
      </VCol>
      <VCol cols="4">
        <AppSelect v-model="DependenciasSematizar.id" color="#b48d57" label="Dependencia"
          placeholder="Selecciones la dependencia" :items="DependenciasSematizar" item-title="nombre" item-value="id" />
      </VCol>
      <VDivider />
      <VCol cols="12" md="3" v-for="directorio in directorios">
        <VCard>
          <VCardItem class="redondearBordes">
            <div>
              <VRow class="margin_top">
                <VCol md="12" class="centrarFlex">
                  <div class="image-container">
                    <VImg class="image-left" :src="`${StorageEdomexURL + directorio.imagen}?${Date.now()}`"
                      v-if="directorio.imagen" alt="Imagen" width="150" height="150" accept="image/*" />

                    <img class="image-left" v-else src="../../../assets/images/logos/1Recurso 2.png" alt="Imagen"
                      width="150" height="150" accept="image/*" />
                  </div>
                  <!-- <VIcon color="primary" size="35" class="tabler-user" /> -->
                </VCol>

                <hr>
              </VRow>
              <VRow class="margin_top">
                <VCol md="12" class="centrarFlex">
                  <p>{{ directorio.persona }} </p>
                </VCol>
              </VRow>
              <hr>
              <VRow class="margin_top">
                <VCol md="2">
                  <VIcon color="primary" class="tabler-mail" />
                </VCol>
                <VCol md="10" v-if="directorio.correoElectronico">
                  <p>{{ directorio.correoElectronico }}</p>
                </VCol>
                <VCol md="10" v-else>
                  <p>Sin correo</p>
                </VCol>
              </VRow>

              <div v-if="directorio.idTipoDirectorio == 2">
                <hr>
                <VRow class="margin_top">
                  <VCol md="2">
                    <VIcon color="primary" class="tabler-users-group" />
                  </VCol>
                  <VCol md="10">
                    <p>{{ directorio.comunidad }}</p>
                  </VCol>
                </VRow>
                <hr>
                <VRow class="margin_top">
                  <VCol md="2">
                    <VIcon color="primary" class="tabler-building" />
                  </VCol>
                  <VCol md="10">
                    <p>{{ directorio.municipio }}</p>
                  </VCol>
                </VRow>
                <hr>
                <VRow class="margin_top">
                  <VCol md="2">
                    <VIcon color="primary" class="tabler-armchair" />
                  </VCol>
                  <VCol md="10">
                    <p>{{ directorio.cargo }}</p>
                  </VCol>
                </VRow>
                <hr>
              </div>
              <div v-if="directorio.idTipoDirectorio == 1">
                <hr>
                <VRow class="margin_top">
                  <VCol md="2">
                    <VIcon color="primary" class="tabler-armchair" />
                  </VCol>
                  <VCol md="10">
                    <p>{{ directorio.cargo }}</p>
                  </VCol>
                </VRow>
                <hr>
                <VRow class="margin_top">
                  <VCol md="2">
                    <VIcon color="primary" class="tabler-flag-3" />
                  </VCol>
                  <VCol md="10">
                    <p>{{ directorio.dependencia }}</p>
                  </VCol>
                </VRow>
              </div>


              <VRow class="margin_top">
                <VCol md="2">
                  <VIcon color="primary" class="tabler-phone" />
                </VCol>
                <VCol md="10">
                  <p>{{ directorio.numContacto }}</p>
                </VCol>
              </VRow>
              <hr>
              <VRow class="margin_top">
                <VCol md="2">
                  <div v-if="directorio.idGenero == 1">
                    <VIcon color="primary" class="tabler-man" />
                  </div>
                  <div v-else>
                    <VIcon color="primary" class="tabler-woman" />
                  </div>
                </VCol>
                <VCol md="10">
                  <p>{{ directorio.genero }}</p>
                </VCol>
              </VRow>
              <hr>
              <VRow class="margin_top">
                <VCol md="2">
                  <VIcon color="primary" class="" />
                </VCol>
                <VCol md="10">
                  <p>{{ directorio.gama }}</p>
                </VCol>
              </VRow>
            </div>
            <VRow>
              <VCol md="12">
                <div class="demo-space-x botones_tarjetas">
                  <VBtn title="Editar" size="35" color="success" @click="OpenEditar(directorio)">
                    <VIcon icon="tabler-edit" size="20" />
                  </VBtn>
                  <VBtn title="Eliminar" size="35" color="error" class="botonEliminar"
                    @click="OpenEliminar(directorio.id)">
                    <VIcon icon="tabler-trash" size="20" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardItem>
        </VCard>
      </VCol>
      <hr>

      <!-- TABLA -->
      <!-- <div>
                <VCol cols="12" md="12">
                    <VCard>
                        <VCardItem>
                            <VDataTable :headers="headers" :items="directorios" :search="search">
                                <template #item.actions="{ item }">
                                    <div class="d-flex gap-1">
                                        <VBtn title="Editar" size="25" color="success" @click="OpenEditar(item)">
                                            <VIcon icon="tabler-edit" size="20" />
                                        </VBtn>
                                        <VBtn title="Eliminar" size="25" color="error" @click="OpenEliminar(item.id)">
                                            <VIcon icon="tabler-trash" size="20" />
                                        </VBtn>
                                    </div>
                                </template>
</VDataTable>
</VCardItem>
</VCard>
</VCol>
</div> -->
      <!-- Fin TABLA -->

    </VRow>

    <!-- Formulario modal para agregar/editar directorio -->
    <VDialog v-model="open" max-width="650px">
      <VCard>
        <VCardTitle class="pa-6 pb-0">
          <span class="headline">{{ directorioGuardar.id !== 0 ? 'Editar directorio' : 'Agregar Directorio'
            }}</span>
        </VCardTitle>
        <VCardText class="pt-0 pb-0">
          <VContainer>
            <VForm ref="refFrom" @submit.prevent="onSubmit()" enctype="multipart/form-data">
              <VRow>
                <VCol cols="12" md="4" class="file-upload-container">
                  <div class="image-container">
                    <VImg class="image-left" :src="imagen" alt="Imagen" width="150" height="150" v-if="imagen" />

                    <img class="image-left" src="../../../assets/images/logos/1Recurso 2.png" alt="Imagen" width="150"
                      height="150" v-else />

                    <!-- <VIcon v-else size="100" icon="table-user"></VIcon> -->
                  </div>
                  <label for="fileInput" class="custom-file-button">
                    <VIcon class="tabler-plus" size="32" />
                  </label>
                  <input type="file" accept="image/*" id="fileInput" ref="fileInput" @change="obtenerImagen"
                    style="display: none;" />
                </VCol>
                <VCol cols="12" md="8">

                  <VRow>
                    <VCol cols="12" md="12">
                      <AppSelect v-model="directorioGuardar.idTipoDirectorio" label="Directorio"
                        placeholder="Seleccionar Tipo de Directorio" :items="tipoDirectorio" item-title="nombre"
                        item-value="id"
                        :rules="[requiredValidator => !!requiredValidator || 'Directorio es requerida']" />
                    </VCol>
                    <VCol cols="12" md="12">
                      <AppSelect v-model="directorioGuardar.idGrado" label="Grado" :items="grado" item-title="nombre"
                        placeholder="Seleccionar Tipo de Grado" item-value="id"
                        :rules="[requiredValidator => !!requiredValidator || 'Grado es requerido']" />
                    </VCol>
                  </VRow>

                </VCol>
                <VDivider class="my-3" />
                <VCol cols="12" md="6">
                  <VTextField v-model="directorioGuardar.nombres" label="Nombres"
                    :rules="[requiredValidator => !!requiredValidator || 'Nombres son requeridos']" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="directorioGuardar.apPaterno" label="Apellido Paterno"
                    :rules="[requiredValidator => !!requiredValidator || 'Apellido Paterno es requerido']" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="directorioGuardar.apMaterno" label="Apellido Materno" />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField v-model="directorioGuardar.correoElectronico" label="Correo Electrónico" />
                </VCol>

                <VCol cols="12" md="12">
                  <VRow v-if="directorioGuardar.idTipoDirectorio == 2">
                    <VDivider class="my-3" />
                    <VCol cols="12" md="6">
                      <VTextField v-model="directorioGuardar.comunidad" label="Comunidad" />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSelect placeholder="Selecione municipio " label="Municipio"
                        v-model="directorioGuardar.municipio" :items="Municipios" item-title="nombre"
                        item-value="nombre" @click="getMunicipios()" />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField v-model="directorioGuardar.cargo" label="Cargo"
                        :rules="[requiredValidator => !!requiredValidator || 'cargo es requerido']" />
                    </VCol>
                    <VDivider class="my-3" />
                  </VRow>
                  <VRow v-if="directorioGuardar.idTipoDirectorio == 1">
                    <VDivider class="my-3" />
                    <VCol cols="12" md="6">
                      <label for="">Cargo</label>
                      <VTextField style="margin-top: 5px;" v-model="directorioGuardar.cargo" placeholder="Cargo"
                        :rules="[requiredValidator => !!requiredValidator || 'Cargo es requerido']" />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppSelect v-model="directorioGuardar.idDependencia" label="Dependencia"
                        placeholder="Seleccionar dependencia" :items="dependencias" item-title="nombre" item-value="id"
                        :rules="[requiredValidator => !!requiredValidator || 'Dependencia es requerido']">
                      </AppSelect>
                    </VCol>
                    <VDivider class="my-3" />
                  </VRow>

                </VCol>

                <VCol cols="6" md="6">
                  <AppSelect v-model="directorioGuardar.idGenero" label="Sexo" placeholder="Seleccionar Sexo"
                    :items="generos" item-title="descripcion" item-value="id"
                    :rules="[requiredValidator => !!requiredValidator || 'Genero es requerido']">
                  </AppSelect>
                </VCol>
                <VCol cols="6" md="6">
                  <AppSelect v-model="directorioGuardar.idGama" label="Rango" placeholder="Seleccionar rango"
                    :items="gamas" item-title="descripcion" item-value="id"
                    :rules="[requiredValidator => !!requiredValidator || 'Gama es requerido']" />
                </VCol>
                <VCol cols="12" md="12" class="d-flex gap-3 ">
                  <VRow>
                    <VCol cols="12" md="6">
                      <AppSelect :value="+52" v-model="directorioGuardar.Lada" placeholder="Seleccionar lada"
                        :items="paises" item-title="lada" item-value="lada">
                        <template v-slot:selection="{ item }">
                          <v-list-item-content>
                            <v-list-item-title>
                              <div class="d-flex align-center">
                                <img class="me-2"
                                  :src="`https://flagcdn.com/w20/${item.raw.codigo ? item.raw.codigo : 'mx'}.png`" />
                                <span>{{ item.value ? item.value : "+52" }}</span>
                              </div>
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </AppSelect>
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField v-model="directorioGuardar.numContacto" label="Contacto" :rules="[


    ]" />
                    </VCol>
                  </VRow>
                </VCol>

                <!-- Botones de submit y reset -->
                <VCol cols="12" class="d-flex justify-end gap-4">
                  <VBtn color="error" type="reset" variant="outlined" @click="cerrar">
                    Cancelar
                  </VBtn>
                  <VBtn color="success" variant="elevated" type="submit">
                    Guardar
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VContainer>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Diálogo para eliminar directorio -->
    <VDialog v-model="openEliminar" max-width="500px">
      <VCard>
        <VCardTitle class="d-flex justify-center mt-1 mb-1">¿Deseas eliminar el registro?</VCardTitle>
        <VCardActions>
          <VSpacer />
          <VBtn color="error" variant="outlined" @click="cerrarEliminar">
            Cancelar
          </VBtn>
          <VBtn color="success" variant="elevated" @click="EliminarDirectorio()">
            Aceptar
          </VBtn>
          <VSpacer />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss">
.cente {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
}

.margin_top {
  margin-top: 5px;
}

.centrarFlex {
  display: flex;
  justify-content: center;
}

.botones_tarjetas {
  display: flex;
  justify-content: center;
}

.botonEliminar {
  margin-right: 0;
}

.margin_top_form {
  margin-top: 10px;
}

.file-upload-container {
  position: relative;
  display: inline-block;
}

.image-container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 5%;
  // background-image: url('../../../assets/images/logos/1Recurso 2.png');
  background-size: contain;
}

.custom-file-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 2%;
  background-color: #915a2e;
  cursor: pointer;
  border-radius: 100%;
}
</style>