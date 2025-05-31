import { createRouter, createWebHistory } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/search', name: 'searchPage', component: () => import('../views/SearchPageView.vue') },
  {
    path: '/files/:id(\\d+)',
    name: 'filePage',
    component: () => import('../views/FileContentView.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/UploadView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/UserProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id(\\d+)',
    name: 'public-profile',
    component: () => import('../views/UserProfileView.vue'),
    props: true,
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    meta: {
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const { loadingBar } = createDiscreteApi(['loadingBar'])

router.beforeEach((to, from, next) => {
  loadingBar.start()

  const token = localStorage.getItem('access')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'register' })
  } else {
    next()
  }
})

router.afterEach(() => {
  loadingBar.finish()
})

router.onError(() => {
  loadingBar.error()
})

export default router
