
const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MyLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // }
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      {
        path: ['', 'map', 'map/lon/:lon/lat/:lat/zoom/:zoom'],
        component: () => import('pages/Map.vue')
      },
      {
        path: 'settings',
        component: () => import('pages/Settings.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
