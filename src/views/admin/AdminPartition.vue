<template>
  <div>
    <div class="info-header">
      <a-button type="primary" @click="visible = true">新建分区</a-button>
    </div>
    <div class="partitions">
      <div class="partition-item" v-for="(item, index) in allPartition" :key="index">
        <div class="item-left">
          <p>{{ item.content }}</p>
          <a-button type="link" @click="deletePartitionClick(item.id)">删除</a-button>
        </div>
        <div class="item-right">
          <div v-for="(sub, i) in item.subpartition" :key="i">
            <p>{{ sub.content }}</p>
            <a-button type="link" @click="deletePartitionClick(sub.id)">删除</a-button>
          </div>
        </div>
      </div>
    </div>
    <!--导入视频-->
    <a-modal v-model="visible" title="添加分区">
      <a-form-model ref="form" :model="addForm" :rules="rules">
        <a-form-model-item label="分区名" prop="content">
          <a-input v-model="addForm.content"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属分区">
          <a-select v-model="addForm.fid" :allowClear="true">
            <a-select-option v-for="item in partitions" :key="item.id">
              {{ item.content }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" @click="addPartitionClick()">添加</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getPartition, getAllPartition } from "@/api/partition";
import { addPartition, deletePartition } from "@/api/admin.js";
export default {
  data() {
    return {
      visible: false,
      partitions: [],
      allPartition: [],
      addForm: {
        content: "",
        fid: Number,
      },
      rules: {
        content: [
          { required: true, message: "请输入分区名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addPartitionClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addPartition(this.addForm).then((res) => {
            if (res.data.code === 2000) {
              this.$message.success("添加成功");
              this.visible = false;
              this.getAllPartitionList();
              this.getPartitionList(0);
            }
          }).catch((err) => {
            this.$message.error(err.response.data.msg);
          });
        } else {
          this.$message.error("请检查输入的数据");
        }
      });
    },
    getPartitionList(fid) {
      getPartition(fid).then((res) => {
        if (res.data.code === 2000) {
          this.partitions = res.data.data.partitions;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //获取所有分区
    getAllPartitionList() {
      getAllPartition().then((res) => {
        if (res.data.code === 2000) {
          this.allPartition = res.data.data.partitions;
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
    //删除分区
    deletePartitionClick(id) {
      deletePartition(id).then((res) => {
        if (res.data.code === 2000) {
          this.$message.success("删除成功");
          this.getAllPartitionList();
        }
      }).catch((err) => {
        this.$message.error(err.response.data.msg);
      });
    },
  },
  created() {
    this.getPartitionList(0);
    this.getAllPartitionList();
  },
};
</script>

<style lang="less" scoped>
.info-header {
  display: flex;
  height: 50px;
  margin: 10px;
  align-items: center;
}

.partitions {
  margin: 10px;
  width: 700px;
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}

.partition-item {
  display: flex;
  font-size: 16px;
  .item-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 200px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    p {
      margin: 0;
    }
  }

  .item-right {
    width: 500px;
    border-bottom: 1px solid #e8e8e8;
    align-items: center;
    div {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      p {
        margin: 0;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>