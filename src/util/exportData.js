window.getExcellentExportPromise = (function() {
  let p;
  return function() {
    if (!p) {
      p = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.onload = function() {
          s.onload = null;
          resolve();
        };
        s.onerror = function(err) {
          s.onerror = null;
          reject(err);
        };
        document.body.appendChild(s);
        s.src = `${process.env.BASE_URL}libs/excellentexport.js`;
      });
    }
    return p;
  };
})();
function exportData(el, data, title) {
  const doc = document.createElement('div');
  doc.insertAdjacentHTML(
    'afterbegin',
    '<link rel="stylesheet" href="https://unpkg.com/view-design/dist/styles/iview.css">'
  );
  const style = document.createElement('style');
  style.textContent = `.ivu-table{height:auto !important;}`;
  doc.appendChild(style);


  doc.appendChild(el.cloneNode(true));

  const clonedCharts = [].slice.call(doc.querySelectorAll('[_echarts_instance_]'));

  // 将页面上的图表转化为图片
  const chartImgArr = [];
  [].slice.call(el.querySelectorAll('[_echarts_instance_]')).forEach((chartEl, i) => {
    const base64 = chartEl.getElementsByTagName('canvas')[0].toDataURL('image/png');
    chartImgArr.push(base64);

    const img = document.createElement('img');
    img.src = base64;
    clonedCharts[i].replaceWith(img);
    // doc.appendChild(img);
  });

  // json数据
  const pre = document.createElement('pre');
  pre.innerText = JSON.stringify(data, 0, 2);
  pre.className = 'json-data';
  doc.appendChild(pre);

  // 下载
  download(doc.innerHTML, title + '.html');
  chartImgArr.forEach((item, i) => {
    download(item, `${title}-图表${i + 1}.png`, true);
  });

  // csv 下载
  // if (!window.ExcellentExport && )
  window.getExcellentExportPromise().then(res => {
    let save_link = document.createElement('a');
    var table = el.querySelector('.summary-table .ivu-table-body > table');
    var theadTr = el.querySelector('.summary-table .ivu-table-header > table > thead');
    if (!table) return;
    table = table.cloneNode(true);
    table.appendChild(theadTr.cloneNode(true));

    window.ExcellentExport.csv(save_link, table);
    save_link.download = title + '.csv';

    save_link.click();
  });
}
function download(data, filename, isBase64) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = isBase64 ? data : URL.createObjectURL(new Blob([data]));

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
export { download };
export default exportData;
