export default function getDate(dateStr) {
  const date = dateStr.split('T');
  return date && date[0];
}
