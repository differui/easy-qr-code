<template>
  <div class="workspace">
    <div class="workspace__header">
      <input ref="input" class="workspace__input" type="text" placeholder="Enter text to be encode" autofocus @keydown="handleInputKeyDown" />
    </div>
    <div class="workspace__body">
      <div class="workspace__list" v-if="allCodes.length">
        <scroller class="workspace__scroller">
          <qr-code-list></qr-code-list>
        </scroller>
      </div>
      <div class="workspace__deck has-qr-code-image">
        <qr-code-image class="workspace__qr-code-image"></qr-code-image>
        <div class="workspace__copyright">
          Easy QR Code &copy; 2017
        </div>
      </div>
    </div>
    <helper-modal class="workspace__helper-modal" v-model="helperModalVisible"></helper-modal>
    <toast></toast>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { parse as parseUrl } from 'url';
import Toast from '@/components/Toast';
import Scroller from '@/components/Scroller';
import QrCodeImage from '@/components/QrCodeImage';
import QrCodeList from '@/components/QrCodeList';
import HelperModal from '@/components/HelperModal';
import * as cfg from '@/configs';
import * as helpers from '@/helpers';

export default {
  computed: {
    ...mapGetters([
      'allCodes',
      'selectedCode',
      'isReachLimitCodeCount',
    ]),
  },
  components: {
    QrCodeImage,
    QrCodeList,
    Scroller,
    HelperModal,
    Toast,
  },
  data() {
    return {
      clearConfirmed: false,
      helperModalVisible: false,
    };
  },
  watch: {
    selectedCode(newSelectedCode) {
      if (newSelectedCode && newSelectedCode.content) {
        this.$electron.ipcRenderer.send('encode-text', newSelectedCode.content);
      }
    },
    allCodes(newAllCodes) {
      helpers.setItem('codes', newAllCodes);
    },
  },
  methods: {
    handleInputKeyDown(ev) {
      if (ev.keyCode !== cfg.KEY_ENTER) return;

      const targetNode = ev.target;
      const content = targetNode.value && targetNode.value.trim();
      let existedCode;

      if (content && content.length >= cfg.MAX_CONTENT_LENGTH) {
        this.$store.dispatch('showToast', 'Too many content.');
      }
      if (content && this.isReachLimitCodeCount) {
        this.$store.dispatch('showToast', `Only ${cfg.MAX_AVALIABLE_CODE_COUNT} codes avaliable`);
        return;
      }
      if (content) {
        existedCode = this.allCodes.find(c => c.content === content);
      }
      if (content && existedCode) {
        this.$store.dispatch('selectCode', existedCode.id);
        return;
      }
      if (content) {
        const urlOpts = parseUrl(content);

        this.$store.dispatch('addCode', {
          title: urlOpts.hostname || content,
          content,
          selected: true,
        });
        this.$electron.ipcRenderer.send('encode-text', content);
        this.$store.dispatch('selectCode', this.allCodes[0].id);
      }
      targetNode.value = '';
    },
    handleKeyDown(ev) {
      const input = this.$refs.input;
      const keyCode = ev.keyCode;
      let nextSelectedCode;
      let clearConfirmTimer;

      if (keyCode !== cfg.KEY_ESCAPE) {
        if (helpers.isDarwin && !ev.metaKey) {
          return;
        }
        if (helpers.isWin && !ev.getModifierState('Control')) {
          return;
        }
      }
      switch (keyCode) {
        case cfg.KEY_BACKSPACE:
          if (!this.allCodes.length) {
            return;
          }
          if (!this.clearConfirmed) {
            this.clearConfirmed = true;
            this.$store.dispatch('showToast', 'Press one more time clear all records?');
            clearConfirmTimer = setTimeout(() => {
              this.clearConfirmed = false;
            }, cfg.TOAST_DURATION);
            return;
          }
          this.$store.dispatch('removeCodes', this.allCodes.map(c => c.id));
          this.$store.dispatch('clearCodeImage');
          this.$store.dispatch('hideToast');
          this.clearConfirmed = false;
          clearTimeout(clearConfirmTimer);
          input.select();
          input.focus();
          break;
        case cfg.KEY_D:
          if (this.selectedCode) {
            this.$store.dispatch('removeCode', this.selectedCode.id);
          }
          nextSelectedCode = this.allCodes.length ? this.allCodes[0] : null;
          if (nextSelectedCode) {
            this.$store.dispatch('selectCode', nextSelectedCode.id);
            this.$store.dispatch('updateCodeImage', {
              title: nextSelectedCode.title,
              content: nextSelectedCode.content,
            });
          } else {
            this.$store.dispatch('clearCodeImage');
            input.select();
            input.focus();
          }
          break;
        case cfg.KEY_ESCAPE:
          this.helperModalVisible = false;
          this.$store.dispatch('hideToast');
          this.clearConfirmed = false;
          clearTimeout(clearConfirmTimer);
          break;
        case cfg.KEY_COMMA:
          this.helperModalVisible = true;
          this.$store.dispatch('hideToast');
          break;
        default:
      }
    },
    handleDocumentVisibilityChange() {
      if (!document.hidden) {
        const input = this.$refs.input;

        input.select();
        input.focus();
      }
    },
    handleEncodeTextDone(ev, result) {
      const { text, data } = result;

      this.$store.dispatch('updateCodeImage', {
        src: helpers.encodeOptimizedSVGDataUri(data),
        title: text,
        content: text,
      });
    },
    handleEncodeTextError(ev, err) {
      this.$store.dispatch('showToast', err.message);
    },
  },
  created() {
    this.$electron.ipcRenderer.on('encode-text-done', this.handleEncodeTextDone);
    this.$electron.ipcRenderer.on('encode-text-error', this.handleEncodeTextError);
    window.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('visibilitychange', this.handleDocumentVisibilityChange);
    if (this.selectedCode) {
      this.$electron.ipcRenderer.send('encode-text', this.selectedCode.content);
      this.$store.dispatch('selectCode', this.selectedCode.id);
    }
  },
};
</script>

<style lang="scss">
.workspace {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    background-color: #f6f8f8;
    border-bottom: 1px solid #e8e8e8;
  }

  &__body {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex: 1;
  }

  &__copyright {
    color: #d8dbe0;
    border-top: 1px solid #e8e8e8;
    background-color: #f6f8f8;
    padding: 2px 4px;
    font-size: 12px;
    text-align: right;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }

  &__input {
    -webkit-appearance: none;
    color: inherit;
    box-sizing: border-box;
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    padding: 20px 16px;
    font-size: 18px;
  }

  &__list {
    overflow-x: hidden;
    width: 250px;
    border-right: 1px solid #e0e5e6;
    background-color: #f6f8f8;
  }

  &__deck {
    position: relative;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  &__qr-code-image {
    width: 50%;
    min-width: 300px;
    max-width: 500px;
    margin-top: -16px;
  }
}
</style>
