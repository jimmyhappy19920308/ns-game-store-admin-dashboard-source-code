export default function(time) {
  const dates = new Date(time * 1000);
  const year = dates.getFullYear();
  let month = dates.getMonth() + 1;
  let date = dates.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (date < 10) {
    date = `0${date}`;
  }
  return `${year}/${month}/${date}`;
  // return dates.toLocaleDateString();
}
