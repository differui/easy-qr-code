import Vue from 'vue';
import Vuex from 'vuex';
import toast from '@/store/modules/toast';
import qrCodeList from '@/store/modules/qr-code-list';
import qrCodeImage from '@/store/modules/qr-code-image';
import * as helpers from '@/helpers';

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
export default store;
