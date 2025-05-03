<script setup lang="ts">
import { useRoute } from 'vue-router'
import { NSelect, NDatePicker, NFlex, NInputNumber, NDynamicTags } from 'naive-ui'
import { ref, onMounted, computed, watch } from 'vue'
import { type Category, getFilesData } from '../constants'
import { FeedFilled } from '@vicons/material'

const route = useRoute()

const fetchedCategories = ref<Category[]>([])
const selectedCategories = ref([])

const timestamp = ref<[number, number]>([1183135260000, Date.now()])
const minRate = ref(0)
const maxRate = ref(5)
const tags = ref(['myTag', 'fiz2'])

const queryCategories = computed(() => {
  const raw = route.query.category
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') return [raw]
  return []
})

const categoriesWithLabels = computed(() => {
  return fetchedCategories.value.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
})
</script>

<template>
  <n-flex>
    <n-select v-model:value="selectedCategories" multiple :options="categoriesWithLabels" />
    <n-select placeholder="Sortuj"></n-select>
    <n-date-picker v-model:value="timestamp" type="daterange" clearable />
    <n-input-number
      v-model:value="minRate"
      placeholder="Min"
      :min="0"
      :max="maxRate"
      :step="0.1"
      button-placement="both"
    />
    <n-input-number
      v-model:value="maxRate"
      placeholder="Max"
      :min="minRate"
      :max="5"
      :step="0.1"
      button-placement="both"
    />
    <n-dynamic-tags v-model:value="tags" />
  </n-flex>
</template>

<style scoped>
.n-input-number {
  width: 100px;
  text-align: center;
}
</style>
