<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Power
      <VIcon icon="tabler-heart" color="error" size="1.25rem" class="mx-1" />
      By
      <a href="#" target="" rel="noopener noreferrer" class="text-cafe ms-1"
        >Morant</a
      >
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <!-- <a
        href="https://themeforest.net/licenses/standard"
        target="noopener noreferrer"
      >License</a> -->
      <a
        href=""
        target="noopener noreferrer"
        class="text-cafe"
        style="display: none"
        >Manual</a
      >
      <!-- <a
        href="https://demos.pixinvent.com/vuexy-vuejs-admin-template/documentation/"
        target="noopener noreferrer"
      >Documentation</a> -->
    </span>
  </div>
</template>
