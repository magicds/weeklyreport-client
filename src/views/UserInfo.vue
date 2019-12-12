<template>
  <Row style="padding-top:24px">
    <i-col :xl="{span:8,push	:8}" :lg="{span:12,push	:6}" :sm="{span:24}" :xs="{span:24}">
      <Card>
        <UserCard :user="user" @refresh="refresh" />
      </Card>
    </i-col>
  </Row>
</template>

<script>
import UserCard from '@/components/UserCard';
export default {
  name: 'userinfo',
  components: { UserCard },
  provide() {
    return {
      getDeptList: () => {
        return this.deptList;
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.userData;
    }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      deptList: []
    };
  },
  methods: {
    getData() {
      this.$fetch('api/dept/tree').then(res => {
        if (res.code !== 200) {
          return;
        }
        this.deptList = res.data.list;
      });
    },
    refresh(data) {
      this.$store.commit('updateUserData', { data: data });
    }
  }
};
</script>

<style>
</style>