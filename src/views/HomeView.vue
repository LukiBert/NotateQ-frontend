<script setup lang="ts">
import { useRouter } from 'vue-router'

import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

function receiveEmit(receivedText: string) {
  if (receivedText.trim()) {
    router.push({ name: 'searchPage', query: { title: receivedText } })
  }
}
</script>

<template>
  <NavBar />
  <SearchBar mode="manual" @search-phrase="receiveEmit" />
  <CategoryHolder />
  <div id="text-holder">Najnowsze udostępnione dokumenty</div>
  <FileList />
</template>

<style scoped>
#text-holder {
  margin: 10px auto;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: rgb(24, 160, 88);
}
</style>
