import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/workouts',
    },
    {
      path: '/workouts',
      name: 'Workouts',
      component: () => import('../pages/UserWorkouts.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/workouts/add',
      name: 'AddWorkout',
      component: () => import('../pages/AddWorkout.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/workouts/edit/:id',
      name: 'EditWorkout',
      component: () => import('../pages/EditWorkout.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Register.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Login.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/logout',
      name: 'Logout',
      component: () => import('../pages/Logout.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../pages/Profile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/Error.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const hasToken = Boolean(localStorage.getItem('token'))
  const isLoggedIn = Boolean(userStore.user.id) || hasToken

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'Login' }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'Workouts' }
  }

  return true
})

export default router