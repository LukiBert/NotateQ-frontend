<script setup lang="ts">
import { ref } from 'vue'
import { MdSearch } from '@vicons/ionicons4'
import { NFlex, NInputGroup, NInput, NButton, NIcon } from 'naive-ui'
import { debounce } from 'lodash'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  mode?: 'dynamic' | 'manual'
}>()

const router = useRouter()
const route = useRoute()

const searchInput = ref('')

function manualSearchUpdate() {
  router.push({
    name: 'searchPage',
    query: {
      ...route.query,
      title: searchInput.value.trim(),
    },
  })
  if (props.mode === 'manual') {
    searchInput.value = ''
  }
}

function dynamicSearchUpdate() {
  if (props.mode === 'dynamic') {
    debounce(() => {
      router.replace({
        name: 'searchPage',
        query: {
          ...route.query,
          title: searchInput.value.trim(),
        },
      })
    }, 300)
  }
}
</script>

<template>
  <n-flex justify="center" class="search-flex">
    <n-input-group class="search-input-group">
      <n-input
        class="search-input"
        placeholder="Szukaj..."
        size="large"
        round
        v-model:value="searchInput"
        @update:value="dynamicSearchUpdate"
        @keyup.enter="manualSearchUpdate"
      />
      <n-button circle size="large" @click="manualSearchUpdate" class="search-button">
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
