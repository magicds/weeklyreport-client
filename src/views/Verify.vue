<template>
  <div>
    <Alert type="warning">
      <p>如果您确认下方用户是团队成员，请点击按钮通过验证请求。否则请忽略或删除。</p>
    </Alert>
    <legend class="user-verify-title">未验证成员</legend>
    <i-table :columns="tableColumns" :data="userList" :loading="loading" no-data-text="暂无未验证用户"></i-table>
    <legend class="user-verify-title">验证记录</legend>
    <div class="user-verify-logs">
      <ul v-if="logsData.length">
        <li :key="log.id" class="verify-log-item" v-for="log in logsData">
          <Tag :color="log.type | type2color" style="vertical-align: top; width:50px; text-align: center;">{{log.type}}</Tag>
          <span>{{log.date | timestamp2Date}}</span>
          <span>{{log.info}}</span>
        </li>
      </ul>
      <div class="no-logs" v-else>暂无记录</div>
    </div>
  </div>
</template>

<script>
import { date2text } from '@/util/date.js';

export default {
  name: 'verify',
  data() {
    return {
      loading: true,
      tableColumns: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: 'email',
          key: 'email'
        },
        {
          title: '所在部门',
          key: 'deptName'
        },
        {
          title: '所属小组',
          key: 'groupName'
        },
        {
          title: '注册时间',
          key: 'date'
        },
        {
          title: '操作',
          width: 200,
          render: (h, params) => {
            return h('ButtonGroup', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    icon: 'ios-checkmark'
                  },
                  on: {
                    click: () => {
                      this.verifyUser(params.row);
                    }
                  }
                },
                '通过'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'dashed',
                    icon: 'ios-trash-outline'
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params.row);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ],
      userList: [],
      logsData: []
    };
  },
  computed: {
    user() {
      return this.$store.state.userData;
    }
  },
  filters: {
    type2color(type) {
      let color = 'default';
      switch (type) {
        case 'signup':
          color = 'default';
          break;
        case 'verify':
          color = 'green';
          break;
        case 'delete':
          color = 'red';
          break;
        default:
          break;
      }
      return color;
    },
    timestamp2Date(d) {
      const date = new Date(d);
      return date2text(date, true);
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getUnVerifyList() {
      const { role } = this.user;
      const deptQ = role < 1000 ? `&dept=${this.user.dept.id}` : '';
      return this.$fetch('api/user/list?unVerify=true' + deptQ).then(res => {
        if (res.code == 200) {
          return res.data;
        } else {
          return Promise.reject(new Error(res.message));
        }
      });
    },
    getVerifyLog() {
      return this.$fetch('api/user/verifylog').then(res => {
        if (res.code == 200) {
          return res.data;
        } else {
          return Promise.reject(new Error(res.message));
        }
      });
    },
    getData() {
      this.loading = true;
      return Promise.all([this.getUnVerifyList(), this.getVerifyLog()])
        .then(data => {
          const [userList, logs] = data;
          console.log(...arguments);
          userList.forEach(item => {
            item.groupName = item.group.name;
            item.deptName = item.dept.name;
            item.date = item.meta.createAt;
          });
          this.userList = userList;
          this.logsData = logs;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$Message.error(err.message);
        });
    },
    verifyUser(user) {
      this.loading = true;
      this.$fetch('api/user/verify', { uid: user.id }).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.$Message.success('认证成功');
          return this.getData();
        } else {
          this.$Message.success('操作失败');
        }
      });
    },
    deleteUser(user) {
      this.$fetch('api/user/remove', { uid: user.id }).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.$Message.success('删除成功');
          return this.getData();
        } else {
          this.$Message.success('操作失败');
        }
      });
    }
  }
};
</script>

<style>
.user-verify-title {
  margin-top: 20px;
}
.verify-log-item {
  line-height: 30px;
  margin-bottom: 6px;
}
.no-logs {
  text-align: center;
  padding: 20px;
}
</style>