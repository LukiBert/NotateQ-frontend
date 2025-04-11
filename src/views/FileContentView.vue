<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import FileContent from '../components/FileContent.vue'

const route = useRoute()

const loadingStatus = ref(false)
const fetchedFileData = ref(null)
const errorMessage = ref(null)

watch(() => route.params.id, fetchFileData, { immediate: true })

async function fetchFileData(id) {
  errorMessage.value = fetchedFileData.value = null
  loadingStatus.value = true

  try {
    const res = await axios.get(`http://20.26.121.115:8000/api/files/${id}`)
    console.log(res.data)
    fetchedFileData.value = res.data
  } catch (err) {
    errorMessage.value = err.toString()
  } finally {
    loadingStatus.value = false
  }
}
</script>

<template>
  <FileContent :file-data="fetchedFileData" :loading="loadingStatus" />
</template>
