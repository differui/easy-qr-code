<template>
  <div class="toast" v-if="toastVisible">
    <div class="toast__wrapper">
      <p class="toast__message">{{ toastMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'toastVisible',
      'toastMessage',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.toast {
  z-index: 1;
  position: fixed;
  font-size: 14px;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &,
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__wrapper {
    text-align: center;
    border-radius: 500px;
    background-color: rgba(0, 0, 0, 0.75);
    min-width: 100px;
    max-width: 250px;
    padding: 12px;
  }

  &__message {
    color: #ffffff;
    margin: 0;
  }
}
</style>

