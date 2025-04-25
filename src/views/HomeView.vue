<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'

const searchInput = ref('')
const router = useRouter()

function receiveEmit(receivedText: string) {
  if (receivedText.trim()) {
    router.push({ path: '/show', query: { q: receivedText } })
  }
}
</script>

<template>
  <SearchBar mode="manual" @search-phrase="receiveEmit" />
  <p>Input: {{ searchInput }}</p>
  <CategoryHolder />
  <FileList :show-heading="true" />
</template>
