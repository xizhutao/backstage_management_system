<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/settings'
import { getDetailInfoById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList () {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getDetailInfoById (id) {
      const { roleIds } = await getDetailInfoById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 确定保存
    async btnOk () {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    // 确定取消
    btnCancel () {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style>
</style>
