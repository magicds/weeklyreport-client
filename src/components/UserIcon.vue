<template>
  <Dropdown @on-click="itemClick" placement="bottom-end" trigger="click">
    <a class href="javascript:void(0)">
      <Avatar size="default">{{data.name | shortName}}</Avatar>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem name="userinfo">个人信息</DropdownItem>
      <!-- <DropdownItem name="admin" v-if="user.isAdmin">人员管理</DropdownItem>
      <DropdownItem name="groupAdmin" v-if="user.isAdmin">小组管理</DropdownItem>
      <DropdownItem name="verify" v-if="user.isAdmin">未验证用户</DropdownItem>-->
      <DropdownItem v-for="item in extItems" :key="item.id" :name="item.name">{{item.text}}</DropdownItem>
      <DropdownItem divided name="logout">注销登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
export default {
  name: 'user-icon',
  props: {
    extItems: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
      required: true
    },
    onItemClick: {
      type: Function
    }
  },
  methods: {
    itemClick(name) {
      this.onItemClick(name);
    }
  }
};
</script>

<style>
</style>