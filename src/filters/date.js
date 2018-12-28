export default function(time) {
  const dates = new Date(time * 1000);
  const year = dates.getFullYear();
  const month = dates.getMonth() + 1;
  const date = dates.getDate();
  return `${year}/${month}/${date}`;
  // return dates.toLocaleDateString();
}
