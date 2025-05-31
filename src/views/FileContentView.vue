<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type FileData } from '@/constants'
import { getFileDataById } from '@/constants/requests'
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
    fetchedFile.value = await getFileDataById(id)
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
