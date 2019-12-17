<template>
  <Form ref="signinForm" :model="editData" :rules="userRule" :label-width="80">
    <FormItem prop="email" label="邮箱">
      <i-input type="text" readonly v-model="editData.email" placeholder="请输入邮箱">
        <Icon type="ios-mail-outline" slot="prepend"></Icon>
      </i-input>
    </FormItem>
    <FormItem prop="name" label="姓名">
      <i-input type="text" v-model="editData.name" placeholder="请输入姓名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </i-input>
    </FormItem>
    <FormItem prop="extInfo" label="备注信息">
      <i-input type="text" v-model="editData.extInfo" placeholder="输入您的备注信息，如实习生、试用期等">
        <Icon type="ios-alert-outline" slot="prepend"></Icon>
      </i-input>
    </FormItem>
    <FormItem prop="dept" label="所在部门">
      <Select v-model="editData.dept" prefix="ios-people-outline">
        <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem prop="group" label="所属小组">
      <Select v-model="editData.group" prefix="ios-people-outline">
        <Option v-for="item in (deptMap[user.dept] ? deptMap[user.dept].groups: [])" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem prop="gender" label="性别">
      <RadioGroup v-model="editData.gender" style="width: 100%">
        <Radio label="男">
          <Icon type="ios-man"></Icon>
          <span>男</span>
        </Radio>
        <Radio label="女">
          <Icon type="ios-woman"></Icon>
          <span>女</span>
        </Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: 'user-editor',
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      }
    }
    // deptList: {
    //   type: Array,
    //   default: () => []
    // },
    // deptMap: {
    //   type: Array,
    //   default: () => {
    //     return {};
    //   }
    // }
  },
  inject: ['getDeptList'],
  data() {
    return {
      editData: JSON.parse(JSON.stringify(this.user)),
      deptList: this.getDeptList(),
      userRule: {
        name: [
          {
            required: true,
            message: '姓名必填',
            trigger: 'blur'
          }
        ],
        // gender: [
        //   {
        //     required: true,
        //     message: '请选择性别',
        //     trigger: 'blur'
        //   }
        // ],
        dept: [
          {
            required: true,
            message: '请选择所属部门',
            trigger: 'blur'
          }
        ],
        group: [
          {
            required: true,
            message: '请选择所属小组',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '登录邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    deptMap() {
      return this.deptList.reduce((t, d) => {
        t[d.id] = d;
        return t;
      }, {});
      // return {}
    }
  },
  methods: {
    getData() {
      const origin = this.user;
      const data = JSON.parse(JSON.stringify(this.editData));
      // diff
      Object.keys(data).forEach(k => {
        if (k != 'id' && data[k] == origin[k]) {
          delete data[k];
        }
      });
      return data;
    }
  }
};
</script>

<style>
</style>