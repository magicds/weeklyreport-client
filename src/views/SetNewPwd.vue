<template>
  <div class="reset-pwd-box">
    <img class="logo" src="../assets/logo.png" />
    <h2 class="reset-pwd-box-title">设置新密码</h2>
    <i-form ref="form" :rules="relues" :model="user" @submit.native.prevent>
      <FormItem prop="token" label="凭据">
        <i-input type="text" v-model="user.token" readonly disabled></i-input>
      </FormItem>
      <FormItem prop="pwd" label="新密码">
        <i-input type="password" v-model="user.pwd" placeholder="请输入新密码"></i-input>
      </FormItem>
      <FormItem prop="pwd2" label="重复新密码">
        <i-input type="password" v-model="user.pwd2" placeholder="请再次输入新密码"></i-input>
      </FormItem>
      <FormItem class="text-center">
        <i-button type="primary" @click="resetPwd" :loading="loading" style="width:100%">重置密码</i-button>
      </FormItem>
      <FormItem class="text-center">
        <Button type="text" style="float:left" @click="toLogin">去登录</Button>
        <Button type="text" style="float:right" @click="toSignUp">去注册</Button>
      </FormItem>
    </i-form>
  </div>
</template>

<script>

export default {
  name: 'ResetPwd',
  data() {
    const params = this.getParams();
    return {
      loading: false,
      endDate: params.endDate,
      user: { uid: params.uid, token: params.token, pwd: '', pwd2: '' },
      relues: {
        pwd: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '密码至少6位',
            trigger: 'blur'
          }
        ],
        pwd2: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => {
              if (value === this.user.pwd) {
                return true;
              }
              return false;
            },
            message: '两次密码必须一致',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    if (!this.check()) {
      this.$Message.warning({
        content: '您此密码重置链接已过期，请重新重置密码',
        closable: true,
        duration: 10
      });
      this.$router.push('/resetPwd');
    }
  },
  methods: {
    check() {
      // 验证token是否在有效期内 服务端有二次校验，此处仅做用户提示
      const t = +new Date();
      const e = +new Date(this.endDate);
      return e >= t;
    },
    getParams() {
      const params = new URLSearchParams(location.search);
      return {
        token: params.get('token'),
        endDate: params.get('date'),
        uid: params.get('uid')
      };
    },
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

        this.$fetch('api/user/resetPwd', { uid: this.user.uid, token: this.user.token, newPwd: this.user.pwd })
          .then(res => {
            if (res.code == 200) {
              this.loading = false;
              this.$Message.success({
                content: '密码重置成功，请使用新密码登录',
                closable: true,
                duration: 10
              });
              this.toLogin();
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

<style >
</style>