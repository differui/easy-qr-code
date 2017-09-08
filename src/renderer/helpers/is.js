import Vue from 'vue';
import '@/electron';

const electron = Vue.prototype.$electron;

export const isDarwin = electron.remote.process.platform === 'darwin';
export const isWin = electron.remote.process.platform === 'win32';

