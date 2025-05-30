<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_URL, type FileData } from '@/constants'
import FilePage from '@/components/FilePage.vue'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const loadingStatus = ref(false)
const fetchedFile = ref<FileData>()
const errorMessage = ref(null)

watch(() => Number(route.params.id), fetchFileData, { immediate: true })

async function fetchFileData(id: number) {
  errorMessage.value = null
  loadingStatus.value = true

  try {
    const res = await axios.get(`${API_URL}api/files/${id}`)
    // console.log(res.data)
    fetchedFile.value = res.data
  } catch (err: any) {
    console.error('Error loading files: ', err)
    router.push({ name: 'notFound' })
  } finally {
    loadingStatus.value = false
    console.log(fetchedFile.value)
  }
}
</script>

<template>
  <NavBar />
  <FilePage v-if="fetchedFile" :file-data="fetchedFile" :loading="loadingStatus" />
</template>
