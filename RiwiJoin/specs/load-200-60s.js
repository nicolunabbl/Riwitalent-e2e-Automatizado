import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 200,          // 200 usuarios virtuales concurrentes
  duration: "60s",   // ejecutar durante 60 segundos
};

export default function () {
  const res = http.get("https://join.riwi.io/register"); // cambia por la URL que quieres probar

  check(res, {
    "status es 200": (r) => r.status === 200,
  });

  // “think time” opcional para simular usuario humano
  sleep(1);
}
