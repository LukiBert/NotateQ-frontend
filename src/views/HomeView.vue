<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  searchInput.value = receivedText
}
</script>

<template>
  <SearchBar @search-phrase="receiveEmit" />
  <p>Input: {{ searchInput }}</p>
  <CategoryHolder />
  <FileList :show-heading="true" />
</template>
