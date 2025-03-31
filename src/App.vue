<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  searchInput.value = receivedText
}
</script>

<template>
  <SearchBar @search-phrase="receiveEmit" />

  <main>
    <p>Input: {{ searchInput }}</p>
    <div id="categories"></div>
  </main>
</template>

<style scoped>
main {
  color: black;
}
</style>
