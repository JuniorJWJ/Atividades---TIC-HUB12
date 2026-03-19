<script lang="ts">
import { defineComponent } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { products } from '../../data/products'

export default defineComponent({
  name: 'AdminProductsView',
  components: {
    Card,
    DataTable,
    Column,
  },
  data() {
    return {
      products,
    }
  },
})
</script>

<template>
  <Card class="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
    <template #content>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h2 class="text-2xl font-semibold">Produtos</h2>
        </div>
      </div>
      <DataTable
        :value="products"
        class="mt-6 rounded-xl border border-slate-800/60"
        tableStyle="min-width: 100%"
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Produto" />
        <Column field="price" header="Preço" />
        <Column header="Categoria">
          <template #body="{ data }">
            {{ data.category.getDisplayName() }}
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
