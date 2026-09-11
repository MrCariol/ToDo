import { createRouter, createWebHistory } from 'vue-router'
import TodayView from '../views/TodayView.vue'
import ImportantView from '../views/ImportantView.vue'
import PlannedView from '../views/PlannedView.vue'
import AllTasksView from '../views/AllTasksView.vue'
import ListView from '../views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/today' },
    { path: '/today', name: 'today', component: TodayView },
    { path: '/important', name: 'important', component: ImportantView },
    { path: '/planned', name: 'planned', component: PlannedView },
    { path: '/all', name: 'all', component: AllTasksView },
    { path: '/list/:listId', name: 'list', component: ListView, props: true },
  ],
})

export default router
