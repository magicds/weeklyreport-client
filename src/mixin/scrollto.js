var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(fn) {
    return setTimeout(fn, 17);
  };
var cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  function(id) {
    return clearTimeout(id);
  };
/**
 * [easeout description] 动画缓动
 * 基于 http://www.zhangxinxu.com/wordpress/2017/01/share-a-animation-algorithm-js/ 修改
 * @param  {[type]}   start    [开始位置]
 * @param  {[type]}   end      [结束位置]
 * @param  {[type]}   rate     [缓动速率]
 * @param  {Function} callback [回调函数]
 * @return {[number]}          [requestAnimationFrame id]
 */
function easeOut(start, end, rate, callback) {
  if (start == end || typeof start != 'number') {
    return;
  }
  end = end || 0;
  rate = rate || 2;

  var id;
  var lastPos;
  var step = function() {
    start = (start + (end - start) / rate) >> 0;

    if (Math.abs(start - end) <= 1 || lastPos === start) {
      callback(end, true);
      return id;
    }
    lastPos = start;
    callback(start, false);
    id = requestAnimationFrame(step);
  };
  step();
  return id;
}
easeOut.cancel = cancelAnimationFrame.bind(window);

const doc = document.body.scrollTop ? document.body : document.documentElement;

let currentScrollerId;

export default {
  methods: {
    scrollTo(targetDom) {
      easeOut.cancel(currentScrollerId);
      if (!targetDom || doc.scrollHeight <= doc.clientHeight) return;
      const s = doc.scrollTop;
      const e = s + targetDom.getBoundingClientRect().top;
      currentScrollerId = easeOut(s, e, 8, v => {
        doc.scrollTop = v;
      });
    }
  }
};
