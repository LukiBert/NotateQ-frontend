<script setup lang="ts">
import { ref } from 'vue'
import { MdSearch } from '@vicons/ionicons4'
import { NInputGroup, NInput, NButton, NIcon } from 'naive-ui'

const emit = defineEmits(['search-phrase'])

const searchPhrase = ref('')

function emitSearchPhrase() {
  emit('search-phrase', searchPhrase.value)
  searchPhrase.value = ''
}
</script>

<template>
  <div class="wrapper">
    <n-input-group>
      <n-input round v-model:value="searchPhrase" @keyup.enter="emitSearchPhrase" />
      <n-button circle @click="emitSearchPhrase">
        <n-icon>
          <MdSearch />
        </n-icon>
      </n-button>
    </n-input-group>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.n-input-group {
  max-width: 500px;
}
</style>
