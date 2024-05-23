<template>
  <section>
    <div :style="`width:${left}%`">
      <slot name="left" />
    </div>
    <div :style="`width:${right}%`">
      <slot name="right" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  left: Number,
  right: Number,
});

if (!props.left && !props.right) {
  props.left = 50;
  props.right = 50;
} else if (!props.right) {
  props.right = 100 - Number(props.left);
} else if (!props.left) {
  props.left = 100 - Number(props.right);
}

</script>

<style scoped>
section {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>