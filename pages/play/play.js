// pages/play/play.js
// 获取app.js实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicVal: {},//当前音乐的数据
    isPlay: true,//是否在播放
    index: 0,//当前音乐的索引
    currentTime: '00:00',//音乐播放的当前进度
    duration: '00:00',//音乐的总时长
    percent: 0,//进度条的百分比
    loop: true,//是否自动播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    // console.log(app.data.musicData[options.index]);
    this.setData({
      index: parseInt(options.index),
      musicVal: app.data.musicData[options.index]
    });
    console.log('play-musicVal------>', this.data.musicVal);
    // 音乐的循环播放
    app.data.audio.loop = this.data.loop;
    // 页面加载就播放音乐
    let url = this.data.musicVal.mp3Url;
    app.data.audio.src = url;
    // 第一次进入时会被调用，这个是监听音频进入可以播放状态的事件
    app.data.audio.onCanplay(
      this.handleProgress
    );
    // 第二次及以后进入会被调用
    this.handleProgress();
    app.data.audio.play();
  },
  // 处理进度条
  handleProgress() {
    let that = this;
    app.data.audio.pause();
    app.data.audio.play();
    // 当播放音乐时，播放进度改变时触发
    app.data.audio.onTimeUpdate(() => {
      let nowTime = this.formatTime(app.data.audio.currentTime);
      let allTime = this.formatTime(app.data.audio.duration);
      let percent = app.data.audio.currentTime / app.data.audio.duration * 100;
      this.setData({
        currentTime: nowTime,
        duration: allTime,
        percent: percent
      });
      // 播放完毕且loop为false，自动播放下一首
      if (percent >= 99.5 && that.data.loop === false) {
        that.next();
      }
    });
  },
  // 校正播放进度的时间的格式
  formatTime(t) {
    let m = '' + Math.floor(t / 60);//分钟
    let s = '' + Math.round(t % 60);
    let mm = addZero(m);
    let ss = addZero(s);
    if(isNaN(mm)&&isNaN(ss)){
      mm='00';
      ss='00';
    }
    return mm + ':' + ss;
    // 补零函数
    function addZero(num) {
      if (num.length < 2) {
        return '0' + num;
      }
      return num;
    };
  },
  // 播放暂停音乐
  play(e) {
    if (!this.data.isPlay) {
      this.setData({
        isPlay: true
      });
      app.data.audio.play();
    } else {
      app.data.audio.pause();
      this.setData({
        isPlay: false
      });
    }
  },
  // 下一首音乐
  next() {
    // 如果是最后一首的话，把index改为-1
    if (this.data.index === app.data.musicData.length - 1) {
      this.setData({
        index: -1
      });
    };
    this.setData({
      index: this.data.index + 1,
      musicVal: app.data.musicData[this.data.index + 1],
      isPlay: true
    });
    let url = this.data.musicVal.mp3Url;
    app.data.audio.src = url;
    app.data.audio.pause();
  },
  // 上一首音乐
  pre() {
    // 如果是第一首的话，把index改为数组的长度length
    if (this.data.index === 0) {
      this.setData({
        index: app.data.musicData.length
      });
    };
    this.setData({
      index: this.data.index - 1,
      musicVal: app.data.musicData[this.data.index - 1],
      isPlay: true
    });
    let url = this.data.musicVal.mp3Url;
    app.data.audio.src = url;
    app.data.audio.pause();
  },
  // 拖动进度条
  bindchange(e) {
    // console.log(e.detail.value);
    let changePosition = e.detail.value / 100 * app.data.audio.duration;
    app.data.audio.pause();
    // 音乐播放进度跳转到指定位置
    app.data.audio.seek(changePosition);
    this.setData({
      isPlay: true
    });
  },
  // 循环播放的方法
  isloop(e) {
    // console.log(e);
    this.setData({
      loop: !this.data.loop
    });
    app.data.audio.loop = this.data.loop;
  },
  onUnload: function () {
    app.data.audio.pause();
    app.data.audio.offCanplay(
      this.handleProgress
    );
  },
})