/**
 * 获取任一日期的周一
 *
 * @export
 * @param {Date} d 任意日期对象
 * @returns 周一 0.0的日期对象
 */
export function getWeekStart(d) {
  const d1 = new Date(d);
  let day = d1.getDay();
  day = day === 0 ? 7 : day;
  const startDate = d1.getDate() - (day - 1);
  const s = new Date(d1.getTime());
  s.setDate(startDate);
  s.setHours(0, 0, 0, 0);

  return s;
}
/**
 * 获取任一日期的周日
 *
 * @export
 * @param {Date} d 任意日期对象
 * @returns 周日 0.0的日期对象
 */
export function getWeekEnd(d) {
  const d1 = new Date(d);
  let day = d1.getDay();
  day = day === 0 ? 7 : day;
  const endDate = d1.getDate() + (7 - day);
  const e = new Date(d1.getTime());
  e.setDate(endDate);
  e.setHours(23, 59, 59, 999);
  return e;
}

export function date2text(d, withTime) {
  const year = d.getFullYear();
  const month = ('' + (d.getMonth() + 1)).padStart(2, '0');
  const date = ('' + d.getDate()).padStart(2, '0');
  if (withTime) {
    const h = ('' + d.getHours()).padStart(2, '0');
    const m = ('' + d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${h}:${m}`;
  }
  return `${year}-${month}-${date}`;
}

export function getWeekDate(d) {
  return {
    start: getWeekStart(d),
    end: getWeekEnd(d)
  };
}

export function getWeekDateText(d) {
  const { start, end } = getWeekDate(d);
  return `${date2text(start)}~${date2text(end)}`;
}
/**
 * 根据 yyyy-mm-dd 的日期获取日期对象
 *
 * @param {string} t yyyy-mm-dd 的日期
 * @returns 日期对象
 */
export function getDateByText(t) {
  const d = t.split('-');
  d[1] -= 1;
  return new Date(...d);
}

export default {
  date2text,
  getWeekStart,
  getWeekEnd,
  getWeekDate,
  getWeekDateText,
  getDateByText
};
