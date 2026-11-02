<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <Shader>
      <InkFlow
        color="#ff2d7e"
        :radius="0.3"
      />
    </Shader>

    <main class="app-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  position: relative;
  isolation: isolate;
}

.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
</style>
