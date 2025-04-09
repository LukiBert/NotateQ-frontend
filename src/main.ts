import './assets/main.css'

import { createApp, h } from 'vue'
import App from './App.vue'
import {
  NNotificationProvider,
  NDialogProvider,
  NConfigProvider
} from 'naive-ui'

const app = createApp({
  render: () =>
    h(NConfigProvider, null, {
      default: () =>
        h(NNotificationProvider, null, {
          default: () =>
            h(NDialogProvider, null, {
              default: () => h(App)
            })
        })
    })
})

app.mount('#app')


