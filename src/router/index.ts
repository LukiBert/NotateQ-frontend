import { createRouter, createWebHistory } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'

import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/upload',
      name: 'upload',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UploadView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

const { loadingBar } = createDiscreteApi(['loadingBar'])

router.beforeEach((to, from, next) => {
  loadingBar.start()
  next()
})

router.afterEach(() => {
  loadingBar.finish()
})

router.onError(() => {
  loadingBar.error()
})

export default router
