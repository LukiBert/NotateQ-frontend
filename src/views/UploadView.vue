<script setup lang="ts">
import FileUploadForm from '../components/FileUploadForm.vue'
import { NModal } from 'naive-ui'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showModal = ref(true)

watch(showModal, (newVal) => {
  if (!newVal) {
    router.push({ name: 'home' })
  }
})

</script>

<template>
  <n-modal v-model:show="showModal"
           v-if="showModal"
           preset="card"
           style="width: 600px"
  >
  <FileUploadForm />
  </n-modal>
</template>
