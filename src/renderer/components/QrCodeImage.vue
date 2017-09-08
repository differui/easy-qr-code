<template>
  <div class="qr-code-image">
    <div class="qr-code-image__wrapper">
      <div class="qr-code-image__content">
        <img class="qr-code-image__image" :src="codeImageSrc" :alt="codeImageTitle" v-if="codeImageSrc" />
        <p class="qr-code-image__placeholder" v-if="!codeImageSrc">QR code in easy way.</p>
      </div>
      <div class="qr-code-image__stub" v-if="!codeImageSrc">
        <div class="qr-code-image__stub-top-left"></div>
        <div class="qr-code-image__stub-bottom-left"></div>
        <div class="qr-code-image__stub-top-right"></div>
      </div>
    </div>
    <div class="qr-code-image__footer">
      <h2 class="qr-code-image__text">{{ codeImageContent }}</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'codeImageSrc',
      'codeImageTitle',
      'codeImageContent',
    ]),
  },
};
</script>

<style lang="scss">
.qr-code-image {
  position: relative;

  &__wrapper,
  &__content {
    width: 100%;
    height: 100%;
  }

  &__wrapper {
    height: auto;
    position: relative;
    padding-bottom: 100%;
    border: 1px solid #e0e5e6;
  }

  &__content {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__footer {
    text-align: center;
    margin-top: 8px;
  }

  &__image {
    height: 90%;
    width: 90%;
    position: absolute;
  }

  &__stub-top-left,
  &__stub-top-right,
  &__stub-bottom-left {
    width: 20%;
    height: 20%;
    background-color: #e0e5e6;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before,
    &::after {
      content: '';
      position: absolute;
    }

    &::before {
      width: 80%;
      height: 80%;
      background-color: #ffffff;
    }

    &::after {
      width: 50%;
      height: 50%;
      background-color: #e0e5e6;
    }
  }

  &__stub-top-left,
  &__stub-bottom-left {
    left: 20%;
  }

  &__stub-top-left,
  &__stub-top-right {
    top: 20%;
  }

  &__stub-top-right {
    right: 20%;
  }

  &__stub-bottom-left {
    bottom: 20%;
  }

  &__placeholder {
    color: #e8e8e8;
    text-align: center;
  }

  &__text {
    color: #e8e8e8;
    font-weight: normal;
    display: inline;
    font-size: 14px;
    word-break: break-all;
  }
}
</style>
