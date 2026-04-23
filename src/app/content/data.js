import { jwtDecode } from "jwt-decode";

export const getTokenData= async()=>{
const token = localStorage.getItem("token")
console.log("Retrieved Token:", token ? "Token exists" : "No token found");
// if(!token){
//   showErrorToast('you are not authorized person')
// }
if (!token) {
  console.log("No token found in localStorage");
  return null;
}
const decodedToken = await jwtDecode(token);
console.log("Decoded Token Data:", decodedToken);
console.log("Available fields in token:", Object.keys(decodedToken));
return decodedToken;
}
