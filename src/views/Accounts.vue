<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <h2>Счета с остатками на дату</h2>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="right-end" width="160" v-model="canDeleteAccount">
            <p>Удалить запись?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" icon="el-icon-error" circle @click="canDeleteAccount=false"></el-button>
              <el-button
                size="mini"
                icon="el-icon-success"
                type="danger"
                circle
                @click="handleDeleteAccount()"
              ></el-button>
            </div>
          </el-popover>
          <Accounts
            :date="currentDate"
            :dates="$store.state.opDate"
            :handleDateChange="changeDate"
            :handleSelect="handleCurrentChange"
            :handleAdd="handleAddAccount"
            :handleDelete="confirmDeleteAccount"
            :handleEdit="handleEditAccount"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <h1>Проводки по счету</h1>
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
            :account="selectedAccount"
            :handleDelete="confirmDeleteOperation"
            :handleEdit="handleEditOperation"
            :handleSelect="()=>{}"
          />
        </el-col>
      </el-row>
    </el-main>
    <!-- Form add account -->
    <ModifyAccount
      title="Добавление остатка на дату"
      :visible.sync="dialogAddAccountVisible"
      :data="addActForm"
      :accounts="$store.state.acct"
      :handleComplete="completeAddAccount"
    />
    <!-- Form edit account -->
    <ModifyAccount
      title="Редактирование остатка на дату"
      :visible.sync="dialogEditAccountVisible"
      :data="currentAccount"
      :accounts="$store.state.acct"
      :handleComplete="completeEditAccount"
    />

    <!-- Form edit operation -->
    <ModifyOperation
      title="Редактирование проводки"
      :visible.sync="dialogEditOperationVisible"
      :data="currentOperation"
      :limited="true"
      :accounts="$store.state.acct"
      :handleComplete="completeEditOperation"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Operations from "../components/Operations.vue";
import Accounts from "../components/Accounts.vue";
import ModifyAccount from "../components/ModifyAccount.vue";
import ModifyOperation from "../components/ModifyOperation.vue";

Vue.component("Operations", Operations);
Vue.component("Accounts", Accounts);
Vue.component("ModifyAccount", ModifyAccount);
Vue.component("ModifyOperation", ModifyOperation);
export default Vue.extend({
  data() {
    return {
      dialogAddAccountVisible: false,
      dialogEditAccountVisible: false,
      dialogEditOperationVisible: false,
      canDeleteOperation: false,
      canDeleteAccount: false,
      deletingAccount: null,
      currentDate: this.$store.getters.lastDate,
      currentAccount: { opDate: "", acctNum: "", balance: 0 },
      addActForm: { opDate: "", acctNum: "", balance: 0 },
      accounts: this.$store.state.acct,
      selectedAccount: null,
      deletingOperation: null,
      currentOperation: { opDate: "", acctNumCr: "", acctNumDb: "", balance: 0 }
    };
  },
  methods: {
    changeDate(date: any) {
      this.currentDate = date;
    },
    completeAddAccount(result: any) {
      if (!result.opDate || !result.acctNum || !result.balance) {
        this.$notify.error({
          title: "Ошибка",
          message: "Не заполнены обязательные поля"
        });
        return;
      }
      result.opDate = moment(result.opDate).format("YYYY-MM-DD");
      if (
        this.$store.getters.getAccountByDateNumber(
          result.opDate,
          result.acctNum
        )
      ) {
        this.$notify.error({
          title: "Ошибка",
          message: "Остатки на эту дату уже сформированы"
        });
        return;
      }
      this.dialogAddAccountVisible = false;
      this.$store.dispatch("addAcctPos", {
        ...result,
        balance: Number(result.balance)
      });
      if (!this.$store.getters.hasDate(result.opDate)) {
        this.$store.dispatch("addOpDate", { opDate: result.opDate });
      }
    },
    handleAddAccount() {
      this.addActForm = { opDate: "", acctNum: "", balance: 0 };
      this.dialogAddAccountVisible = true;
    },
    handleEditAccount(row: any) {
      this.currentAccount = row;
      this.selectedAccount = row.acctNum;
      this.dialogEditAccountVisible = true;
    },
    completeEditAccount(result: any) {
      this.dialogEditAccountVisible = false;
      this.$store.dispatch("updateAcctPos", {
        ...result,
        balance: Number(result.balance)
      });
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
    confirmDeleteAccount(row: any) {
      this.deletingAccount = { ...row };
      this.canDeleteAccount = true;
    },
    handleDeleteAccount() {
      this.canDeleteAccount = false;
      this.$store.dispatch("deleteAcctPos", this.deletingAccount);
      this.deletingAccount = null;
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
    handleCurrentChange(val: any) {
      if (val != undefined && val.acctNum) {
        this.selectedAccount = val.acctNum;
      } else {
        this.selectedAccount = null;
        this.currentAccount = { opDate: "", acctNum: "", balance: 0 };
      }
    }
  },
  computed: {
    tableAccounts() {
      return this.$store.getters.getAccountsByDate((this as any).currentDate);
    },
    tableEntries() {
      if (this.currentAccount != undefined && this.currentAccount.acctNum) {
        return this.$store.getters.getEntriesByAccount(
          (this as any).currentAccount.acctNum
        );
      }
      return [];
    }
  }
});
</script>
