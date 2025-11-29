<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { NButton, NIcon, NPopover } from 'naive-ui'
import {
  IosHome as HomeIcon,
  MdCloudUpload as UploadIcon,
  MdPerson as PersonIcon,
  MdNotificationsOutline as BellIcon,
} from '@vicons/ionicons4'
import { isLoggedIn } from '@/constants/authState'
import API from "@/constants/api.ts";

const router = useRouter()
const route = useRoute()

const notifications = ref([])

async function loadNotifications() {
  if (!isLoggedIn.value) return

  try {
    const response = await API.get('/notifications/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
    notifications.value = response.data
  } catch (err) {
    console.error('Błąd ładowania powiadomień:', err)
  }
}

function goToSender(userId: number) {
  router.push({ name: 'public-profile', params: { id: userId } })
}

function goToFile(fileId: number) {
  router.push({ name: 'filePage', params: { id: fileId } })
}



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

onMounted(() => {
  loadNotifications()
})


</script>

<template>
  <div class="navbar">
    <!-- Logo -->
    <picture class="logo" @click="goToHome">
      <source srcset="/logo-graphic.png" media="(max-width: 1024px)" />
      <img src="/logo-notateq.png" alt="NotateQ Logo" />
    </picture>

    <!-- Menu Buttons -->
    <div class="menu-buttons">
      <n-button text @click="goToHome" :class="{ active: activeButtonKey === 'home' }">
        <template #icon>
          <n-icon><HomeIcon /></n-icon>
        </template>
        <p class="visible-text">Strona główna</p>
      </n-button>

      <n-button text @click="goToUpload" :class="{ active: activeButtonKey === 'upload' }">
        <template #icon>
          <n-icon><UploadIcon /></n-icon>
        </template>
        <p class="visible-text">Dodaj notatkę</p>
      </n-button>

      <n-button text @click="goToProfile" :class="{ active: activeButtonKey === 'profile' }">
        <template #icon>
          <n-icon><PersonIcon /></n-icon>
        </template>
        <p class="visible-text" v-if="isLoggedIn">Twoje konto</p>
        <p class="visible-text" v-else>Zaloguj się</p>
      </n-button>

      <n-popover v-if="isLoggedIn" trigger="click" placement="bottom-end">
  <template #trigger>
    <n-button text>
      <template #icon>
        <n-icon size="24"><BellIcon /></n-icon>
      </template>
    </n-button>
  </template>

  <div class="notifications">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="notification-item"
    >
      <span class="notif-user" @click="goToSender(notif.sender.id)">
        {{ notif.sender.username }}
      </span>
      dodał nowy plik:
      <span class="notif-file" @click="goToFile(notif.file.id)">
        {{ notif.file.title }}
      </span>
    </div>

    <div v-if="notifications.length === 0" class="notification-empty">
      Brak powiadomień
    </div>
  </div>
</n-popover>

    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #14532d;
  padding: 0.5rem 1rem;
  height: 64px;

  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo img {
  padding: 0.75rem;
  height: 64px;
  cursor: pointer;
}

.menu-buttons {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.visible-text {
  display: none;
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

.notifications {
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

.notification-empty {
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 14px;
}

@media (min-width: 1024px) {
  .visible-text {
    display: block;
  }
}

.notif-user,
.notif-file {
  color: #14532d;
  font-weight: bold;
  cursor: pointer;
}

.notif-user:hover,
.notif-file:hover {
  text-decoration: underline;
}


</style>
