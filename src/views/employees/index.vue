<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通栏 -->
      <PageTools :is-show-before="true">
        <template v-slot:before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <template v-slot:after>
          <el-button type="danger">普通excel导出</el-button>
          <el-button type="info">复杂excel导出</el-button>
          <el-button type="success">excel导入</el-button>
          <el-button type="primary" @click="addEmploy">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-table :data="list" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="width" sortable>
        </el-table-column>
        <el-table-column label="姓名" prop="username" width="width" sortable>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" width="width" sortable>
        </el-table-column>
        <el-table-column label="工号" prop="workNumber" width="width" sortable>
        </el-table-column>
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          width="width"
          sortable
          :formatter="formOfEmployment"
        >
        </el-table-column>
        <el-table-column
          label="部门"
          prop="departmentName"
          width="width"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="入职时间"
          prop="timeOfEntry"
          width="width"
          sortable
        >
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="width"
          sortable
          prop="formOfEmployment"
        >
          <template slot-scope="{ row }">
            <el-switch
              :value="row.formOfEmployment === 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right" sortable>
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column></el-table
      >
      <!-- 分页 -->
      <el-row type="flex" align="middle" justify="center">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :current-page.sync="page.page"
          :page-size="page.size"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-row>
      <!-- 弹层 -->
      <AddEmploy :show-dialog="showDialog"></AddEmploy>
    </div>
  </div>
</template>

<script>
import AddEmploy from './components/add-employ.vue'
import emunEmployment from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
export default {
  filters: {},
  components: { AddEmploy },
  data () {
    return {
      loading: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList () {
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
    },
    handleCurrentChange (newpage) {
      this.page.page = newpage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formOfEmployment (row, column, cellValue, index) {
      const obj = emunEmployment.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee (id) {
      try {
        await this.$confirm('确认删除吗？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 新增员工
    addEmploy () {
      this.showDialog = true
    }

  }
}
</script>

<style scoped lang='scss'>
</style>
