<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTime, NTag, NButton, NSkeleton } from 'naive-ui'

defineProps(['fileData', 'loading'])
</script>

<template>
  <div class="file-data-wrapper">
    <n-descriptions v-if="loading" class="file-data" label-placement="top" :column="3">
      <n-descriptions-item label="Autor">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Dodano">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Kategoria">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Tagi" :span="2">
        <n-skeleton text width="60%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Pobrano">
        <n-skeleton text width="20%"></n-skeleton>
      </n-descriptions-item>

      <n-descriptions-item label="Opis">
        <n-skeleton text :repeat="3" width="80%"></n-skeleton>
      </n-descriptions-item>
    </n-descriptions>

    <n-descriptions
      v-else
      class="file-data"
      label-placement="top"
      :title="fileData.title"
      :column="3"
    >
      <n-descriptions-item label="Autor">{{ fileData.author }} </n-descriptions-item>

      <n-descriptions-item label="Dodano">
        <n-time :time="new Date(fileData.upload_date)" format="yyyy-MM-dd"></n-time>
      </n-descriptions-item>

      <n-descriptions-item label="Kategoria"> {{ fileData.category }} </n-descriptions-item>

      <n-descriptions-item label="Tagi" :span="2">
        <n-tag v-for="(tag, index) in fileData?.tag_names" :key="index" type="info" size="small">
          {{ tag }}
        </n-tag>
      </n-descriptions-item>

      <n-descriptions-item label="Pobrano">{{ fileData.downloads }} </n-descriptions-item>

      <n-descriptions-item label="Opis">{{ fileData.description }} </n-descriptions-item>
    </n-descriptions>

    <n-button type="primary" @click="console.log(`Pobieram ${fileData?.file}`)">
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
