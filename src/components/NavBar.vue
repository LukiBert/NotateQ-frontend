<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { h, computed, ref } from 'vue'
import { NButton, NIcon, NPopover } from 'naive-ui'
import {
  IosHome as HomeIcon,
  MdCloudUpload as UploadIcon,
  MdPerson as PersonIcon,
  MdNotificationsOutline as BellIcon,
} from '@vicons/ionicons4'
import { isLoggedIn } from '@/constants/authState'

const router = useRouter()
const route = useRoute()

const mockNotifications = ref([
  { id: 1, message: 'Użytkownik JanKowalski udostępnił plik: Algebra 1' },
  { id: 2, message: 'Nowy plik dodany w kategorii Fizyka' },
  { id: 3, message: 'Twoja notatka została oceniona na 5 gwiazdek' },
])

// function goToLogin() {
//   router.push({ name: 'register' })
// }

// function logout() {
//   localStorage.removeItem('access')
//   isLoggedIn.value = false
//   router.push({ name: 'home' })
// }

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
        <p v-if="isLoggedIn">Twoje konto</p>
        <p v-else>Zaloguj się</p>
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
          <div v-for="notif in mockNotifications" :key="notif.id" class="notification-item">
            {{ notif.message }}
          </div>
          <div v-if="mockNotifications.length === 0" class="notification-empty">
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
</style>
