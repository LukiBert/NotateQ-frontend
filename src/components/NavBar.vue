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
import type { Notification } from '../constants'

const router = useRouter()
const route = useRoute()

const notifications = ref<Notification[]>([])

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

async function onPopoverToggle(show: boolean) {
  if (!show) return;


  for (const notif of notifications.value) {
    if (!notif.is_read) {
      await API.patch(`/notifications/${notif.id}/read/`, {
        is_read: true
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })

      notif.is_read = true
    }
  }
}

async function deleteNotification(id: number) {
  try {
    await API.delete(`/notifications/${id}/delete/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    });
    notifications.value = notifications.value.filter(n => n.id !== id)
  } catch (e) {
    console.error("Błąd usuwania powiadomienia:", e)
  }
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

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.is_read).length
)


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

      <n-popover v-if="isLoggedIn" trigger="click" placement="bottom-end" @update:show="onPopoverToggle">
      <template #trigger>
        <n-button text class="notif-bell-btn">
          <template #icon>
            <n-icon size="24"><BellIcon /></n-icon>
            <span v-if="unreadCount > 0" class="notif-dot"></span>
          </template>
       </n-button>
      </template>

  <div class="notifications">

    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="notification-item"
    >

      <div class="notification-text">
        <span class="notif-user" @click="goToSender(notif.sender.id)">
          {{ notif.sender.username }}
        </span>
        dodał nowy plik:
        <span class="notif-file" @click="goToFile(notif.file.id)">
          {{ notif.file.title }}
        </span>
      </div>


      <button class="notif-delete" @click.stop="deleteNotification(notif.id)">
        Usuń
      </button>
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
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem;
  border-bottom: 1px solid #eee;
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
.notif-bell-btn {
  position: relative;
}

.notif-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}

.notification-text {
  flex: 1;
  font-size: 14px;
}

.notif-delete {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #b91c1c;
  padding: 4px;
}

.notif-delete:hover {
  color: #dc2626;
  text-decoration: underline;
}



</style>
