const mainContainer = document.querySelector(".main-cont__cont");
const reloadBtn = document.getElementById("reload-btn");
const userPointsSpan = document.getElementById("user-points-span");
const pcPointsSpan = document.getElementById("pc-points-span");
const resetPointsBtn = document.getElementById("reset-points-btn");
const responsiveResetPointsBtn = document.getElementById(
  "responsive-reset-points-btn"
);
// const $menuBtn = document.getElementById('menu-btn')
// const $configSidebar = document.getElementById('config-sidebar')

// $menuBtn.addEventListener('mouseenter' , ()=> {
//   $configSidebar.style.top = '10vh'
// })

// $menuBtn.addEventListener('mouseleave' , ()=> {
//   $configSidebar.style.top = '0'
// })
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

const userColor = "goldenrod";
const pcColor = "darkorchid";

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
  cube.style.backgroundColor = pcColor;
  cube.classList.add("pc");
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
    cube.style.backgroundColor = userColor;
    cube.classList.add("user");

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

mainContainer.addEventListener("click", useTurn);
reloadBtn.addEventListener("click", clearInterface);
resetPointsBtn.addEventListener("click", resetPoints);
responsiveResetPointsBtn.addEventListener("click", resetPoints);

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

const gradients = [
  "linear-gradient(to RIGHT, #07f, #7f0)",
  "linear-gradient(to RIGHT, #f70, #07f)",
  "linear-gradient(to RIGHT, #70f, #f07)",
  "linear-gradient(to RIGHT, #0f7, #70f)",
  "linear-gradient(to RIGHT, #f07, #0f7)",
  "linear-gradient(to RIGHT, #7f0, #f70)",
];

setInterval(() => {
  mainContainer.style.background = gradients[randomNum(6, 0)];
}, 7000);
