import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Table from "@/views/IcebergGovernance/Table";
import Catalog from "../views/IcebergGovernance/Catalog";
import App from "../App"
import Index from "../views/Index"

const routes = [
    {
        path: "/",
        name: "迁移工具",
        component: Index,
        children: [
            {
                path: '/metaTransformIndex',
                name: '元数据迁移',
                component: ()=>import('../views/metaTransform/metaTransformIndex')
            },
            {
                path: '/about',
                name: 'About',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
            }
        ]
    },
    ,
    {
        path: "/na",
        name: "导航2",
        component: Index,
        redirect:"/Catalog",
        children: [
            {
                path: '/Catalog',
                name: 'Catalog',
                component: Catalog

            },
            {
                path: '/Table',
                name: 'Table',
                component: Table
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
