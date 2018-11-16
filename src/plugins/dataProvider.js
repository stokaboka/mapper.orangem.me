
import DataProvider from '../lib/network/DataProvider'

export default ({ Vue }) => {
  Vue.prototype.$dataProvider = new DataProvider('http://localhost:3000/dp')
}
