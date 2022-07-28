<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="perssionList" row-key="id" border>
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deletePermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹层 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        @close="btnCancel"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="formData"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input
              v-model="formData.description"
              style="width: 90%"
            ></el-input>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnOk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  filters: {},
  components: {},
  data () {
    return {
      perssionList: [],
      dialogVisible: false, //控制弹层
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
    }
  },
  computed: {},
  watch: {},
  created () {
    // 获取权限列表
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList () {
      const res = await getPermissionList()
      // 将数据处理成树形结构
      this.perssionList = tranListToTreeData(res, '0')

    },
    // 添加权限
    async addPermission (type, pid) {
      console.log('pid', pid);
      this.formData.type = type
      this.formData.pid = pid
      this.dialogVisible = true
    },
    // 确认提交表单
    btnOk () {
      // 先对表单进行校验
      this.$refs.form.validate().then(() => {
        if (this.formData.id) {
          // 是编辑
          return updatePermission(this.formData)
        }
        // 是添加
        return addPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success('新增成功')
        this.getPermissionList()
        this.dialogVisible = false
      })
    },
    // 取消提交
    btnCancel () {
      // 清空表格
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      }
      // 清空表单校验
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 删除
    deletePermission (id) {
      this.$confirm('确认删除吗？').then(() => {
        // 删除id
        return delPermission(id)
      }).then(() => {
        // 提示消息
        this.$message.success('删除成功')
        // 重新获取权限列表
        this.getPermissionList()
        // 关闭弹层
        this.dialogVisible = false
      })
    },
    // 编辑
    async editPermission (id) {
      this.formData = await getPermissionDetail(id)
      this.dialogVisible = true
    }
  }

}
</script>

<style scoped lang='scss'>
</style>
