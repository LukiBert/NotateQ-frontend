import { createRouter, createWebHistory } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/upload', name: 'upload', component: () => import('../views/UploadView.vue') },
  { path: '/files/:id', name: 'filePage', component: () => import('../views/FileContentView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/UserProfileView.vue'), },
  { path: '/search', name: 'searchPage', component: () => import('../views/SearchPageView.vue') },
  {
    path: '/:pathMatch(.*)',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
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
