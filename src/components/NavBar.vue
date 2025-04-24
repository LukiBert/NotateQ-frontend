<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'

import { h, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import { IosHome as HomeIcon, MdCloudUpload as UploadIcon, MdPerson } from '@vicons/ionicons4'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const router = useRouter()
const route = useRoute()

function goToProfile() {
  router.push({ name: 'profile' })
}

const activeMenuKey = computed(() => {
  switch (route.name) {
    case 'home':
      return 'go-home-page'
    case 'upload':
      return 'go-upload-form'
    default:
      return null
  }
})

const isProfileRoute = computed(() => route.name === 'profile')

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(RouterLink, {
        to: {
          name: 'home',
        },
      }),
    key: 'go-home-page',
    icon: renderIcon(HomeIcon),
  },
  {
    label: () =>
      h(RouterLink, {
        to: {
          name: 'upload',
        },
      }),
    key: 'go-upload-form',
    icon: renderIcon(UploadIcon),
  },
]



</script>

<template>
  <div class="navbar">
    <n-menu
      mode="horizontal"
      :options="menuOptions"
      :value="activeMenuKey"
      responsive
    />
    <n-icon
      class="profile-icon"
      :class="{ active: isProfileRoute }"
      @click="goToProfile"
    >
      <MdPerson />
    </n-icon>
  </div>
</template>

<style scoped>
/* .nav-bar {
  background-color: #18a058;
} */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.profile-icon {
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
  color: black;
}

.profile-icon:hover {
  transform: scale(1.1);
  color: #18a058;
}

.profile-icon.active {
  color: #18a058;
}

</style>
