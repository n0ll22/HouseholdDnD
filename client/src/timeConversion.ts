export const timeInSeconds = (_length: { s: string; m: string; h: string }) => {
  const { s, m, h } = _length;
  return parseInt(h) * 3600 + parseInt(m) * 3600 + parseInt(s);
};

export const timeInHMS = (s: number) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const hoursString = hours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");
  const secondsString = seconds.toString().padStart(2, "0");

  return `${hoursString}:${minutesString}:${secondsString}`;
};
