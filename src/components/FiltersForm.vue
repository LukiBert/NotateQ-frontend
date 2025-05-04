<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  NSelect,
  NDatePicker,
  NFlex,
  NInputNumber,
  NDynamicTags,
  NAutoComplete,
  NInput,
  NSwitch,
  NIcon,
} from 'naive-ui'
import { MdArrowDown, MdArrowUp } from '@vicons/ionicons4'
import { ref, onMounted, computed, watch } from 'vue'
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
    <n-dynamic-tags v-model:value="tags">
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
    <n-input-number
      v-model:value="minDownload"
      placeholder="Min"
      :min="0"
      :max="maxDownload"
      button-placement="both"
    />
    <n-input-number
      v-model:value="maxDownload"
      placeholder="Max"
      :min="minDownload"
      :max="100"
      button-placement="both"
    />
    <n-input type="text" placeholder="Autor" clearable></n-input>
  </n-flex>
</template>

<style scoped>
.n-input-number {
  width: 100px;
  text-align: center;
}
</style>
