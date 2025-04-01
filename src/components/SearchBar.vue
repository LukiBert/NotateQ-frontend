<script setup lang="ts">
import { ref } from 'vue'
import { MdSearch } from '@vicons/ionicons4'
import { NFlex, NInputGroup, NInput, NButton, NIcon } from 'naive-ui'

const emit = defineEmits(['search-phrase'])

const searchPhrase = ref('')

function emitSearchPhrase() {
  emit('search-phrase', searchPhrase.value)
  searchPhrase.value = ''
}
</script>

<template>
  <n-flex justify="center">
    <n-input-group>
      <n-input round size="large" v-model:value="searchPhrase" @keyup.enter="emitSearchPhrase" />
      <n-button circle size="large" @click="emitSearchPhrase">
        <n-icon>
          <md-search />
        </n-icon>
      </n-button>
    </n-input-group>
  </n-flex>
</template>

<style scoped>
.n-input-group {
  max-width: 500px;
}
.n-flex {
  margin: 0 0.5rem 1rem 0.5rem;
}
</style>
