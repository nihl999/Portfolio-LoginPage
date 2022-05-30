//
//  Arthur Lorhan -Nihl 15/05/2022
//

function init() {
  const apiBaseUrl = "http://localhost:5001";
  const form = document.querySelector("#prop-sign-in");
  const submitButton = form.querySelector("button");
  const emailInput = document.querySelector("#input-email");
  const passwordInput = document.querySelector("#input-password");

  const formTypes = {
    Login: 1,
    Register: -1,
  };

  let currentFormType = formTypes.Login;

  let registerAnchor = document
    .querySelector("#register-account")
    .querySelector("a");

  function validateEmail(event) {
    let input = event.currentTarget;
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const validEmail = regex.test(input.value);
    if (validEmail) {
      submitButton.removeAttribute("disabled");
      input.classList.remove("error");
      return true;
    } else if (input.value.length == 0) {
      input.classList.remove("error");
      submitButton.setAttribute("disabled", "disabled");
      return false;
    } else {
      input.classList.add("error");
      submitButton.setAttribute("disabled", "disabled");
      return false;
    }
  }

  function validatePassword(event) {
    let input = event.currentTarget;

    if (input.value.length >= 8) {
      submitButton.removeAttribute("disabled");
      input.classList.remove("error");
      return true;
    } else if (input.value.length == 0) {
      input.classList.remove("error");
      submitButton.setAttribute("disabled", "disabled");
      return false;
    } else {
      input.classList.add("error");
      submitButton.setAttribute("disabled", "disabled");
      return false;
    }
  }

  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", validatePassword);

  async function makePostRequest(data, url) {
    var myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json");
    myHeaders.set("Accept", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(data),
    };

    return new Request(url, myInit);
  }

  function createRequestBody() {
    const email = document.querySelector("#input-email").value;
    const password = document.querySelector("#input-password").value;
    let postBody = {
      username: email,
      password: password,
    };
    return postBody;
  }

  async function saveTokenLocal(token, key) {
    window.localStorage.setItem(key, token);
  }
  async function getTokenLocal(key) {
    return window.localStorage.getItem(key);
  }

  async function sendLoginRequest() {
    const postRequest = await makePostRequest(
      createRequestBody(),
      apiBaseUrl + "/auth/login"
    );
    let response = await fetch(postRequest);
    return response;
  }
  async function sendRegisterRequest() {
    const postRequest = await makePostRequest(
      createRequestBody(),
      apiBaseUrl + "/auth/register"
    );
    let response = await fetch(postRequest);
    return response;
  }

  async function loginEventListener(event) {
    event.preventDefault();
    let validEmail = validateEmail({ currentTarget: emailInput });
    let validPassword = validatePassword({ currentTarget: passwordInput });
    if (!validEmail || !validPassword) return;
    let response = await sendLoginRequest();
    if (response) response = await response.json();
    if (response.response.token != undefined) {
      saveTokenLocal(response.response.token, "@loginpage/token");
      submitButton.animate([{ opacity: 0 }, { opacity: 1 }], 500);
      submitButton.classList.add("success-button");
      submitButton.innerText = "Logged in with success!";
      setTimeout(() => (window.location.href = "../check-auth.html"), 2000);
    }
    console.log(response);
  }
  async function registerEventListener(event) {
    let validEmail = validateEmail({ currentTarget: emailInput });
    let validPassword = validatePassword({ currentTarget: passwordInput });
    if (!validEmail || !validPassword) return;
    event.preventDefault();
    let response = await sendRegisterRequest();
    if (response) response = await response.json();
  }
  function loginForm() {
    let form = document.querySelector("#prop-sign-in");
    let submitButton = form.querySelector("button");
    submitButton.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    submitButton.innerHTML =
      'Login to your Account <img src="images/arrow.svg" />';
    let registerAnchor = document
      .querySelector("#register-account")
      .querySelector("a");
    registerAnchor.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    registerAnchor.innerText = "Register your account";
    form.removeEventListener("submit", registerEventListener);
    form.addEventListener("submit", loginEventListener);
  }

  function registerForm() {
    let form = document.querySelector("#prop-sign-in");
    let submitButton = form.querySelector("button");
    submitButton.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    submitButton.innerHTML =
      'Register your Account <img src="images/arrow.svg" />';
    let registerAnchor = document
      .querySelector("#register-account")
      .querySelector("a");
    registerAnchor.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    registerAnchor.innerText = "Login to your account";
    form.removeEventListener("submit", loginEventListener);
    form.addEventListener("submit", registerEventListener);
  }

  function changeForm(formType) {
    console.log("entered");
    if (formType == formTypes.Login) loginForm();
    else if (formType == formTypes.Register) registerForm();
  }

  registerAnchor.addEventListener("click", (event) => {
    event.preventDefault();
    currentFormType *= -1;
    changeForm(currentFormType);
    console.log("clicked");
  });

  changeForm(currentFormType);
}

window.onload = init;
