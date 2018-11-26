
import DataProvider from '../lib/network/DataProvider'

const dpBaseUrl = 'http://orangem.me:3333/dp'

export default ({ Vue }) => {
  Vue.prototype.$dataProvider = new DataProvider(dpBaseUrl)
}
