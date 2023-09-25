import Cookies from "js-cookie";

export function cookie(name) {
  return JSON.parse(Cookies.get(name).slice(2));
}
