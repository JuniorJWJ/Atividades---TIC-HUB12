import { createRouter, createWebHistory } from 'vue-router'
import { Role } from '../enums/Role'
import { authState } from '../state/auth.store'
import ConsumerLayout from '../layouts/ConsumerLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import HomeView from '../views/HomeView.vue'
import ProductDetailsView from '../views/ProductDetailsView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import AdminProductsView from '../views/admin/AdminProductsView.vue'
import AdminReportsView from '../views/admin/AdminReportsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ConsumerLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: {
            breadcrumb: [{ label: 'Início', to: { name: 'home' } }],
          },
        },
        {
          path: 'produto/:id',
          name: 'product-details',
          component: ProductDetailsView,
          meta: {
            breadcrumb: [
              { label: 'Início', to: { name: 'home' } },
              { label: 'Detalhes' },
            ],
          },
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: CheckoutView,
          meta: {
            requiresAuth: true,
            breadcrumb: [
              { label: 'Início', to: { name: 'home' } },
              { label: 'Finalizar compra' },
            ],
          },
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        requiresRole: Role.ADMIN,
      },
      children: [
        {
          path: '',
          redirect: { name: 'admin-products' },
        },
        {
          path: 'produtos',
          name: 'admin-products',
          component: AdminProductsView,
          meta: {
            breadcrumb: [
              { label: 'Admin', to: { name: 'admin-products' } },
              { label: 'Produtos' },
            ],
          },
        },
        {
          path: 'relatorios',
          name: 'admin-reports',
          component: AdminReportsView,
          meta: {
            breadcrumb: [
              { label: 'Admin', to: { name: 'admin-products' } },
              { label: 'Relatórios' },
            ],
          },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresRole === Role.ADMIN)

  if (requiresAuth && !authState.isAuthenticated) {
    return { name: 'home' }
  }

  if (requiresAdmin && authState.role !== Role.ADMIN) {
    return { name: 'home' }
  }
})

export default router
