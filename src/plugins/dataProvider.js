
import DataProvider from '../lib/network/DataProvider'

// localhost
const dpBaseUrl = 'http://localhost:3333/dp'

// orangem.me
// const dpBaseUrl = 'http://orangem.me:3333/dp'

// на работе из под express
// const dpBaseUrl = '/dp'

export default ({ Vue }) => {
  Vue.prototype.$dataProvider = new DataProvider(dpBaseUrl)
}
