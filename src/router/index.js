import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Table from "@/views/IcebergGovernance/Table";
import Catalog from "../views/IcebergGovernance/Catalog";
import App from "../App"
import Index from "../views/Index"

const routes = [
    {
        path: "/",
        name: "数据湖工具",
        component: Index,
        children: [
            {
                path: '/metaTransformIndex',
                name: '元数据迁移',
                component: ()=>import('../views/metaTransform/metaTransformIndex'),
                meta: { keepAlive: true }
            },
            {
                path: '/SQLParseIndex',
                name: 'SQL语法解析',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/SQLParse/SQLParseIndex'),
                meta: { keepAlive: true }
            }
        ]
    }
    // ,
    // {
    //     path: "/manager",
    //     name: "数据湖管理",
    //     component: Index,
    //     redirect:"/Catalog",
    //     children: [
    //         {
    //             path: '/Catalog',
    //             name: 'Catalog',
    //             component: Catalog
    //
    //         },
    //         {
    //             path: '/Table',
    //             name: 'Table',
    //             component: Table
    //         }
    //     ]
    // }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
