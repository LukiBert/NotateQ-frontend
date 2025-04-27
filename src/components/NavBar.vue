<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { h, computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { IosHome as HomeIcon, MdCloudUpload as UploadIcon, MdPerson as PersonIcon } from '@vicons/ionicons4'

const router = useRouter()
const route = useRoute()

function goToHome() {
  router.push({ name: 'home' })
}

function goToUpload() {
  router.push({ name: 'upload' })
}

function goToProfile() {
  router.push({ name: 'profile' })
}

const activeButtonKey = computed(() => {
  switch (route.name) {
    case 'home':
      return 'home'
    case 'upload':
      return 'upload'
    case 'profile':
      return 'profile'
    default:
      return ''
  }
})
</script>

<template>
  <div class="navbar">
    <!-- Logo -->
    <div class="logo" @click="goToHome">
      <img src="/logo-notateq.png" alt="NotateQ Logo" />
    </div>

    <!-- Menu Buttons -->
    <div class="menu-buttons">
      <n-button text @click="goToHome" :class="{ active: activeButtonKey === 'home' }">
        <template #icon>
          <n-icon><HomeIcon /></n-icon>
        </template>
        Strona główna
      </n-button>

      <n-button text @click="goToUpload" :class="{ active: activeButtonKey === 'upload' }">
        <template #icon>
          <n-icon><UploadIcon /></n-icon>
        </template>
        Dodaj notatkę
      </n-button>

      <n-button text @click="goToProfile" :class="{ active: activeButtonKey === 'profile' }">
        <template #icon>
          <n-icon><PersonIcon /></n-icon>
        </template>
        Twoje konto
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #14532d;
  padding: 0.5rem 1rem;
  height: 64px;
}

.logo img {
  margin-left: 10rem;
  height: 160px;
  cursor: pointer;
}

.menu-buttons {
  margin-right: 10rem;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.n-button {
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.n-button:hover {
  color: #d9f99d;
}

.n-button.active {
  color: #d9f99d;
  font-weight: bold;
}
</style>
