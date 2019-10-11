<template>
  <el-dialog :title="title" :visible.sync="visible" :show-close="false">
    <el-form :model="data">
      <el-form-item label="Счет">
        <el-select v-model="data.acctNum" :readonly="limited" placeholder="Select">
          <el-option
            v-for="item in accounts"
            :key="item.acctNum"
            :label="item.acctNum"
            :value="item.acctNum"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Дата">
        <el-date-picker
          v-model="data.opDate"
          :readonly="limited"
          type="date"
          placeholder="Выберите дату"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="Остаток">
        <el-input v-model="data.balance" autocomplete="off" type="number"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-error"></el-button>
      <el-button type="primary" @click="handleComplete(data)" icon="el-icon-success"></el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["visible", "title", "limited", "data", "accounts", "handleComplete"],
  data() {
    return {};
  }
});
</script>
