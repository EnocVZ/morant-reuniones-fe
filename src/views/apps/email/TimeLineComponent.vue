<script>
import 'chartjs-adapter-date-fns';
import { startOfDay } from 'date-fns';
import { Bar,Line   } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale,PointElement,LineElement, BarElement, Title, Tooltip, Legend,TimeScale)

export default{
    components: {Line},
    data(){
      return{
        chartLoad:false,
        dateRange: "",
        horaInicio:"",
        horafin:"",
        data: {
          labels: [],
          datasets: []
        },
        options:{ },
        // AcontecimientosVinculados:[
        //   // { id:1,
        //   //   titulo:"prueba1",
        //   //   fechaHora:'2023-10-13T17:00:00',
        //   //   nombreMunicipio:"Rayon", 
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   // },
        //   // {
        //   //   id:2,
        //   //   titulo:"prueba2",
        //   //   fechaHora:'2023-10-13T18:00:00',
        //   //   nombreMunicipio:"Tapilla",
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."
        //   // },
        //   // {
        //   //   id:1,
        //   //   titulo:"prueba4",
        //   //   fechaHora:'2023-10-13T16:00:00',
        //   //   nombreMunicipio:"Rayon",
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   // },
        //   // {
        //   //   id:2,
        //   //   titulo:"prueba3",
        //   //   fechaHora:'2023-10-14T10:00:00',
        //   //   nombreMunicipio:"Pueblo nuevo",
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   // },
       
        //   {
        //     id:1,
        //     titulo:"prueba5",
        //     fechaHora:'2023-10-13T16:40:00',
        //     nombreMunicipio:"Rayon",
        //     ubicacion:"centro",
        //     color:"#03B63B",
        //     contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   },
        //   {
        //     id:1,
        //     titulo:"prueba6",
        //     fechaHora:'2023-10-14T22:30:00',
        //     nombreMunicipio:"Rayon",
        //     ubicacion:"centro",
        //     color:"#03B63B",
        //     contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   },
        //   // {
        //   //   id:1,
        //   //   titulo:"prueba7",
        //   //   fechaHora:'2023-10-15T22:00:00',
        //   //   nombreMunicipio:"Rayon",
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   // },         
        //   // {
        //   //   id:1,
        //   //   titulo:"prueba7",
        //   //   fechaHora:'2023-11-15T10:00:00',
        //   //   nombreMunicipio:"Rayon",
        //   //   ubicacion:"centro",
        //   //   color:"#03B63B",
        //   //   contexto:"Pobladores de “La Marquesa” armados con palos agredieron a jóvenes de una camioneta gris y comenzaron una discusión para después enfrascarse a golpes. Se desconoce la gravedad de sus heridas, pero se han difundido videos de lo sucedido a redes sociales."

        //   // },


        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-10-24T22:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },          {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-10-28T22:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-10-15T10:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-10-11T12:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },    
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-09-11T13:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },    
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-09-11T14:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },   
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-09-11T14:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#03B63B"
        // //   },
        // //   {
        // //     id:1,
        // //     titulo:"prueba2",
        // //     fechaHora:'2023-09-13T14:00:00',
        // //     nombreMunicipio:"Rayon",
        // //     ubicacion:"centro",
        // //     color:"#FDD835"
        // //   }
          
        // ]
      }

    },
    props:{
        AcontecimientosVinculados:{
            type:Object, 
        }
    },
     
    methods:{

        formatDateFromDatabase(date) {
          const options = { day: "numeric", month: "long", year: "numeric" };
          return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
        },

        formatDateFromDatabaseHora(date) {
          const options = { hour: "numeric", minute: "numeric", hour12: true };
          return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
        },

        actualizarDatosChar(datas) {
          //si selecionoa un rango de fecha entra aqui
          if(this.startDay!=null && this.endDay!=null && this.dateRange!=""){
            var startDay = this.startDay;
            var endDay = this.endDay;
          }
          else{
            //por defecto entra aqui graficando los 30 dias del mes mas antiguo
            // Encuentra la fecha más antigua en AcontecimientosVinculados
            var minDate = new Date(Math.min(...datas.map(evento => new Date(evento.fechaHora))));
            var MaxDate = new Date(Math.max(...datas.map(evento=>new Date(evento.fechaHora))))
            
            // Inicializa el rango de fechas desde el primer día del mes más antiguo
            var startDay = new Date(minDate);
            // startDay.setHours(0, 0, 0, 0); //Establece las horas  en 00:00:00, al inicio del día.
            // startDay.setDate(1); //configurar al el primer día del mes
            
            // Calcula el último día del mes más antiguo
            var endDay = new Date(MaxDate);
            // endDay.setMonth(endDay.getMonth() + 1);
            // endDay.setDate(0);
          }
           
          // Crea un array con todas las fechas en el rango
          const allDates = [];
          let diaActual = new Date(startDay);
          while (diaActual <= endDay) {
            allDates.push(new Date(diaActual));
            diaActual.setDate(diaActual.getDate() + 1);
          }
          // fechas en eje X
          const labels = allDates.map(eventDate => eventDate.toISOString());
          // array para almacenar  datos eb dataset
          const datasets = [];
          //array para almacenar las fechas con eventos
          const eventDates = [];
          // Asigna los valores de los eventos a las fechas correspondientes
          datas.forEach(evento => {
            const eventoDate = new Date(evento.fechaHora);
            const eventoDateTruncated = startOfDay(eventoDate);
            // Comparar la fecha truncada con las fechas en labels
            const dateIndex = labels.findIndex(date => {
                // Truncar la fecha de labels a la precisión de "día"
                const labelDate = startOfDay(new Date(date));
                // Comparar las fechas truncadas
                return labelDate.getTime() === eventoDateTruncated.getTime();
            });
            const horaExacta = 5;

            if(dateIndex !== -1){

              const fecha =this.formatDateFromDatabase(evento.fechaHora) ;
              const fechaHora =this.formatDateFromDatabaseHora(evento.fechaHora);
              datasets.push({
                label: ` ${evento.titulo}`,
                backgroundColor: ` ${evento.color}`,
                hoverRadius: 10, // Tamaño del punto al pasar el mouse
                borderColor: ` ${evento.color}`,
                borderWidth: 7,
                fill:false,
                data: [{
                    x: eventoDate,
                    y: horaExacta
                }],
                municipio: evento.nombreMunicipio,
                ubicacion: evento.ubicacion,
                titulo:evento.titulo,
                fecha :fecha+" "+fechaHora,
                contexto:evento.contexto
              });
            }
            // Agrega la fecha al array de fechas con eventos si no se ha agregado previamente
            if (!eventDates.some(date => date === eventoDate)) {
                eventDates.push(eventoDate);
            }
          }); 


          // const eventDatesTruncated = eventDates.map(date => startOfDay(new Date(date)));
          // // Crear las etiquetas solo para las fechas con eventos
          // const labels2 = allDates.map(date => {
          //     // Truncar la fecha de allDates a la precisión de "día"
          //     const dateTruncated = startOfDay(date);
          //     // Verificar si la fecha truncada está presente en las fechas truncadas de los eventos
          //     return eventDatesTruncated.some(eventDate => eventDate.getTime() === dateTruncated.getTime())
          //         ? date.toISOString()
          //         : '';
          // });
 
          return {labels: labels,datasets: datasets};

        },
          // Función para obtener el nombre abreviado del mes
         getShortMonthName(monthNumber) {
            const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
            return monthNames[monthNumber - 1];
        },

        graficarEventos() {
          const chartData  = this.actualizarDatosChar(this.AcontecimientosVinculados);
          // Actualizar las variables data y options con los nuevos valores
          this.data = chartData 
          this.options = this.OptionsChart();
          this.chartLoad=true;
        },

        //configuracion del option del chart
         OptionsChart() {
          return {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                display:false,
                beginAtZero: true,
                max:24,
                ticks: {
                  stepSize: 1
                }
              },
              x:{
                grid:{
                  display:false
                },
                type: 'time',
                // ticks: {
                //   callback: function(val, index) {
               

                //     return 'val';
                    
                //   }
                // }   
              }
            },
            plugins:{
              legend: {display: false},
              tooltip: {
                  enabled: false,
                  external: this.tooltipPersonalizado,
              },
            },
            interaction: {
                mode: 'nearest', // Permite que se muestren los tooltips de varios puntos
                intersect: false, // Permite que el hover funcione independientemente de la intersección con otros elementos del gráfico
            },
            hover: {
                mode: 'nearest', // Muestra el tooltip del punto más cercano
                intersect: false, // Permite que el hover funcione independientemente de la intersección con otros elementos del gráfico
                animationDuration: 0, // Desactiva la animación del hover
            }
          };
        },

        tooltipPersonalizado(context) {
          // Obtén el elemento del DOM donde se mostrará el tooltip
          let tooltipEl = document.getElementById('my-custom-tooltip');

          // Crea el elemento si no existe
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'my-custom-tooltip';
            tooltipEl.innerHTML = '<p class="custom-tooltip-title"></p><p class="custom-tooltip-body"></p>';
            document.body.appendChild(tooltipEl);
          }
            // Obtiene el modelo del tooltip
          const tooltipModel = context.tooltip;
          // Si el tooltip está vacío, oculta el elemento
          if(tooltipModel.opacity ===  0) {
            tooltipEl.style.opacity =  0;
            return;
          }

          const dataPoint = tooltipModel.dataPoints[0];
          const dataset = dataPoint.dataset;
          // Si hay datos en el dataset
          if (dataset) {
            const evento = dataset; // Reemplaza 'evento' con el nombre correcto del campo que contiene los datos
            if (evento) {
              // Obtener los valores específicos que deseas mostrar en el tooltip
              const titulo    = evento.titulo;
              const contexto  = evento.contexto;
              const municipio = evento.municipio;
              const ubicacion = evento.ubicacion;
              const fecha     = evento.fecha
 
              // Asignar los valores al tooltip
              // tooltipEl.getElementsByClassName('custom-tooltip-title')[0].innerHTML = `<p><strong>Titulo:</strong> ${titulo}</p>`;
              tooltipEl.getElementsByClassName('custom-tooltip-body')[0].innerHTML = `
                <p class="letra_tool"><strong>Contenido:</strong> ${contexto}</p>
                <p class="letra_tool"><strong>Fecha:</strong> ${fecha}</p>
                <p class="letra_tool"><strong>Municipio:</strong> ${municipio}</p>
                <p class="letra_tool"><strong>Ubicación:</strong> ${ubicacion}</p>
              `;
            }
          }
          // Posiciona y muestra el tooltip personalizado
          const position = context.chart.canvas.getBoundingClientRect();
          const tooltipX = position.left + window.pageXOffset;
          const tooltipY = position.top + window.pageYOffset + 100;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = `${tooltipX}px`;
          tooltipEl.style.top = `${tooltipY}px`;
          tooltipEl.style.width = `${position.width}px`; // Ajusta el ancho al ancho de la línea de tiempo
          tooltipEl.style.pointerEvents = 'none'; // Para que el tooltip no interfiera con los eventos del gráfico
        },

        //cacha el valor del rango de fechas
        valorDateRange(event) {  
          const newDateRange = event.target.value;
          this.dateRange = newDateRange.split("to");
          this.startDay = new Date(this.dateRange[0])
          this.endDay = new Date(this.dateRange[1])

          //si endDay no existe , toma el misma valor que el startDay
          if (isNaN(this.endDay.getTime()) ) {
            this.startDay.setDate(this.startDay.getDate()+1);
            this.endDay = this.startDay;
          }

          // Llamar a graficarEventos solo si endDay es una fecha válida
          if (!isNaN(this.endDay.getTime())) {
              this.graficarEventos();
          }
        },

        limpiarFiltro() {
          this.dateRange = "";
          this.graficarEventos();
        },

    }, 

    watch:{
        AcontecimientosVinculados(newData) {
          if (newData) {
            this.dateRange = "";
            this.graficarEventos();
          }
        },
    },

    mounted() {
        // this.renderTimeline();
      this.graficarEventos();
    },
    
    
}
</script>

<template>
    <!-- <div v-if="Object.keys(AcontecimientosVinculados).length > 0" id="timeline-container" style="height: 500px;margin-bottom: 25px;"></div> -->
    <v-app>
    <v-container>
      <v-row>
        <v-col cols="4">
          <label >Filtrar por rango de fechas</label>
          <AppDateTimePicker
          v-model="dateRange"
          @input="valorDateRange"
          placeholder="Selececione un rango de fecha"
          :config="{ mode:'range' }"
        />
      
        </v-col>
        <VCol cols="4">
          <VBtn class="mt-6" :onclick="() => limpiarFiltro()"  style="background: linear-gradient(135deg, rgb(130, 37, 54) 0%, rgb(193, 78, 97) 100%) !important;">
            <VIcon class="tabler-eraser mx-1" />
            Limpiar
          </VBtn>
        </VCol>
        <!-- <v-col cols="3">
          <label for="hora">hora inicio</label>
          <AppDateTimePicker
          
          v-model="horaInicio"
          placeholder="Select time"
          :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
          />
        </v-col >
        <v-col cols="3">
          <label for="hora">hora fin</label>
          <AppDateTimePicker
        
          v-model="horafin"
          placeholder="Select time"
          :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
          />
        </v-col >
        <v-col cols="2">
          <VBtn @click="botonAplicar">Aplicar</VBtn>
        </v-col> -->
        
      </v-row>
      <v-row>
        <v-col>
            <Line v-if="chartLoad" :options="options" :data="data" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style>
#my-custom-tooltip{
  position: absolute;
  pointer-events: none;
  background: rgba(176, 173, 173, 0.8);
  color: rgb(5, 0, 0);
  padding:  5px;
  border-radius:  4px;
  font-size:  12px;
  z-index:  1000; /* Asegúrate de que esté por encima de otros elementos */
  width: 20%;
}
.letra_tool{
  font-size: 15px;
  text-align: justify;
}
</style>
