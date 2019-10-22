// 选择tabbar - tabbar页
const select_tab_bar = (page, selected) => {
  if (typeof page.getTabBar === 'function' &&
    page.getTabBar()) {
    page.getTabBar().setData({
      selected: selected
    })
  }
};

module.exports = {
  select_tab_bar
}