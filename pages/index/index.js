// pages/index/index.js
// 获取app.js实例
const app = getApp();
// 设置获取图片路径的可复用路径
const imaUrl = "http://127.0.0.1:8083/static/images/";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicBox: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    // 网络请求
    wx.request({
      url: app.data.baseUrl + '/api/getMusic',
      header: {
        "content-type": 'application/json'
      },
      success(res) {
        // console.log(res);
        res.data.map((item) => item.isPlay = false);
        that.setData({
          musicBox: res.data
        });
        console.log('index-musicBox------>', that.data.musicBox);
        app.data.musicData = that.data.musicBox;
        // console.log(app.data.musicData);
      }
    })
  },
  // 跳转方法
  navTo(e) {
    // console.log(e);
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/play/play?index=${id}`
    });
  },
  // 播放暂停音乐
  play(e) {
    // 暂停所有音乐
    app.data.audio.pause();
    // 点击的音乐的索引
    let index = e.currentTarget.id;
    // 点击的音乐的mp3Url
    let url = this.data.musicBox[index].mp3Url;
    // 让其他音乐播放状态isPlay为false
    for(let i=0;i<this.data.musicBox.length;i++){
      if(i!=index){
        this.setData({
          [`musicBox[${i}].isPlay`]:false
        });
      }
    };
    // 设置音频url
    app.data.audio.src = url;
    // 根据点击的音乐的播放状态决定播放或暂停
    if (!this.data.musicBox[index].isPlay) {
      app.data.audio.play();
      this.setData({
        [`musicBox[${index}].isPlay`]: true
      })
    } else {
      app.data.audio.pause();
      this.setData({
        [`musicBox[${index}].isPlay`]: false
      })
    }
  },
  // 隐藏页面时
  onHide(){
    // 让本页所有音乐播放状态isPlay为false
    for(let i=0;i<this.data.musicBox.length;i++){
        this.setData({
          [`musicBox[${i}].isPlay`]:false
        });
    };
    // 暂停音乐
    app.data.audio.pause();
  }
})