import * as types from '@/store/types';
import * as cfg from '@/configs';

const toast = {
  state: {
    toast: {
      visible: false,
      message: '',
    },
  },
  getters: {
    toastVisible: state => state.toast.visible,
    toastMessage: state => state.toast.message,
  },
  mutations: {
    [types.UPDATE_TOAST](state, payload) {
      const t = state.toast;

      t.visible = payload.visible;
      t.message = payload.message;
    },
  },
  actions: {
    showToast({ commit, dispatch }, message) {
      commit(types.UPDATE_TOAST, {
        visible: true,
        message,
      });
      setTimeout(() => dispatch('hideToast'), cfg.TOAST_DURATION);
    },
    hideToast({ commit }) {
      commit(types.UPDATE_TOAST, {
        visible: false,
        message: '',
      });
    },
  },
};

export default toast;
