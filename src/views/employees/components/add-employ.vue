<template>
  <el-dialog title="新增员工" :visible.sync="showDialog">
    <!-- 表单 -->
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="120px"
    >
      <el-form-item prop="username" label="姓名">
        <el-input
          v-model="ruleForm.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机">
        <el-input
          v-model="ruleForm.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间">
        <el-date-picker
          v-model="ruleForm.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式">
        <el-select
          v-model="ruleForm.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="workNumber" label="工号">
        <el-input
          v-model="ruleForm.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门">
        <el-input
          v-model="ruleForm.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="selectDepartment"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :default-expand-all="true"
          :data="treeData"
          :props="defaultProps"
          @node-click="selectNode"
        >
        </el-tree>
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间">
        <el-date-picker
          v-model="ruleForm.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancelBtn">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/department'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'AddEmploy',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      ruleForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    async selectDepartment () {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 选择树形节点
    selectNode (node) {
      this.ruleForm.departmentName = node.name
      this.showTree = false
    },
    // 新增员工
    async btnOk () {
      console.log(123)
      // 1、进行表单整体校验
      await this.$refs.ruleForm.validate()
      // 2、新增员工
      await addEmployee(this.ruleForm)
      // 通知父组件更新数据
      await this.$parent.getEmployeeList()
      this.$parent.showDialog = false
    },
    // 取消
    cancelBtn () {
      this.ruleForm = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 重置表单校验
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style>
</style>
