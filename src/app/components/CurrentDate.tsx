"use client";

const CurrentDate = () => {
  const currentDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return <p>{currentDate}</p>;
};

export default CurrentDate;
