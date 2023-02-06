//Variables
const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
//INPUT
let input = {
  cursorMovement: { x: 0, y: 0 },
  keyboard: { modifiers: [], keys: [] },
  mouseButtons: { left: false, middle: false, right: false },
  posCursorUnlocked: { x: 0, y: 0 },
};

//Enviorment Variables

let cursor = {
  pos: { x: 0, y: 0 },
  resDir: "./res/images/pointer.png",
  scale: 0.3,
  offset:{x:0,y:0}
};
let system = {
    apps:[
        { icon: "./res/images/browser.png", name: "Browser" },
        { icon: "./res/images/calculator.png", name: "Calculator" },
        { icon: "./res/images/file_explorer.png", name: " File Explorer" }
    ],
  taskbar: {
    apps: [
      { icon: "./res/images/browser.png", name: "Browser" },
      { icon: "./res/images/calculator.png", name: "Calculator" },
      { icon: "./res/images/file_explorer.png", name: " File Explorer" }
    ],
    icon: "./res/images/os-system.png",
    windows:[
        {name:"App1",size:{x:50,y:50},}
    ],
  },
};
let desktop = {
  wallpaper:
    "https://th.bing.com/th/id/R.9e368d13d05df97f8de0a401a89b3168?rik=nGrPe7np0bxULg&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2fe%2f9%2fb%2f1085668-best-simple-backgrounds-2490x1402-notebook.jpg&ehk=VAtr%2bthk46SmqH0MceKsy%2feyt3Kola3GsQZWn97cnuI%3d&risl=&pid=ImgRaw&r=0",
};

//Graphic Functions
function DrawCursor(Context, OverridePath) {
  if (OverridePath == null || OverridePath == undefined) {
    OverridePath = cursor.resDir;
  }
  const cursorTexture = new Image();
  cursorTexture.src = OverridePath;
  Context.drawImage(
    cursorTexture,
    cursor.pos.x + cursor.offset.x,
    cursor.pos.y + cursor.offset.y,
    cursorTexture.naturalWidth * cursor.scale,
    cursorTexture.naturalHeight * cursor.scale
  );
}
function DrawWallPaper() {
  let img = new Image();
  img.src = desktop.wallpaper;

  ctx.drawImage(img, 0, 0, innerWidth, innerHeight);
}

function DrawTaskbar() {
    let cursor_tch = false
  ctx.beginPath();
  ctx.rect(0, innerHeight - 50, innerWidth, 50);
  ctx.fillStyle = "rgba(255,255,255)";
  ctx.fill();
  ctx.beginPath();
  const icns = new Image();
  icns.src = system.taskbar.icon;
  ctx.drawImage(icns, 5, innerHeight - 47, 45, 45);
  if (
    cursor.pos.x > 5 &&
    cursor.pos.x < 50 &&
    cursor.pos.y < innerHeight &&
    cursor.pos.y > innerHeight - 47
  ) {
    cursor_tch = true
  }

  system.taskbar.apps.forEach((e, i) => {
    let image = new Image();
   
    image.src = e.icon;
    ctx.beginPath();
    ctx.drawImage(
      image,
      innerWidth / 2 - 35 / 2 - (system.taskbar.apps.length - (i + 2)) * 40 + i*8,
      innerHeight - 42,
      35,
      35
    );
    if (
        cursor.pos.x > innerWidth / 2 - 35 / 2 - (system.taskbar.apps.length - (i + 2)) * 40 + i*8 &&
        cursor.pos.x < innerWidth / 2 - 35 / 2 - (system.taskbar.apps.length - (i + 2)) * 40 + i*8 + 35 &&
        cursor.pos.y < innerHeight &&
        cursor.pos.y > innerHeight - 35
      ) {
       cursor_tch = true
      }
  });
  if(cursor_tch){
    cursor.resDir = "./res/images/hand.png";
    cursor.scale = 0.4;
    cursor.offset.x = -7
  }else{
    cursor.resDir = "./res/images/pointer.png";
    cursor.scale = 0.3;
    cursor.offset.x = 0
  }
}
function DrawWindows(){

}

//Update Screen
function updateScreen() {
  requestAnimationFrame(updateScreen);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  DrawWallPaper();

  DrawTaskbar();
  //Drawing the Cursor - Keep below other Renderers but Above Taskbar
  //moves cursor
  let size = new Image();
  size.src = cursor.resDir;

  cursor.pos.x += input.cursorMovement.x;
  if (cursor.pos.x < 0) {
    cursor.pos.x = 0;
  }
  if (cursor.pos.x > innerWidth - 5) {
    cursor.pos.x = innerWidth - 5;
  }
  cursor.pos.y += input.cursorMovement.y;
  if (cursor.pos.y < 0) {
    cursor.pos.y = 0;
  }
  if (cursor.pos.y > innerHeight - 5) {
    cursor.pos.y = innerHeight - 5;
  }
  input.cursorMovement.x = 0;
  input.cursorMovement.y = 0;
  DrawCursor(ctx);
}

//Initiater
setInterval(() => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

DrawWallPaper();
updateScreen();
canvas.onclick = () => {
  canvas.requestPointerLock();
  canvas.requestFullscreen();
};
onkeydown = onkeyup = function (e) {
  input.keyboard.keys[e.key] = e.type == "keydown";
};
onmousemove = (e) => {
  input.cursorMovement = {
    x: e.movementX,
    y: e.movementY,
  };
  input.posCursorUnlocked = {
    x: e.clientX,
    y: e.clientY,
  };
};
onmousedown = onmouseup = (e) => {
  if (e.button == 0) {
    input.mouseButtons.left = e.type == "mousedown";
  } else if (e.button == 1) {
    input.mouseButtons.middle = e.type == "mousedown";
  } else if (e.button == 2) {
    input.mouseButtons.right = e.type == "mousedown";
  }
};
setInterval(() => {
  if (document.pointerLockElement == canvas) {
  } else {
    cursor.pos = input.posCursorUnlocked;
  }
});
