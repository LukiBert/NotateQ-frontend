<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import FilePage from '../components/FilePage.vue'
import { API_URL, type FileData } from '../constants'

const route = useRoute()

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
    errorMessage.value = err.toString()
  } finally {
    loadingStatus.value = false
  }
}
</script>

<template>
  <FilePage
    v-if="fetchedFile"
    :file-data="fetchedFile"
    :loading="loadingStatus"
  />
</template>
