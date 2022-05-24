function changeColor(eventCaller) {
  eventCaller.classList.add("green-hover");
}

function sendCheck(event) {
  event.preventDefault();
  const eventCaller = event.target;

  switch (eventCaller.name) {
    case "anon":
      sendAnonGet(eventCaller);
      break;
    case "normal":
      sendNormalGet(eventCaller);
      break;
    case "admin":
      sendAdminGet(eventCaller);
      break;
    case "social":
      sendSocialGet(eventCaller);
      break;
  }
}

function getTokenLocal(key) {
  return window.localStorage.getItem(key) != null
    ? window.localStorage.getItem(key)
    : " ";
}

async function sendAnonGet(caller) {
  let response = await fetch("http://localhost:5001/check-auth/anonymous");
  console.log(response);
  if (response.ok) changeColor(caller);
}

var myHeaders = new Headers();
myHeaders.set("Content-Type", "application/json");
myHeaders.set("Accept", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");
myHeaders.set("Authorization", "Bearer " + getTokenLocal("@loginpage/token"));

var myInit = {
  method: "GET",
  headers: myHeaders,
  mode: "cors",
  cache: "default",
};

async function sendNormalGet(caller) {
  let response = await fetch("http://localhost:5001/check-auth/normal", myInit);
  console.log(response);
  if (response.ok) changeColor(caller);
}
async function sendAdminGet(caller) {
  let response = await fetch("http://localhost:5001/check-auth/admin", myInit);
  console.log(response);
  if (response.ok) changeColor(caller);
}
async function sendSocialGet(caller) {
  let response = await fetch("http://localhost:5001/check-auth/social", myInit);
  console.log(response);
  if (response.ok) changeColor(caller);
}
