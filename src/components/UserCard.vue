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
          <i-button @click="startEdit" class="edit-btn btn-text" type="text">
            <Icon class="mr-s" type="ios-create"></Icon>编辑
          </i-button>
          <i-button :loading="loading" @click="deleteUser(userId)" class="edit-btn btn-text" type="text" v-if="showDelete">
            <Icon class="mr-s" type="ios-trash-outline"></Icon>删除
          </i-button>
        </span>
      </div>
      <hr class="hr" />

      <div class="item">
        <Icon class="mr-s" type="ios-person"></Icon>
        <span>{{user.name}}</span>
        <Tag color="green" v-if="user.isDeptLeader">部门经理</Tag>
        <Tag color="blue" v-if="user.isGroupLeader">组长</Tag>
        <!-- <Tag color="green" v-if="user.isAdmin">管理员</Tag>
        <Tag color="blue" v-if="user.noReport">免填周报</Tag>-->
      </div>

      <div class="item">
        <Icon class="mr-s" type="ios-mail"></Icon>
        <span>{{user.email}}</span>
      </div>

      <div class="item">
        <Icon class="mr-s" type="ios-people"></Icon>
        <span>{{user.group.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    showDelete() {
      return true;
    }
  },
  methods: {
    startEdit() {
      alert('功能即将上线，请稍后');
    },
    deleteUser() {
      alert('功能即将上线，请稍后');
    }
  }
};
</script>

<style lang="scss">
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
}
</style>