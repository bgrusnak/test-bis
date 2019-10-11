<template>
  <el-dialog :title="title" :visible.sync="visible" :show-close="false">
    <el-form :model="data">
      <el-form-item label="Дата">
        <el-date-picker v-model="data.opDate" type="date" placeholder="Выберите дату"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" icon="el-icon-error"></el-button>
      <el-button type="primary" @click="handleComplete(data)" icon="el-icon-success"></el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["visible", "title", "data", "handleComplete", "handleCancel"],
  data() {
    return {};
  }
});
</script>
