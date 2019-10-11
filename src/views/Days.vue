<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <h2>Операционные дни</h2>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-popover placement="right-end" width="160" v-model="canDeleteDay">
            <p>Удалить запись?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" icon="el-icon-error" circle @click="canDeleteDay=false"></el-button>
              <el-button
                size="mini"
                icon="el-icon-success"
                type="danger"
                circle
                @click="handleDeleteDay()"
              ></el-button>
            </div>
          </el-popover>
          <Days
            :handleSelect="handleSelectDay"
            :handleDelete="confirmDeleteDay"
            :handleAdd="handleAddDay"
          />
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <h1>Проводки операционного дня</h1>
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
            :date="selectedDate"
            :handleDelete="confirmDeleteOperation"
            :handleEdit="handleEditOperation"
            :handleAdd="handleAddOperation"
            :handleSelect="()=>{}"
          />
        </el-col>
      </el-row>
    </el-main>
    <AddDay
      title="Добавление даты"
      :visible.sync="dialogAddDayVisible"
      :data="addDayForm"
      :handleComplete="completeAddDay"
      :handleCancel="() => dialogAddDayVisible=false"
    />
    <!-- Form edit operation -->
    <ModifyOperation
      title="Редактирование проводки"
      :visible.sync="dialogEditOperationVisible"
      :data="currentOperation"
      :limited="true"
      :accounts="$store.state.acct"
      :handleComplete="completeEditOperation"
      :handleCancel="() => dialogEditOperationVisible=false"
    />
    <!-- Form add operation -->
    <ModifyOperation
      title="Добавление проводки"
      :visible.sync="dialogAddOperationVisible"
      :data="currentOperation"
      :accounts="$store.state.acct"
      :handleComplete="completeAddOperation"
      :handleCancel="() => dialogAddOperationVisible=false"
    />
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import Operations from "../components/Operations.vue";
import Days from "../components/Days.vue";
import AddDay from "../components/AddDay.vue";
import ModifyAccount from "../components/ModifyAccount.vue";
import ModifyOperation from "../components/ModifyOperation.vue";

Vue.component("Operations", Operations);
Vue.component("Days", Days);
Vue.component("AddDay", AddDay);
Vue.component("ModifyAccount", ModifyAccount);
Vue.component("ModifyOperation", ModifyOperation);

export default Vue.extend({
  data() {
    return {
      dialogAddDayVisible: false,
      deletingDay: null,
      canDeleteDay: false,
      addDayForm: { opDate: "" },
      allDates: this.$store.state.opDate,
      currentRow: null,
      selectedDate: "",
      dialogEditOperationVisible: false,
      dialogAddOperationVisible: false,
      canDeleteOperation: false,
      deletingOperation: null,
      currentOperation: { opDate: "", acctNumCr: "", acctNumDb: "", balance: 0 }
    };
  },
  methods: {
    handleSelectDay(val: any) {
      this.currentRow = val;
      if (val) {
        this.selectedDate = val.opDate;
      }
    },
    handleAddDay() {
      this.addDayForm = { opDate: "" };
      this.dialogAddDayVisible = true;
    },
    completeAddDay(result: any) {
      result.opDate = moment(result.opDate).format("YYYY-MM-DD");
      if (this.$store.getters.hasDate(result.opDate)) {
        this.$notify.error({
          title: "Ошибка",
          message: "Дата уже существует"
        });
        return;
      }
      this.dialogAddDayVisible = false;
      this.$store.dispatch("addOpDate", { ...result });
    },
    confirmDeleteDay(row: any) {
      this.deletingDay = { ...row };
      this.canDeleteDay = true;
    },
    handleDeleteDay() {
      this.canDeleteDay = false;
      this.$store.dispatch("deleteOpDate", this.deletingDay);
      this.deletingDay = null;
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
    tableEntries() {
      if (this.currentRow === null) return [];
      return this.$store.getters.getEntriesByDate(
        (this as any).currentRow.opDate
      );
    }
  }
});
</script>
