<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CategoryHolder from './components/CategoryHolder.vue'

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  searchInput.value = receivedText
}
</script>

<template>
  <SearchBar @search-phrase="receiveEmit" />

  <main>
    <p>Input: {{ searchInput }}</p>
    <CategoryHolder />
  </main>
</template>

<style scoped>
main {
  color: black;
}
</style>
