import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    name: 'employees',
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id?', name: 'detail', component: () => import('@/views/employees/Detail.vue'), meta: {
      title: '员工详情'
    }, hidden: true
  },
  {
    path: 'print/:id', name: 'print',
    component: () => import('@/views/employees/print.vue'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }
  ]
}
