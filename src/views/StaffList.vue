<template>
  <div>
    <div class="dept-nav" v-if="deptList.length"></div>

    <div class="dept-list" v-if="deptList.length">
      <Row class="dept-item" v-for="dept in deptList" :key="dept.id">
        <h3>{{dept.name}}</h3>
        <div class="group-list" v-if="dept.groups">
          <div class="group-item" v-for="group in dept.groups" :key="group.id">
            <p>
              组名：{{group.name}}
              人数：{{group.members ? group.members.length : 0}}
            </p>
            <Card v-for="user in group.members" :key="user.id">
              {{user.name}}
              {{user.group.name}}
            </Card>
          </div>
        </div>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'staff-list',
  data() {
    return {
      deptList: [],
      otherUsers: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$fetch('http://localhost:2222/fe-manage/api/dept/tree').then(res => {
        console.log(res);
        if (res.code !== 200) {
          return;
        }
        this.deptList = res.data.list;
        this.otherUsers = res.data.users;
      });
    }
  }
};
</script>

<style>
</style>