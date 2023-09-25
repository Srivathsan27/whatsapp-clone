import Cookies from "js-cookie";

export default function isAuth() {
  const user = Cookies.get("user");
  if (user != undefined && user != null && user.trim() != "") {
    return true;
  }
  return false;
}
