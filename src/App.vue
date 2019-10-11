<template>
  <el-container>
    <el-aside>
      <el-menu>
        <el-menu-item index="1-1">
          <router-link to="/">Счета</router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link to="/days">Операционные дни</router-link>
        </el-menu-item>
        <el-menu-item index="1-3">
          <router-link to="/operations">Операции</router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
 <style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
<script>
export default {
  data() {
    return {};
  }
};
</script>