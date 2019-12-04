<template>
  <div class="signin-box">
    <img class="logo" src="../assets/logo.png" />
    <h2 style="text-align: center; margin-bottom: 20px;">注册</h2>
    <i-form ref="signinForm" :model="user" :rules="userRule" :label-width="80">
      <FormItem prop="email" label="邮箱">
        <i-input type="text" v-model="user.email" placeholder="请输入邮箱">
          <Icon type="ios-mail" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem prop="pwd" label="密码">
        <i-input type="password" v-model="user.pwd" placeholder="请输入登录密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem prop="name" label="姓名">
        <i-input type="text" v-model="user.name" placeholder="请输入姓名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem prop="dept" label="所在部门">
        <Select v-model="user.dept" prefix="ios-people">
          <Option v-for="item in deptList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="group" label="所属小组">
        <Select v-model="user.group" prefix="ios-people">
          <Option v-for="item in (deptMap[user.dept] ? deptMap[user.dept].groups: [])" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="gender" label="性别">
        <RadioGroup v-model="user.gender" style="width: 100%">
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
      <FormItem>
        <Button type="primary" @click="handleSubmit('signinForm')">注册</Button>
        <Button type="text" @click="toLogin">去登录</Button>
      </FormItem>
    </i-form>
  </div>
</template>

<script>
export default {
  name: 'signin',
  data() {
    return {
      groupList: [],
      user: {
        name: '',
        gender: undefined,
        username: '',
        pwd: '',
        dept: '',
        group: ''
      },
      userRule: {
        pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码至少6位',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名必填',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'blur'
          }
        ],
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
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
      }
    };
  },
  computed: {
    deptList() {
      const d = this.deptMap;
      return Object.keys(d).map(k => d[k]);
    },
    deptMap() {
      if (!this.groupList.length) return {};
      const d = {};
      this.groupList.forEach(g => {
        const dept = g.dept;
        if (!dept || !dept.id) return;

        if (!d[dept.id]) {
          d[dept.id] = {
            id: dept.id,
            name: dept.name,
            groups: [g]
          };
        } else {
          d[dept.id].groups.push(g);
        }
      });
      return d;
    }
  },
  mounted() {
    this.getGroupData();
  },
  methods: {
    getGroupData() {
      this.$fetch('http://localhost:2222/fe-manage/api/group/list').then(res => {
        console.log(res);
        if (res.code !== 200) {
          return this.$Message.error(res.message);
        }
        this.groupList = res.data;
      });
    },
    toLogin() {
      this.$router.push('/login');
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$fetch('http://localhost:2222/fe-manage/api/user/signup', {...this.user}).then(res => {
            if (res.code == 200) {
              return this.$Message.error('注册失败' + res.message);
            }

            this.$Message.success('注册成功，请等待管理者审批');
            this.$router.push({name:'login'});
            //
          });
        } else {
          this.$Message.error('请检查信息');
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.signin-box {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  .ivu-form {
    text-align: left;
  }
}
</style>