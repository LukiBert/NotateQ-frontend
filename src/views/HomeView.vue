<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'

const route = useRoute()
const router = useRouter()

function receiveEmit(receivedText: string) {
  if (receivedText) {
    router.push({ name: 'searchPage', query: { ...route.query, title: receivedText.trim() } })
  }
}
</script>

<template>
  <SearchBar mode="manual" @manual-search="receiveEmit" />
  <CategoryHolder />
  <FileList />
</template>
