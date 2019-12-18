<template>
  <div class="dept-manange">
    <nav class="dept-nav" v-if="deptList.length > 1">
      <span class="dept-nav-item" :class="{'active': activeId === dept.id}" @click="activeId = dept.id" :data-target="dept.id" v-for="dept in deptList" :key="dept.id">{{dept.name}}</span>
    </nav>

    <div class="dept-list" v-if="deptList.length">
      <div class="dept-item" v-for="dept in deptList" :key="dept.id" :data-key="dept.id">
        <h3 class="dept-name">
          {{dept.name}}
          <Button class="edit-btn btn-text" type="text" icon="ios-create-outline" @click="showDeptDialog('edit', dept)" style="vertical-align: top;"></Button>
          <Button v-if="currentUser.role >= 1000" class="edit-btn btn-text" type="text" icon="ios-trash" @click="removeDept(dept)" style="vertical-align: top;"></Button>
        </h3>
        <Row class="group-list" v-if="dept.groups" :gutter="16">
          <i-col class="group-item" :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="group in dept.groups" :key="group.id">
            <Card class="group-card">
              <p class="line">组名：{{group.name}}</p>
              <p class="line">
                <span style="width: 100px">组长：{{group.leader ? group.leader.name : ''}}</span>
                <span>组员：{{group.members ? group.members.length : 0}}</span>
              </p>
              <!-- <Icon class="edit-btn"  type="ios-create-outline" @click="showGroupDialog('edit', dept.id, group)" /> -->
              <div class="group-btn-warp">
                <Button class="edit-btn btn-text" type="text" icon="ios-create-outline" @click="showGroupDialog('edit', dept.id, group)"></Button>
                <Button v-if="currentUser.role >= 100" class="edit-btn btn-text" type="text" icon="ios-trash" @click="removeGroup(group)"></Button>
              </div>
            </Card>
          </i-col>
          <i-col class="group-item add" :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}">
            <Card class="group-card add">
              <Icon class="add-icon" type="ios-add" @click="showGroupDialog('add', dept.id)" title="新增小组" />
            </Card>
          </i-col>
        </Row>
      </div>
    </div>

    <Button size="large" icon="md-add" @click="showDeptDialog('add')">创建新部门</Button>

    <!-- 部门编辑 -->
    <Modal :title="deptEditInfo.title" v-model="deptEditInfo.show" :loading="true" @on-ok="saveDept">
      <Form v-model="deptEditInfo.data" :label-width="80" v-if="deptEditInfo.show">
        <FormItem prop="name" label="部门名称">
          <i-input v-model="deptEditInfo.data.name"></i-input>
        </FormItem>
        <FormItem prop="leaderId" label="管理者" v-if="deptEditInfo.type != 'add'">
          <!-- <i-input v-model="deptEditInfo.data.leaderId"></i-input> -->
          <i-select v-model="deptEditInfo.data.leaderId">
            <i-option v-for="item in (deptUserMap[deptEditInfo.data.deptId] || [])" :key="item.id" :value="item.id">{{item.name}}</i-option>
          </i-select>
        </FormItem>
        <FormItem prop="note" label="备注">
          <i-input type="textarea" v-model="deptEditInfo.data.note"></i-input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 小组编辑 -->
    <Modal :title="groupEditInfo.title" v-model="groupEditInfo.show" :loading="true" @on-ok="saveGroup">
      <Form v-model="groupEditInfo.data" :label-width="80" v-if="groupEditInfo.show">
        <FormItem prop="name" label="小组名称">
          <i-input v-model="groupEditInfo.data.name"></i-input>
        </FormItem>
        <FormItem prop="leaderId" label="组长">
          <!-- <i-input v-model="groupEditInfo.data.leaderId"></i-input> -->

          <i-select v-model="groupEditInfo.data.leaderId" v-if="groupEditInfo.type != 'add'">
            <i-option v-for="item in (groupUserMap[groupEditInfo.data.groupId] || [])" :key="item.id" :value="item.id">{{item.name}}</i-option>
            <!-- <i-option v-for="item in otherUsers" :key="item.id" :value="item.id">{{item.name}}</i-option> -->
          </i-select>
        </FormItem>
        <FormItem prop="note" label="备注">
          <i-input type="textarea" v-model="groupEditInfo.data.note"></i-input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import scrollTo from '@/mixin/scrollto.js';
export default {
  name: 'DeptManage',
  mixins: [scrollTo],
  data() {
    return {
      activeId: '',
      deptList: [],
      otherUsers: [],
      deptEditInfo: {
        deptId: '',
        show: false,
        title: '',
        data: {},
        type: 'add'
      },
      groupEditInfo: {
        deptId: '',
        groupId: '',
        show: false,
        title: '',
        data: {},
        type: 'add'
      },
      colConfig: { lg: { span: 8 }, md: { span: 12 }, sm: { span: 24 }, xs: { span: 24 } }
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.userData;
    },
    // 部门下的可选人员
    deptUserMap() {
      const deptUserTree = JSON.parse(JSON.stringify(this.deptList));

      return deptUserTree.reduce((t, c) => {
        t[c.id] = c.groups
          .map(group => {
            return group.members;
          })
          .flat();
        return t;
      }, {});
    },
    // 小组下的可选人员
    groupUserMap() {
      const map = {};
      this.deptList.forEach(dept => {
        dept.groups.forEach(group => {
          map[group.id] = group.members;
        });
      });
      return map;
    },
    allUsers() {
      const deptUserMap = this.deptUserMap;
      const list = [];
      Object.keys(deptUserMap).forEach(id => {
        list.push(...deptUserMap[id]);
      });
      list.push(...this.otherUsers);
      return list;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$fetch('api/dept/tree').then(res => {
        console.log(res);
        if (res.code !== 200) {
          return;
        }
        this.deptList = res.data.list;
        this.otherUsers = res.data.users;
      });
    },
    showDeptDialog(type, dept) {
      this.deptEditInfo.type = type;
      if (type == 'add') {
        this.deptEditInfo.data = {
          deptId: '',
          name: '',
          leaderId: '',
          note: ''
        };
        this.deptEditInfo.show = true;
        this.deptEditInfo.title = '新增部门';
      } else {
        this.deptEditInfo.data = {
          deptId: dept.id,
          name: dept.name,
          leaderId: dept.leader ? dept.leader.id : dept.leader,
          note: dept.note || ''
        };
        this.deptEditInfo.show = true;
        this.deptEditInfo.title = dept.name;
      }
    },
    saveDept() {
      const type = this.deptEditInfo.type == 'add' ? 'add' : 'update';

      let { name, leaderId, note, deptId } = this.deptEditInfo.data;
      name = name.trim();
      if (!name) {
        this.$Message.error('部门名称必填！');
        this.deptEditInfo.show = false;
        return;
      }

      const saveData = {
        name,
        leader: leaderId,
        note
      };
      if (type == 'update') {
        saveData.deptId = deptId;
      }

      this.$fetch('api/dept/' + type, saveData).then(res => {
        console.log(res);
        if (res.code !== 200) {
          this.$Message.error('保存失败！' + res.message);
          this.deptEditInfo.show = false;
          return;
        }
        this.$Message.success('保存成功');
        this.getData();
        this.deptEditInfo.show = false;
      });
    },
    showGroupDialog(type, deptId, group) {
      this.groupEditInfo.type = type;
      if (type == 'add') {
        this.groupEditInfo.data = {
          name: '',
          leaderId: '',
          note: '',
          deptId
        };
        this.groupEditInfo.show = true;
        this.groupEditInfo.title = '新增小组';
        return;
      }
      if (type == 'edit') {
        this.groupEditInfo.data = {
          groupId: group.id,
          name: group.name,
          leaderId: group.leader ? group.leader.id : group.leader,
          note: group.note,
          deptId: deptId
        };
        this.groupEditInfo.show = true;
        this.groupEditInfo.title = group.name;
        return;
      }
    },
    saveGroup() {
      const type = this.groupEditInfo.type == 'add' ? 'add' : 'update';
      let { name, leaderId, note, deptId, groupId } = this.groupEditInfo.data;
      name = name.trim();
      if (!name) {
        this.$Message.error('部门名称必填！');
        return;
      }

      const saveData = {
        name,
        leader: leaderId,
        note
      };
      // 更新需要知道自己的 id 新增需要父部门的id
      if (type == 'update') {
        saveData.groupId = groupId;
      } else {
        saveData.dept = deptId;
      }

      this.$fetch('api/group/' + type, saveData).then(res => {
        console.log(res);
        if (res.code !== 200) {
          this.$Message.error('保存失败！' + res.message);
          return;
        }
        this.$Message.success('保存成功');
        this.getData();
        this.groupEditInfo.show = false;
      });
    },
    removeDept(dept) {
      if (this.currentUser.role <= 1000) return;
      if (dept.groups && dept.groups.length) {
        return this.$Message.error('此部门下已有小组，禁止删除！');
      }
      var that = this;
      this.$Modal.confirm({
        loading: true,
        title: '系统警告',
        content: '确定删除此部门，删除后此部门的所有数据将丢失，是否继续',
        onOk() {
          that
            .$fetch('api/dept/remove', { id: dept.id })
            .then(res => {
              if (res.code === 200) {
                that.$Message.success('删除成功');
                that.getData();
              } else {
                that.$Message.error(res.message);
              }
              that.$Modal.remove();
            })
            .catch(err => {
              that.$Message.error(err.message);
              that.$Modal.remove();
            });
        }
      });
    },
    removeGroup(group) {
      if (this.currentUser.role <= 100) return;
      var that = this;
      this.$Modal.confirm({
        loading: true,
        title: '系统警告',
        content: '确定删除此小组，删除后此小组的所有数据将丢失，是否继续',
        onOk() {
          that
            .$fetch('api/group/remove', { id: group.id })
            .then(res => {
              if (res.code === 200) {
                that.getData();
                that.$Message.success('删除成功');
              } else {
                that.$Message.error(res.message);
              }
              that.$Modal.remove();
            })
            .catch(err => {
              that.$Message.error(err.message);
              that.$Modal.remove();
            });
        }
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

<style lang="scss">
.dept-list {
  margin-bottom: 20px;
}
.dept-item {
  margin-top: 32px;
}
.dept-name {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 16px;
  line-height: 32px;
}
.group-item {
  margin-bottom: 16px;
}

.group-card {
  $padding: 16px;
  $height: 100px;
  .ivu-card-body {
    height: $height;
    position: relative;
  }
  .line {
    line-height: ($height - $padding * 2) / 2;
    > span {
      display: inline-block;
    }
  }
  .group-btn-warp {
    position: absolute;
    top: 16px;
    right: 16px;
    // line-height: ($height - $padding * 2 ) / 2 ;
    font-size: 20px;
    font-weight: bold;
    // opacity: 0;
    transition: all 0.2s ease-out;
    cursor: pointer;
  }
  &:hover .group-btn-warp {
    opacity: 1;
  }
  &.add {
    text-align: center;
    color: #999;
    cursor: pointer;
    &:hover {
      color: #333;
    }
    .add-icon {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      font-size: 60px;
      line-height: $height;
    }
  }
}
</style>