<template>
  <ul class="qr-code-list">
    <li v-for="code in allCodes" :key="code.id" :id="code.id" class="qr-code-list__item" :class="code.selected ? 'qr-code-list__item_selected' : ''" @click="handleItemClick(code)">
      <a class="qr-code-list__anchor" href="javascript: void(0);" tabindex="-1">
        <p class="qr-code-list__title" :title="code.title" @dblclick="handleTitleDoubleClick" @blur="handleTitleBlur(arguments[0], code)" @keydown="handleTitleKeyDown">{{ code.title }}</p>
        <p class="qr-code-list__content" :title="code.content">{{ code.content }}</p>
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import * as cfg from '@/configs';

export default {
  computed: {
    ...mapGetters([
      'allCodes',
      'selectedCode',
    ]),
  },
  methods: {
    handleItemClick(code) {
      this.$store.dispatch('selectCode', code.id);
    },
    handleTitleDoubleClick(ev) {
      const body = document.querySelector('body');
      const element = ev.currentTarget;

      element.contentEditable = true;
      element.parentElement.parentElement.classList.add('qr-code-list__item_edit');
      if (body.createTextRange) {
        const range = body.createTextRange();

        range.moveToElementText(element);
        range.select();
      } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    },
    handleTitleKeyDown(ev) {
      if (ev.keyCode === cfg.KEY_ENTER) {
        ev.preventDefault();
        ev.currentTarget.blur();
      }
    },
    handleTitleBlur(ev, code) {
      const element = ev.currentTarget;
      const title = element.textContent.replace(/\n|\r/g, '');

      element.contentEditable = false;
      element.innerHTML = title;
      element.parentElement.parentElement.classList.remove('qr-code-list__item_edit');
      if (!title) {
        element.innerHTML = code.title;
        return;
      }
      if (title === code.title) {
        return;
      }
      if (this.allCodes.some(c => c.title === title)) {
        this.$store.dispatch('showToast', 'Duplicate record title');
        element.innerHTML = code.title;
        return;
      }
      if (title !== code.title) {
        this.$store.dispatch('updateCode', {
          id: code.id,
          title,
        });
      }
    },
  },
};
</script>

<style lang="scss">
  .qr-code-list {
    list-style: none;
    padding: 0;
    margin: 0;

    &__item {
      cursor: pointer;
      padding: 16px;
      border-bottom: 1px solid #efefef;
      position: relative;
    }

    &__anchor {
      color: inherit;
      text-decoration: none;
      outline: none;
    }

    &__title,
    &__content {
      margin-top: 0;
      margin-bottom: 0;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
    }

    &__title::after,
    &__content::after {
      content: '';
      width: 20px;
      top: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background-image: linear-gradient(to left, #f6f8f8 20%, transparent);
    }

    &__title {
      outline: none;
      margin-bottom: 5px;
    }

    &__content {
      color: #cccccc;
      font-size: 14px;
    }

    // state
    // ====
    &__item_selected {
      background-color: #efefef;
      border-bottom-color: #e0e5e6;
    }

    &__item_selected::after {
      content: '';
      width: 100%;
      height: 1px;
      background-color: #e0e5e6;
      top: -1px;
      left: 0;
      position: absolute;
    }

    &__item_selected &__title::after,
    &__item_selected &__content::after {
      background-image: linear-gradient(to left, #efefef 20%, transparent);
    }

    &__item_edit &__title::after {
      background-image: none;
    }
  }
</style>

