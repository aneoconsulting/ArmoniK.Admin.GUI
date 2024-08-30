<template>
  <section>
    <div id="left">
      <slot name="left" />
    </div>
    <div id="right">
      <slot name="right" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  left: String,
  right: String,
  justifyRight: String,
  justifyLeft: String,
});

const justifyRight = props.justifyRight || 'center';
let right = 50;
let left = 50;

if (props.left && props.right) {
  left = `${Number(props.left)}%`;
  right = `${Number(props.right)}%`;
} else if (!props.right) {
  left = `${Number(props.left)}%`;
  right = `${100 - Number(props.left)}%`;
} else if (!props.left) {
  right = `${Number(props.right)}%`;
  left = `${100 - Number(props.right)}%`;
}
</script>

<style scoped>
section {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#left {
  width: v-bind('left');
}

#right {
  width: v-bind('right');
  display: flex;
  justify-content: v-bind('justifyRight');
}
</style>