<template>
  <modal class="helper-modal" :visible="value">
    <div class="helper-modal__content">
      <div class="helper-modal__close" @click="handleCloseClick"></div>
      <ul class="helper-modal__list" v-if="shortcutOptionActivated">
        <li class="helper-modal__item">
          <kbd class="helper-modal__kbd">{{ keyModifier }}</kbd>
          <kbd class="helper-modal__kbd">,</kbd>
          <span class="helper-modal__desc">Show helper window.</span>
        </li>
        <li class="helper-modal__item">
          <kbd class="helper-modal__kbd">{{ keyModifier }}</kbd>
          <kbd class="helper-modal__kbd">D</kbd>
          <span class="helper-modal__desc">Delete selected record.</span>
        </li>
        <li class="helper-modal__item">
          <kbd class="helper-modal__kbd">{{ keyModifier }}</kbd>
          <kbd class="helper-modal__kbd">Del</kbd>
          <span class="helper-modal__desc">Clear all records.</span>
        </li>
      </ul>
      <div class="helper-modal__about" v-if="aboutOptionActivated">
        <p>Easy QR Code {{ appVersion }}</p>
      </div>
      <ul class="helper-modal__tab">
        <li class="helper-modal__option" :class="shortcutOptionActivated ? 'helper-modal__option-active' : ''" @click="handleOptionClick">Shortcuts</li>
        <li class="helper-modal__option" :class="aboutOptionActivated ? 'helper-modal__option-active' : ''" @click="handleOptionClick">About</li>
      </ul>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import * as helpers from '@/helpers';
import * as pkg from '../../../package.json';

export default {
  data() {
    return {
      shortcutOptionActivated: true,
      aboutOptionActivated: false,
    };
  },
  computed: {
    appVersion() {
      return pkg.version;
    },
    keyModifier() {
      return helpers.isDarwin ? '⌘' : 'Ctr';
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Modal,
  },
  methods: {
    handleCloseClick() {
      this.$emit('input', false);
    },
    handleOptionClick(ev) {
      switch (ev.currentTarget.textContent) {
        case 'Shortcuts':
          this.shortcutOptionActivated = true;
          this.aboutOptionActivated = false;
          break;
        case 'About':
          this.aboutOptionActivated = true;
          this.shortcutOptionActivated = false;
          break;
        default:
      }
    },
  },
};
</script>

<style lang="scss">
  .helper-modal {
    .modla__wrapper,
    .modal__content,
    &__content {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      position: fixed;
    }

    &__content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      box-sizing: border-box;
    }

    &__close {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      top: 35px;
      right: 45px;
      position: absolute;
    }

    &__close::before,
    &__close::after {
      content: '';
      display: block;
      width: 1px;
      height: 70%;
      background-color: #fff;
      top: 1px;
      position: relative;
    }

    &__close::before {
      transform: rotate(45deg);
    }

    &__close::after {
      transform: rotate(-45deg);
    }

    &__about,
    &__tab {
      width: 100%;
    }

    &__about {
      font-size: 12px;
      text-align: center;
    }

    &__tab {
      flex-direction: row;
      list-style: none;
      display: flex;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
    }

    &__option {
      cursor: pointer;
      color: #e8e8e8;
      font-size: 24px;
      padding: 2px 0;
      text-align: center;
      flex: 1;
    }

    &__option-active,
    &__option:active {
      color: inherit;
    }

    &__list {
      display: flex;
      flex-direction: column;
      justify-content: center;;
      list-style: none;
    }

    &__item {
      margin-bottom: 28px;
      display: flex;
      align-items: flex-start;
    }

    &__item:last-child {
      margin-bottom: 0;
    }

    &__kbd {
      cursor: pointer;
      line-height: 1.3;
      top: -3px;
      position: relative;
      min-width: 12px;
      text-align: center;
      float: left;
      border: solid 1px #5e7478;
      padding: 2px 8px;
      border-radius: 4px;
      vertical-align: baseline;
      margin-right: 8px;
      box-shadow: 0 5px 0 #5e7478;
      color: #5e7478;
      background-color: #e0e5e6;
    }

    &__kbd:active {
      top: auto;
      box-shadow: 0 2px 0 #5e7478;
    }

    &__desc {
      flex: 1;
      display: block;
      font-size: 14px;
    }
  }
</style>

