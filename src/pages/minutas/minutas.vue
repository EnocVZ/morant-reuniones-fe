<!-- <script setup>
    import minuta from '@navigated/pages/minutas/reunion-minuta.vue'
</script> -->

<template>
    <div class="">
        <VRow>
            <VCol cols="12" md="12">
                <VCard >
                    <VCardItem>
                        <VBtn class="buto-crear">
                            <RouterLink
                            class="ms-2 text-white"
                            :to="{ name: 'minutas-reunion-minuta' }"
                            >
                                Crear Reunion
                            </RouterLink>
                        </VBtn>
                        
                    </VCardItem>
                </VCard>
            </VCol>
        </VRow>
    </div>
</template>

<style>
    .buto-crear{
        background: linear-gradient(135deg, rgb(135, 38, 56) 0%, rgb(193, 78, 97) 100%);
        box-shadow: 0 2px 6px rgba(var(--v-global-theme-primary), 0.48);
        font-weight: 500;
    }
</style>