<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const searchInput = ref('')

function receiveEmit(receivedText: string) {
  if (receivedText.trim()) {
    router.push({ name: 'searchPage', query: { title: receivedText } })
  }
}
</script>

<template>
  <header>
    <NavBar />
  </header>
  <SearchBar mode="manual" @search-phrase="receiveEmit" />
  <CategoryHolder />
  <FileList />
</template>
