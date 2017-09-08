<template>
  <div class="scroller">
    <div class="scroller__content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.scroller {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin-right: -17px;

  &__content {
    padding-right: 17px;
  }
}
</style>

