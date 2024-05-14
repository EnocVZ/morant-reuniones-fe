<script>
import L from 'leaflet';
import { ref } from "vue";
import 'leaflet.markercluster';
import { watchEffect } from 'vue';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import marcadorGris from '@images/icons/file/marker-gray.png'

export default {

    setup() {
        const imgMarcador = useGenerateImageVariant(marcadorGris);

        return {
            imgMarcador,
        };
    },
    props: {
        latitud: {
            type: Number,
            default: 0,
        },

        longitud: {
            type: Number,
            default: 0,
        },
        email: {
            type: Array,
        },

        coordenadas: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            map: ref(null),
            mapContainer: ref(null),
            dialog: false,
            mapModal: ref(null),
            currentMarkerInfo: null,
        };
    },
    methods: {

        Mapa() {
            // Verifica que mapContainer.value exista
            if (this.$refs.mapContainer) {
                // Destruye el mapa si ya está inicializado
                if (this.map) {
                    this.map.remove();
                }
                // Crea el mapa
                this.map = L.map(this.$refs.mapContainer).setView(
                    [this.email.latitud, this.email.longitud],
                    13
                );
                // Agrega la capa de azulejos (tiles)
                L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(this.map);

                this.addMarkers(this.map);
            }
        },

        addMarkers(mapas) {

            if (mapas) {
                // Agrupamiento de marcadores
                let markers = L.markerClusterGroup({
                    iconCreateFunction: function (cluster) {

                        var clusterHtml = '<div class="custom-cluster">' + cluster.getChildCount() + '</div>';
                        return L.divIcon({
                            className: 'custom-cluster-icon',
                            html: clusterHtml,
                            iconSize: [30, 30], // Ajustar según sea necesario

                        });
                    }
                });
                let markerCoordinates = [];
                this.coordenadas.forEach((coordenadas) => {
                    markerCoordinates.push([coordenadas.latitud, coordenadas.longitud]);
                    let colorIcon = (coordenadas.id == this.email.id) ? 'gray' : 'blue';
                    let iconSize = (colorIcon === 'gray') ? [41, 41] : [25, 41];
                    if (coordenadas.id == this.email.id) {
                        //poner el icocno dek marcador en color gris
                        colorIcon = 'gray';
                    }

                    let marker = L.marker([
                        coordenadas.latitud,
                        coordenadas.longitud,
                    ], {
                        icon: L.icon({
                            iconUrl: (colorIcon === 'gray') ? this.imgMarcador : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                            iconSize: iconSize,
                            iconAnchor: [41, 41],
                            popupAnchor: [1, -34],
                            tooltipAnchor: [16, -28],
                        }),
                    })
                    //agregar info al marcador al hacer click
                    let info_popup = `<div>${coordenadas.contexto}</div>`;
                    marker.bindPopup(info_popup).openPopup();
                    markers.addLayer(marker);
                });

                mapas.addLayer(markers);
                // Ajustar la vista del mapa para que todos los marcadores sean visibles
                if (markerCoordinates.length > 0) {
                    let bounds = L.latLngBounds(markerCoordinates);
                    this.map.fitBounds(bounds);
                }
            }
        },

        MapaModal() {
            if (this.$refs.mapContainerModal) {

                // Crea el mapa en el contenedor del modal
                this.mapModal = L.map(this.$refs.mapContainerModal).setView(
                    [this.email.latitud, this.email.longitud],
                    13
                );

                L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(this.mapModal);

                this.addMarkers(this.mapModal);
            }
        },

        abrirModal() {
            // Abre el modal solo si no está abierto y el clic se realiza dentro del contenedor del mapa
            if (!this.dialog) {
                this.dialog = true;
                // Llamar a MapaModal cuando se abre el modal
                this.$nextTick(() => {
                    this.MapaModal();
                });
            }
        },

        cerrarModal() {
            this.mapModal.remove();
            this.mapModal = null;
            this.dialog = false;
        },

        updateMap() {
            this.Mapa();
        },

    },

    watch: {
        coordenadas() {
            this.updateMap();
        }
    },

    mounted() {
        this.Mapa();
    },
}

</script>

<template>
    <div ref="mapContainer" style="width: 100%; height: 300px;"></div>
    <div v-if="currentMarkerInfo">
        <p>{{ currentMarkerInfo }}</p>
    </div>
    <div>
        <button class="custom-button" @click="abrirModal">Ampliar mapa</button>
    </div>
    <!-- Modal -->
    <v-dialog v-model="dialog" max-width="100%">
        <DialogCloseBtn @click="cerrarModal()" />
        <v-card>
            <v-card-text>
                <!-- Contenedor para el mapa dentro del modal -->
                <div ref="mapContainerModal" style="width: 100%; height: 650px;"></div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<style>
#mapContainer {
    width: 100%;
    height: 300px;
}


.number {
    background-color: #1976d2;
    color: #ffffff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Estilos CSS para el botón dentro del mapa */
.custom-button {
    background: linear-gradient(135deg, rgb(135, 38, 56) 0%, rgb(193, 78, 97) 100%) !important;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    margin-bottom: 20px;
    height: 25px;
}

.custom-cluster-icon {
    background-color: greenyellow;
    /* Cambia el color de fondo según tus preferencias */
    border-radius: 50%;
    /* Hace que el icono sea circular */
    text-align: center;
    line-height: 33px;
    /* Ajusta según sea necesario para centrar el número verticalmente */
    color: black;
    /* Cambia el color del texto según tus preferencias */
}

.custom-cluster {
    font-size: 16px;
    /* Tamaño de fuente del número del clúster */
}

.custom-marker-tooltip {
    background-color: white;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>