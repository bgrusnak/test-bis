<template>
  <el-table
    :data="tableEntries"
    style="width: 100%"
    highlight-current-row
    empty-text="Нет данных"
    @current-change="handleSelect"
  >
    <el-table-column label="Дата операционного дня" prop="opDate"></el-table-column>
    <el-table-column label="Счет кредита" prop="acctNumCr"></el-table-column>
    <el-table-column label="Счет дебита" prop="acctNumDb"></el-table-column>
    <el-table-column label="Сумма" prop="amount"></el-table-column>
    <el-table-column align="right">
      <template slot="header" slot-scope="scope" align="right">
        <el-button
          v-if="handleAdd"
          type="primary"
          icon="el-icon-circle-plus"
          circle
          @click="handleAdd()"
        ></el-button>
      </template>
      <template slot-scope="scope">
        <el-button
          v-if="handleEdit"
          icon="el-icon-edit"
          type="primary"
          circle
          @click="handleEdit(scope.row)"
        ></el-button>&nbsp;
        <el-button
          v-if="handleDelete"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete(scope.row)"
          circle
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: [
    "account",
    "date",
    "handleEdit",
    "handleDelete",
    "handleAdd",
    "handleSelect"
  ],
  data() {
    return {
      dialogAddAccountVisible: false,
      dialogEditAccountVisible: false,
      dialogAddOperationVisible: false,
      dialogEditOperationVisible: false,
      canDeleteAccount: false,
      deletingAccount: null
    };
  },
  methods: {},
  computed: {
    tableEntries() {
      if (this.account !== undefined && this.date !== undefined) {
        return this.$store.getters.getEntriesByDateAccounts(
          this.date,
          typeof this.account === "string" ? [this.account] : this.account
        );
      }
      if (this.account !== undefined) {
        return this.$store.getters.getEntriesByAccount(this.account);
      }
      if (this.date !== undefined) {
        return this.$store.getters.getEntriesByDate(this.date);
      }
      return this.$store.getters.getEntries;
    }
  }
});
</script>
