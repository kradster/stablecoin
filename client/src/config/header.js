export const HEADER = {
    "Content-Type": "application/json",
    "email": localStorage.getItem("USER_EMAIL"),
    "authorization": localStorage.getItem("JWT_TOKEN"),
};