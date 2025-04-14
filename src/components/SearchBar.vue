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
  <n-flex justify="center" class="search-flex">
    <n-input-group class="search-input-group">
      <n-input
        class="search-input"
        placeholder="Search..."
        size="large"
        round
        v-model:value="searchPhrase"
        @keyup.enter="emitSearchPhrase"
      />
      <n-button circle size="large" @click="emitSearchPhrase" class="search-button">
        <n-icon>
          <md-search />
        </n-icon>
      </n-button>
    </n-input-group>
  </n-flex>
</template>

<style scoped>
.search-flex {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.search-input-group {
  width: 100%;
  max-width: 500px;
}

.search-input {
  font-size: 1rem;
}

@media (min-width: 1024px) {
  .search-input-group {
    max-width: 1000px;
  }

  .search-input {
    font-size: 1.2rem;
    height: 52px;
  }

  .search-button {
    width: 52px;
    height: 52px;
  }
}
</style>
