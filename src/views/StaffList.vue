<template>
  <div>
    <nav class="dept-nav" v-if="deptUserTree.length > 1">
      <span class="dept-nav-item" :class="{'active': activeId === dept.id}" @click="activeId = dept.id" :data-target="dept.id" v-for="dept in deptUserTree" :key="dept.id">{{dept.name}}</span>
    </nav>

    <div class="dept-list" v-if="deptUserTree.length">
      <div class="dept-item" v-for="dept in deptUserTree" :key="dept.id" :data-key="dept.id">
        <h3 class="dept-name">{{dept.name}}</h3>
        <Row :gutter="16" v-if="dept.members && dept.members.length">
          <i-col :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="user in dept.members" :key="user.id">
            <Card>
              <UserCard :user="user" />
            </Card>
          </i-col>
        </Row>
        <div class="dept-empty" v-else>此部门暂无成员</div>
      </div>
    </div>

    <!-- 游离人员 -->
    <Row class="other-user-list" :gutter="16" v-if="otherUsers && otherUsers.length">
      <i-col :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="user in otherUsers" :key="user.id">
        <Card>
          <UserCard :user="user" />
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue';
import scrollTo from '@/mixin/scrollto.js';

export default {
  name: 'staff-list',
  components: { UserCard },
  data() {
    return {
      deptList: [],
      otherUsers: [],
      activeId: ''
    };
  },
  mixins: [scrollTo],
  computed: {
    deptUserTree() {
      const deptUserTree = JSON.parse(JSON.stringify(this.deptList));

      deptUserTree.forEach(dept => {
        const deptLeader = dept.leader ? dept.leader.id : false;
        dept.members = dept.groups
          .map(group => {
            const groupLeader = group.leader ? group.leader.id : false;
            group.members.forEach(user=>{
              user.isDeptLeader = user.id === deptLeader;
              user.isGroupLeader = user.id === groupLeader;
            })
            return group.members;
          })
          .flat();
        console.log(dept.members);
      });
      console.log(deptUserTree);
      return deptUserTree;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$fetch('api/dept/tree').then(res => {
        if (res.code !== 200) {
          return;
        }
        this.deptList = res.data.list;
        this.otherUsers = res.data.users;
      });
    }
  },
  watch: {
    activeId(v) {
      this.scrollTo(document.querySelector(`.dept-item[data-key="${v}"]`));
    }
  }
};
</script>

<style socped lang="scss">

.dept-empty {
  margin: 8px 0;
  color: #999;
}
</style>