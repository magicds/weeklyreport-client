<template>
  <div class="login-box">
    <img class="logo" src="../assets/logo.png" />
    <h2 style="text-align: center; margin-bottom: 20px;">登录</h2>
    <Form class="login-form" ref="loginForm" :model="user" :rules="userRule">
      <!-- <FormItem prop="username" label="用户名">
        <i-input type="text" v-model="user.username" placeholder="请输入用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </i-input>
      </FormItem>-->
      <FormItem prop="email" label="邮箱">
        <i-input type="text" v-model="user.email" placeholder="请输入邮箱">
          <Icon type="ios-mail" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem prop="password" label="密码">
        <i-input type="password" v-model="user.password" placeholder="请输入登录密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </i-input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
        <Button type="text" @click="toSignUp">去注册</Button>
        <Button type="text" style="float:right" @click="toForgetPwd">忘记密码</Button>
        <!-- <Button type="primary" @click="handleSubmit('loginForm')">登录</Button> -->
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      userRule: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
          // {
          //   type: "string",
          //   min: 6,
          //   message: "密码至少6位",
          //   trigger: "blur"
          // }
        ]
      }
    };
  },
  mounted() {
    this.autoLogin();
  },
  methods: {
    autoLogin() {
      this.$fetch('api/user/autoLogin').then(res => {
        if (res.code === 200) {
          this.$store.commit('updateUserData', { data: res.data });
          // 提取跳转
          const { params } = this.$route;
          if (params && params.originPath) {
            this.$router.push(params.originPath);
          } else {
            this.$router.push({ name: 'summary' });
          }
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success('Success!');
          const { email, password } = this.user;
          // Api.User.logIn(username, password)
          this.$fetch('api/user/login', {
            email,
            pwd: password
          })
            .then(res => {
              if (res.code === 200) {
                this.$store.commit('updateUserData', { data: res.data });
                this.$router.push({ name: 'input' });
              } else {
                this.$store.commit('updateUserData', { data: null });
                this.$Message.error({
                  content: res.message,
                  closable: true,
                  duration: 10
                });
              }
              console.log(res);
            })
            .catch(this.loginError);
        } else {
          this.$Message.error('登录失败!');
        }
      });
    },
    toSignUp() {
      this.$router.push('/signup');
    },
    toForgetPwd() {
      this.$router.push({ name: 'resetPwd' });
    }
  }
};
</script>


<style scoped lang="scss">
.login-box {
  padding-top: 32px;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  .ivu-form {
    text-align: left;
  }
}
</style>