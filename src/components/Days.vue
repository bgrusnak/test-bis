<template>
  <el-table
    :data="$store.state.opDate"
    style="width: 100%"
    highlight-current-row
    @current-change="handleSelect"
    empty-text="Нет данных"
  >
    <el-table-column label="Дата" prop="opDate"></el-table-column>
    <el-table-column align="right">
      <template slot="header" slot-scope="scope">
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
  props: ["handleEdit", "handleSelect", "handleDelete", "handleAdd"],
  data() {
    return {};
  }
});
</script>
