<script>
import L from 'leaflet';
import { ref } from "vue";
import 'leaflet.markercluster';

export default{
    
    props:{
      
        Acontecimiento: {
            type: Array,
            
        },
    },
    data(){
        return{
            map: ref(null),
            mapModal: ref(null),
            selectedMarker: ref(null),
            selectedMarkerModal: ref(null),
            modalMarcadorModal: false,
            modal_mapa: false,
        };
    },
    methods:{

        //METODO PARA CREAR EL MAPA
        Mapa() {
            // Verifica que mapContainer.value exista
            if (this.$refs.mapContainer) {
                console.log(this.Acontecimiento)
                // Destruye el mapa si ya está inicializado
                if (this.map) {
                this.map.remove();
                } 
                if (this.selectedMarker) {
                // Elimina el marcador anterior si existe
                this.map.removeLayer(this.selectedMarker);
                }
                // Crea el mapa
                this.map = L.map(this.$refs.mapContainer).setView(
                [this.Acontecimiento.latitud, this.Acontecimiento.longitud],
                13
                );
                // Agrega la capa de azulejos (tiles)
                L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(this.map);

                this.addMarkers();
            }
        },

        //METODO PARA AGREGAR MARCADORES AL MAPA
        addMarkers() {
            this.selectedMarker = L.marker([
                this.Acontecimiento.latitud,
                this.Acontecimiento.longitud,
            ]).addTo(this.map);
        },

        // SCRIP PARA MOSTRA EL MAPA EN EL MODAL  EN TAMAÑO DE LA PANTALLA
        abrirModal() {
            if (!this.modal_mapa) {
                this.modal_mapa = true;

                this.$nextTick(() => {
                this.MapaModal();
                this.mapModal.on("click", (e) => this.onClickMapaModal(e));
                });
            }
        },

        MapaModal() {
            if (this.$refs.mapContainerModal) {
                if (this.mapModal) {
                this.mapModal.remove();
                }

                if (this.selectedMarkerModal) {
                // Elimina el marcador anterior si existe
                this.mapModal.removeLayer(this.selectedMarkerModal);
                }
                // Crea el mapa en el contenedor del modal
                this.mapModal = L.map(this.$refs.mapContainerModal).setView(
                [this.Acontecimiento.latitud, this.Acontecimiento.longitud],
                13
                );

                L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(this.mapModal);

                this.addMarkersModal();
            }
        },

        addMarkersModal() {
            this.selectedMarkerModal = L.marker([
                this.Acontecimiento.latitud,
                this.Acontecimiento.longitud,
            ]).addTo(this.mapModal);
        },

        onClickMapaModal(e) {
            if (this.selectedMarkerModal) {
                this.modalMarkerModal();
            } else {
                this.selectedMarkerModal = L.marker(e.latlng)
                .addTo(this.mapModal)
                .on("click", this.modalMarkerModal);

                this.Acontecimiento.latitud = e.latlng.lat.toFixed(4).toString();
                this.Acontecimiento.longitud = e.latlng.lng.toFixed(4).toString();
            }
        },

        modalMarkerModal() {
            this.modalMarcadorModal = true;
        },

        confirmarEliminarMarcadorModal() {
            if (this.selectedMarkerModal) {
                // Elimina el marcador y proporciona el callback
                this.mapModal.removeLayer(this.selectedMarkerModal);
                // Desvincula el evento 'click' asociado al marcador
                this.selectedMarkerModal.off("click", this.modalMarkerModal);

                // Establece el marcador actual como null
                this.selectedMarkerModal = null;
                this.modalMarcadorModal = false;
            }
        },

        cerrarModal() {
            this.modal_mapa = false;
            this.Mapa()
        },

        updateMap() {
            this.Mapa();
        },
    },

    watch: {
        Acontecimiento() {
            this.updateMap(); 
        }
    },

    mounted() {
        this.Mapa();
    },
}

</script>

<template>
    <div ref="mapContainer" style="width: 100%; height: 190px"></div>
    <div>
        <VBtn class="custom-button" @click="abrirModal()">Ampliar mapa</VBtn>
    </div>
        <!-- Modal -->
    <v-dialog v-model="modal_mapa" max-width="100%">
        <DialogCloseBtn @click="cerrarModal" />
        <v-card>
            <v-card-text>
                <!-- Contenedor para el mapa dentro del modal -->
                <div ref="mapContainerModal" style="width: 100%; height: 650px"></div>
            </v-card-text>
        </v-card>
    </v-dialog>
    <VDialog v-model="modalMarcadorModal" max-width="650px">
        <VCard>
            <VCardTitle> ¿Está seguro de remover el marcador del mapa? </VCardTitle>
            <VCardActions>
                <VSpacer />
                <VBtn
                    color="error"
                    variant="outlined"
                    @click="() => (modalMarcadorModal = false)"
                    >
                    Cancelar
                </VBtn>
                <VBtn
                    color="success"
                    variant="elevated"
                    @click="confirmarEliminarMarcadorModal()"
                    >
                    Aceptar
                </VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style scoped>

.custom-button {
  background: linear-gradient(
    135deg,
    rgb(135, 38, 56) 0%,
    rgb(193, 78, 97) 100%
  ) !important;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
  height: 25px;
  border-radius: 0;
}
</style>
    