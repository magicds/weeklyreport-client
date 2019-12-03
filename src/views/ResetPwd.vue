<template>
  <div class="rest-wrap">
    <div class="rest-box">
      <h2 class="rest-box-title">重置密码</h2>
      <i-form ref="form" :rules="relues" :model="user" @submit.native.prevent>
        <FormItem prop="email">
          <i-input type="text" v-model="user.email" placeholder="请输入您注册的邮箱"></i-input>
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
  </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  name: "ResetPwd",
  data() {
    return {
      loading: false,
      user: {
        email: ""
      },
      relues: {
        email: [
          {
            required: true,
            message: "请填写邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    toSignUp() {
      this.$router.push("/signup");
    },
    resetPwd() {
      this.$refs.form.validate(isValidated => {
        if (!isValidated) return;

        this.loading = true;

        this.$Message.success({
          content: "重置密码邮件已经发送，请注意查收！",
          closable: true,
          duration: 10
        });

        this.loading = false;
        this.$Message.error({
          // content: err.message || err,
          closable: true,
          duration: 10
        });
      });
    }
  }
};
</script>

<style scoped>
.rest-wrap {
  padding: 20px 0;
}
.rest-box {
  width: 300px;
  margin-top: calc(30% - 120px);
  margin-left: auto;
  margin-right: auto;
}
.rest-box-title {
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: #666;
  border-bottom: 1px solid #ddd;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>