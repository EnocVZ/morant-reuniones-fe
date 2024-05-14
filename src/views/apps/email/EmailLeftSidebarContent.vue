<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import grupoServices from "@/services/inbox/grupos-services";
import { icon } from "@/views/demos/components/badge/demoCodeBadge";

const emit = defineEmits(["toggleComposeDialogVisibility"]);
import { ref, onMounted, watchEffect } from "vue";

const props = defineProps({
  countEmail: {},
  Grupos: {
    type: Array,
    required: true,
  },
});

defineOptions({
  inheritAttrs: false,
});

const open = ref(["Grupos"]);
const grupos = [
  ["Recibidos", "tabler-mail"],
  ["Enviados", "tabler-send"],
  ["Eliminar", "tabler-trash"],
];

const folders = [
  {
    title: "Recibidos",
    prependIcon: "tabler-mail",
    to: { name: "apps-email" },
    badge: {
      content: "4",
      color: "primary",
    },
  },
  {
    title: "Enviados",
    prependIcon: "tabler-send",
    to: {
      name: "apps-email-filter",
      params: { filter: "sent" },
    },
  },
  {
    title: "Eliminados",
    prependIcon: "tabler-trash",
    to: {
      name: "apps-email-filter",
      params: { filter: "trashed" },
    },
  },
  {
    title: "Borradores",
    prependIcon: "tabler-file",
    to: {
      name: "apps-email-filter",
      params: { filter: "drafts" },
    },
  },
];

const folders_grupo = [
  {
    title: "Recibidos",
    prependIcon: "tabler-mail",
    to: {
      name: "apps-email-filter",
      params: { filter: "recibido" },
    },
    badge: {
      content: "4",
      color: "primary",
    },
  },
  {
    title: "Enviados",
    prependIcon: "tabler-send",
    to: {
      name: "apps-email-filter",
      params: { filter: "sent" },
    },
  },
  {
    title: "Eliminados",
    prependIcon: "tabler-trash",
    to: {
      name: "apps-email-filter",
      params: { filter: "trashed" },
    },
  },
  {
    title:"Borradores",
    prependIcon:"tabler-file",
    to:{
      name: "apps-email-filter",
      params: { filter: "drafts" },
    }
  }
];

const labels = [
  {
    title: "Personal",
    color: "success",
    to: {
      name: "apps-email-label",
      params: { label: "personal" },
    },
  },
  {
    title: "Company",
    color: "primary",
    to: {
      name: "apps-email-label",
      params: { label: "company" },
    },
  },
  {
    title: "Important",
    color: "warning",
    to: {
      name: "apps-email-label",
      params: { label: "important" },
    },
  },
  {
    title: "Private",
    color: "error",
    to: {
      name: "apps-email-label",
      params: { label: "private" },
    },
  },
];
</script>

<template>
  <div class="d-flex flex-column h-100">
    <!-- 👉 Compose -->
    <div class="px-6 pb-5 pt-6"></div>
    <!-- 👉 Folders -->
    <PerfectScrollbar :options="{ wheelPropagation: false }" class="h-100">
      <!-- Filters -->
      <ul class="email-filters">
        <li class="text-xs d-block text-uppercase text-disabled">Todos</li>
        <RouterLink
          v-for="folder in folders"
          :key="folder.title"
          v-slot="{ isActive, href, navigate }"
          class="d-flex align-center cursor-pointer"
          :to="folder.to"
          custom
        >
          <li
            v-bind="$attrs"
            :href="href"
            :class="isActive && 'email-filter-active texto-cafe'"
            class="d-flex align-center cursor-pointer"
            @click="navigate"
          >
            <VIcon :icon="folder.prependIcon" class="me-2" size="20" />
            <span class="font-weight-medium">{{ folder.title }}</span>

            <VSpacer />

            <VChip
              v-if="folder.badge?.content"
              :color="folder.badge.color"
              pill
            >
              {{ props.countEmail }}
            </VChip>
          </li>
        </RouterLink>
      </ul>

      <VList>
        <p class="text-xs d-block text-uppercase text-disabled ms-6 mt-6">
          Grupos
        </p>

        <VListGroup v-for="grupo in Grupos" :value="`Grupo-${grupo.id}`">
          <template #activator="{ props }">
            <VListItem
              color="cafe"
              v-bind="props"
              prepend-icon="tabler-users-group"
              :title="grupo.nombre"
            />
          </template>
          <RouterLink
            v-for="folders_grupos in folders_grupo"
            v-slot="{ isActive, href, navigate }"
            class="d-flex align-center cursor-pointer"
            :to="{
              name: 'apps-email-filter',
              params: {
                filter:
                  'grupo-' + grupo.id + '-' + folders_grupos.to.params.filter,
              },
            }"
            custom
          >
            <ul>
              <li
                :value="folders_grupos.title"
                :title="folders_grupos.title"
                :prepend-icon="folders_grupos.prependIcon"
                @click.stop="navigate"
                :href="href"
                :class="{ active_grupo: isActive }"
                class="cursor-pointer custom-list-item"
              >
                <span class="font-weight-medium"
                  ><i :class="folders_grupos.prependIcon" class="icon"> </i
                  >{{ folders_grupos.title }}</span
                >
              </li>
            </ul>
          </RouterLink>
        </VListGroup>
      </VList>
    </PerfectScrollbar>
  </div>
</template>

<style lang="scss">
.email-filters,
.email-labels {
  > li {
    position: relative;
    margin-block-end: 4px;
    padding-block: 8px;
    padding-inline: 24px;
  }

  .email-filter-active,
  .email-label-active {
    &::after {
      position: absolute;
      background: currentcolor;
      block-size: 100%;
      content: "";
      inline-size: 3px;
      inset-block-start: 0;
      inset-inline-start: 0;
    }
  }
}

.email-labels {
  > li {
    position: relative;
    margin-block-end: 4px;
    padding-block: 4px;
    padding-inline: 24px;
  }
}

.btn-color {
  background: linear-gradient(
    135deg,
    rgb(135, 38, 56) 0%,
    rgb(193, 78, 97) 100%
  ) !important;
}
.texto-cafe {
  color: #b48d57;
  border-left: 2px solid #b48d57;
}

/* Estilos para la lista */
.custom-list-item {
  list-style-type: none; /* Elimina los marcadores de lista */
  padding: 15px;
  padding-left: 30%;
}
.custom-list-item:hover {
  background-color: #ece3e3; /* Color de fondo cuando se pasa el mouse sobre el elemento */
  color: #8e3040;
}
.icon {
  margin-right: 10px;
  font-size: 20px;
  vertical-align: text-bottom;
}

/* Estilo adicional para el elemento activo */
.active_grupo {
  background: linear-gradient(
    135deg,
    rgb(135, 38, 56) 0%,
    rgb(193, 78, 97) 100%
  ) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
</style>
