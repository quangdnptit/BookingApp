import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
        { path: 'movies', name: 'MovieList', component: () => import('../views/Movies/MovieList.vue') },
        { path: 'movies/new', name: 'MovieNew', component: () => import('../views/Movies/MovieForm.vue') },
        { path: 'movies/:id/edit', name: 'MovieEdit', component: () => import('../views/Movies/MovieForm.vue') },
        { path: 'showtimes', name: 'Showtimes', component: () => import('../views/Showtimes.vue') },
        { path: 'theaters', name: 'Theaters', component: () => import('../views/Theaters.vue') },
        { path: 'seats', name: 'Seats', component: () => import('../views/Seats.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

const AUTH_KEY = 'reel-cms-auth'

router.beforeEach((to, _from, next) => {
  let user: unknown = null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      const data = JSON.parse(raw) as { user?: unknown }
      user = data?.user
    }
  } catch {
    // ignore
  }

  const isAuthenticated = !!user

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  if (to.meta.public && isAuthenticated && to.path === '/login') {
    const redirect = (to.query.redirect as string) || '/'
    next(redirect)
    return
  }
  next()
})

export default router
