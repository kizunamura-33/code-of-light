const commands = [];
const functions = {};

const player = document.getElementById("player");
const lamp = document.getElementById("lamp1");
const obstacle = document.getElementById("obstacle");
const commandView = document.getElementById("commands");

let position = 20;
let currentStage = 1;

// ----------------
// コマンド追加
// ----------------
function addCommand(type) {
  if (type === "repeat") {
    commands.push({ type: "repeat", count: 3, action: "moveRight" });
  } else if (type === "if") {
    commands.push({ type: "if" });
  } else {
    commands.push({ type });
  }
  renderCommands();
}

// ----------------
// 表示
// ----------------
function renderCommands() {
  commandView.innerHTML = commands.map(cmd => {
    if (cmd.type === "repeat") return `repeat(${cmd.count})`;
    if (cmd.type === "if") return `if(obstacle) jump`;
    if (cmd.type === "function") return `${cmd.name}()`;
    return cmd.type;
  }).join("<br>");
}

// ----------------
// 実行
// ----------------
async function run() {
  for (let cmd of commands) {
    await execute(cmd);
    checkClear();
  }
}

// ----------------
// 実行処理
// ----------------
function execute(cmd) {
  return new Promise(resolve => {
    setTimeout(async () => {

      if (cmd.type === "moveRight") moveRight();
      if (cmd.type === "lightOn") lightOn();

      if (cmd.type === "repeat") {
        for (let i = 0; i < cmd.count; i++) {
          moveRight();
          await wait(200);
        }
      }

      if (cmd.type === "if") {
        if (isBlocked()) {
          jump();
        } else {
          moveRight();
        }
      }

      if (cmd.type === "function") {
        let fn = functions[cmd.name];
        if (fn) {
          for (let sub of fn) {
            await execute(sub);
          }
        }
      }

      resolve();
    }, 300);
  });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ----------------
// 動き
// ----------------
function moveRight() {
  position += 40;
  player.style.left = position + "px";
}

function lightOn() {
  lamp.classList.add("on");
}

function jump() {
  player.style.bottom = "60px";
  setTimeout(() => {
    player.style.bottom = "20px";
  }, 300);
}

function isBlocked() {
  return position >= 120 && position <= 160;
}

// ----------------
// 関数
// ----------------
function createFunction() {
  const name = prompt("関数名は？", "goForward");
  if (!name) return;
  functions[name] = [...commands];
  alert(name + "() を作成！");
}

function callFunction() {
  const name = prompt("呼び出す関数名は？", "goForward");
  if (!functions[name]) {
    alert("ないよ！");
    return;
  }
  commands.push({ type: "function", name });
  renderCommands();
}

// ----------------
// ステージ
// ----------------
function loadStage(stage) {
  reset();
  currentStage = stage;

  obstacle.style.display = stage >= 3 ? "block" : "none";
}

// ----------------
// クリア判定
// ----------------
function checkClear() {
  if (currentStage === 1 && lamp.classList.contains("on")) {
    clearStage();
  }

  if (currentStage >= 2 && position > 240) {
    clearStage();
  }
}

// ----------------
// クリア
// ----------------
function clearStage() {
  setTimeout(() => {
    alert("🌟 クリア！");
  }, 200);
}

// ----------------
// リセット
// ----------------
function reset() {
  commands.length = 0;
  position = 20;
  player.style.left = position + "px";
  player.style.bottom = "20px";
  lamp.classList.remove("on");
  renderCommands();
}

// 初期
loadStage(1);
