"use client";

import { data } from "@/services/user/route";
import { useEffect, useState } from "react";

interface mensajeProps {
  message: string;
}

const User = () => {
  const [mensaje, setmensaje] = useState<mensajeProps>();

  const fetchData = async () => {
    const result = await data();
    setmensaje(result);
  };

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      fetchData();
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <h1>Vista users</h1>
      <div>mensaje: {mensaje?.message}</div>
    </>
  );
};

export default User;
