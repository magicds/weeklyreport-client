<template>
  <div class="reset-pwd-box" style="margin-top: 30px">
    <img class="logo" src="../assets/logo.png" />
    <h2 class="reset-pwd-box-title">重置密码</h2>
    <Form ref="form" :rules="relues" :model="user" @submit.native.prevent>
      <FormItem prop="email">
        <i-input type="text" v-model="user.email" placeholder="请输入您注册的邮箱"></i-input>
      </FormItem>
      <FormItem class="text-center">
        <Button type="primary" @click="resetPwd" :loading="loading" style="width:100%">重置密码</Button>
      </FormItem>
      <FormItem class="text-center">
        <Button type="text" style="float:left" @click="toLogin">去登录</Button>
        <Button type="text" style="float:right" @click="toSignUp">去注册</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  name: 'ResetPwd',
  data() {
    return {
      loading: false,
      user: {
        email: ''
      },
      relues: {
        email: [
          {
            required: true,
            message: '请填写邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    },
    toSignUp() {
      this.$router.push('/signup');
    },
    resetPwd() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;

        this.loading = true;

        this.$fetch('api/user/sendResetPwdMail', { email: this.user.email })
          .then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.$Message.success({
                content: '重置密码邮件已经发送，请注意查收！',
                closable: true,
                duration: 10
              });
            } else {
              throw new Error(res.message || res);
            }
          })
          .catch(err => {
            this.loading = false;
            this.$Message.error({
              content: err.message || err,
              closable: true,
              duration: 10
            });
          });
      });
    }
  }
};
</script>
