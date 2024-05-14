<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import Oficina from "@/services/oficina/oficina-services.js";

export default {
  name: "Oficina",
  components: {
    VDataTable,
  },
  data() {
    return {
      toast: useToast(),
      oficinas: [],
      isSelectOficina: false,
      selectedOficina: null,
    };
  },

  methods: {
    async listaOficinas() {
      let res = await Oficina.getOficinas().then((res) => {
        this.oficinas = res.data;
      });
    },
    selectOficina(oficina) {
      this.selectedOficina = oficina;
      this.isSelectOficina = false;
      this.$emit("oficina-selected", oficina);
      this.showNotification();
    },
    showNotification() {
      this.toast.success("Oficina seleccionada correctamente");
    },
  },

  async created() {
    await this.listaOficinas();
  },
};
</script>

<template>
  <VBtn @click="isSelectOficina = true"> Open Dialog </VBtn>
  <VDialog v-model="isSelectOficina" class="v-dialog-sm" persistent>
    <VCard title="Oficina">
      <VCardText>
        <VTable height="450" class="text-no-wrap">
          <thead>
            <tr>
              <th class="text-uppercase">Oficinas</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="oficina in oficinas" :key="oficina.id" @click="selectOficina(oficina)" class="cursor-pointer">
              <td>{{ oficina.nombre }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="tonal" color="secondary" @click="isSelectOficina = false">
          Cancelar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
<style></style>
