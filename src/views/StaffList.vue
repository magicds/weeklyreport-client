<template>
  <div class="staff-manage">
    <nav class="dept-nav" v-if="deptUserTree.length > 1">
      <span class="dept-nav-item" :class="{'active': activeId === dept.id}" @click="activeId = dept.id" :data-target="dept.id" v-for="dept in deptUserTree" :key="dept.id">{{dept.name}}</span>
    </nav>

    <div class="dept-list" v-if="deptUserTree.length">
      <div class="dept-item" v-for="dept in deptUserTree" :key="dept.id" :data-key="dept.id">
        <h2 class="dept-name">{{dept.name}}</h2>
        <Row :gutter="16" >
          <i-col class="card-wrap" :xl="8" :lg="{span:12}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" >
          <Card v-if="dept.leader && dept.leader.id">
            <UserCard :user="dept.leader" @refresh="getData" :is-admin="true" />
          </Card>
          </i-col>
        </Row>
        <div v-if="dept.groups.length">
          <div class="group-item" v-for="group in dept.groups" :key="group.id">
            <!-- <h3 class="group-name">{{group.name}}</h3> -->
            <Row :gutter="16" v-if="group.members && group.members.length">
              <i-col class="card-wrap" :xl="8" :lg="{span:12}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="user in group.members" :key="user.id">
                <Card>
                  <UserCard :user="user" @refresh="getData" :is-admin="true" />
                </Card>
              </i-col>
            </Row>
            <div class="dept-empty" v-else>此小组暂无成员</div>
          </div>
        </div>
        <div class="dept-empty" v-else>此部门暂无成员</div>
      </div>
    </div>

    <!-- 游离人员 -->
    <Row class="other-user-list" :gutter="16" v-if="0 && otherUsers && otherUsers.length">
      <i-col :lg="{span:8}" :xl="8" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="user in otherUsers" :key="user.id">
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
      let deptUserTree = JSON.parse(JSON.stringify(this.deptList));

      const userData = this.$store.state.userData;
      const userDeptId = userData.dept.id;
      const isSuper = userData.role >= 1000;
      // filter: if user is just dept leader, just show it's own dept
      if (!isSuper) {
        deptUserTree = deptUserTree.filter(d => d.id == userDeptId);
      }

      deptUserTree.forEach(dept => {
        
        const deptLeader = dept.leader ? dept.leader.id : false;
        dept.groups.forEach(group => {
          const groupLeader = group.leader ? group.leader.id : false;
          group.members.forEach(user => {
            user.isDeptLeader = user.id === deptLeader;
            user.isGroupLeader = user.id === groupLeader;
            if (!user.index) user.index = 0;
            if (user.isDeptLeader) user.index -= 100;
            if (user.isGroupLeader) user.index -= 10;
            if (user.isDeptLeader) {
              dept.leader = user;
            }
          });
          group.members.sort((a, b) => {
            if (a.index == b.index) return 0;
            return a.index - b.index < 0 ? -1 : 1;
          });
          group.members = group.members.filter(u => !u.isDeptLeader);
        });
        // dept.members = dept.groups
        //   .map(group => {
        //     const groupLeader = group.leader ? group.leader.id : false;
        //     group.members.forEach(user => {
        //       user.isDeptLeader = user.id === deptLeader;
        //       user.isGroupLeader = user.id === groupLeader;
        //     });
        //     return group.members;
        //   })
        //   .flat();
        console.log(dept.members);
      });
      console.log(deptUserTree);
      return deptUserTree;
    }
  },
  mounted() {
    this.getData();
  },
  provide() {
    return {
      getDeptList: () => {
        return this.deptList;
      }
    };
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
.staff-manage {
  padding-bottom: 32px;
}
.dept-empty {
  margin: 8px 0;
  color: #999;
}
.card-wrap {
  margin-bottom: 16px;
}
</style>
<style scoped>
.group-name {
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 32px;
}
</style>