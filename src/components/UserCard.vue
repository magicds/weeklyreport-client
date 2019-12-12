<template>
  <div class="user-card-inner">
    <div class="left">
      <label class="upload-avatar" for="useravatar">
        <Avatar :src="user.avatar" :style="{background: '#2d8cf0',color:'#fff'}" class="user-avatar" ref="avatar" :size="60">{{user.name | shortName}}</Avatar>
      </label>
      <p v-if="user.avatar">{{user.name | shortName}}</p>
      <!-- <input @change="savePhoto" accept=".jpg, .png" id="useravatar" name="useravatar" style="position:absolute;top:-100%;left:-100%;opacity:0;" type="file" /> -->
    </div>
    <div class="right">
      <div class="detail-title">
        <span>详细信息</span>
        <span class="user-action">
          <i-button @click="startEdit(user)" class="edit-btn btn-text" type="text">
            <Icon class="mr-s" type="ios-create"></Icon>编辑
          </i-button>
          <i-button :loading="loading" @click="deleteUser(user.id)" class="edit-btn btn-text" type="text" v-if="showDelete">
            <Icon class="mr-s" type="ios-trash-outline"></Icon>删除
          </i-button>
        </span>
      </div>
      <hr class="hr" />

      <div class="item">
        <Icon class="mr-s" type="ios-person"></Icon>
        <span>{{user.name}}</span>
        <span v-if="user.extInfo">({{user.extInfo}})</span>
        <Tag class="role-tag" color="green" v-if="user.isDeptLeader">部门经理</Tag>
        <Tag class="role-tag" color="blue" v-if="user.isGroupLeader">组长</Tag>
        <!-- <Tag color="green" v-if="user.isAdmin">管理员</Tag>
        <Tag color="blue" v-if="user.noReport">免填周报</Tag>-->
      </div>

      <div class="item">
        <Icon class="mr-s" type="ios-mail"></Icon>
        <p class="email-block">
          {{user.email}}
          <Button class="reset-pwd-btn" @click="resetPwd(user.email)">重置密码</Button>
        </p>
      </div>

      <div class="item">
        <Icon class="mr-s" type="ios-people"></Icon>
        <span>{{user.group.name}}</span>
      </div>
    </div>

    <Modal title="个人信息修改" :loading="true" v-model="editDialogShow" @on-ok="doSave">
      <UserEditor v-if="editDialogShow" ref="usereditor" :user="editData" />
    </Modal>
  </div>
</template>

<script>
import UserEditor from './UserEditor';

export default {
  props: {
    user: Object
  },
  components: { UserEditor },
  data() {
    return {
      loading: false,
      editDialogShow: false,
      editData: {}
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.userData;
    },
    showDelete() {
      if (this.user.id === this.currentUser.id) return false;
      if (this.currentUser.role < 100) return false;
      return true;
    }
  },
  methods: {
    startEdit(userData) {
      const editData = JSON.parse(JSON.stringify(userData));
      editData.dept = editData.dept.id;
      editData.group = editData.group.id;
      delete editData.meta;

      this.editData = editData;
      this.editDialogShow = true;
    },
    doSave() {
      const data = this.$refs.usereditor.getData();
      console.log(data);
      if (Object.keys(data).length < 2) {
        this.$Message.info('数据未修改');
        this.editDialogShow = false;
        return;
      }

      this.$fetch('api/user/update', data)
        .then(res => {
          if (res.code == 200) {
            this.editDialogShow = false;
            this.$Message.success('保存成功');
            this.refresh(res.data);
          } else {
            throw new Error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error(err.message);
          this.editDialogShow = false;
        });
    },
    deleteUser(userId) {
      this.$Modal.confirm({
        title: '删除确认',
        loading: true,
        content: '确定删除此用户，删除后不可恢复，且已填写日志无法查询？',
        onOk: () => {
          this.$fetch('api/user/remove', { uid: userId })
            .then(res => {
              if (res.code == 200) {
                this.$Message.success('删除成功');
                this.$Modal.remove();
                this.refresh(res.data);
              } else {
                throw new Error(res.message);
              }
            })
            .catch(err => {
              this.$Message.error(err.message);
              this.$Modal.remove();
            });
        }
      });
    },
    refresh(data) {
      this.$emit('refresh', data);
    },
    resetPwd(email) {
      alert('即将到来' + email);
    }
  }
};
</script>

<style lang="scss">
.role-tag {
  margin-left: 8px;
}
.user-card-inner {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  .left {
    width: 80px;
    align-self: center;
    .ivu-avatar-string {
      line-height: 60px;
    }
  }
  .right {
    flex-grow: 1;
  }
  .item {
    padding-left: 8px;
    line-height: 28px;
    height: 28px;
  }
  .detail-title {
    padding-left: 8px;
    display: flex;
    line-height: 32px;
    align-items: flex-start;
    justify-content: space-between;
  }
  .hr {
    margin-top: 4px;
    margin-bottom: 8px;
    border: 0;
    border-top: 1px solid #e5e5e5;
  }
  .user-action {
    align-self: flex-end;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-100px);
    transition: opacity 0.2s ease-out;
    .edit-btn {
      vertical-align: top;
      padding-left: 4px;
      padding-right: 4px;
    }
  }
  &:hover .user-action {
    pointer-events: auto;
    opacity: 1;
    transform: translateY(0);
  }
  .email-block {
    display: inline-block;
  }
  .reset-pwd-btn {
    opacity: 0;
    transition: all 0.2s ease-out;
  }
  &:hover .reset-pwd-btn {
    opacity: 1;
  }
}
</style>