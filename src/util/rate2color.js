export default function rate2color (rate) {
  if (rate >= 140) {
    return '#ea644a';
  }
  if (rate > 120) {
    return '#f1a325';
  }
  if (rate > 90) {
    return '#38b03f';
  }
  if (rate >= 70) {
    return '#f1a325';
  } else {
    return '#ea644a';
  }
}
