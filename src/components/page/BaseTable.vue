<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-search" @click="add">新增</el-button>
      </div>
      <el-table
        :data="filters"
        border
        stripe
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="Name" label="名称"></el-table-column>
        <el-table-column prop="Catalog" label="分类"></el-table-column>
        <el-table-column prop="IsHot" label="热门分类" width="150" :formatter="formatBoolean"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row, scope)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
          :pageSize="pageSize"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="名称">
          <el-input v-model="form.Name"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.Catalog"></el-input>
        </el-form-item>
        <el-form-item label="热门">
          <el-switch v-model="form.IsHot" active-color="#13ce66"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow(form.ID)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchData } from "../../api/index";
export default {
  name: "basetable",
  data() {
    return {
      filters: [],
      total: 0,
      cur_page: 1,
      pageSize: 5,
      multipleSelection: [],
      select_word: "",
      editVisible: false,
      delVisible: false,
      form: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    formatBoolean: (row, col, value, index) => {
      return value ? "是" : "否";
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      fetchData.filter
        .list({
          Index: this.cur_page,
          Size: this.pageSize,
          Status: 1
        })
        .then(res => {
          this.filters = res.PageEntities;
          this.total = res.Count;
        });
    },
    search() {
      this.$message.error("接口不支持，没实现！");
    },
    handleEdit(index, row) {
      this.form = row;
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.form = row;
      this.delVisible = true;
    },
    delAll() {
      let that = this;
      this.multipleSelection.forEach(item => {
        that.deleteRow(item.ID);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    add() {
      this.handleEdit(null, {
        ID: "",
        IsHot: false
      });
    },
    // 保存编辑
    saveEdit() {
      let that = this;
      if (this.form.ID === "") delete this.form.ID;
      fetchData.filter.save(this.form).then(data => {
        that.editVisible = false;
        that.$message.success("编辑完成");
        that.getData();
      });
    },
    // 确定删除
    deleteRow(id) {
      let that = this;
      fetchData.filter.delete(id).then(data => {
        that.delVisible = false;
        that.$message.success("删除成功");
        that.getData();
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
