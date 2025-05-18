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
} from 'naive-ui'
import {
  type Category,
  type Tag,
  type Filters,
  getAllCategories,
  getTags,
  formatDate,
} from '../constants'
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { convertCompilerOptionsFromJson } from 'typescript'

const router = useRouter()
const route = useRoute()

const inputValue = ref('')
const fetchedTags = ref<Tag[]>([])
const fetchedCategories = ref<Category[]>([])

const timestamp = ref<[number, number]>([1183135280000, Date.now()])
const author = ref('')
const downloadsMin = ref(0)
const downloadsMax = ref(100)
const category = ref([])
const ratingMin = ref(0)
const ratingMax = ref(5)
const tags = ref([])

const tagOptions = computed(() => {
  return fetchedTags.value.map((tag) => tag.name)
})

const categoriesWithLabels = computed(() => {
  return fetchedCategories.value.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
})

function applyFilters() {
  const [start, end] = timestamp.value ?? [null, null]

  const filtersObject: Filters = {
    author: author.value,
    downloads_min: downloadsMin.value,
    downloads_max: downloadsMax.value,
    upload_date_after: start ? formatDate(start) : '',
    upload_date_before: end ? formatDate(end) : '',
    category: category.value,
    rating_min: ratingMin.value,
    rating_max: ratingMax.value,
    tags: tags.value,
  }

  const filtersToQuery: Record<string, string | string[]> = {}

  //console.log(timestamp.value)
  Object.entries(filtersObject).forEach(([key, value]) => {
    //console.log(`${key}: ${value}`)
    if (value !== undefined && value !== null && value != '') {
      if (Array.isArray(value)) {
        filtersToQuery[key] = value.map((v) => String(v))
      } else {
        filtersToQuery[key] = String(value)
      }
    }
  })

  router.replace({ name: 'searchPage', query: { title: route.query.title, ...filtersToQuery } })
}

onMounted(async () => {
  fetchedTags.value = await getTags()
  fetchedCategories.value = await getAllCategories()
})
</script>

<template>
  <div class="filters-wrapper">
    <n-input-group>
      <n-input-group-label>Data dodania</n-input-group-label>
      <n-date-picker v-model:value="timestamp" type="daterange" clearable />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Ocena</n-input-group-label>
      <n-input-group-label>min</n-input-group-label>
      <n-input-number
        v-model:value="ratingMin"
        placeholder="Min"
        :min="0"
        :max="ratingMax"
        :step="0.1"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="ratingMax"
        placeholder="Max"
        :min="ratingMin"
        :max="5"
        :step="0.1"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Pobrania</n-input-group-label>
      <n-input-group-label>min</n-input-group-label>
      <n-input-number
        v-model:value="downloadsMin"
        placeholder="Min"
        :min="0"
        :max="downloadsMax"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="downloadsMax"
        placeholder="Max"
        :min="downloadsMin"
        :max="100"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Kategorie</n-input-group-label>
      <n-select v-model:value="category" multiple :options="categoriesWithLabels" />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Autor</n-input-group-label>
      <n-input v-model:value="author" type="text" placeholder="Autor" clearable></n-input>
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Sortowanie według</n-input-group-label>
      <n-select placeholder="Sortuj"></n-select>
    </n-input-group>

    <n-input-group>
      <n-input-group-label style="margin-right: 0.5rem">Tagi</n-input-group-label>
      <n-dynamic-tags v-model:value="tags" :max="5" style="align-items: center">
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

    <n-button type="primary" @click="applyFilters">Filtruj</n-button>
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

.n-button {
  justify-self: center;
}

@media (min-width: 1024px) {
  .filters-wrapper {
    grid-template-columns: auto auto;
    justify-content: center;
  }

  .n-button {
    grid-column: span 2;
  }
}
</style>
