<template>
  <ul class="qr-code-list">
    <li v-for="code in allCodes" :key="code.id" :id="code.id" class="qr-code-list__item" :class="code.selected ? 'qr-code-list__item_selected' : ''" @click="handleItemClick(code)">
      <a class="qr-code-list__anchor" href="javascript: void(0);" tabindex="-1">
        <p class="qr-code-list__title" :title="code.title">{{ code.title }}</p>
        <p class="qr-code-list__content" :title="code.content">{{ code.content }}</p>
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';

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

    &__item:active,
    &__item_selected {
      background-color: #efefef;
      border-bottom-color: #e0e5e6;

      &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #e0e5e6;
        top: -1px;
        left: 0;
        position: absolute;
      }
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
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__title {
      margin-bottom: 5px;
    }

    &__content {
      color: #cccccc;
      font-size: 14px;
    }
  }
</style>

