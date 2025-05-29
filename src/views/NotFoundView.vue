<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult } from 'naive-ui'
import SearchBar from '@/components/SearchBar.vue'
import CategoryHolder from '@/components/CategoryHolder.vue'
import FileList from '@/components/FileList.vue'
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
  <n-result status="404" title="404 Not Found" description="Życie mnie mnie."></n-result>
</template>
