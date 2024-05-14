<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { VCardActions } from "vuetify/lib/components/index.mjs";
import historiaServices from "@/services/inbox/historias-services";
import acontecimientoServices from "@/services/inbox/acontecimientos-services";
import { watchEffect } from "vue";

export default {
  name: "Grupos",
  components: {
    VDataTable,
    VCardActions,
  },
  data() {
    return {
      toast: useToast(),
      Historias: [],
      idHistoria: "",
      Acontecimientos: [],
      rangoFechas: "",
      inicio: "",
      fin: "",
    };
  },

  methods: {
    async ListaHistorias() {
      let res = await historiaServices
        .listaHistorias()
        .then((data) => data.data);
      this.Historias = res;
    },

    async AcontecimientoByHistoria(id) {
      this.countAcontecimientos = null;
      this.Acontecimiento = null;
      this.Historia = null;
      var res = await acontecimientoServices
        .AcontecimientoByHistoria(id)
        .then((data) => data);
      if (res.status == 200) {
        if (this.rangoFechas != "" && this.rangoFechas != null) {
          this.Acontecimientos = res.data.data.filter((data) => {
            let fecha = new Date(data.fechaHora).toISOString().split("T")[0];

            if (this.rangoFechas.split(" ")[2]) {
              return fecha >= this.inicio && fecha <= this.fin;
            } else {
              return fecha >= this.inicio;
            }
          });
        } else {
          this.Acontecimientos = res.data.data;
        }
      }
    },

    Limpiar() {
      this.rangoFechas = "";
    },
  },

  async created() {
    await this.ListaHistorias();
    watchEffect(async () => {
      if (this.rangoFechas != "" && this.rangoFechas != null) {
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
      }

      if (this.idHistoria != "") {
        await this.AcontecimientoByHistoria(this.idHistoria);
      }
    });
  },
};
</script>

<template>
  <div>
    <div class="mb-3">
      <VRow>
        <VCol class="d-flex align-center"
          ><p class="text-2xl mc-6 mb-0">
            <VIcon
              icon="tabler-users-group"
              color="primary"
              class="me-3"
              size="30"
            />Reportes
          </p></VCol
        >
        <VCol cols="12" md="3">
          <AppDateTimePicker
            v-model="rangoFechas"
            label="Rango fechas"
            placeholder="Select date"
            :config="{ mode: 'range' }"
          />
        </VCol>
        <VCol cols="12" md="2" class="d-flex justify-center align-end">
          <VBtn class="mb-1" :onClick="() => Limpiar()"> Limpiar </VBtn>
        </VCol>
      </VRow>
    </div>
    <VRow>
      <VCol cols="12" md="12" class="item-gap item">
        <VSelect
          color="#b48d57"
          label="Historias"
          placeholder="Seleccione una historia"
          :items="Historias"
          item-title="titulo"
          item-value="idHistoria"
          v-model="idHistoria"
          @click="ListaHistorias()"
        />
      </VCol>
    </VRow>

    <VRow v-for="acontecimiento in Acontecimientos">
      <!-- <VCol
        ><h4>{{ acontecimiento.titulo }}</h4>
        <span class="truncate">{{ acontecimiento.contexto }}</span></VCol
      > -->
    </VRow>
  </div>

  <VDialog v-model="open" max-width="500px">
    <VCard>
      <VCardTitle>
        <span class="headline">{{
          grupoDatos.id != 0 ? "Editar grupo" : "Agregar grupo"
        }}</span>
      </VCardTitle>
      <VCardText>
        <VForm
          ref="refFormulario"
          @submit.prevent="
            () => {
              onSubmit();
            }
          "
        >
          <VRow>
            <VCol cols="12" md="12">
              <VTextField
                v-model="grupoDatos.ultramsgID"
                label="IdUltramsg"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" md="12">
              <VTextField
                v-model="grupoDatos.nombre"
                label="Nombre"
                validate-on="input"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" @click="CerrarModal">
                  Cerrar
                </VBtn>

                <VBtn color="success" type="submit"> Guardar </VBtn>
              </VCardActions>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="modalEliminar" max-width="500px">
    <VCard>
      <VCardTitle> ¿Deseas eliminar el registro? </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @click="CerrarEliminar">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @click="DeleteGrupo">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>

  <VCard> </VCard>
</template>

<style scoped>
.cafe-btn {
  background-color: #b48d57;
  color: #fff;
}
.v-data-table th {
  background-color: #3498db; /* Cambia este color según tus preferencias */
  color: white; /* Cambia este color según tus preferencias */
}
</style>
