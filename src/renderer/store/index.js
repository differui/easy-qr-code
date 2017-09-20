import Vue from 'vue';
import Vuex from 'vuex';
import debounce from 'debounce';
import toast from '@/store/modules/toast';
import qrCodeList from '@/store/modules/qr-code-list';
import qrCodeImage from '@/store/modules/qr-code-image';
import * as helpers from '@/helpers';
import * as cfg from '@/configs';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    toast,
    qrCodeList,
    qrCodeImage,
  },
});
store.replaceState({
  toast: toast.state,
  qrCodeList: {
    ...qrCodeList.state,
    codes: helpers.getItem('codes') || [],
  },
  qrCodeImage: qrCodeImage.state,
});
store.subscribe(debounce((mutation, state) => {
  helpers.setItem('codes', state.qrCodeList.codes);
}, cfg.SAVE_CHECKPOINT_DURATION));
export default store;
