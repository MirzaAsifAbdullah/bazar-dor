"use client";

import { useEffect, useState } from "react";



const CurrentDate = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const currentDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    setDate (currentDate);
  }, []);

  return <>{date || "লোড হচ্ছে..."}</>;
};

export default CurrentDate;