<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import FileList from '../components/FileList.vue'


const userName = 'janusz_koduje'
const userAvatarUrl = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Coder'
const documentsShared = 17


const searchInput = ref('')

function receiveEmit(phrase: string) {
  searchInput.value = phrase

  console.log('Szukasz w profilu:', phrase)
}
</script>

<template>
  <div class="profile-wrapper">
    <!-- INFO O UŻYTKOWNIKU -->
    <div class="user-info-card">
      <img :src="userAvatarUrl" alt="Avatar" class="avatar" />
      <div class="user-details">
        <h2>{{ userName }}</h2>
        <p>{{ documentsShared }} udostępnionych dokumentów</p>
      </div>
    </div>

    <!-- SEARCHBAR + LISTA -->
    <div class="search-card">
      <SearchBar @search-phrase="receiveEmit" />
      <p v-if="searchInput">🔍 Szukasz: "{{ searchInput }}"</p>

      <!-- Gotowy komponent z listą -->
      <FileList :show-heading="false" />
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 1rem;
  gap: 1.5rem;
  margin-left: 25rem;
}

/* Górny prostokąt */
.user-info-card {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1300px;
  min-height: 160px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 1.5rem;
}

.user-details {
  align-self: flex-start;
}

.user-details h2 {
  margin: 0;
  font-size: 2rem;
}

.user-details p {
  margin: 0.25rem 0 0;
  color: #666;
}

/* Dolny prostokąt z SearchBarem */
.search-card {
  width: 100%;
  max-width: 1300px;
  background-color: #fafafa;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
