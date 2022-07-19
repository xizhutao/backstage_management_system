<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- tab栏切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button
            class="add_btn"
            type="primary"
            size="medium"
            @click="addRole"
            >新增角色</el-button
          >
          <!-- 表格  -->
          <el-table :data="RoleList" border style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="name" label="角色" width="200">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope"
                ><el-button type="success" size="small">分配权限</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="editRole(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteRole(scope.row.id)"
                  >删除</el-button
                ></template
              >
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              :total="page.total"
              :page-size="page.pagesize"
              :current-page="page.page"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="formData.companyAddress"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="formData.mailbox"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- 编辑弹层 -->
      <el-dialog
        title="编辑弹层"
        :visible.sync="dialogVisible"
        @close="btnCancel"
      >
        <!--表单 -->
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/settings'
import { mapGetters } from 'vuex'
export default {
  filters: {},
  components: {},
  data () {
    // 自定义的角色名是否重复的验证规则
    const checkRoleNameRepeate = (rule, value, callback) => {
      // 获取角色列表
      this.getRoleList()
      const isRepeate = this.RoleList.some(item => item.name === value)
      isRepeate ? callback(new Error('角色名称重复')) : callback()
    }
    return {
      activeName: 'first',
      page: {
        pagesize: 3, //
        page: 1, // 角色列表的大小
        total: 0 // 记录总页数
      },
      RoleList: [], // 存放角色列表
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { validator: checkRoleNameRepeate, message: '角色名已经存在', trigger: 'blur' }
        ]
      },
      formData: {}, // 存放公司信息
      dialogVisible: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules2: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  created () {
    // 获取角色列表
    this.getRoleList()
    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    // tab栏切换
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 获取角色列表
    async getRoleList () {
      const res = await getRoleList(this.page)
      const { rows, total } = res
      this.page.total = total
      this.RoleList = rows
    },
    // 当前分页变化
    handleCurrentChange (newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 删除角色
    async deleteRole (id) {
      try {
        await this.$confirm('确认删除此角色吗')
        // 点击确认才能进入下方
        await deleteRole(id) // 删除角色
        this.getRoleList() // 重新获取角色
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 获取公司信息
    // 获取的公司的信息
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 编辑角色
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.dialogVisible = true
    },
    // 确认编辑
    async btnOK () {
      try {
        // await this.$refs.roleForm.validate()
        // 校验通过了才会执行以下代码
        if (this.roleForm.id) {
          // 更新信息
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.dialogVisible = false
        // 重新拉取角色列表
        this.getRoleList()
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 取消编辑
    btnCancel () {
      // 将表单和校验规则清空
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.dialogVisible = false
    },
    // 添加角色
    addRole () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang='scss'>
.add_btn {
  margin-bottom: 30px;
  zoom: 0.9;
}
.block {
  margin-top: 10px;
}
</style>
