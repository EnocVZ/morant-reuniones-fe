<!-- Elemento.vue -->
<template>
    <div class="elemento">
        {{ elemento.texto }}
    </div>
</template>

<script>
export default {
    props: ['elemento'],
};
</script>

<style scoped>
.elemento {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 5px;
    cursor: move;
}
</style>
