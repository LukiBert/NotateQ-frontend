<script setup lang="ts">
import { MdFolderOpen } from '@vicons/ionicons4'
import { NIcon, NCard } from 'naive-ui'
import { useRouter } from 'vue-router'
import { type FileData, getCategoryMap } from '../constants'
import { computed, onMounted, ref } from 'vue'

const { file } = defineProps<{
  file: FileData
}>()

const router = useRouter()

function navToFilePage() {
  router.push({ name: 'filePage', params: { id: file.id } })
}

const categoryMap = ref<Record<number, string>>({})

onMounted(async () => {
  categoryMap.value = await getCategoryMap()
})

const categoryName = computed(() => {
  return categoryMap.value[props.file.category as unknown as number] || 'Nieznana kategoria'
})

</script>

<template>
  <div class="file-wrapper">
    <n-card hoverable class="responsive-card" @click="navToFilePage">
      <div class="custom-card">
        <n-icon size="32" :component="MdFolderOpen" class="icon" />

        <div class="card-content">
          <h3 class="card-title">{{ file.title }}</h3>
          <h5 class="card-description">
            {{ categoryName }}
            <span class="size-info">{{ file.downloads }}</span>
          </h5>
          <h5 class="card-author">{{ file.author }}</h5>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.file-wrapper {
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.responsive-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.responsive-card:hover {
  transform: scale(1.02);
}

.custom-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-content {
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.card-description {
  margin: 4px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.size-info {
  font-size: 13px;
  color: #888;
}

.card-author {
  font-size: 13px;
  margin: 0;
}

/* Tablet */
@media (min-width: 768px) {
  .file-wrapper {
    max-width: 700px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-description {
    font-size: 15px;
  }

  .size-info,
  .card-author {
    font-size: 14px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .file-wrapper {
    max-width: 900px;
  }

  .icon {
    font-size: 36px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 16px;
  }

  .size-info,
  .card-author {
    font-size: 15px;
  }
}
</style>
