const mainContainer = document.querySelector(".main-cont__cont");
const reloadBtn = document.getElementById("reload-btn");
const userPointsSpan = document.getElementById("user-points-span");
const pcPointsSpan = document.getElementById("pc-points-span");

let userColor;
let pcColor;
let backgroundTimer;

const cube1 = document.querySelector(".cube-1");
const cube2 = document.querySelector(".cube-2");
const cube3 = document.querySelector(".cube-3");
const cube4 = document.querySelector(".cube-4");
const cube5 = document.querySelector(".cube-5");
const cube6 = document.querySelector(".cube-6");
const cube7 = document.querySelector(".cube-7");
const cube8 = document.querySelector(".cube-8");
const cube9 = document.querySelector(".cube-9");
const combs = {
  row1: [cube1, cube2, cube3],
  row2: [cube4, cube5, cube6],
  row3: [cube7, cube8, cube9],

  col1: [cube1, cube4, cube7],
  col2: [cube2, cube5, cube8],
  col3: [cube3, cube6, cube9],

  diag1: [cube1, cube5, cube9],
  diag2: [cube3, cube5, cube7],
};

const $CUBES = Array.from(document.querySelectorAll(".cube"));

userPointsSpan.textContent = localStorage.getItem("user-victories") || 0;
pcPointsSpan.textContent = localStorage.getItem("pc-victories") || 0;

function smartMovement() {
  let cube;

  if (findSmartLine("pc")) {
    const line = findSmartLine("pc");
    cube = combs[line].find(isFree);
  } else if (findSmartLine("user")) {
    const line = findSmartLine("user");
    cube = combs[line].find(isFree);
  } else {
    const cubes = Array.from(document.querySelectorAll(".cube"));
    const freeCubes = cubes.filter(isFree);
    cube = freeCubes[randomNum(freeCubes.length - 1, 0)];
  }
  cube.classList.add("pc");
  document
    .querySelectorAll(".cube.pc")
    .forEach((cube) => (cube.style.backgroundColor = pcColor));
}
function findSmartLine(who) {
  const smartLines = [];
  for (const string in combs) {
    const comb = combs[string];
    const clickedCubes = comb.filter((el) => el.classList.contains(who));
    const isCombFree = comb.some(isFree);
    if (clickedCubes.length === 2 && isCombFree) smartLines.push(string);
  }
  return smartLines[randomNum(smartLines.length - 1, 0)];
}
function randomNum(max, min) {
  return Math.round(Math.random() * (max - min) + min);
}
function thereIsALine(clss) {
  let line = [];
  for (const string in combs) {
    const comb = combs[string];
    if (comb.every((el) => el.classList.contains(clss))) line.push(string);
  }
  return line[randomNum(line.length - 1, 0)];
}
function isFree(cube) {
  return !cube.classList.contains("user") && !cube.classList.contains("pc");
}
function areCubesFree() {
  const pcCubes = document.querySelectorAll(".pc");
  const userCubes = document.querySelectorAll(".user");
  return userCubes.length < 5 || pcCubes.length < 4;
}
function victory(who) {
  mainContainer.removeEventListener("click", useTurn);
  const response = thereIsALine(who);
  let animationName;
  if (who === "user") {
    if (localStorage.getItem("user-victories")) {
      const currLocalValue = parseInt(localStorage.getItem("user-victories"));
      userPointsSpan.textContent = currLocalValue + 1;
      localStorage.setItem("user-victories", currLocalValue + 1);
    } else {
      localStorage.setItem("user-victories", "1");
      userPointsSpan.textContent = "1";
    }
    mainContainer.style.borderColor = userColor;
    animationName = "user-wins";
  } else {
    if (localStorage.getItem("pc-victories")) {
      const pcLocalValue = parseInt(localStorage.getItem("pc-victories"));
      pcPointsSpan.textContent = pcLocalValue + 1;
      localStorage.setItem("pc-victories", pcLocalValue + 1);
    } else {
      localStorage.setItem("pc-victories", "1");
      pcPointsSpan.textContent = "1";
    }
    mainContainer.style.borderColor = pcColor;
    animationName = "pc-wins";
  }
  combs[response].forEach((el) => {
    el.style.animationName = animationName;
    el.style.animationDuration = ".6s";
    if (who === "pc") {
      el.style.animationIterationCount = "2";
    }
  });

  rotateReplayBtn();
}
function rotateReplayBtn() {
  setTimeout(() => {
    reloadBtn.style.transform = "rotateZ(15deg)";
  }, 600);
  setTimeout(() => {
    reloadBtn.style.animationName = "slidein";
    reloadBtn.style.animationDuration = ".8s";
    reloadBtn.style.animationIterationCount = "3";
    reloadBtn.style.animationTimingFunction = "ease-in-out";
    reloadBtn.style.animationDirection = "alternate";
  }, 1000);
  setTimeout(() => {
    reloadBtn.style.transform = "rotateZ(0deg)";
  }, 3500);
}
function useTurn(e) {
  if (e.target.classList.contains("cube") && isFree(e.target)) {
    const cube = e.target;
    cube.classList.add("user");
    document
      .querySelectorAll(".cube.user")
      .forEach((cube) => (cube.style.backgroundColor = userColor));

    if (thereIsALine("user")) {
      victory("user");
      console.log("you win!");
    } else if (areCubesFree()) {
      mainContainer.removeEventListener("click", useTurn);
      setTimeout(() => {
        smartMovement();
        if (thereIsALine("pc")) {
          victory("pc");
          console.log("pc wins!");
        } else {
          mainContainer.addEventListener("click", useTurn);
        }
      }, randomNum(1500, 500));
    } else {
      rotateReplayBtn();
      console.log("nobody won :(");
    }
  }
}
function resetPoints() {
  localStorage.removeItem("user-victories");
  localStorage.removeItem("pc-victories");
  userPointsSpan.textContent = "0";
  pcPointsSpan.textContent = "0";
}
function clearInterface() {
  mainContainer.addEventListener("click", useTurn);
  reloadBtn.style = "";
  mainContainer.style.borderColor = "";
  $CUBES.forEach((cube) => {
    cube.classList.remove("user", "pc");
    cube.style = "";
    cube.style.backgroundColor = "#6495ed";
  });
}
function updateUserLocalConfig() {
  $SETTINGS_MODAL.querySelectorAll("input[type=checkbox]").forEach((input) => {
    localStorage.setItem(input.name, input.checked);
  });
  $SETTINGS_MODAL.querySelectorAll("input[type=color]").forEach((input) => {
    localStorage.setItem(input.name, input.value);
  });

  renderUserLocalConfig();
}
function renderUserLocalConfig() {
  $SETTINGS_MODAL.querySelectorAll("input[type=checkbox]").forEach((input) => {
    input.checked = JSON.parse(localStorage.getItem(input.name));
  });

  $SETTINGS_MODAL.querySelectorAll("input[type=color]").forEach((input) => {
    input.value = localStorage.getItem(input.name);
  });

  if (JSON.parse(localStorage.getItem("color-rainbow"))) {
    backgroundTimer ? null : renderBackgroundGradients();
  } else {
    clearInterval(backgroundTimer);
    backgroundTimer = null;
    mainContainer.style.background = "#454545";
  }

  userColor = localStorage.getItem("user-color") || "goldenrod";
  pcColor = localStorage.getItem("pc-color") || "darkorchid";

  document.body.style.setProperty("--user-victory-color", userColor);
  document.body.style.setProperty("--pc-victory-color", pcColor);
}
function renderBackgroundGradients() {
  mainContainer.style.background = GRADIENTS[randomNum(6, 0)];
  backgroundTimer = setInterval(() => {
    mainContainer.style.background = GRADIENTS[randomNum(6, 0)];
  }, 7000);
}
const GRADIENTS = [
  "linear-gradient(to RIGHT, #07f, #7f0)",
  "linear-gradient(to RIGHT, #f70, #07f)",
  "linear-gradient(to RIGHT, #70f, #f07)",
  "linear-gradient(to RIGHT, #0f7, #70f)",
  "linear-gradient(to RIGHT, #f07, #0f7)",
  "linear-gradient(to RIGHT, #7f0, #f70)",
];

const $SETTINGS_MODAL = document.getElementById("settings-modal");

document.addEventListener("click", (e) => {
  if (e.target.matches("#open-settings-modal-btn i")) {
    $SETTINGS_MODAL.showModal();
  } else if (e.target.matches(".modal-control-btn")) {
    if (e.target.matches(".succes-btn")) {
      updateUserLocalConfig();
    } else if (e.target.matches(".danger-btn")) {
      renderUserLocalConfig();
    }

    $SETTINGS_MODAL.close();
  } else if (e.target.matches("#reload-btn")) clearInterface();
  else if (
    e.target.matches("#reset-points-btn") ||
    e.target.matches("#responsive-reset-points-btn")
  )
    resetPoints();
});

document.addEventListener("DOMContentLoaded", renderUserLocalConfig);
mainContainer.addEventListener("click", useTurn);
