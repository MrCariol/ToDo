<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TaskDetailPanel from '../tasks/TaskDetailPanel.vue'
import ListFormModal from '../lists/ListFormModal.vue'
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <nav class="navbar navbar-expand-md bg-body-tertiary border-bottom d-md-none">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          aria-label="Apri menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <span class="navbar-brand mb-0 h1">ToDo</span>
      </div>
    </nav>

    <div class="d-flex flex-grow-1 overflow-hidden">
      <div
        id="sidebarOffcanvas"
        class="offcanvas-md offcanvas-start bg-body-tertiary border-end"
        tabindex="-1"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div class="offcanvas-header">
          <h5 id="sidebarOffcanvasLabel" class="offcanvas-title">ToDo</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarOffcanvas"
            aria-label="Chiudi"
          ></button>
        </div>
        <div class="offcanvas-body">
          <Sidebar />
        </div>
      </div>

      <main class="flex-grow-1 overflow-auto p-3 p-md-4">
        <router-view />
      </main>
    </div>

    <TaskDetailPanel />
    <ListFormModal />
  </div>
</template>
