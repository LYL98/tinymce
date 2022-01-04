<template>
  <div class="my-product-manage">
    <Breadcrumb />
    <div class="top mt-30">
      <div class="d-flex justify-content-between">
        <div class="">
          <el-button type="primary" size="small" style="width: 100%" @click="handleAdd"
            >新增供应商</el-button
          >
        </div>
        <div class="d-flex">
          <el-select
            v-model="query.source"
            placeholder="请选择来源"
            @change="changeQuery"
            class="mr-10"
            clearable
          >
            <el-option :key="'全部'" :label="'全部'" :value="''"></el-option>
            <el-option
              v-for="item in Constant.ACCOUNT_SOURCE()"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-select
            v-model="query.type"
            placeholder="请选择类型"
            @change="changeQuery"
            class="mr-10"
            clearable
          >
            <el-option :key="'全部'" :label="'全部'" :value="''"></el-option>
            <el-option
              v-for="item in Constant.SUPPLIER_TYPE()"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-input
            size="small"
            style="width: 300px"
            placeholder="请输入公司名称/用户名/手机号"
            prefix-icon="el-icon-search"
            v-model="query.keyword"
            clearable
            @clear="changeQuery"
          >
          </el-input>
          <el-button class="ml-10" type="primary" size="small" @click="changeQuery">查询</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="content"> -->
    <div class="table-content mt-20">
      <el-table
        ref="multipleTable"
        border
        :data="list.records"
        style="width: 100%"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#f2f2f2',
          'font-weight': '400',
          color: '#636363',
        }"
        :cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
        @sort-change="changeSort"
        v-loading="loading"
      >
        <!-- <el-table-column type="selection" width="40" :selectable="checkSelectable">
          </el-table-column> -->

        <el-table-column label="公司名称">
          <template slot-scope="scope">
            <div class="">
              <!-- <router-link
                :to="{ name: 'sensor-detail', query: { id: scope.row.id } }"
                target="_blank"
              > -->
              {{ scope.row.name }}
              <!-- </router-link> -->
            </div>
          </template>
        </el-table-column>

        <el-table-column label="手机号">
          <template slot-scope="scope">
            {{ scope.row.contractPhone || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="用户名">
          <template slot-scope="scope"> {{ scope.row.supplierName || '-' }} </template>
        </el-table-column>

        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-for="item in scope.row.typeList" :key="item">
              {{ Constant.SUPPLIER_TYPE('enum')[item] }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" sortable="custom" prop="createTime">
          <template slot-scope="scope">
            <div>
              {{ Handle.returnDateFormat(scope.row.createTime, 'yyyy-MM-dd') }}
            </div>
            <div>
              {{ Handle.returnDateFormat(scope.row.createTime, 'HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="来源">
          <template slot-scope="scope">
            {{ Constant.ACCOUNT_SOURCE('enum')[scope.row.source] || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="创建人">
          <template slot-scope="scope">
            {{ scope.row.inviterName }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">查看</el-button>

            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="pagination">
        <Pagination
          :pageSize="query.pageSize"
          :pageIndex="query.pageIndex"
          :total="list.total"
          @changePageParams="changePage"
        />
      </div>
    </div>
    <!-- </div> -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="80%">
      <Detail
        v-if="dialog.visible && dialog.type === 'detail'"
        :item="dialog.item"
        :type="dialog.type"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <Form
        v-if="dialog.visible && dialog.type !== 'detail'"
        :item="dialog.item"
        :type="dialog.type"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/components/Breadcrumb'
import { Constant, Handle } from '@/utils'
import { SupplierList, SupplierDelete } from '@/api/member'
import Form from './form'
import Detail from './detail'

export default {
  name: 'supplier-manage-list',
  data() {
    return {
      loading: false,
      query: {},
      productCateList: [],
      list: {
        records: [],
      },
      multipleSelection: [],
      dialog: {
        visible: false,
        title: '',
        item: {},
        type: '',
      },
    }
  },
  components: {
    Pagination,
    Breadcrumb,
    Detail,
    Form,
  },

  beforeRouteEnter(to, from, next) {
    to.meta.keepAlive = true
    if (from.path.indexOf(to.path) == -1) {
      next((e) => {
        e.initQuery()
      })
    } else if (from.query.type == 'add') {
      next((e) => {
        e.query.pageIndex = 1
      })
    } else {
      next()
    }
  },
  activated() {
    this.getSupplierList()
  },
  deactivated() {},
  created() {
    this.Constant = Constant
    this.Handle = Handle
    this.initQuery()
    console.log('created')
    this.getSupplierList()
  },
  computed: {},
  methods: {
    initQuery() {
      this.query = {
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
        source: '',
        type: '',
        pageSorts: [
          {
            column: 'createTime',
            asc: false,
          },
        ],
      }
    },
    changeQuery() {
      this.query.pageIndex = 1
      this.getSupplierList()
    },
    changePage(val) {
      this.query.pageIndex = val
      this.getSupplierList()
    },
    changeSort(val) {
      let prop = val.prop
      let sortType = val.order
      if (sortType == 'descending') {
        this.query.pageSorts = [
          {
            column: 'createTime',
            asc: false,
          },
        ]
      } else if (sortType == 'ascending') {
        this.query.pageSorts = [
          {
            column: 'createTime',
            asc: true,
          },
        ]
      } else {
        this.query.pageSorts = [
          {
            column: 'createTime',
            asc: '',
          },
        ]
      }
      this.getSupplierList()
    },
    //获取列表数据
    getSupplierList() {
      SupplierList(this.query).then((res) => {
        if (res.code == 200) {
          this.list = res.data || { records: [] }
          // this.list.records = this.list.records.filter((item) => {
          //   return item.deleted == false
          // })
          // console.log(this.$data.list);
        }
      })
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //判断是否可选择
    checkSelectable(row) {
      ///todo
      return row.onSale !== 3
    },
    //删除
    handleDelete(item) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          SupplierDelete({ id: item.companyId }).then((res) => {
            this.query.pageIndex = this.Handle.returnCurrentPage(
              this.query.pageIndex,
              this.query.pageSize,
              this.list.total
            )
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.getSupplierList()
          })
        })
        .catch(() => {})
    },

    handleDetail(item) {
      this.$router.push({
        name: 'supplier-manage-detail',
        // path: 'supplierManage/form',
        query: {
          id: item.companyId,
        },
      })

      // this.dialog = {
      //   visible: true,
      //   title: '供应商详情',
      //   item: item,
      //   type: 'detail',
      // }
    },

    handleAdd() {
      this.$router.push({
        name: 'supplier-manage-form',
        // path: 'supplierManage/form',
        query: {
          type: 'add',
        },
      })

      // this.dialog = {
      //   visible: true,
      //   title: '新增供应商',
      //   item: {},
      //   type: 'add',
      // }
    },
    handleEdit(item) {
      this.$router.push({
        name: 'supplier-manage-form',
        query: {
          id: item.companyId,
          type: 'edit',
        },
      })

      // this.dialog = {
      //   visible: true,
      //   title: '编辑供应商',
      //   item: item,
      //   type: 'edit',
      // }
    },
    handleSubmit() {
      this.getSupplierList()
      this.handleCancel()
    },
    handleCancel() {
      this.dialog = {
        visible: false,
        title: '',
        item: {},
        type: '',
      }
    },
  },
}
</script>
<style lang="less" scoped>
.my-product-manage {
  padding: 40px;
  background-color: #fff;
  .box {
    margin-top: 40px;
    height: 1px;
    background-color: #e5e5e5;
  }
  > .top {
    > .title {
      font-size: 20px;
      color: #363839;
      font-weight: 550;
    }
    > .query {
      display: flex;
      > .query-search {
        width: 480px;
      }
      > .query-button {
        margin-left: 20px;
        width: 120px;
      }
    }
  }
  > .content {
    // padding: 20px 0px;
    > .top {
      display: flex;
      justify-content: space-between;
      > .add-button {
        width: 120px;
      }
      .btn {
        width: 80px;
        border-color: #1890ff;
        color: #1890ff;
      }
      .danger {
        width: 80px;
        border-color: #e02020;
        color: #e02020;
      }
    }
    > .table-bottom {
      margin-top: 20px;
      > .pagination {
        text-align: right;
        height: 30px;
      }
    }
  }
}
</style>
