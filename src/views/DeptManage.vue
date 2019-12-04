<template>
  <div>
    <div class="dept-nav" v-if="deptList.length"></div>

    <div class="dept-list" v-if="deptList.length">
      <div class="dept-item" v-for="dept in deptList" :key="dept.id">
        <h3>{{dept.name}}</h3>
        <Row class="group-list" v-if="dept.groups" :gutter="16">
          <i-col class="group-item" :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}" v-for="group in dept.groups" :key="group.id">
            <Card class="group-card">
              <p class="line">组名：{{group.name}}</p>
              <p class="line">
                <span>组长：{{group.leader ? group.leader.name : ''}}</span>
                <span>组员：{{group.members ? group.members.length : 0}}</span>
              </p>
              <!-- <Icon class="edit-btn"  type="ios-create-outline" @click="showGroupDialog('edit', dept.id, group)" /> -->
              <Button class="edit-btn" type="text" icon="ios-create-outline" @click="showGroupDialog('edit', dept.id, group)"></Button>
            </Card>
          </i-col>
          <i-col class="group-item add" :lg="{span:8}" :md="{span:12}" :sm="{span:24}" :xs="{span:24}">
            <Card class="group-card add">
              <Icon class="add-icon" type="ios-add" @click="showGroupDialog('add', dept.id)" />
            </Card>
          </i-col>
        </Row>
      </div>
    </div>

    <Button type="text" icon="ios-add" @click="showDeptDialog('add')">创建新部门</Button>

    <!-- 部门编辑 -->
    <Modal :title="deptEditInfo.title" v-model="deptEditInfo.show" :loading="true" @on-ok="createDept">
      <Form v-model="deptEditInfo.data" :label-width="80" v-if="deptEditInfo.show">
        <FormItem prop="name" label="部门名称">
          <i-input v-model="deptEditInfo.data.name"></i-input>
        </FormItem>
        <FormItem prop="leaderId" label="管理者">
          <!-- <i-input v-model="deptEditInfo.data.leaderId"></i-input> -->
          <i-select v-model="deptEditInfo.data.leaderId">
            <i-option v-for="item in allUsers" :key="item.id" :value="item.id">{{item.name}}</i-option>
          </i-select>
        </FormItem>
        <FormItem prop="note" label="备注">
          <i-input type="textarea" v-model="deptEditInfo.data.note"></i-input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 小组编辑 -->
    <Modal :title="groupEditInfo.title" v-model="groupEditInfo.show" :loading="true" @on-ok="createGroup">
      <Form v-model="groupEditInfo.data" :label-width="80" v-if="groupEditInfo.show">
        <FormItem prop="name" label="小组名称">
          <i-input v-model="groupEditInfo.data.name"></i-input>
        </FormItem>
        <FormItem prop="leaderId" label="组长">
          <!-- <i-input v-model="groupEditInfo.data.leaderId"></i-input> -->
          
          <i-select v-model="groupEditInfo.data.leaderId">
            <!-- TODO error  -->  
            <i-option v-for="item in deptUserMap[groupEditInfo.deptId]" :key="item.id" :value="item.id">{{item.name}}</i-option>
            <i-option v-for="item in otherUsers" :key="item.id" :value="item.id">{{item.name}}</i-option>
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
export default {
  name: 'DeptManage',
  data() {
    return {
      deptList: [],
      otherUsers: [],
      deptEditInfo: {
        show: false,
        title: '',
        data: {}
      },
      groupEditInfo: {
        deptId: '',
        show: false,
        title: '',
        data: {}
      },
      colConfig: { lg: { span: 8 }, md: { span: 12 }, sm: { span: 24 }, xs: { span: 24 } }
    };
  },
  computed: {
    // 部门下的可选人员
    deptUserMap() {
      const deptMap = {};
      this.deptList.forEach(dept => {
        if (!deptMap[dept.id]) {
          deptMap[dept.id] = [];
        }
        dept.groups.map(group => {
          deptMap[dept.id].push(...group.members);
        });
      });
      return deptMap;
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
      this.$fetch('http://localhost:2222/fe-manage/api/dept/tree').then(res => {
        console.log(res);
        if (res.code !== 200) {
          return;
        }
        this.deptList = res.data.list;
        this.otherUsers = res.data.users;
      });
    },
    showDeptDialog(type) {
      if (type == 'add') {
        this.deptEditInfo.data = {
          name: '',
          leaderId: '',
          note: ''
        };
        this.deptEditInfo.show = true;
        this.deptEditInfo.title = '新增部门';
      }
    },
    createDept() {
      let { name, leaderId, note } = this.deptEditInfo.data;
      name = name.trim();
      if (!name) {
        this.$Message.error('部门名称必填！');
        return;
      }

      this.$fetch('http://localhost:2222/fe-manage/api/dept/add', {
        name,
        note,
        leader: leaderId
      }).then(res => {
        console.log(res);
        if (res.code !== 200) {
          this.$Message.error('保存失败！' + res.message);
          return;
        }
        this.$Message.success('保存成功');
        this.getData();
        this.deptEditInfo.show = false;
      });
    },
    showGroupDialog(type, deptId, group) {
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
          name: group.name,
          leaderId: group.leader,
          note: group.note,
          deptId: deptId
        };
        this.groupEditInfo.show = true;
        this.groupEditInfo.title = group.name;
        return;
      }
    },
    createGroup() {
      let { name, leaderId, note, deptId } = this.groupEditInfo.data;
      name = name.trim();
      if (!name) {
        this.$Message.error('部门名称必填！');
        return;
      }

      this.$fetch('http://localhost:2222/fe-manage/api/group/add', {
        name,
        note,
        leader: leaderId,
        dept: deptId
      }).then(res => {
        console.log(res);
        if (res.code !== 200) {
          this.$Message.error('保存失败！' + res.message);
          return;
        }
        this.$Message.success('保存成功');
        this.getData();
        this.groupEditInfo.show = false;
      });
    }
  }
};
</script>

<style lang="scss">
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
  }
  .edit-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    // line-height: ($height - $padding * 2 ) / 2 ;
    font-size: 20px;
    font-weight: bold;
    opacity: 0;
    transition: all 0.2s ease-out;
    cursor: pointer;
    outline: none !important;
    box-shadow: none !important;
  }
  &:hover .edit-btn {
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