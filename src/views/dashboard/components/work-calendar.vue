<template>
  <!-- 日历组件 -->
  <div>
    <!-- 放置一个日历组件 -->
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select
        @change="dataChange"
        v-model="currentYear"
        size="small"
        style="width: 120px"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <!-- 月 -->
      <el-select
        @change="dataChange"
        v-model="currentMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  created () {
    this.currentYear = this.startDate.getFullYear() //当前年份
    this.currentMonth = this.startDate.getMonth() + 1 //当前月份
    // 快速生成数组的方法
    this.yearList = Array.from(Array(11), (v, k) => this.currentYear + k - 5)
  },

  data () {
    return {
      currentMonth: null,
      currentYear: null,
      yearList: [],
      currentDate: null
    }
  },
  methods: {
    dataChange () {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    // 是否是休息日
    isWeek (value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style lang='scss'  scoped>
::v-deep .el-calendar-day {
  height: auto;
}
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none;
}
</style>

