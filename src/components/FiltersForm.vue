<script setup lang="ts">
import {
  NSelect,
  NDatePicker,
  NFlex,
  NInputNumber,
  NDynamicTags,
  NAutoComplete,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NButton,
} from 'naive-ui'
import { ref, onMounted, computed } from 'vue'
import { type Category, type Tag, getAllCategories, getTags } from '../constants'

const fetchedCategories = ref<Category[]>([])
const selectedCategories = ref([])

const timestamp = ref<[number, number]>([1183135260000, Date.now()])

const minRate = ref(0)
const maxRate = ref(5)

const minDownload = ref(0)
const maxDownload = ref(100)

const fetchedTags = ref<Tag[]>([])
const tags = ref(['fiz', 'mat'])

const inputValue = ref('')
const options = computed(() => {
  return fetchedTags.value.map((tag) => tag.name)
})

const categoriesWithLabels = computed(() => {
  return fetchedCategories.value.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
})

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
        v-model:value="minRate"
        placeholder="Min"
        :min="0"
        :max="maxRate"
        :step="0.1"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="maxRate"
        placeholder="Max"
        :min="minRate"
        :max="5"
        :step="0.1"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Pobrania</n-input-group-label>
      <n-input-group-label>min</n-input-group-label>
      <n-input-number
        v-model:value="minDownload"
        placeholder="Min"
        :min="0"
        :max="maxDownload"
        button-placement="both"
      />
      <n-input-group-label>max</n-input-group-label>
      <n-input-number
        v-model:value="maxDownload"
        placeholder="Max"
        :min="minDownload"
        :max="100"
        button-placement="both"
      />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Kategorie</n-input-group-label>
      <n-select v-model:value="selectedCategories" multiple :options="categoriesWithLabels" />
    </n-input-group>

    <n-input-group>
      <n-input-group-label>Autor</n-input-group-label>
      <n-input type="text" placeholder="Autor" clearable></n-input>
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
            :options="options"
            placeholder="Tags"
            :clear-after-select="true"
            @select="submit($event)"
            @blur="deactivate"
          />
        </template>
      </n-dynamic-tags>
    </n-input-group>

    <n-button type="primary">Filtruj</n-button>
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
