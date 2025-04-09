<script setup lang="ts">
import { ref } from "vue";
import { NModal, NButton, useNotification } from "naive-ui";

const props = defineProps<{
  fileId: number;
  fileName: string;
}>();

const emit = defineEmits(["deleted"]);

const showModal = ref(false);
const notification = useNotification();

const open = () => {
  showModal.value = true;
};

const close = () => {
  showModal.value = false;
};

const deleteFile = async () => {
  try {
    // Symulacja usuwania bez backendu:
    await new Promise((resolve) => setTimeout(resolve, 1000));

    notification.success({
      title: "Plik usunięty",
      content: `Plik "${props.fileName}" zostanie nieodwracalnie usunięty po 14 dniach.`,
      duration: 5000,
    });

    emit("deleted", props.fileId); // powiadom rodzica o usunięciu
    close();
  } catch (error) {
    notification.error({
      title: "Błąd usuwania",
      content: "Nie udało się usunąć pliku.",
      duration: 5000,
    });
  }
};

defineExpose({ open });
</script>

<template>
  <n-modal v-model:show="showModal" preset="dialog" title="Potwierdź usunięcie">
    <p>Czy na pewno chcesz usunąć plik "{{ fileName }}"?</p>
    <template #action>
      <n-button @click="close">Anuluj</n-button>
      <n-button type="error" @click="deleteFile">Usuń</n-button>
    </template>
  </n-modal>
</template>
