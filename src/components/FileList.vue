<script setup lang="ts">
import FileDescriptor from './FileDescriptor.vue'
</script>

<template>
  <div class="wrapper">
    <p>Proponowne dokumenty</p>
    <FileDescriptor v-for="n in 5" />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
