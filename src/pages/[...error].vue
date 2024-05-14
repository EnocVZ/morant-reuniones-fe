<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import misc404 from "@images/pages/404.png";
import miscMaskDark from "@images/pages/misc-mask-dark.png";
import miscMaskLight from "@images/pages/misc-mask-light.png";
import logosdevDark from "@images/logos/logoEdomexDark.png";
import logosdevLighk from "@images/logos/logoEdomexLight.png";
import authV2MaskDark from "@images/logos/textura.png";
import authV2MaskLight from "@images/logos/textura.png";

// const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const imagenlogin = useGenerateImageVariant(logosdevDark, logosdevLighk, true);

definePage({
  alias: "/pages/misc/not-found/:error(.*)",
  meta: {
    layout: "blank",
    public: true,
  },
});
</script>

<template>
  <VRow class="justify-center fondoRow">
    <VCol cols="12" md="10" class="tamanoCol">
      <div class="fondoCol">
        <!-- <div class="misc-wrapper"> -->
        <div class="contenido_error">
          <div class="contenido_404">
            <ErrorHeader
              status-code="404"
              title="Página no encontrada ⚠️"
              description="No  pudimos encontrar la pagina que estas buscando"
            />

            <VBtn to="./trelloPrueba.vue" width="300" class="mb-12"> Volver al inicio </VBtn>

            <!-- 👉 Image -->
            <div class="misc-avatar w-100 text-center">
              <VImg
                :src="imagenlogin"
                alt="Coming Soon"
                :width="900"
                class="mx-auto"
              />
            </div>
          </div>
          <div class="misc-avatar w-100 text-center">
            <VImg :src="authThemeMask" class="tamanoFondo d-none d-md-block" />
          </div>

          <!-- <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" /> -->
          <!-- <VImg :src="authThemeMask" class="tamanoFondo d-none d-md-block" /> -->
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.tamanoFondo {
  // position: absolute;
  inline-size: 100%;
  inset-block-end: 0;
}

.fondoRow {
  background-color: #2f3349;
}

.tamanoCol {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fondoCol {
  max-height: 90vh;
  background-color: #25293c;
}

.contenido_error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  min-block-size: 100dvh;
}

.contenido_404 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
