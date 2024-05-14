

<script lang="ts" setup>
import '@styles/style.css'

import { ref } from 'vue';

const date = ref('');
const time = ref('');

const items = ['Guardia Nacional', 'Proteción civil', 'Policia Municipal', 'Militar']
const selected = ref(['Guardia Nacional'])
</script>

<template>
    <VForm>
        <VRow class="vrow-flex">
            <VCol cols="12" md="7" class="d-flex whats-margin">
                <VIcon color="primary" class="tabler-brand-whatsapp ma-3" size="40"/>
                <p class="titulo-whats">
                    <h2><b> Informes WhatsApp</b></h2>
                    <h3>Editor de mensajes</h3>
                </p>
            </VCol>
            <VCol cols="12" md="4" class="margin-top">
                <VBtn :to="{name:'apps-email-mensaje'}" block class="btn-color">
                    Guardar
                </VBtn>
            </VCol>
            <VCol cols="12" md="3" class="col-flex"> <!-- Primera columna -->
                <VCard class="altura-col col-1-width">
                    <VCardItem>
                    <div class="padreItem">
                        <VCol cols="12" md="12" class="item-gap item">
                            <VTextField
                                label="Título"
                                prepend-icon="tabler-file-typography"
                                validate-on="input"
                            />
                        </VCol>
                    </div>
                    <div class="padreItem">
                        <VCol cols="12" md="12" class="item-gap item">
                            <VSelect
                                v-model="selected"
                                :items="items"
                                placeholder="Seleciones actores "
                                label="Actores relevantes"
                                prepend-icon="tabler-tag"
                                chips
                                multiple
                                closable-chips
                            />
                        </VCol>
                    </div>
                    <div class="padreItem">
                        <VCol cols="12" md="12" class="item-gap item">
                            <VSelect
                                label="Grupos"
                                placeholder="Selecionar Grupos"
                                prepend-icon="tabler-users-group"
                            />
                        </VCol>
                    </div>
                    <div class="padreItem">
                        <VCol cols="12" md="12" class="item-gap item">
                            <VSelect
                                label="Urgencia"
                                placeholder="Selecionar"
                                prepend-icon="tabler-alert-triangle"
                            />
                        </VCol>
                    </div>
                    <div class="padreItem">
                        <VCol cols="12" class="item-gap"> <!-- Fecha y hora -->
                            <VRow>
                                <!-- <VCol md="1">
                                    <div class="pt-7">
                                        <VIcon class="tabler-calendar-time" />
                                    </div>
                                </VCol> -->
                                <VCol md="7">
                                    <AppDateTimePicker
                                        v-model="date"
                                        placeholder="Fecha"
                                        prepend-icon="tabler-calendar-time"
                                    />
                                </VCol>
                                <VCol md="5">
                                    <AppDateTimePicker
                                        v-model="time"
                                        placeholder="Hora"
                                        :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                                    />
                                </VCol>
                            </VRow>
                        </VCol>
                    </div>
                    </VCardItem>
                </VCard>
                
            </VCol>
            <VCol cols="12" md="4"> <!-- Segunda columna -->
                <VCard class="altura-col">
                    <VCardItem>
                        <VCol cols="12" md="12" class="item2">
                            <VTextarea
                                rows="4"
                                label="Contexto (Automatizado)"
                                validate-on="input"
                                placeholder="Escriba su contexto"
                                prepend-icon="tabler-analyze"
                                
                            />
                        </VCol>
                        <VCol cols="12" md="12">
                            <VTextarea
                                rows="3"
                                label="Dirección"
                                validate-on="input"
                                placeholder="Escriba su dirección"
                                prepend-icon="tabler-map-pin"
                            />
                        </VCol>
                        <VCol cols="12" md="12" class="map-align">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1780.4947839717029!2d-93.11760688439306!3d16.753676296660164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ecd88c8c5266ef%3A0x90bbd6a4cd6cc9d6!2sParque%20Central%20de%20Tuxtla%20Guti%C3%A9rrez!5e0!3m2!1ses-419!2smx!4v1700697631682!5m2!1ses-419!2smx" width="90%" height="180px" class="rounded" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </VCol>
                    </VCardItem>
                </VCard>
            </VCol>
            <VCol cols="12" md="4"> <!-- Tercera columna -->
                <VCard class="altura-col">
                    <VCardItem>
                        <VCol cols="12" md="12">
                            <div class="item3">
                                <VTextarea
                                    rows="8"
                                    label="Mensaje Original"
                                    validate-on="input"
                                    placeholder="Escriba su contexto"
                                    prepend-icon="tabler-mail"
                                />
                            </div>
                        </VCol>
                        <VCol cols="12" md="12">
                            <div class="item4">
                                <VTextarea
                                    rows="8"
                                    label="Información Adicional"
                                    validate-on="input"
                                    placeholder="Escriba su contexto"
                                    prepend-icon="tabler-info-circle"
                                />

                            </div>
                        </VCol>
                    </VCardItem>
                </VCard>
                
            </VCol>
        </VRow>
    </VForm>
        
    <a onclick="history.back()" class="btn-flotante">
        <VIcon icon="tabler-arrow-narrow-left"/>
    </a>
</template>

<style scoped>
/* margin top del boton GUARDAR */
.margin-top {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    padding-bottom: 8px;
    /* flex-direction: column; */
    /* align-items: center; */
}
.vrow-flex {
    display: flex;
    justify-content: center;
    /* align-items: center; */
    /* margin-top: 5px; */
}
.whats-margin {
    padding-top: 10px;
    padding-bottom: 8px;
}
.titulo-whats {
    margin: 0;
}
.col-flex {
    display: flex;
    justify-content: center;
    margin: 0;
    /* max-height: 570px; */
    
}
.altura-col {  
    /* min-height: 570px; */
    height: 510px;
    
}
.col-1-width {
    width: 100%;
}
.map-align {
    /* background-color: red; */
    display: flex;
    justify-content: flex-end;
}
.item-gap {
    margin-bottom: 25px;
}

.padreItem {
    position: relative;
}
.item::before {
    content: ' ';
    border-left: 2px solid rgba(165, 164, 164, 0.473);
    position: absolute;
    left: 23px;
    top: 50px;
    height: 55px;
}
.item2::before {
    content: ' ';
    border-left: 2px solid rgba(165, 164, 164, 0.473);
    position: absolute;
    left: 47px;
    top: 65px;
    height: 124px; 
}
.item3::before {
    content: ' ';
    border-left: 2px solid rgba(165, 164, 164, 0.473);
    position: absolute;
    left: 47px;
    top: 65px;
    height: 215px;
}

</style>