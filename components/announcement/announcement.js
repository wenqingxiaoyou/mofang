// components/announcement/announcement.js
const CFLAG = '__announcement__';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      value:'我是通知的消息和需要通知的具体内容我是通知的消息和需要通知的具体内容',
      observer(newVal,oldVal,changePath){
        let _this = this;
        wx.getStorage({
          key: CFLAG,
          success(res) {},
          fail() {
            this.setData({}, this._init);
          }
        })
      }
    },
    speed: {
      type: Number,
      value: 50
    },
    delay: {
      type: Number,
      value: 0
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    width:0,
    wrapWidth:0,
    animation: null,
    resetAnimation: null,
    elapse: 0,
    timer:null,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      console.log('attached');
    },
    detached() {
      console.log('detached');
     },
  },
  pageLifetimes:{
    hide(){
      const {timer} = this.data;
      timer && clearTimeout(timer);
    },
    show(){
      let _this = this;
      wx.getStorage({
        key: CFLAG,
        success(res) {
          _this._init();
        },
        fail(){
          wx.setStorage({
            key: CFLAG,
            data: true,
          })
        }
      })

     
      // const test = getCurrentPages();
      // console.log(test[0]);
    },
    resize(){
      console.log('component resize');
    }
  },
  detached() {
    console.log('detached');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _init(){
      //获取text实际宽度
      wx.createSelectorQuery().in(this).select('.anm').boundingClientRect(rect=>{
        if(!rect || !rect.width)return;
        this.setData({width:rect.width});
      }).exec();
      //获取text父层宽度
      wx.createSelectorQuery().in(this).select('.anmWrap').boundingClientRect(rect => {
        if (!rect || !rect.width) return;
        this.setData({ wrapWidth: rect.width });
        const { width, wrapWidth, speed,delay} = this.data;
        if(wrapWidth < width){
          const elapse = width/speed * 1000;
          const animation = wx.createAnimation({
            duration:elapse,
            timingFunction:'linear',
            delay
          })
          const animationReset = wx.createAnimation({
            duration:0,
            timingFunction:'linear'
          });
          this.setData({
            elapse,
            animation,
            animationReset
          },()=>{
            this._scroll();
          })
        }
      }).exec();
    
    },
    _scroll(){
      
      const {animation,animationReset,wrapWidth,width,elapse,speed} = this.data;
      animationReset.translateX(wrapWidth).step();
      const animationData = animation.translateX(-(elapse*speed)/1000).step();
      this.setData({
        animationData:animationReset.export(),
      });

      setTimeout(() => {
        this.setData({
          animationData: animationData.export()
        });
      }, 100);

      const timer = setTimeout(() => {
        this._scroll();
      }, elapse);

      this.setData({
        timer
      });
    

    }
  }
})
