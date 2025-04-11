<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { NDescriptions, NDescriptionsItem, NTime, NTag, NButton } from 'naive-ui'

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
  <div class="file-data-wrapper">
    <n-descriptions
      class="file-data"
      v-if="!loadingStatus"
      label-placement="top"
      :title="fetchedFileData.title"
      :column="3"
    >
      <n-descriptions-item label="Autor">
        {{ fetchedFileData.author }}
      </n-descriptions-item>
      <n-descriptions-item label="Dodano">
        <n-time :time="new Date(fetchedFileData.upload_date)" format="yyyy-MM-dd"></n-time>
      </n-descriptions-item>
      <n-descriptions-item label="Kategoria"> {{ fetchedFileData.category }} </n-descriptions-item>
      <n-descriptions-item label="Tagi" :span="2">
        <n-tag
          v-for="(tag, index) in fetchedFileData?.tag_names"
          :key="index"
          type="info"
          size="small"
        >
          {{ tag }}
        </n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="Pobrano">
        {{ fetchedFileData.downloads }}
      </n-descriptions-item>
      <n-descriptions-item label="Opis">
        {{ fetchedFileData.description }}
      </n-descriptions-item>
    </n-descriptions>
    <n-button type="primary" tag="a" :href="fetchedFileData?.file" target="_blank" download>
      Pobierz plik
    </n-button>
  </div>
</template>

<style scoped>
.file-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
}
.file-data {
  width: 80%;
  min-width: 300px;
}
</style>
