
  const app = getApp();
  Page({
  // 页面初始数据
  data: {
    menuheight: "",
    menutop: "",
    productList: [],
    barcolor: "",
    prodsinfo: [],
    imgpre: "",
    pid: "",
    name: '',
    phone: '',
    address: '',
    size: '',
    mark: '',
    deliverType:2,
    multiArray: [
      [{id:-1,name:"北京"}],
      [{id:-1,name:"北京"}],
      [{id:-1,name:"东城"}]
    ],
    multiIndex: [0,0,0],
    provinces:[]
  },

  onLoad(e) {
    const menuButtonInfo = app.globalData.menuButtonInfo;
    this.setData({
      'menutop':menuButtonInfo.top,
      'menuheight': menuButtonInfo.top + menuButtonInfo.height + 10,
      imgpre: app.globalData.prefix,
      'setinfo':app.globalData.setinfo,
      pid:e.pid,
      size:e.size
    });

    wx.request({
      url: app.globalData.posturl+"/getprodsinfo",
      method: "POST",
      data: {
        pid: e.pid
      },
      success: (e) => {
        this.setData({
          'prodsinfo': e.data.msg,
        });
      }
    })
    
    
    // this.getData();
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 3) {
      this.setData({
        'barcolor': "white"
      });
    } else {
      this.setData({
        'barcolor': ""
      });
    }
    // 触发自定义事件，将滚动信息传递给组件
    // this.selectComponent('#navifation-bar').triggerEvent('pageScroll', e);
  },
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  onAddressInput(e) {
    this.setData({
      address: e.detail.value
    });
  },
  onMarkInput(e) {
    this.setData({
      mark: e.detail.value
    });
  },

  // 验证手机号
  validatePhoneNumber(phoneNumber) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phoneNumber);
  },
  // 前往支付页面
  goToPay() {

    let that = this;
    let posdata = {};
    posdata.name = that.data.name;
    posdata.phone = that.data.phone;
    // posdata.area = that.data.multiArray[0][that.data.multiIndex[0]].name+"-"+that.data.multiArray[1][that.data.multiIndex[1]].name+"-"+that.data.multiArray[2][that.data.multiIndex[2]].name;
    posdata.area= that.data.area;
    posdata.address= that.data.address;
    posdata.pid= that.data.pid;
    posdata.deliverType = that.data.deliverType;
    posdata.bid = app.globalData.bid;
    posdata.code = app.globalData.code;
    posdata.size = that.data.size;
    posdata.mark = that.data.mark;
    console.log(posdata);

    if(!posdata.code){
      wx.showToast({
        title: '兑换码异常，请重新从兑换渠道进入',
        icon: 'none',
        duration: 2000
      })
      return;
    }


    if(!that.validatePhoneNumber(posdata.phone)){
      
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!posdata.name){
      
      wx.showToast({
        title: '请输入收件人姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!posdata.address){
      
      wx.showToast({
        title: '请输入详细收件地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    console.log(posdata);
    wx.request({
      url: app.globalData.posturl+"/addorder",
      data:posdata,
      method:"POST",
      success:function(e){
        if(e.data.code=='1'){
          wx.showModal({
            title: '提示',
            content: e.data.msg,
            showCancel: false
          });
          return;
        }else{

          wx.showToast({
            title: e.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  back() {
    wx.navigateBack()
  },
  setDefaultDeliverTyp(e) { 
    const type = e.currentTarget.dataset.type; 
    this.setData({ 
      deliverType: type 
    }); 
  }, 
  getData()
  {
    wx.request({
      url: 'https://a.zjglsw.com/i/HK/code.json',
      method:'GET',
      success: res => {
        // console.log(res);
        if (res.data){
          var temp = res.data;
          this.setData({
            provinces:temp,
            multiArray:[temp, temp[0].children, temp[0].children[0].children],
            multiIndex:[0, 0, 0]
          })
        }
      }
    })     
  },
  //点击确定
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  //滑动
  bindMultiPickerColumnChange: function(e){
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //更新滑动的第几列e.detail.column的数组下标值e.detail.value
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
    if (e.detail.column == 0){
      data.multiIndex = [e.detail.value,0,0];
    } else if (e.detail.column == 1){
      //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
      data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
    } else if (e.detail.column == 2) {
      //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
      data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].children).length > 0){
      //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
      data.multiArray[1] = temp[data.multiIndex[0]].children;
      var areaArr = (temp[data.multiIndex[0]].children[data.multiIndex[1]]).children;
      // console.log(areaArr);
      //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
      data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
    }else{
      //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
      data.multiArray[1] = [];
      data.multiArray[2] = [];
    }
    // console.log(data.multiIndex);
    // console.log(data.multiArray);
    //setData更新数据
    this.setData(data);
  },
  chooseaddress(){
    let that = this;
    wx.showModal({
      title: '个人信息授权申请',
      content: '申请快速获取你的姓名、电话、手机号地址信息用于一键填充。我们将采取合理的安全措施保护您的个人信息，防止信息泄露、篡改或损坏，我们不会向任何无关第三方披露您的个人信息。',
      confirmText:'同意授权',
      cancelText:'拒绝',
      complete: (res) => {
        if (res.cancel) {
          wx.showToast({
            title: '取消授权',
            icon:'none'
          })
        }
    
        if (res.confirm) {
          wx.chooseAddress({
            success(res) {
              console.log('获取收货地址成功', res);
              const { userName, telNumber, provinceName, cityName, countyName, detailInfo } = res;
              that.setData({
                name:userName,
                phone:telNumber,
                area:provinceName+"-"+cityName+"-"+countyName,
                address:detailInfo
              })
              // console.log(`收货人: ${userName}, 电话: ${telNumber}, 省份: ${provinceName}, 城市: ${cityName}, 区县: ${countyName}, 详细地址: ${detailInfo}`);
            },
            fail(err) {
              console.error('获取收货地址失败', err);
            }
          });
        }
      }
    })
  }
});