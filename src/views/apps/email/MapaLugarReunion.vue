<script>
import L from 'leaflet';
import { ref } from "vue";
import 'leaflet.markercluster';
import { OpenStreetMapProvider,SearchControl } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
export default {
    props: {
        lugarGuardar: {
            type: Object,
        },
    },
    data() {
        return {
            map: null,
            mapModal: null,
            selectedMarker: null,
            selectedMarkerModal: null,
            modalMarcadorModal: false,
            modal_mapa: false,
        };
    },
    methods: {
        Mapa() {
            if (this.$refs.mapContainer) {
                try {
                    if (this.map) {
                        this.map.remove();
                    }
                    if (this.selectedMarker) {
                        this.map.removeLayer(this.selectedMarker);
                    }

                    this.lugarGuardar.latitud = this.lugarGuardar.latitud !== null ? this.lugarGuardar.latitud : 19.4303; // Valor predeterminado para latitud
                    this.lugarGuardar.longitud = this.lugarGuardar.longitud !== null ? this.lugarGuardar.longitud : -99.1337;

                    this.map = L.map(this.$refs.mapContainer,{
                        zoomAnimation: false // Desactivar animaciones de zoom
                    }).setView([this.lugarGuardar.latitud,  this.lugarGuardar.longitud],13);
                    
                    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    }).addTo(this.map);

                     // Agregar evento de clic al contenedor del mapa
                    this.map.addEventListener('click', this.guardarLatitudLongitud);

                    const search = new SearchControl({
                        provider: new OpenStreetMapProvider({
                            params: {
                                bounded: true, // Limita la búsqueda dentro de los límites especificados
                                countrycodes: 'MX' // Código del país para limitar la búsqueda solo a México
                            },
                            autoCompleteDelay:  300,
                            autoClose: true,
                            style: 'bar',
                            notFoundMessage: 'Sorry, that address could not be found.',
                        })
                    });
                    this.map.addControl(search);
                    this.addMarkers();

                    const provider = new OpenStreetMapProvider();
                    // Supongamos que tienes las variables latitud y longitud
                    const latitud = 19.4303.toString();
                    const longitud = -99.1337.toString();


                    // scrip para obtener la dirrecion y la latitud
                    this.map.on('geosearch/showlocation', (e) => {
                        this.lugarGuardar.direccion  = e.location.label;
                        this.lugarGuardar.latitud = e.location.y.toFixed(4).toString();
                        this.lugarGuardar.longitud = e.location.x.toFixed(4).toString();
                        console.log("Dirección seleccionada:", this.lugarGuardar.direccion);
                    });
                } catch (error) {
                    console.error("Error al inicializar el mapa:", error);
                }
            }
        },

        guardarLatitudLongitud(evento) {

            this.lugarGuardar.latitud = evento.latlng.lat.toFixed(4).toString();;
            this.lugarGuardar.longitud = evento.latlng.lng.toFixed(4).toString();;
            this.addMarkers();
        },
        addMarkers() {
            try {
                if (this.selectedMarker) {
                    this.map.removeLayer(this.selectedMarker);
                    this.selectedMarker.off("click", this.map);
                    this.selectedMarker = null;
                 }
                this.lugarGuardar.latitud = this.lugarGuardar.latitud !== null ? this.lugarGuardar.latitud : 19.4303; // Valor predeterminado para latitud
                this.lugarGuardar.longitud = this.lugarGuardar.longitud !== null ? this.lugarGuardar.longitud : -99.1337; // Valor predeterminado para longitud

                this.selectedMarker = L.marker([this.lugarGuardar.latitud, this.lugarGuardar.longitud]).addTo(this.map);
            } catch (error) {
                console.error("Error al agregar marcadores:", error);
            }
        },
        abrirModal() {
            console.log(this.lugarGuardar)
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
                try {
                    if (this.mapModal) {
                        this.mapModal.remove();
                    }
                    if (this.selectedMarkerModal) {
                        this.mapModal.removeLayer(this.selectedMarkerModal);
                    }

                    const defaultLat = this.lugarGuardar.latitud || 19.4303; // Valor predeterminado para latitud
                    const defaultLng = this.lugarGuardar.longitud || -99.1337; // Valor predeterminado para longitud

                    this.mapModal = L.map(this.$refs.mapContainerModal, {
                        zoomAnimation: false // Desactivar animaciones de zoom
                    }).setView([defaultLat, defaultLng], 13);

                    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    }).addTo(this.mapModal);

                    const search = new GeoSearch.GeoSearchControl({
                        provider: new GeoSearch.OpenStreetMapProvider({
                            params: {
                                bounded: true, // Limita la búsqueda dentro de los límites especificados
                                countrycodes: 'MX' // Código del país para limitar la búsqueda solo a México
                            }
                        })
                    });

                    this.mapModal.addControl(search);
                    this.addMarkersModal();

                    //scrip para obtener la dirrecion y la latitud
                    this.mapModal.on('geosearch/showlocation', (e) => {
                        this.lugarGuardar.direccion  = e.location.label;
                        this.lugarGuardar.latitud = e.location.y.toFixed(4).toString();
                        this.lugarGuardar.longitud = e.location.x.toFixed(4).toString();
                        console.log("Dirección seleccionada:", this.lugarGuardar.direccion);
                    });

                } catch (error) {
                    console.error("Error al inicializar el mapa modal:", error);
                }
            }
        },
        addMarkersModal() {
            try {
                let lat = this.lugarGuardar.latitud !== null ? this.lugarGuardar.latitud : 19.4303; // Valor predeterminado para latitud
                let lng = this.lugarGuardar.longitud !== null ? this.lugarGuardar.longitud : -99.1337; // Valor predeterminado para longitud

                this.selectedMarkerModal = L.marker([
                    lat,
                    lng,
                ]).addTo(this.mapModal);
            } catch (error) {
                console.error("Error al agregar marcadores modales:", error);
            }
        },
        onClickMapaModal(e) {
            if (this.selectedMarkerModal) {
                this.modalMarkerModal();
            } else {
                try {
                    this.selectedMarkerModal = L.marker(e.latlng)
                        .addTo(this.mapModal)
                        .on("click", this.modalMarkerModal);

                    this.lugarGuardar.latitud = e.latlng.lat.toFixed(4).toString();
                    this.lugarGuardar.longitud = e.latlng.lng.toFixed(4).toString();
                    console.log(this.lugarGuardar.latitud)
                    console.log(this.lugarGuardar.longitud)
                } catch (error) {
                    console.error("Error al manejar el evento click en el mapa modal:", error);
                }
            }
        },
        modalMarkerModal() {
            this.modalMarcadorModal = true;
        },
        confirmarEliminarMarcadorModal() {
            if (this.selectedMarkerModal) {
                this.mapModal.removeLayer(this.selectedMarkerModal);
                this.selectedMarkerModal.off("click", this.modalMarkerModal);
                this.selectedMarkerModal = null;
                this.modalMarcadorModal = false;
            }
        },
        cerrarModal() {
            this.modal_mapa = false;
            this.Mapa();
        },
        updateMap() {
            this.Mapa();
        },
    },
    watch: {
        LugarGuardar() {
            this.updateMap();
        }
    },
    mounted() {
        this.Mapa();
    },
};
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
                <!-- Mostrar latitud y longitud -->
                <VCard class="map-marker-info">
                    <div>
                        <p>Latitud: {{ lugarGuardar.latitud }}</p>
                        <p>Longitud: {{ lugarGuardar.longitud }}</p>
                    </div>
                </VCard>
            </v-card-text>
        </v-card>
    </v-dialog>
    <VDialog v-model="modalMarcadorModal" max-width="650px">
        <VCard>
            <VCardTitle> ¿Está seguro de remover el marcador del mapa? </VCardTitle>
            <VCardActions>
                <VSpacer />
                <VBtn color="error" variant="outlined" @click="() => (modalMarcadorModal = false)">
                    Cancelar
                </VBtn>
                <VBtn color="success" variant="elevated" @click="confirmarEliminarMarcadorModal()">
                    Aceptar
                </VBtn>
                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style scoped>
.custom-button {
    background: linear-gradient(135deg, rgb(135, 38, 56) 0%, rgb(193, 78, 97) 100%) !important;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    margin-bottom: 20px;
    height: 25px;
    border-radius: 0;
}

.map-marker-info {
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0px 5px 8px rgb(127, 128, 129);
    max-width: 200px;
    margin: 10px auto 0 auto;
    color: rgb(0, 0, 0);

}
</style>
