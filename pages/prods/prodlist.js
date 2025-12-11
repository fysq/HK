const app = getApp();
function throttle(func, gapTime) {
  let _lastTime = null;
  gapTime = gapTime || 300; // 默认时间间隔 300ms
  return function () {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      func.apply(this, arguments);
      _lastTime = _nowTime;
    }
  };
}
Page({
  data: {
    categories: [],
    currentCategoryIndex: 0,
    currentCategoryIndexclick: 0,
    scrollTop: 0,
    scrolllist:[],
    menutop:0,
    menuheight:0,
    chooseindex:0,
    imgpre:"",
    inputsearch:"",
    searchkey:"",
  },

  onLoad: function(options) {
    let that = this;
    
    const menuButtonInfo = app.globalData.menuButtonInfo;
    that.setData({
      'menutop':menuButtonInfo.top,
      'menuheight':menuButtonInfo.top+menuButtonInfo.height+10,
      'imgpre':app.globalData.prefix,
      'setinfo':app.globalData.setinfo
    });

    wx.request({
      url: app.globalData.posturl+"/getprodslist",
      data:{
        pids:app.globalData.allpids
        // pids:'1,2,3'
      },
      method:"POST",
      success:function(e){
        // console.log(e.data.msg);
        that.setData({
          "categories":e.data.msg,
        })

        if(options.tid){
          let categories = that.data.categories;
          categories.forEach((e,i)=>{
            if(e.id==options.tid){
              that.setData({
                chooseindex: i,
              });
            }
          })
        }
        // console.log(tid);
      }
    })
  },
  onReady(){
    // this.getRect();
  },
  getRect(){
    let that = this;
    let scrolllist = [];
    // 获取窗口高度，用于设置滚动区域高度
    const query = wx.createSelectorQuery();
    query.selectAll('.product-section').boundingClientRect();
    query.exec(res => { 
      const rects = res[0] || []
      if(rects.length === 0) {
        console.warn('未查询到节点，重试中...')
        setTimeout(() => that.getRect(), 500)
        return
      }
      console.log('ok');
      res[0].forEach(i => {
        scrolllist.push(i.top);
      });
      // console.log(scrolllist)
      that.setData({
        scrolllist
      });
    });
  },
  gotoprod:function(e){
    // console.log(e);
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/prods/prodinfo?pid='+pid,
    })
    // console.log(pid);
  },
  
  back() {
    wx.navigateBack()
  },
  
  inputsearch(e) {
    this.setData({
      inputsearch: e.detail.value
    });
  },
  
  search(e) {
    let that = this;
    let searchkey = that.data.inputsearch
    let chooseindex = that.data.chooseindex
    let categories = that.data.categories
    let prods = categories[chooseindex].products
    // console.log(prods)
    prods.forEach((e,i)=>{
      // console.log(e.pname.toLowerCase().includes(searchkey.toLowerCase()))
      if(searchkey){
        if(e.pname.toLowerCase().includes(searchkey.toLowerCase()) || e.pcode.toLowerCase().includes(searchkey.toLowerCase())){
          e['hidden']=false;
        }else{
          e['hidden']=true;
        }
      }else{
        e['hidden']=false;
      }
    })
    categories[chooseindex].products = prods
    // console.log(prods);
    // let key = "categories["+chooseindex+"].products"
    // console.log(key);
    // console.log(that.data.[key]);
    this.setData({
      categories
    });
    console.log(that.data.categories)
  },
  // 切换分类
  chooseindex: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      chooseindex: index,
    });
    // console.log(this.data.categories)
    this.search();
  },

  // 产品滚动事件
  onProductScroll: throttle(function(e) {
    let that =this 
    const scrollY = e.detail.scrollTop+that.data.menuheight;
    // console.log(scrollY);
    // throttle(function(e){
      let nowindex = that.data.currentCategoryIndex;
      let scrollindex = that.findInterval(that.data.scrolllist,scrollY);
      if(scrollindex != nowindex){
        that.setData({
          currentCategoryIndex: scrollindex
        });
      }
      // console.log(scrollindex);
    // },2000);
    
  }),
  findInterval(arr, target) {
    // 如果数组为空，返回 null
    if (arr.length === 0) {
      return null;
    }
  
    // 如果目标数字小于数组的第一个元素
    if (target <= arr[0]) {
      return 0;
    }
  
    // 如果目标数字大于数组的最后一个元素
    if (target >= arr[arr.length - 1]) {
      return arr.length - 1;
    }
  
    let left = 0;
    let right = arr.length - 1;
    let result = null;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
  
      if (arr[mid] <= target) {
        // 如果中间元素小于目标值，向右查找
        left = mid + 1;
      } else if (arr[mid] > target) {
        // 如果中间元素大于目标值，向左查找
        result = mid; // 记录当前中间索引，可能是一个候选
        right = mid - 1;
      }
    }
  
    // 如果找到第一个大于目标值的元素
    if (result !== null) {
      // 检查是否是第一个元素
      return result - 1;
    }
  
    // 如果目标值等于数组的最后一个元素
    return null;
  },
  throttle(func, gapTime) {
    let _lastTime = null;
    gapTime = gapTime || 300; // 默认时间间隔 300ms
    return function () {
      let _nowTime = +new Date();
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        // console.log('888');
        func.apply(this, arguments);
        _lastTime = _nowTime;
      }else{
        // console.log('999');
      }
    };
  }
  
});