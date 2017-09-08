import * as types from '../types';

const qrCodeImage = {
  state: {
    image: {
      src: '',
      title: '',
      content: '',
    },
  },
  getters: {
    codeImageSrc: state => state.image.src,
    codeImageTitle: state => state.image.title,
    codeImageContent: state => state.image.content,
  },
  mutations: {
    [types.UPDATE_CODE_IMAGE](state, payload) {
      const image = state.image;

      image.src = payload.src;
      image.title = payload.title;
      image.content = payload.content;
    },
  },
  actions: {
    updateCodeImage({ commit }, payload) {
      commit(types.UPDATE_CODE_IMAGE, {
        src: payload.src,
        title: payload.title,
        content: payload.content,
      });
    },
    clearCodeImage({ commit }) {
      commit(types.UPDATE_CODE_IMAGE, {
        src: '',
        title: '',
        content: '',
      });
    },
  },
};

export default qrCodeImage;
