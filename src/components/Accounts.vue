<template>
  <el-table
    :data="tableAccounts"
    style="width: 100%"
    highlight-current-row
    @current-change="handleSelect"
    empty-text="Нет данных"
  >
    <el-table-column label="Номер счета" prop="acctNum"></el-table-column>
    <el-table-column label="Остаток" prop="balance"></el-table-column>
    <el-table-column>
      <template slot="header" slot-scope="scope" align="right">
        <el-select
          v-if="dates"
          :value="date"
          v-on:change="handleDateChange"
          placeholder="Дата"
          style="width:180px"
        >
          <el-option
            v-for="item in dates"
            :key="item.opDate"
            :label="item.opDate"
            :value="item.opDate"
          ></el-option>
        </el-select>
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
    "date",
    "accounts",
    "dates",
    "handleDateChange",
    "handleEdit",
    "handleSelect",
    "handleDelete",
    "handleAdd"
  ],
  data() {
    return {};
  },
  methods: {},
  computed: {
    tableAccounts() {
      if (this.accounts) {
        return this.$store.getters.getEntriesByDateAccounts(
          (this as any).date,
          (this as any).accounts
        );
      }
      return this.$store.getters.getAccountsByDate((this as any).date);
    }
  }
});
</script>
