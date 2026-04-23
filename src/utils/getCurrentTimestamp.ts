
const getDate = (): string => {
  const date = new Date(Date.now());
  const rawHours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const period = rawHours < 12 ? 'AM' : 'PM'
  const hours = rawHours.toString().padStart(2, '0');

  return `${hours}:${minutes} ${period}`;
};

export default getDate;
