<script setup>
definePage({ meta: { layoutWrapperClasses: "layout-content-height-fixed" } });
</script>

<script>
import acontecimientoServices from "@/services/inbox/acontecimientos-services";
import historiaServices from "@/services/inbox/historias-services";
import grupoServices from "@/services/inbox/grupos-services";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import ComposeDialog from "@/views/apps/email/ComposeDialog.vue";
import EmailLeftSidebarContent from "@/views/apps/email/EmailLeftSidebarContent.vue";
import EmailView from "@/views/apps/email/EmailView.vue";
import { useEmail } from "@/views/apps/email/useEmail";
import { useToast } from "vue-toastification";

export default {
  name: "",
  components: {},
  data() {
    return {
      contador: 400,
      toast: useToast(),
      Acontecimientos: [],
      AcontecimientosVinculados: [],
      AcontecimientosUpdDel: [],
      listaHistorias: [],
      resGrupos: [],
      ListaGrupos: [],
      count: 0,
      modalEliminar: false,
      ListaEliminar: [],

      isLeftSidebarOpen: useResponsiveLeftSidebar(),
      route: useRoute(),
      labels: useEmail(),
      resolveLabelColor: useEmail(),
      emailMoveToFolderActions: useEmail(),
      shallShowMoveToActionFor: useEmail(),
      moveSelectedEmailTo: useEmail(),
      updateEmails: useEmail(),
      updateEmailLabels: useEmail(),
      isComposeDialogVisible: false,
      emailsData: {
        filteredData: [],
        emailsMeta: {
          inbox: 0,
          draft: 0,
          spam: 0,
        },
      },
      q: "",
      selectedEmails: [],

      emails: computed(() => this.emailsData.filteredData),

      selectAllEmailCheckbox: computed(
        () =>
          this.emails.length &&
          this.emails.length === this.selectedEmails.length
      ),

      isSelectAllEmailCheckboxIndeterminate: computed(
        () =>
          Boolean(this.selectedEmails.length) &&
          this.emails.length !== this.selectedEmails.length
      ),

      isAllMarkRead: computed(() => {
        return this.selectedEmails.every(
          (emailId) =>
            this.emails.find(
              (email) => email.listaAcontecimientos.id === emailId
            )?.listaAcontecimientos.leido
        );
      }),

      //-------------------------------------------------------------
      openedEmail: ref(null),

      emailViewMeta: computed(() => {
        const returnValue = {
          hasNextEmail: false,
          hasPreviousEmail: false,
        };

        if (this.openedEmail) {
          const openedEmailIndex = this.emails.findIndex(
            (e) => e.id === this.openedEmail?.id
          );

          returnValue.hasNextEmail = !!this.emails[openedEmailIndex + 1];
          returnValue.hasPreviousEmail = !!this.emails[openedEmailIndex - 1];
        }

        return returnValue;
      }),
    };
  },
  methods: {
    async listarAcontecimientos() {
      let res = await acontecimientoServices
        .listaAcontecimiento()
        .then((data) => data.data);
      this.Acontecimientos = res;
      localStorage.setItem('todosAcontecimientoIndex', JSON.stringify(this.Acontecimientos));
    },

    async listGrupos() {
      // this.ListaGrupos = [];
      // let res = await acontecimientoServices
      //   .listaGrupos()
      //   .then((data) => data.grupos);
      // let ids = 1;
      // res.map((data) => {
      //   data.ids = ids++;
      // });
      // this.resGrupos = res;
      let res = await grupoServices.listaGrupos().then((data) => data.data);
      this.ListaGrupos = res;
    },

    async getHistorias() {
      let res = await historiaServices
        .listaHistorias()
        .then((data) => data.data);
      this.listaHistorias = res;
    },

    async funcEmailsData() {
      await this.listarAcontecimientos();

      await this.listGrupos();

      // this.resGrupos.map((data) => {
      //   this.ListaGrupos.push(data);
      // });

      try {
        const filter =
          "filter" in this.route.params ? this.route.params.filter : undefined;
        const label =
          "label" in this.route.params ? this.route.params.label : undefined;

        if (
          filter ===
          "grupo-" +
          (filter != undefined ? filter.split("-")[1] : "") +
          "-recibido" ||
          filter ===
          "grupo-" +
          (filter != undefined ? filter.split("-")[1] : "") +
          "-trashed" ||
          filter ===
          "grupo-" +
          (filter != undefined ? filter.split("-")[1] : "") +
          "-sent" ||
          filter ===
          "grupo-" +
          (filter != undefined ? filter.split("-")[1] : "") +
          "-drafts"
        ) {
          const datos = this.ListaGrupos.find(
            (data) => data.id == filter.split("-")[1]
          ).ultramsgID;
          var Id = await grupoServices.grupoById(datos).then((data) => data);
        }

        const queryLowered = this.q.toLowerCase();

        function isInFolder(email) {
          if (filter === "trashed") return !email.activo; // Cambio aquí, verifica si el campo activo es falso
          if (
            filter ===
            "grupo-" +
            (filter != undefined ? filter.split("-")[1] : "") +
            "-recibido" //condicion para mensajes recibidos de un grupo
          ) {
            return (
              email.idGrupo == Id.id && email.activo && !email.mensajeEnviado
            );
          }

          if (
            filter ===
            "grupo-" +
            (filter != undefined ? filter.split("-")[1] : "") +
            "-sent" //condicion para mensajes recibidos de un grupo
          ) {
            return (
              email.mensajeEnviado && email.activo && email.idGrupo == Id.id
            );
          }

          if (
            filter ===
            "grupo-" +
            (filter != undefined ? filter.split("-")[1] : "") +
            "-trashed"
          ) {
            // condicion para mensajes borrados de un grupo
            return email.activo == false && email.idGrupo == Id.id;
          }
          if (
            filter ===
            "grupo-" +
            (filter != undefined ? filter.split("-")[1] : "") +
            "-drafts"
          ) {
            return (
              email.activo &&
              !email.mensajeEnviado &&
              email.validado &&
              email.idGrupo == Id.id
            );
          }

          if (filter === "sent") return email.mensajeEnviado && email.activo; // Cambio aquí, verifica si el campo activo es falso

          if (filter === "drafts")
            return email.activo && !email.mensajeEnviado && email.validado;

          return (
            email.folder === (filter || email.folder) &&
            email.activo &&
            !email.validado &&
            !email.mensajeEnviado
          );
        }

        const filteredData = this.Acontecimientos.filter(
          (email) =>
            (email.listaAcontecimientos.titulo
              .toLowerCase()
              .includes(queryLowered) ||
              email.listaAcontecimientos.contexto
                .toLowerCase()
                .includes(queryLowered)) &&
            isInFolder(email.listaAcontecimientos)
        );

        const emailsMeta = {
          inbox: this.Acontecimientos.filter(
            (email) =>
              !email.listaAcontecimientos.activo &&
              !email.listaAcontecimientos.leido
          ).length,
          draft: this.Acontecimientos.filter(
            (email) => email.listaAcontecimientos.folder === "draft"
          ).length,
          spam: this.Acontecimientos.filter(
            (email) =>
              !email.listaAcontecimientos.activo &&
              !email.listaAcontecimientos.leido
          ).length,
        };

        this.emailsData.emailsMeta = emailsMeta;
        this.emailsData.filteredData = filteredData;

        this.count = 0;
        this.Acontecimientos.map((data) => {
          if (
            data.listaAcontecimientos.leido == false &&
            data.listaAcontecimientos.activo == true
          )
            this.count++;
        });
      } catch (error) {
        console.error("Error al obtener la lista de acontecimientos:", error);
        // Manejar el error según sea necesario
      }
    },

    toggleSelectedEmail(emailId) {
      const emailIndex = this.selectedEmails.indexOf(emailId);
      if (emailIndex === -1) this.selectedEmails.push(emailId);
      else this.selectedEmails.splice(emailIndex, 1);
    },

    selectAllCheckboxUpdate() {
      this.selectedEmails = !this.selectAllEmailCheckbox
        ? this.emails.map((email) => email.listaAcontecimientos.id)
        : [];
    },

    async filtrarCorreos() {
      await this.funcEmailsData();
    },

    //-------------------------------------------------------------

    async Eliminar(emailIds) {
      emailIds.map((data) => {
        this.AcontecimientosUpdDel.push({ id: data });
      });
      let respuesta = await acontecimientoServices.deleteAcontecimiento(
        this.AcontecimientosUpdDel
      );

      if (respuesta.data.success) {
        this.toast.success(
          this.AcontecimientosUpdDel.length > 1
            ? respuesta.data.message
            : "Mensaje eliminado correctamente"
        );
      } else {
        this.toast.error(
          this.AcontecimientosUpdDel.length > 1
            ? "Los mensajes no se pudieron eliminar intente nuevamente."
            : "El mensaje no se pudo eliminar intente nuevamente."
        );
      }
      await this.funcEmailsData();
    },

    async marcarNoLeido(emailIds) {
      if (emailIds.length > 1) {
        emailIds.map((id) => {
          let noLeido = this.emails.find(
            (data) => data.listaAcontecimientos.id == id
          ).listaAcontecimientos;

          if (noLeido.leido == true)
            this.AcontecimientosUpdDel.push({ id: noLeido.id });
        });
      } else {
        let mensaje = this.emails.find(
          (data) => data.listaAcontecimientos.id == emailIds
        ).listaAcontecimientos;

        this.AcontecimientosUpdDel.push({ id: mensaje.id });
      }
      let respuesta = await acontecimientoServices.updateAcontecimientos(
        this.AcontecimientosUpdDel
      );

      if (respuesta.data.success) {
        this.toast.success(
          this.AcontecimientosUpdDel.length > 1
            ? "Mensajes marcados como no leídos correctamente."
            : "Mensaje marcado como no leído correctamente."
        );
      } else {
        this.toast.error(
          "No se pudo realizar el marcado intentelo nuevamente."
        );
      }
    },

    async marcarLeido(emailIds, tipo) {
      if (emailIds.length > 1) {
        emailIds.map((id) => {
          let noLeido = this.emails.find(
            (data) => data.listaAcontecimientos.id == id
          ).listaAcontecimientos;

          if (noLeido.leido == false)
            this.AcontecimientosUpdDel.push({ id: noLeido.id });
        });

        let respuesta = await acontecimientoServices.updateAcontecimientos(
          this.AcontecimientosUpdDel
        );

        if (respuesta.data.success) {
          this.toast.success("Mensajes marcados como leídos correctamente.");
        } else {
          this.toast.error(
            "Los Mensajes no se pudieron marcar como leídos intente nuevamente."
          );
        }
      } else {
        if (this.emails.length > 0) {
          var mensaje = this.emails.find(
            (data) => data.listaAcontecimientos.id == emailIds
          ).listaAcontecimientos;
        }
        else {
          var mensaje = this.Acontecimientos.find(
            (data) => data.listaAcontecimientos.id == emailIds
          ).listaAcontecimientos;
        }

        if (!mensaje.leido) {
          this.AcontecimientosUpdDel.push({ id: mensaje.id });
          let respuesta = await acontecimientoServices.updateAcontecimientos(
            this.AcontecimientosUpdDel
          );

          if (respuesta.data.success) {
            if (!tipo)
              this.toast.success("Mensaje marcado como leído correctamente.");
          } else {
            this.toast.error(
              "El mensaje no se pudo marcar como leído intente nuevamente."
            );
          }
        }
      }
    },

    async handleActionClick(action, emailIds = this.selectedEmails, tipo) {
      this.selectedEmails = [];
      // this.AcontecimientosVinculados = [];
      this.AcontecimientosUpdDel = [];
      if (!emailIds.length) return;
      if (action === "trash") {
        this.ListaEliminar = emailIds;
        this.modalEliminar = true;
      } else if (action === "spam")
        await this.updateEmails(emailIds, { folder: "spam" });
      else if (action === "unread") {
        await this.marcarNoLeido(emailIds);
      } else if (action === "read") {
        await this.marcarLeido(emailIds, tipo);
      }
      this.funcEmailsData();
    },
    //-------------------------------------------------------------

    handleMoveMailsTo(action) {
      this.moveSelectedEmailTo(action, this.selectedEmails);
      this.funcEmailsData();
    },

    changeOpenedEmail(dir) {
      if (!this.openedEmail) return;
      const openedEmailIndex = this.emails.findIndex(
        (e) => e.id === this.openedEmail?.id
      );
      const newEmailIndex =
        dir === "previous" ? openedEmailIndex - 1 : openedEmailIndex + 1;

      this.openedEmail = this.emails[newEmailIndex];
    },

    async openEmail(email, tipo) {
      this.openedEmail = null;
      this.getHistorias();
      this.openedEmail = email.listaAcontecimientos;
      this.handleActionClick("read", [email.listaAcontecimientos.id], tipo);
    },

    async refreshOpenedEmail() {
      this.funcEmailsData();
      if (this.openedEmail)
        this.openedEmail = this.emails.find(
          (e) => e.id === this.openedEmail?.id
        );
    },
    async close() {
      this.listaHistorias = [];
      this.openedEmail = null;
      this.funcEmailsData();
      this.$router.push({ name: this.$route.name, params: {} });
    },
    formatDateFromDatabase(date) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
    },

    Cancelar() {
      this.modalEliminar = false;
      this.ListaEliminar = [];
    },

    async EliminarAcontecimiento() {
      this.modalEliminar = false;
      await this.Eliminar(this.ListaEliminar);
    },
  },
  async created() {

    // si existe un paraetro en la url
    if (this.$router.currentRoute.value.params.id) {
      const acontecimientoLocal = localStorage.getItem('todosAcontecimientoIndex');
      if (acontecimientoLocal) {
        this.Acontecimientos = JSON.parse(acontecimientoLocal)

      } else {
        await this.listarAcontecimientos();
      }
      const idRuta = parseInt(this.$router.currentRoute.value.params.id, 10);
      const email = this.Acontecimientos.find((email) => email.listaAcontecimientos.id === idRuta);
      // Si encontramos el correo, lo abrimos automáticamente
      if (email) {
        this.openEmail(email, 1);
      }
    }
    this.funcEmailsData();
    // setInterval(async () => {
    //   this.contador = this.contador - 1;
    //   if (this.contador > 0) {
    //     let res = await acontecimientoServices
    //       .listaAcontecimiento()
    //       .then((data) => data.data);
    //     console.log(res.length);
    //     console.log(this.Acontecimientos.length);
    //     if (res.length != this.Acontecimientos.length) {
    //       this.funcEmailsData();
    //     }
    //   }
    //   console.log(this.contador);
    // }, 8000);
    // await thi
    watch(
      () => this.route.params,
      () => {
        this.selectedEmails = [];
        this.listaHistorias = [];
        this.openedEmail = null;
        this.funcEmailsData();
      },
      { deep: true }
    );
  },
};
</script>

<template>
  <VLayout style="min-block-size: 100%" class="email-app-layout">
    <VNavigationDrawer v-model="isLeftSidebarOpen" absolute touchless location="start"
      :temporary="$vuetify.display.mdAndDown">
      <EmailLeftSidebarContent :countEmail="count" :Grupos="ListaGrupos" @toggle-compose-dialog-visibility="
        isComposeDialogVisible = !isComposeDialogVisible
        " />
    </VNavigationDrawer>
    <EmailView :email="openedEmail" :emails="Acontecimientos" :listaHistorias="listaHistorias" :email-meta="emailViewMeta"
      @refresh="refreshOpenedEmail" @navigated="changeOpenedEmail" @close="close"
      :AcontecimientosVinculados="AcontecimientosVinculados"
      @remove="handleActionClick('trash', openedEmail ? [openedEmail.id] : [])"
      @unread="handleActionClick('unread', openedEmail ? [openedEmail.id] : [])"
      @star="handleActionClick('star', openedEmail ? [openedEmail.id] : [])"
      @unstar="handleActionClick('unstar', openedEmail ? [openedEmail.id] : [])" />
    <VMain>
      <VCard flat class="email-content-list h-100 d-flex flex-column">
        <div class="d-flex align-center">
          <IconBtn class="d-lg-none ms-3" @click="isLeftSidebarOpen = true">
            <VIcon icon="tabler-menu-2" />
          </IconBtn>

          <!-- 👉 Search -->
          <VTextField @input="filtrarCorreos" v-model="q" density="default" class="email-search px-1 flex-grow-1"
            prepend-inner-icon="tabler-search" placeholder="Buscar mensajes" />
        </div>
        <VDivider />
        <!-- 👉 Action bar -->
        <div class="py-2 px-5 d-flex align-center">
          <!-- TODO: Make checkbox primary on indeterminate state -->
          <VCheckbox :model-value="selectAllEmailCheckbox" :indeterminate="isSelectAllEmailCheckboxIndeterminate"
            @update:model-value="selectAllCheckboxUpdate" />
          <div class="w-100 d-flex align-center action-bar-actions" :style="{
            visibility:
              isSelectAllEmailCheckboxIndeterminate || selectAllEmailCheckbox
                ? undefined
                : 'hidden',
          }">
            <!-- Trash -->
            <IconBtn v-show="'filter' in route.params
                ? route.params.filter !== 'trashed'
                : true
              " @click="handleActionClick('trash')">
              <VIcon icon="tabler-trash" />
              <VTooltip activator="parent" location="top">
                Eliminar Email
              </VTooltip>
            </IconBtn>
            <!-- Mark unread/read -->
            <IconBtn @click="
              isAllMarkRead
                ? handleActionClick('unread')
                : handleActionClick('read')
              ">
              <VIcon :icon="isAllMarkRead ? 'tabler-mail' : 'tabler-mail-opened'" />
              <VTooltip activator="parent" location="top">
                {{
                  isAllMarkRead ? "Marcar como no leído" : "Marcar como leído"
                }}
              </VTooltip>
            </IconBtn>
            <!-- Move to folder -->
            <!-- <IconBtn>
              <VIcon icon="tabler-folder" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Folder
              </VTooltip>
              <VMenu activator="parent">
                <VList density="compact">
                  <template
                    v-for="moveTo in emailMoveToFolderActions"
                    :key="moveTo.title"
                  >
                    <VListItem
                      :class="shallShowMoveToActionFor(moveTo.action) ? 'd-flex' : 'd-none'"
                      href="#"
                      class="items-center"
                      @click="handleMoveMailsTo(moveTo.action)"
                    >
                      <template #prepend>
                        <VIcon
                          :icon="moveTo.icon"
                          class="me-2"
                          size="20"
                        />
                      </template>
                      <VListItemTitle class="text-capitalize">
                        {{ moveTo.action }}
                      </VListItemTitle>
                    </VListItem>
                  </template>
                </VList>
              </VMenu>
            </IconBtn> -->
            <!-- Update labels -->
            <!-- <IconBtn>
              <VIcon icon="tabler-tag" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Label
              </VTooltip>
              <VMenu activator="parent">
                <VList density="compact">
                  <VListItem
                    v-for="label in labels"
                    :key="label.contexto"
                    href="#"
                    @click="updateEmailLabels(selectedEmails, label.contexto)"
                  >
                    <template #prepend>
                      <VBadge
                        inline
                        :color="resolveLabelColor(label.contexto)"
                        dot
                      />
                    </template>
                    <VListItemTitle class="ms-2 text-capitalize">
                      {{ label.contexto }}
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn> -->
          </div>
          <VSpacer />
          <!-- <IconBtn @click="funcEmailsData()">
            <VIcon icon="tabler-reload" />
          </IconBtn> -->
          <!-- <MoreBtn
            density="comfortable"
            color="undefined"
          /> -->
        </div>
        <VDivider />
        <!-- 👉 Emails list -->
        <div class="">
          
        </div>
        <PerfectScrollbar style="max-height: 70vh;" tag="ul" :options="{ wheelPropagation: false }" class="email-list">
          <li v-for="email in emails" v-show="emails?.length" :key="email.listaAcontecimientos.id"
            class="email-item d-flex align-center py-2 px-5 cursor-pointer"
            :class="[{ 'email-read': email.listaAcontecimientos.leido }]" @click="openEmail(email, 1)">
            <VCheckbox :model-value="selectedEmails.includes(email.listaAcontecimientos.id)
              " class="flex-shrink-0" @update:model-value="
                toggleSelectedEmail(email.listaAcontecimientos.id)
              " @click.stop />
            <!-- <IconBtn
              :color="email.isStarred ? 'warning' : 'default'"
              @click.stop=" handleActionClick(email.isStarred ? 'unstar' : 'star', [email.id])"
            >
              <VIcon
                :icon="email.isStarred ? 'tabler-star-filled' : 'tabler-star'"
                :class="email.isStarred ? '' : 'text-disabled'"
              />
            </IconBtn> -->
            <div class="m-auto" v-if="!email.listaAcontecimientos.leido">
              <svg xmlns="http://www.w3.org/2000/svg" style="color: #00abfb"
                class="icon icon-tabler icon-tabler-circle-filled" width="12" height="12" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z"
                  stroke-width="0" fill="currentColor" />
              </svg>
            </div>
            <!-- <VAvatar
              class="mx-2"
              size="32"
            >
              <VImg
                :src="email.from.avatar"
                :alt="email.from.name"
              />
            </VAvatar> -->

            <div>
              <!-- <VIcon icon="tabler-users-group mx-1" color="primary" /> -->
              {{ email.tipoAcontecimiento.emojis }}
            </div>

            <h6 class="mx-3 text-body-1 font-weight-medium text-high-emphasis">
              {{ email.listaAcontecimientos.titulo }}
            </h6>
            <span class="truncate">{{
              email.listaAcontecimientos.contexto
            }}</span>
            <VSpacer />
            <div class="email-meta" :class="$vuetify.display.xs ? 'd-none' : ''">
              <!-- <VBadge
                v-for="label in email.labels"
                :key="label"
                inline
                :color="resolveLabelColor(label)"
                dot
              /> -->
              <small class="text-disabled text-sm ms-2">{{
                formatDateFromDatabase(email.listaAcontecimientos.fechaAlt)
              }}</small>
            </div>
            <!-- 👉 Email actions -->
            <div class="email-actions d-none">
              <IconBtn @click.stop="
                handleActionClick('trash', [email.listaAcontecimientos.id])
                " v-if="email.listaAcontecimientos.activo">
                <VIcon icon="tabler-trash" />
                <VTooltip activator="parent" location="top">
                  Eliminar Email
                </VTooltip>
              </IconBtn>
              <IconBtn @click.stop="
                handleActionClick(
                  email.listaAcontecimientos.leido ? 'unread' : 'read',
                  [email.listaAcontecimientos.id]
                )
                ">
                <VIcon :icon="email.listaAcontecimientos.leido
                    ? 'tabler-mail'
                    : 'tabler-mail-opened'
                  " />
                <VTooltip activator="parent" location="top">
                  {{
                    email.listaAcontecimientos.leido
                    ? "Marcar como no leído"
                    : "Marcar como leído"
                  }}
                </VTooltip>
              </IconBtn>
              <!-- <IconBtn @click.stop="handleActionClick('spam', [email.id])">
                <VIcon icon="tabler-alert-octagon" />
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  Mover a spam
                </VTooltip>
              </IconBtn> -->
            </div>
          </li>
          <li v-show="!emails.length" class="py-4 px-5 text-center">
            <span class="text-high-emphasis">Sin Registros.</span>
          </li>
        </PerfectScrollbar>
      </VCard>
      <ComposeDialog v-show="isComposeDialogVisible" @close="isComposeDialogVisible = false" />
    </VMain>
  </VLayout>

  <VDialog v-model="modalEliminar" max-width="500px">
    <VCard>
      <VCardTitle> ¿Seguro que deseas eliminar el mensaje? </VCardTitle>

      <VCardActions>
        <VSpacer />

        <VBtn color="error" variant="outlined" @Click="Cancelar">
          Cancelar
        </VBtn>

        <VBtn color="success" variant="elevated" @Click="EliminarAcontecimiento">
          Aceptar
        </VBtn>

        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";

// ℹ️ Remove border. Using variant plain cause UI issue, caret isn't align in center
.email-search {
  .v-field__outline {
    display: none;
  }
}

.email-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-email-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-email-app-layout);
    }
  }
}

.email-content-list {
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.email-list {
  white-space: nowrap;

  .email-item {
    block-size: 3.75rem;
    transition: all 0.2s ease-in-out;
    will-change: transform, box-shadow;

    &.email-read {
      background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    }

    &+.email-item {
      border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }

  .email-item:hover {
    transform: translateY(-2px);

    @include mixins.elevation(3);

    .email-actions {
      display: block !important;
    }

    .email-meta {
      display: none;
    }

    +.email-item {
      border-color: transparent;
    }

    @media screen and (max-width: 600px) {
      .email-actions {
        display: none !important;
      }
    }
  }
}

.email-compose-dialog {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  min-inline-size: 100%;

  @media only screen and (min-width: 800px) {
    min-inline-size: 712px;
  }
}
</style>
