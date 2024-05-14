import { defineStore } from 'pinia'


export const useReunionesStore = defineStore('Reuniones', {
    state: () => ({
        MinutaData: [],
        ParticipantesData: []
    }),
    actions: {
        setMinutaData(data){
            this.$state.MinutaData = data
        },
        setParData(data) {
            this.$state.ParticipantesData = data;
        }
    }
})