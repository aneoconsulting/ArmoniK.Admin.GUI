<template>
  <section>
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.left {
  max-width: 66%;
}

.right {
  max-width: 33%;
}
</style>