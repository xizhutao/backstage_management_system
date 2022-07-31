<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="onComand">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <template v-if="isRoot">
                <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                <el-dropdown-item command="c">删除部门</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog
      title="新增部门"
      :visible.sync="dialogVisible"
      width="80%"
      @click.native.stop
      @close="handleClose"
    >
      <el-form
        ref="addForm"
        :model="addDepartmentForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentForm.manager"
            style="width: 100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑部门 -->
    <el-dialog
      title="编辑部门"
      :visible.sync="dialogVisible2"
      width="80%"
      @click.native.stop
      @close="handleClose"
    >
      <el-form
        ref="addForm"
        :model="addDepartmentForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentForm.manager"
            style="width: 100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit2">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
import { delDepartment, addDepartment, getDepartments, editDepartment, editDepartmentDetail } from '@/api/departments'
import { getSimpleUserList } from '@/api/user'
export default {
  name: 'TreeTools',
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }
  props: {
    //   定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      dialogVisible: false,
      dialogVisible2: false,
      // 收集表单数据
      addDepartmentForm: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          {
            required: true, message: '名称不能为空', trigger: 'blur'
          },
          { min: 3, max: 6, message: '字符在3~6个', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
          trigger: 'blur',
          validator: checkCodeRepeat
        }]
      },
      users: []
    }
  },
  methods: {
    async onComand (val) {
      if (val === 'a') {
        // 添加
        this.dialogVisible = true
        this.getSimpleUserList()
      } else if (val === 'b') {
        //  编辑
        this.dialogVisible2 = true
        this.getSimpleUserList()
        this.editDepartment()
      } else {
        // 删除
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.treeNode.id)
          this.$emit('deletDepartment')
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消成功',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      this.users = res
    },
    handleClose () {
      this.$refs.addForm.resetFields()
    },
    async handleSubmit () {
      this.dialogVisible = false
      this.addDepartmentForm.pid = this.treeNode.id
      await addDepartment(this.addDepartmentForm)
      this.$emit('deletDepartment')
    },
    async handleSubmit2 () {
      this.dialogVisible2 = false
      await editDepartmentDetail(this.treeNode.id, this.addDepartmentForm)
      this.$emit('deletDepartment')
    },
    async editDepartment () {
      const res = await editDepartment(this.treeNode.id)
      const { name, code, manager, introduce } = res
      // 给表单写入值
      this.addDepartmentForm.name = name
      this.addDepartmentForm.code = code
      this.addDepartmentForm.manager = manager
      this.addDepartmentForm.introduce = introduce
    }

  }
}
</script>
<style scoped lang='scss'>
::v-deep .el-input:placeholder-shown {
  font-size: 15px;
}
</style>
