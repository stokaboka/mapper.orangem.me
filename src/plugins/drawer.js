
import Drawer from '../lib/draw/Drawer'

export default ({ Vue }) => {
  Vue.prototype.$drawer = new Drawer()
}
