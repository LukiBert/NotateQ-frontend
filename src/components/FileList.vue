<script setup lang="ts">
import FileDescriptor from './FileDescriptor.vue'
</script>

<template>
  <div class="wrapper">
    <p class="heading">Proponowane dokumenty</p>
    <div class="file-list">
      <FileDescriptor v-for="n in 5" :key="n" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
}

.heading {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* Desktop view */
@media (min-width: 1024px) {
  .file-list {
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }
}
</style>
