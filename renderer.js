const input = document.getElementById("input");
const button = document.getElementById("submitBtn");
const status = document.getElementById("status");

button.addEventListener("click", () => {
  const text = input.value;

  if (!text) {
    status.innerText = "일정을 입력해주세요";
    return;
  }

  status.innerText = `입력됨: ${text}`;
});
