<script setup lang="ts">
import {
  NSelect,
  NDatePicker,
  NInputNumber,
  NDynamicTags,
  NAutoComplete,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NButton,
  NFlex,
} from 'naive-ui'
import { type Category, type Tag, type Filters, type SortOption, formatDate } from '@/constants'
import { getTags, getAllCategories } from '@/constants/requests'
import { addCategoryLabels } from '@/constants'
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['sort-option-change'])

const router = useRouter()
const route = useRoute()

const inputValue = ref('')
const fetchedTags = ref<Tag[]>([])
const fetchedCategories = ref<Category[]>([])

const filtersObj = reactive({
  timestamp: null as [number, number] | null,
  author: '',
  downloadsMin: 0,
  downloadsMax: 100,
  category: [] as number[],
  ratingMin: 0,
  ratingMax: 5,
  tags: [] as string[],
})

const sortOption = ref<SortOption | null>()

const tagOptions = computed(() => {
  return fetchedTags.value.map((tag) => tag.name)
})

const categoriesWithLabels = computed(() => {
  return addCategoryLabels(fetchedCategories.value)
})

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Pobrania: najmniej', value: 'downloads_asc' },
  { label: 'Pobrania: najwięcej', value: 'downloads_desc' },
  { label: 'Ocena: najniższa', value: 'rating_asc' },
  { label: 'Ocena: najwyższa', value: 'rating_desc' },
  { label: 'Data: najstarsze', value: 'date_asc' },
  { label: 'Data: najnowsze', value: 'date_desc' },
]

function applyFilters() {
  const { timestamp, author, downloadsMin, downloadsMax, category, ratingMin, ratingMax, tags } =
    filtersObj
  const [start, end] = timestamp ?? [null, null]

  const refToFilters: Filters = {
    author,
    downloads_min: downloadsMin,
    downloads_max: downloadsMax,
    upload_date_after: start ? formatDate(start) : '',
    upload_date_before: end ? formatDate(end) : '',
    category,
    rating_min: ratingMin,
    rating_max: ratingMax,
    tags,
  }

  const filtersToQuery: Record<string, string | string[]> = {}

  //console.log(timestamp.value)
  for (const [key, value] of Object.entries(refToFilters)) {
    //console.log(`${key}: ${value}`)
    if (value != null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      filtersToQuery[key] = Array.isArray(value) ? value.map(String) : String(value)
    }
  }

  router.replace({ name: 'searchPage', query: { title: route.query.title, ...filtersToQuery } })
}

function resetFilters() {
  filtersObj.timestamp = null
  filtersObj.author = ''
  filtersObj.downloadsMin = 0
  filtersObj.downloadsMax = 100
  filtersObj.category = []
  filtersObj.ratingMin = 0
  filtersObj.ratingMax = 5
  filtersObj.tags = []

  router.replace({ name: 'searchPage', query: {} })
}

onMounted(async () => {
  fetchedTags.value = await getTags()
  fetchedCategories.value = await getAllCategories()

  if (route.query) {
    filtersObj.author = (route.query.author as string) || ''
    filtersObj.downloadsMin = Number(route.query.downloads_min) || 0
    filtersObj.downloadsMax = Number(route.query.downloads_max) || 100
    filtersObj.ratingMin = Number(route.query.rating_min) || 0
    filtersObj.ratingMax = Number(route.query.rating_max) || 5

    filtersObj.category = Array.isArray(route.query.category)
      ? route.query.category.map(Number).filter((n) => !isNaN(n))
      : route.query.category
        ? [Number(route.query.category)].filter((n) => !isNaN(n))
        : []

    const rawTags = route.query.tags
    filtersObj.tags = Array.isArray(rawTags)
      ? rawTags.filter((tag): tag is string => typeof tag === 'string')
      : typeof rawTags === 'string'
        ? [rawTags]
        : []

    const after = route.query.upload_date_after as string
    const before = route.query.upload_date_before as string
    if (after && before) {
      const startDate = new Date(after).getTime()
      const endDate = new Date(before).getTime()
      if (!isNaN(startDate) && !isNaN(endDate)) {
        filtersObj.timestamp = [startDate, endDate]
      }
    }
  }
})
</script>

<template>
  <div class="filters-wrapper">
    <n-input-group>
      <n-input-group-label>Data dodania</n-input-group-label>
      <n-date-picker v-model:value="filtersObj.timestamp" type="daterange" clearable />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Ocena</n-input-group-label>
      <n-input-group-label>min</n-input-group-label>
      <n-input-number
        v-model:value="filtersObj.ratingMin"
        placeholder="Min"
        :min="0"
        :max="filtersObj.ratingMax"
        :step="0.1"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="filtersObj.ratingMax"
        placeholder="Max"
        :min="filtersObj.ratingMin"
        :max="5"
        :step="0.1"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Pobrania</n-input-group-label>
      <n-input-group-label>min</n-input-group-label>
      <n-input-number
        v-model:value="filtersObj.downloadsMin"
        placeholder="Min"
        :min="0"
        :max="filtersObj.downloadsMax"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="filtersObj.downloadsMax"
        placeholder="Max"
        :min="filtersObj.downloadsMin"
        :max="100"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Kategorie</n-input-group-label>
      <n-select v-model:value="filtersObj.category" multiple :options="categoriesWithLabels" />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Autor</n-input-group-label>
      <n-input
        v-model:value="filtersObj.author"
        type="text"
        placeholder="Autor"
        clearable
      ></n-input>
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Sortowanie według</n-input-group-label>
      <n-select
        placeholder="Sortuj"
        :options="sortOptions"
        :value="sortOption"
        @update:value="(val) => emit('sort-option-change', val)"
        clearable
      ></n-select>
    </n-input-group>

    <n-input-group>
      <n-input-group-label style="margin-right: 0.5rem">Tagi</n-input-group-label>
      <n-dynamic-tags v-model:value="filtersObj.tags" :max="5" style="align-items: center">
        <template #input="{ submit, deactivate }">
          <n-auto-complete
            ref="autoCompleteInstRef"
            v-model:value="inputValue"
            :options="tagOptions"
            placeholder="Tags"
            :clear-after-select="true"
            @select="submit($event)"
            @blur="deactivate"
          />
        </template>
      </n-dynamic-tags>
    </n-input-group>

    <n-flex
      ><n-button type="primary" @click="applyFilters">Filtruj</n-button>
      <n-button type="error" @click="resetFilters">Wyczyść filtry</n-button>
    </n-flex>
  </div>
</template>

<style scoped>
.filters-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px 20px;
  width: 100%;
  padding: 1rem 1rem;
  background-color: white;
  box-sizing: border-box;
  justify-content: center;
}

.n-input-number {
  width: 100px;
  text-align: center;
}

.n-input-group {
  width: 100%;
  max-width: 350px;
  justify-self: center;
}

.n-flex {
  justify-self: center;
}

@media (min-width: 1024px) {
  .filters-wrapper {
    grid-template-columns: auto auto;
    justify-content: center;
  }

  .n-flex {
    grid-column: span 2;
  }
}
</style>
