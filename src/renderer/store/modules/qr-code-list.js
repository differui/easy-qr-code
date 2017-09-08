import * as types from '@/store/types';
import * as cfg from '@/configs';

const qrCodeList = {
  state: {
    codes: [],
  },
  getters: {
    allCodes: state => state.codes,
    selectedCode: state => state.codes.find(c => c.selected),
    unselectedCodes: state => state.codes.filter(c => !c.selected),
    isReachLimitCodeCount: state => state.codes.length >= cfg.MAX_AVALIABLE_CODE_COUNT,
  },
  mutations: {
    [types.ADD_CODE](state, payload) {
      if (state.codes.length < cfg.MAX_AVALIABLE_CODE_COUNT) {
        state.codes.unshift({
          id: `s_${String(Math.random()).substr(2)}__${Date.now()}`,
          title: payload.title,
          content: payload.content,
          selected: false,
          updated: Date.now(),
        });
      }
    },
    [types.REMOVE_CODE](state, codeId) {
      const targetCodeIndex = state.codes.findIndex(c => c.id === codeId);

      if (targetCodeIndex > -1) {
        state.codes.splice(targetCodeIndex, 1);
      }
    },
    [types.UPDATE_CODE](state, payload) {
      const targetCode = state.codes.find(c => c.id === payload.id);

      if (targetCode) {
        Object.keys(payload).forEach((key) => {
          if (key !== 'id' && Object.hasOwnProperty.call(targetCode, key)) {
            targetCode[key] = payload[key];
          }
        });
      }
    },
    [types.SORT_CODE](state) {
      const codes = state.codes;
      const len = codes.length;
      let i;
      let j;

      for (i = 0; i < len; i += 1) {
        for (j = 0; j < len - i - 1; j += 1) {
          if (codes[j].updated < codes[j + 1].updated) {
            const temp = codes[j + 1];

            codes[j + 1] = codes[j];
            codes[j] = temp;
          }
        }
      }
    },
  },
  actions: {
    addCode({ commit }, payload) {
      commit(types.ADD_CODE, payload);
      commit(types.SORT_CODE);
    },
    removeCode({ commit }, codeId) {
      commit(types.REMOVE_CODE, codeId);
    },
    updateCode({ commit }, payload) {
      commit(types.UPDATE_CODE, {
        ...payload,
        ...{
          updated: Date.now(),
        },
      });
      commit(types.SORT_CODE);
    },
    selectCode({ commit, getters }, codeId) {
      const allCodes = getters.allCodes;
      const targetCode = allCodes.find(c => c.id === codeId);

      if (targetCode) {
        commit(types.UPDATE_CODE, {
          id: codeId,
          selected: true,
        });
        commit(types.SORT_CODE);
        allCodes.forEach((code) => {
          if (code.id !== codeId) {
            commit(types.UPDATE_CODE, {
              id: code.id,
              selected: false,
            });
          }
        });

        const targetCodeNode = document.querySelector(`#${codeId}`);

        if (targetCodeNode) {
          targetCodeNode.scrollIntoViewIfNeeded();
        }
      }
    },
    addCodes({ commit }, codes) {
      codes.forEach(c => commit(types.ADD_CODE, c));
      commit(types.SORT_CODE);
    },
    removeCodes({ commit }, ids) {
      ids.forEach(id => commit(types.REMOVE_CODE, id));
    },
  },
};

export default qrCodeList;
