<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CategoryHolder from './components/CategoryHolder.vue'
import FileList from './components/FileList.vue'
import FileUploadForm from './components/FileUploadForm.vue'

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  searchInput.value = receivedText
}
</script>

<template>
  <header>
    <SearchBar @search-phrase="receiveEmit" />
  </header>

  <main>
    <p>Input: {{ searchInput }}</p>
    <CategoryHolder />
    <FileList />
    <FileUploadForm />
  </main>
</template>

<style scoped>
main {
  color: black;
}

@media (min-width: 1024px) {
}
</style>
