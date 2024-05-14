<script>
import dependenciaService from "@/services/dependencia-service";
import generoService from "@/services/genero-service";
import gamaService from "@/services/gama-service";
import directorioService from "@/services/directorio-service";
import paisesService from "@/services/paises-service";
import municipiosServices from "@/services/inbox/municipios-services";
import { $apiService } from "@/utils/api-service";
import gradoService from "@/services/grado-service";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import imagen2 from "@images/logos/1Recurso 2.png";

export default {
  props: ["onSave", "onCancel"],
  data() {
    const DEFAULTFORM = {
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
      }
    return {
      toast: useToast(),
      tipoDirectorio:[],
      directorios: [],
      dependencias: [],
      generos: [],
      paises: [],
      gamas: [],
      grado: [],
      directorioGuardar: DEFAULTFORM,
      StorageEdomexURL: '',
      Municipios : []
    };
  },
  methods: {
    async getMunicipios() {
      var res = await municipiosServices.Municipios().then((data) => data.data);
      this.Municipios = res;
    },
    async _ObtenerGeneros() {
      let result = await generoService.obtenerGeneros();
      if (result.data) this.generos = result.data;
    },
    async _ObtenerGamas() {
      let result = await gamaService.obtenerGamas();
      if (result.data) this.gamas = result.data;
    },
    async _ObtenerDependencias() {
      let result = await dependenciaService.obtenerDependencias();
      if (result.data) this.dependencias = result.data;
    },
    async _ObtenerPaises() {
      let result = await paisesService.obtenerPaises();
      if (result.data) this.paises = result.data;
    },
    async _ObtenerGrado() {
      await gradoService.obtenerGradoV1().then((res) => {
        this.grado = res;
      });

    },
    validarFormatoNumero(numero) {
      let validar = true;
      if(/^\d{10}$/gi.test(numero) == false){
        validar = false
      }
      if(validar == false){
        this.toast.error('Campo de numero incorrecto o vacio');
      }
      return true;
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

    async _ObtenerTipoDirectorio() {
      let result = await directorioService.ObtenerTipoDirectorio().then((res) => {
        // console.log(res);
        this.tipoDirectorio = res.data;
      });
     
    },

    async guardarDirectorio() {
      if (this.directorioGuardar.Lada == "") {
        this.directorioGuardar.Lada = "+52";
      }
      if (
        /*this.validarDirectorio() &&*/
        this.validarFormatoNumero(this.directorioGuardar.numContacto)
      ) {
        try {
          if (this.directorioGuardar.id === 0) {
            const nombrePersona = this.directorioGuardar.persona.trim();

            // Agregar Directorio
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
              formData.append('apMaterno', this.directorioGuardar.apMaterno);
              formData.append('cargo', this.directorioGuardar.cargo ? this.directorioGuardar.cargo : this.directorioGuardar.cargo = '');
              formData.append('comunidad', this.directorioGuardar.comunidad ? this.directorioGuardar.comunidad : '');
              formData.append('municipio', this.directorioGuardar.municipio ? this.directorioGuardar.municipio : '');
              formData.append('procedencia', this.directorioGuardar.procedencia ? this.directorioGuardar.procedencia : '');
              formData.append('correoElectronico', this.directorioGuardar.correoElectronico);
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
              this.toast.success("Se agregó correctamente el directorio");
              this.onSave(false);
              //await this.ListarDirectoriosV2(1);
            } else {
              console.error(result);
            }
          }
        } catch (error) {
          console.error("Error al guardar directorio:", error);
          this.toast.error("Error al guardar o el directorio ya existe");
        }
      }
    },

    onCancelForm(){
      this.onCancel()
    }
  },
  async created() {
    await this._ObtenerGeneros();
    await this._ObtenerGamas();
    await this._ObtenerDependencias();
    await this._ObtenerPaises();
    await this._ObtenerTipoDirectorio()
    await this._ObtenerGrado();
    this.StorageEdomexURL = $apiService.urlAzureBlobStorage + "directorio/";
  },
};
</script>

<template>
  <VForm ref="refFrom" @submit.prevent="guardarDirectorio()" enctype="multipart/form-data">
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
              placeholder="Seleccionar Tipo de Directorio" :items="tipoDirectorio" item-title="nombre" item-value="id"
              :rules="[requiredValidator => !!requiredValidator || 'Directorio es requerida']" />
          </VCol>
          <VCol cols="12" md="12">
            <AppSelect v-model="directorioGuardar.idGrado" label="Grado" :items="grado" item-title="nombre"
              placeholder="Seleccionar Tipo de Grado" item-value="id"
              :rules="[requiredValidator => !!requiredValidator || 'Grado es requerida']" />
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
        <VTextField v-model="directorioGuardar.correoElectronico" label="Correo Electrónico"
          />
      </VCol>

      <VCol cols="12" md="12">
        <VRow v-if="directorioGuardar.idTipoDirectorio == 2">
          <VDivider class="my-3" />
          <VCol cols="12" md="6">
            <VTextField v-model="directorioGuardar.comunidad" label="Comunidad"
               />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect placeholder="Selecione municipio " label="Municipio"
              v-model="directorioGuardar.municipio" :items="Municipios" item-title="nombre" :rules="[requiredValidator => !!requiredValidator || 'Municipio es requerido']"
              item-value="nombre" @click="getMunicipios()" />
          </VCol>
          <VCol cols="12" md="6">
            <label for="">Cargo</label>
            <VTextField style="margin-top: 5px;" v-model="directorioGuardar.cargo" placeholder="Cargo"
              :rules="[requiredValidator => !!requiredValidator || 'Cargo es requerido']" />
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
              :rules="[requiredValidator => !!requiredValidator || 'Dependencia es requerida']">
            </AppSelect>
          </VCol>
          <VDivider class="my-3" />
        </VRow>

      </VCol>

      <VCol cols="6" md="6">
        <AppSelect v-model="directorioGuardar.idGenero" label="Sexo" placeholder="Seleccionar Sexo" :items="generos"
          item-title="descripcion" item-value="id"
          :rules="[requiredValidator => !!requiredValidator || 'Genero es requerido']">
        </AppSelect>
      </VCol>
      <VCol cols="6" md="6">
        <AppSelect v-model="directorioGuardar.idGama" label="Rango" placeholder="Seleccionar rango" :items="gamas"
          item-title="descripcion" item-value="id"
          :rules="[requiredValidator => !!requiredValidator || 'Gama es requerida']" />
      </VCol>
      <VCol cols="12" md="12" class="d-flex gap-3 ">
        <VRow>
          <VCol cols="12" md="6">
            <AppSelect :value="+52" v-model="directorioGuardar.Lada" placeholder="Seleccionar lada" :items="paises"
              item-title="lada" item-value="lada">
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
      <VCol cols="12" class="d-flex gap-4">
        <VBtn color="success" variant="elevated" type="submit">
          Guardar
        </VBtn>
        <VBtn color="secondary" type="reset" variant="tonal" @click="onCancelForm">
          Cancelar
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
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
  width: 110px;
  height: 110px;
  overflow: hidden;
  border-radius: 5%; // background-image: url('../../../assets/images/logos/1Recurso 2.png');
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
