<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <h2>Проводки</h2>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="right-end" width="160" v-model="canDeleteOperation">
            <p>Удалить запись?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" icon="el-icon-error" circle @click="canDeleteOperation=false"></el-button>
              <el-button
                size="mini"
                icon="el-icon-success"
                type="danger"
                circle
                @click="handleDeleteOperation()"
              ></el-button>
            </div>
          </el-popover>
          <Operations
            :handleDelete="confirmDeleteOperation"
            :handleEdit="handleEditOperation"
            :handleAdd="handleAddOperation"
            :handleSelect="handleSelectOperation"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <h1>Счета проводок</h1>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <Accounts :accounts="accounts" :date="currentDate" :handleSelect="()=>{}" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Operations from "../components/Operations.vue";
import Accounts from "../components/Accounts.vue";
import Days from "../components/Days.vue";
import ModifyAccount from "../components/ModifyAccount.vue";
import ModifyOperation from "../components/ModifyOperation.vue";

Vue.component("Operations", Operations);
Vue.component("Days", Days);
Vue.component("ModifyAccount", ModifyAccount);
Vue.component("ModifyOperation", ModifyOperation);
Vue.component("Accounts", Accounts);

export default Vue.extend({
  data() {
    return {
      allEntries: this.$store.state.opEntry,
      currentRow: null,
      dialogAddDayVisible: false,
      deletingDay: null,
      accounts: [],
      canDeleteDay: false,
      addDayForm: { opDate: "" },
      allDates: this.$store.state.opDate,
      currentDate: "",
      dialogEditOperationVisible: false,
      dialogAddOperationVisible: false,
      canDeleteOperation: false,
      deletingOperation: null,
      currentOperation: { opDate: "", acctNumCr: "", acctNumDb: "", balance: 0 }
    };
  },
  methods: {
    handleSelectOperation(row: any) {
      this.currentRow = row;
      this.currentDate = row.opDate;
      this.accounts = [row.acctNumCr, row.acctNumDb];
    },
    handleEditOperation(row: any) {
      this.currentOperation = row;
      this.dialogEditOperationVisible = true;
    },
    completeEditOperation(result: any) {
      this.dialogEditOperationVisible = false;
      this.$store.dispatch("updateEntry", {
        ...result,
        amount: Number(result.amount)
      });
    },
    confirmDeleteOperation(row: any) {
      this.deletingOperation = { ...row };
      this.canDeleteOperation = true;
    },
    handleDeleteOperation() {
      this.canDeleteOperation = false;
      this.$store.dispatch("deleteEntry", this.deletingOperation);
      this.deletingOperation = null;
    },
    handleAddOperation() {
      this.currentOperation = {
        opDate: "",
        acctNumCr: "",
        acctNumDb: "",
        balance: 0
      };
      this.dialogAddOperationVisible = true;
    },
    completeAddOperation(result: any) {
      if (
        !result.opDate ||
        !result.acctNumCr ||
        !result.acctNumDb ||
        !result.amount
      ) {
        this.$notify.error({
          title: "Ошибка",
          message: "Не заполнены обязательные поля"
        });
        return;
      }
      result.opDate = moment(result.opDate).format("YYYY-MM-DD");
      this.dialogAddOperationVisible = false;
      this.$store.dispatch("addEntry", {
        ...result,
        amount: Number(result.amount)
      });
      if (!this.$store.getters.hasDate(result.opDate)) {
        this.$store.dispatch("addOpDate", { opDate: result.opDate });
      }
    }
  },
  computed: {
    tableAccounts() {
      if (this.currentRow === null) {
        return [];
      }
      return this.$store.getters.getEntriesByDateAccounts(
        (this as any).currentRow.opDate,
        [(this as any).currentRow.acctNumCr, (this as any).currentRow.acctNumDb]
      );
    }
  }
});
</script>
