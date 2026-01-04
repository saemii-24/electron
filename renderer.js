const { ipcRenderer } = require("electron");

const input = document.getElementById("input");
const status = document.getElementById("status");

window.submitSchedule = async function () {
  const text = input.value;

  if (!text) {
    status.innerText = "일정을 입력해주세요";
    return;
  }

  status.innerText = "AI가 생각 중입니다...";

  try {
    const result = await ipcRenderer.invoke("ask-gemini", text);
    status.innerText = result;
  } catch (error) {
    console.error(error);
    status.innerText = "AI 호출 중 오류가 발생했습니다";
  }
};

window.connectGoogle = async function () {
  try {
    const result = await ipcRenderer.invoke("google-auth");
    document.getElementById("status").innerText = result;
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText =
      "Google 인증 중 오류가 발생했습니다";
  }
};
