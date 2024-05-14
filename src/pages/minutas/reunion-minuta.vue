<script  setup>
const numberedSteps = [
    {
        title: 'Foro de Planificación',
        subtitle: 'Detalles Relevantes en la Minuta.',
    },
    {
        title: 'Agenda del Encuentro',
        subtitle: 'Intervenciones y Momentos Destacados.',
    },
    {
        title: 'Lista de Participantes',
        subtitle: 'Registro de Nombres Importantes.',
    },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
    
})

const onSubmit = () => {
    console.log(formData.value)
}


const items = ['cambay de Ruíz Castañeda', 'Acolman', 'Metepec', 'El Oro', 'Teoloyucan']

</script>

<template>
    <VRow>
        <VCol cols="12" md="4">
            <VCardText>
                <!-- 👉 Stepper -->
                <AppStepper v-model:current-step="currentStep" direction="vertical" :items="numberedSteps" />
            </VCardText>
        </VCol>
        <!-- 👉 stepper content -->
        <VCol cols="12" md="8">
            <VCard>
                <VCardText>
                    <VForm>
                        <VWindow v-model="currentStep" class="disable-tab-transition">
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Foro de Planificación
                                        </h6>
                                        <p class="mb-0">
                                            Detalles Relevantes en la Minuta.
                                        </p>
                                    </VCol>
                                    <VCol cols="12" md="12">
                                        <AppTextField
                                            v-model="firstName"
                                            label="Titulo"
                                            placeholder="Escriba nombre del titulo"
                                        />
                                    </VCol>
                                    <VCol cols="12" md="6">
                                        <AppDateTimePicker
                                            v-model="date"
                                            label="Fecha y Hora"
                                            placeholder="Selecione fecha y hora"
                                            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                                        />
                                    </VCol>
                                    <VCol cols="12" md="6">
                                        <AppSelect
                                            :items="items"
                                            label="Municipio"
                                            density="compact"
                                            placeholder="Selecione municipio "
                                        />
                                    </VCol>
                                </VRow>
                            </VWindowItem>
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Agenda del Encuentro
                                        </h6>
                                        <p class="mb-0">
                                            Intervenciones y Momentos Destacados.
                                        </p>
                                    </VCol>
                                    <VCol cols="12" md="6">
                                            <AppSelect  label="Orden del día" placeholder="Seleccione el orden"
                                                :items="['Mensaje de bienvenida', 'Explicación de Motivos', 'Intervención']" />
                                        </VCol>
                                    <VCol cols="12" md="12">
                                        <AppTextField  label="Nombre"
                                            placeholder="Escriba nombre completo" />
                                    </VCol>
                                    <VCol cols="12" md="12">
                                        <AppTextField label="Cargo" placeholder="Escriba el nombre de su cargo" />
                                    </VCol>
                                
                                    <!-- <VCol cols="12" md="6">
                                        <AppSelect v-model="formData.language" label="Language"
                                            placeholder="Select Language"
                                            :items="['English', 'Spanish', 'French', 'Russian', 'German']" />
                                    </VCol> -->
                                </VRow>
                            </VWindowItem>
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Participantes
                                        </h6>
                                        <p class="mb-0">
                                            Registro de Nombres Importantes.
                                        </p>
                                    </VCol>
                                   
                                    <VCol cols="12" md="6">
                                            <AppSelect  label="Gobierno" placeholder="Tipo de gobierno"
                                                :items="['Gobierno del Estado de México', 'Gobierno Federal', 'Gobierno Municipal']" />
                                        </VCol>
                                    <VCol cols="12" md="12">
                                        <AppTextField  label="Nombre"
                                            placeholder="Escriba nombre completo" />
                                    </VCol>
                                    <VCol cols="12" md="12">
                                        <AppTextField label="Cargo" placeholder="Escriba el nombre de su cargo" />
                                    </VCol>
                                </VRow>
                            </VWindowItem>
                        </VWindow>
                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                            <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="currentStep--">
                                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                                Previous
                            </VBtn>
                            <VBtn v-if="numberedSteps.length - 1 === currentStep" color="success" append-icon="tabler-check"
                                @click="onSubmit">
                                submit
                            </VBtn>
                            <VBtn v-else @click="currentStep++">
                                Next
                                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                            </VBtn>
                        </div>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
