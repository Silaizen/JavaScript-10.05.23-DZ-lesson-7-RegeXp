const colorNames = [];
const colorCodes = [];

let colorPalette = getCookie("colorPalette");
if (colorPalette) {
  colorPalette = JSON.parse(colorPalette);
  populateColorPalette(colorPalette);
}

document.getElementById("color-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const colorNameInput = document.getElementById("color-name");
  const colorTypeSelect = document.getElementById("color-type");
  const colorType = colorTypeSelect.value;
  const colorCodeInput = document.getElementById("color-code");
  const colorCode = colorCodeInput.value;

  const validColorName = validateColorName(colorNameInput.value);
  const validColorCode = validateColorCode(colorType, colorCode);

  if (validColorName && validColorCode) {
    const colorName = colorNameInput.value.toLowerCase();

    if (colorNames.includes(colorName)) {
      const colorNameError = document.getElementById("color-name-error");
      colorNameInput.classList.add("error-input");
      colorNameError.classList.remove("hidden");
      colorNameError.textContent =
        "Цвет с таким именем уже существует. Пожалуйста, выберите другое имя.";
      return;
    }

    const colorItem = document.createElement("div");
    colorItem.classList.add("color-item");
    colorItem.style.backgroundColor =
      colorType === "hex" ? colorCode : `rgba(${colorCode})`;
    colorItem.title = colorName;

    const colorNameElement = document.createElement("div");
    colorNameElement.classList.add("color-name");
    colorNameElement.textContent = colorName;

    const colorTypeElement = document.createElement("div");
    colorTypeElement.classList.add("color-type");
    colorTypeElement.textContent = colorType.toUpperCase();

    const colorCodeElement = document.createElement("div");
    colorCodeElement.classList.add("color-code");
    colorCodeElement.textContent = colorCode;

    colorItem.appendChild(colorNameElement);
    colorItem.appendChild(colorTypeElement);
    colorItem.appendChild(colorCodeElement);

    const colorPaletteContainer = document.getElementById("color-palette");
    colorPaletteContainer.appendChild(colorItem);

    colorNames.push(colorName);
    colorCodes.push(colorCode);

    colorNameInput.value = "";
    colorTypeSelect.value = "rgb";
    colorCodeInput.value = "";

    colorPalette = getCookie("colorPalette");
    if (colorPalette) {
      colorPalette = JSON.parse(colorPalette);
    } else {
      colorPalette = [];
    }

    colorPalette.push({
      name: colorName,
      type: colorType,
      code: colorCode,
    });

    setCookie("colorPalette", JSON.stringify(colorPalette), 3);
  }
});

function validateColorCode(colorType, colorCode) {
  let valid = false;
  let errorMessage = "";

  if (colorType === "rgb") {
    const rgbRegex = /^\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*$/;
    if (!rgbRegex.test(colorCode)) {
      errorMessage =
        "Неправильный формат кода цвета. Формат должен быть '0-255, 0-255, 0-255'";
    } else {
      valid = true;
    }
  } else if (colorType === "rgba") {
    const rgbaRegex =
      /^\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*(0(\.\d{1,2})?|1(\.0{1,2})?)\s*$/;
    if (!rgbaRegex.test(colorCode)) {
      errorMessage =
        "Неправильный формат кода цвета. Формат должен быть '0-255, 0-255, 0-255, от 0 до 1'";
    } else {
      valid = true;
    }
  } else if (colorType === "hex") {
    const hexRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    if (!hexRegex.test(colorCode)) {
      errorMessage =
        "Неправильный формат кода цвета. Формат должен быть '#ABC' или '#ABCDEF'";
    } else {
      valid = true;
    }
  }

  const colorCodeInput = document.getElementById("color-code");
  const colorCodeError = document.getElementById("color-code-error");

  if (!valid) {
    colorCodeInput.classList.add("error-input");
    colorCodeError.classList.remove("hidden");
    colorCodeError.textContent = errorMessage;
  } else {
    colorCodeInput.classList.remove("error-input");
    colorCodeError.classList.add("hidden");
    colorCodeError.textContent = ""; 
  }

  return valid;
}

function validateColorName(colorName) {
  const hasNonLetters = /[^а-яА-ЯЁёa-zA-Z]/.test(colorName);

  const colorNameInput = document.getElementById("color-name");
  const colorNameError = document.getElementById("color-name-error");

  if (hasNonLetters) {
    colorNameInput.classList.add("error-input");
    colorNameError.classList.remove("hidden");
    colorNameError.textContent = "Можно вводить только буквы";
    return false;
  } else {
    colorNameInput.classList.remove("error-input");
    colorNameError.classList.add("hidden");
    colorNameError.textContent = "";
    return true;
  }
}



function populateColorPalette(colorPalette) {
  colorPalette.forEach((color) => {
    const colorItem = document.createElement("div");
    colorItem.classList.add("color-item");
    colorItem.style.backgroundColor =
      color.type === "hex" ? color.code : `rgba(${color.code})`;
    colorItem.title = color.name;

    const colorNameElement = document.createElement("div");
    colorNameElement.classList.add("color-name");
    colorNameElement.textContent = color.name;

    const colorTypeElement = document.createElement("div");
    colorTypeElement.classList.add("color-type");
    colorTypeElement.textContent = color.type.toUpperCase();

    const colorCodeElement = document.createElement("div");
    colorCodeElement.classList.add("color-code");
    colorCodeElement.textContent = color.code;

    colorItem.appendChild(colorNameElement);
    colorItem.appendChild(colorTypeElement);
    colorItem.appendChild(colorCodeElement);

    const colorPaletteContainer = document.getElementById("color-palette");
    colorPaletteContainer.appendChild(colorItem);

    colorNames.push(color.name);
    colorCodes.push(color.code);
  });
}

function setCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
}

function getCookie(name) {
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
