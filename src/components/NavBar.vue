<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'

import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { NMenu, NIcon } from 'naive-ui'
import { IosHome as HomeIcon, MdCloudUpload as UploadIcon } from '@vicons/ionicons4'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

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
  <n-menu mode="horizontal" :options="menuOptions" responsive />
</template>

<style scoped>
/* .nav-bar {
  background-color: #18a058;
} */
</style>
