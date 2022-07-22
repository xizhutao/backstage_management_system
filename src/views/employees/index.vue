<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 通栏 -->
      <PageTools :is-show-before="true">
        <template v-slot:before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <template v-slot:after>
          <el-button type="danger" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info">复杂excel导出</el-button>
          <el-button type="success" @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button type="primary" @click="addEmploy">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <el-table :data="list" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="width" sortable>
        </el-table-column>
        <el-table-column label="姓名" prop="username" width="width" sortable>
        </el-table-column>
        <el-table-column label="头像" prop="staffPhoto" width="width" sortable>
          <template slot-scope="scope">
            <img
              v-imageerror
              :src="scope.row.staffPhoto"
              style="width: 40px"
              alt=""
            />
          </template>
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
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
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
import { formatDate } from '@/filters'
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
    },
    // excel导出
    async exportExcel () {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 对拿到的数据格式化
      const formJson = (rows, headers) => {
        return rows.map((item) => {
          return Object.keys(headers).map((key) => {
            if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
              return formatDate(item[headers[key]])
            } else if (headers[key] === 'formOfEmployment') {
              const obj = emunEmployment.hireType.find(obj => obj.id === item[headers[key]])
              return obj ? obj.value : '未知'
            }
            return item[headers[key]]
          })
        })
      }
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = formJson(rows, headers)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工工资表', // 非必填
          multiHeader,
          merges
          // autoWidth: true, // 非必填
          // bookType: 'xlsx' // 非必填
        })
      })
    }

  }
}
</script>

<style scoped lang='scss'>
</style>
