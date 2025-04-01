<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CategoryHolder from './components/CategoryHolder.vue'
import FileDescriptor from './components/FileDescriptor.vue'

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  searchInput.value = receivedText
}
</script>

<template>
  <SearchBar @search-phrase="receiveEmit" />

  <main>
    <CategoryHolder />
    <FileDescriptor />
    <p>Input: {{ searchInput }}</p>
  </main>
</template>

<style scoped>
main {
  color: black;
}
.CategoryHolder {
  margin-top: 5rem;
}
</style>
