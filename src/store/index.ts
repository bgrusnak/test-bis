import Vue from 'vue';
import Vuex from 'vuex';

import defaultState from './defaultState';
Vue.use(Vuex);


export default new Vuex.Store({
  state: defaultState,
  mutations: {
    setOpDate(state, opDates) {
      state.opDate = opDates;
    },
    setAcc(state, Accounts) {
      state.acct = Accounts;
    },
    setAcctPos(state, accPoses) {
      state.acctPos = accPoses;
    },
    setOpEntry(state, opEntries) {
      state.opEntry = opEntries;
    }
  },
  getters: {
    lastDate: (state) => state.acctPos.reduce((acc: any, dt: any) =>
      dt.opDate > acc.opDate ? dt : acc
    ).opDate,
    hasDate: (state) => (date: string) => state.opDate.find((pos) =>
      pos.opDate === date
    ),
    getEntriesByAccount: (state) => (account: string) => state.opEntry.filter((pos) =>
      pos.acctNumCr === account ||
      pos.acctNumDb === account
    ),
    getEntriesByDate: (state) => (date: string) => state.opEntry.filter((pos) =>
      pos.opDate === date
    ),
    getAccountByDateNumber: (state) => (date: string, account: string) => state.acctPos.find((pos) =>
      pos.opDate === date && account === pos.acctNum
    ),
    getEntriesByDateAccounts: (state) => (date: string, accounts: [string]) => state.acctPos.filter((pos) =>
      pos.opDate === date && accounts.includes(pos.acctNum)
    ),
    getAccountsByDate: (state) => (date: string) => state.acctPos.filter(
      (pos: any) => pos.opDate === date
    ),
    getEntries: (state) => state.opEntry
  },
  actions: {
    addEntry({ state, commit }, entry) {
      commit('setOpEntry', [...state.opEntry, entry]);
    },
    updateEntry({ state, commit }, entry) {
      const newEntries = state.opEntry.map((opEntry) => {
        if (opEntry.acctNumCr === entry.acctNumCr
          && opEntry.acctNumDb === entry.acctNumDb
          && opEntry.opDate === entry.opDate) {
          return { ...opEntry, amount: entry.amount };
        }
        return opEntry;
      });
      commit('setOpEntry', newEntries);
    },
    deleteEntry({ state, commit }, entry) {
      const newEntries = state.opEntry.filter((opEntry) =>
        opEntry.acctNumCr !== entry.acctNumCr
        || opEntry.acctNumDb !== entry.acctNumDb
        || opEntry.opDate !== entry.opDate);
      commit('setOpEntry', newEntries);
    },
    addAcct({ state, commit }, acct) {
      commit('setAcct', [...state.acct, acct]);
    },
    updateAcct({ state, commit }, { old, val }) {
      const newEntries = state.acct.map((acc) => {
        if (acc.acctNum === old) {
          return { ...acc, acctNum: val };
        }
        return acc;
      });
      commit('setAcct', newEntries);
    },
    deleteAcct({ state, commit }, delAcc) {
      const newEntries = state.acct.filter((acc) =>
        acc.acctNum !== delAcc.acctNum);
      commit('setAcct', newEntries);
    },
    addAcctPos({ state, commit }, item) {
      commit('setAcctPos', [...state.acctPos, item]);
    },
    updateAcctPos({ state, commit }, item) {
      const newEntries = state.acctPos.map((entry) => {
        if (entry.acctNum === item.acctNum
          && entry.opDate === item.opDate) {
          return { ...entry, balance: item.balance };
        }
        return entry;
      });
      commit('setAcctPos', newEntries);
    },
    deleteAcctPos({ state, commit }, item) {
      const newEntries = state.acctPos.filter((entry) =>
        entry.acctNum !== item.acctNum
        || entry.opDate !== item.opDate);
      commit('setAcctPos', newEntries);
    },
    addOpDate({ state, commit }, opDate) {
      commit('setOpDate', [...state.opDate, opDate]);
    },
    updateOpDate({ state, commit }, { old, val }) {
      const newEntries = state.opDate.map((acc) => {
        if (acc.opDate === old) {
          return { ...acc, opDate: val };
        }
        return acc;
      });
      commit('setOpDate', newEntries);
    },
    deleteOpDate({ state, commit }, delAcc) {
      const newEntries = state.opDate.filter((acc) =>
        acc.opDate !== delAcc.opDate);
      commit('setOpDate', newEntries);
    },
  }
});
