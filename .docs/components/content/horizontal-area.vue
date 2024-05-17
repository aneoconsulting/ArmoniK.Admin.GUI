<template>
  <section class="flex w-full justify-start mt-2">
    <div class="pr-5 w-2/3">
      <ContentSlot :use="$slots.left" />
    </div>
    <div class="flex pl-5 w-1/3">
      <ContentSlot :use="$slots.right" />
    </div>
  </section>
</template>