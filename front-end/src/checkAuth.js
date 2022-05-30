//
//  Arthur Lorhan -Nihl 15/05/2022
//

const LiteralObject = {
  NetworkError: {
    httpCode: 503,
    message: "Server error",
    ok: false,
  },
};

const ClassLiterals = {
  Transparent: "element-transparent",
};

function handleSuccess(eventCaller, hadError, responseObject) {
  document
    .querySelector("#load-image")
    .classList.add(ClassLiterals.Transparent);
  let parentDiv = eventCaller.parentElement;
  let popupDiv = document.querySelector("#popup");
  if (hadError) {
    popupDiv.classList.remove(ClassLiterals.Transparent);
    popupDiv.innerText = `${responseObject.httpCode}: ${responseObject.message}`;
    parentDiv.querySelector("p").innerText =
      eventCaller.name == "social" ? "AREN'T" : "CAN'T";
    eventCaller.classList.remove("green-hover");
    eventCaller.classList.add("red-hover");
    return;
  }
  popupDiv.classList.add(ClassLiterals.Transparent);
  parentDiv.querySelector("p").innerText =
    eventCaller.name == "social" ? "ARE" : "CAN";
  eventCaller.classList.remove("red-hover");
  eventCaller.classList.add("green-hover");
}

function sendCheck(event) {
  event.preventDefault();
  const eventCaller = event.target;

  document
    .querySelector("#load-image")
    .classList.remove(ClassLiterals.Transparent);

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

function verifyResponse(response) {
  if (response.ok) {
    console.log(response.status);
    return { httpCode: response.status, message: "Authorized", ok: true };
  } else if (response.status == 401) {
    console.log(response.status);
    return {
      httpCode: response.status,
      message: "You aren't logged in.",
      ok: false,
    };
  } else if (response.status == 403) {
    console.log(response.status);
    return {
      httpCode: response.status,
      message: "Your aren't authorized to this path",
      ok: false,
    };
  }
}

async function sendAnonGet(caller) {
  try {
    let response = await fetch(
      "http://localhost:5001/check-auth/anonymous",
      myInit
    );
    let okResponse = verifyResponse(response);
    if (okResponse) handleSuccess(caller);
    else handleSuccess(caller, true, verifiedResponse);
  } catch (error) {
    handleSuccess(caller, true, LiteralObject.NetworkError);
  }
}

async function sendNormalGet(caller) {
  try {
    let response = await fetch(
      "http://localhost:5001/check-auth/normal",
      myInit
    );
    let verifiedResponse = verifyResponse(response);
    if (verifiedResponse.ok) handleSuccess(caller);
    else handleSuccess(caller, true, verifiedResponse);
  } catch (error) {
    handleSuccess(caller, true, LiteralObject.NetworkError);
  }
}
async function sendAdminGet(caller) {
  try {
    let response = await fetch(
      "http://localhost:5001/check-auth/admin",
      myInit
    );
    let verifiedResponse = verifyResponse(response);
    if (verifiedResponse.ok) handleSuccess(caller);
    else handleSuccess(caller, true, verifiedResponse);
  } catch (error) {
    handleSuccess(caller, true, LiteralObject.NetworkError);
  }
}
async function sendSocialGet(caller) {
  try {
    let response = await fetch(
      "http://localhost:5001/check-auth/social",
      myInit
    );
    let verifiedResponse = verifyResponse(response);
    if (verifiedResponse.ok) handleSuccess(caller);
    else handleSuccess(caller, true, verifiedResponse);
  } catch (error) {
    handleSuccess(caller, true, LiteralObject.NetworkError);
  }
}

window.onload = () => {
  document.querySelector("#popup").classList.remove("preload");
  document.querySelector("#load-image").classList.remove("preload");
};
