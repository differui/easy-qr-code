<template>
  <transition name="fade" mode="out-in">
    <div class="modal" v-if="visible">
      <div class="modal__wrapper">
        <div class="modal__content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true,
      },
    },
  };
</script>

<style lang="scss">
.modal {
  z-index: 1;
  position: fixed;

  &,
  &__wrapper {
    width: 100%;
    height: 100%;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
  }

  &__content {
    margin-top: 16px;
  }
}

// animate
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
