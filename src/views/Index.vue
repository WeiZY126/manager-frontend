<template>
  <div id="index">
    <el-container class="layout-container-demo" style="height: 500px">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu router :default-openeds="['0','1']">
            <el-sub-menu v-for="(routeItem,index) in routes"
                         :key="routeItem.name"
                         :index="index+''">
              <template #title>
                <el-icon>
                  <icon-menu/>
                </el-icon>
                {{ routeItem.name }}
              </template>

              <el-menu-item v-for="child in routeItem.children" :key="child.name" :index="child.path"
                            :class="route.path.toLowerCase()==child.path.toLowerCase()?'is-active':''">
                {{ child.name }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px">
                <setting/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
          </div>
        </el-header>

        <el-main>
          <el-scrollbar>
            <router-view/>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import {useRouter, useRoute} from 'vue-router'

export default {
  name: "Index",
  setup() {
    const router = useRouter()
    const routes = router.options.routes.filter(route => route.name && route.children)

    const route = useRoute()
    return {
      routes,
      route
    }
  }
}

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>