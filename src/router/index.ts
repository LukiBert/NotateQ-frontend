import { createRouter, createWebHistory } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/upload', name: 'upload', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/files/:id', name: 'filePage', component: () => import('../views/FileContentView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/UserProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/search', name: 'searchPage', component: () => import('../views/SearchPageView.vue') },
  { path: '/:pathMatch(.*)', name: 'notFound', component: () => import('../views/NotFoundView.vue')},
  { path: '/profile/:id', name: 'public-profile', component: () => import('../views/UserProfileView.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const { loadingBar } = createDiscreteApi(['loadingBar'])

router.beforeEach((to, from, next) => {
  loadingBar.start()

  const requiresAuth = to.meta.requiresAuth
  const isLoggedIn = !!localStorage.getItem('access')

  if (requiresAuth && !isLoggedIn) {
    return next({ name: 'register' })
  }

  next()
})

router.afterEach(() => {
  loadingBar.finish()
})

router.onError(() => {
  loadingBar.error()
})

export default router
