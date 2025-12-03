<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const input = ref("")
const messages = ref<{ role: string; text: string }[]>([])

function toggleChat() {
  open.value = !open.value
}

async function sendMessage() {
  if (!input.value.trim()) return

  const text = input.value
  input.value = ""

  // Dodaj wiadomość użytkownika
  messages.value.push({ role: "user", text })

  // Wyslij do backendu
  try {
    const res = await fetch("http://127.0.0.1:8000/api/ai_chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`
},
      body: JSON.stringify({ prompt: text }),
    })

    const data = await res.json()

    messages.value.push({
      role: "assistant",
      text: data.response || "Brak odpowiedzi",
    })
  } catch (e) {
    messages.value.push({
      role: "assistant",
      text: "Błąd połączenia z AI",
    })
  }
}
</script>


<template>
  <div>
    <!-- KÓŁKO OTWIERAJĄCE CZAT -->
    <div class="chat-bubble" @click="toggleChat">
      💬
    </div>

    <!-- PANEL CZATU -->
    <div v-if="open" class="chat-window">
      <div class="chat-header">
        AI Asystent
        <button class="close-btn" @click="toggleChat">×</button>
      </div>

      <div class="chat-messages">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="msg"
          :class="msg.role"
        >
          {{ msg.text }}
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="input"
          type="text"
          placeholder="Zapytaj o swoje dokumenty..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Wyślij</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.chat-bubble {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 55px;
  height: 55px;
  background: #14532d;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: 0.2s;
  z-index: 9999;
}
.chat-bubble:hover {
  transform: scale(1.1);
}

.chat-window {
  position: fixed;
  bottom: 100px;
  right: 25px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

.chat-header {
  background: #14532d;
  color: white;
  padding: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg {
  max-width: 80%;
  padding: 7px 10px;
  border-radius: 10px;
}

.msg.user {
  background: #e0f2fe;
  align-self: flex-end;
}

.msg.assistant {
  background: #f1f5f9;
  align-self: flex-start;
}

.chat-input {
  padding: 8px;
  display: flex;
  gap: 5px;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.chat-input button {
  background: #14532d;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
