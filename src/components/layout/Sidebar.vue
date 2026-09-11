<script setup lang="ts">
import { mdiWeatherSunny, mdiStarOutline, mdiCalendarClockOutline, mdiFormatListBulletedSquare, mdiPlus } from '@mdi/js'
import { useListsStore } from '../../stores/lists'
import { useUiStore } from '../../stores/ui'
import AppIcon from '../icons/AppIcon.vue'
import ListSidebarItem from '../lists/ListSidebarItem.vue'

const listsStore = useListsStore()
const uiStore = useUiStore()
</script>

<template>
  <nav class="nav nav-pills flex-column">
    <router-link to="/today" active-class="active" class="nav-link d-flex align-items-center gap-2">
      <AppIcon :path="mdiWeatherSunny" /> Oggi
    </router-link>
    <router-link to="/important" active-class="active" class="nav-link d-flex align-items-center gap-2">
      <AppIcon :path="mdiStarOutline" /> Importante
    </router-link>
    <router-link to="/planned" active-class="active" class="nav-link d-flex align-items-center gap-2">
      <AppIcon :path="mdiCalendarClockOutline" /> Pianificato
    </router-link>
    <router-link to="/all" active-class="active" class="nav-link d-flex align-items-center gap-2">
      <AppIcon :path="mdiFormatListBulletedSquare" /> Tutti
    </router-link>
  </nav>

  <hr />

  <nav class="nav nav-pills flex-column">
    <ListSidebarItem v-for="list in listsStore.lists" :key="list.id" :list="list" />
  </nav>

  <button
    type="button"
    class="btn btn-link text-decoration-none d-inline-flex align-items-center gap-2 mt-2"
    @click="uiStore.openListForm(null)"
  >
    <AppIcon :path="mdiPlus" /> Nuova lista
  </button>
</template>
