<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" @deletDepartment="getDepartmentList" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools
            slot-scope="{ data }"
            :is-root="true"
            :tree-node="data"
            @deletDepartment="getDepartmentList"
          />
        </el-tree>
        <el-backtop></el-backtop>
      </el-card>
    </div>
  </div>
</template>
<script>
import TreeTools from '@/views/departments/components/TreeTools'
import { getDepartments } from '@/api/department'

export default {
  filters: {},
  components: { TreeTools },
  data () {
    return {
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      company: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    // 获取部门列表
    this.getDepartmentList()
  },

  methods: {
    // 点击节点回调
    handleNodeClick () {

    },
    // 获取部门列表
    async getDepartmentList () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // 处理数据
      /** **
      *  将列表型的数据转化成树形数据 => 递归算法 => 自身调用自身 => 一定条件不能一样， 否则就会死循环
      *  遍历树形 有一个重点 要先找一个头儿
      ****/
      function tranListToTreeData (list, rootValue) {
        var arr = []
        list.forEach(item => {
          if (item.pid === rootValue) {
            // 找到之后 就要去找 item 下面有没有子节点
            const children = tranListToTreeData(list, item.id)
            if (children.length) {
              // 如果children的长度大于0 说明找到了子节点
              item.children = children
            }
            arr.push(item) // 将内容加入到数组中
          }
        })
        return arr
      }
      const resolveRes = tranListToTreeData(res.depts, '')
      console.log('执行了编辑')
      this.departs = resolveRes
    }
  }
}
</script>

<style scoped lang='scss'>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
::v-deep .warpper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .dropdown {
    margin-right: 28px;
  }
  .rightManager {
    margin-right: 50px;
  }
}
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
