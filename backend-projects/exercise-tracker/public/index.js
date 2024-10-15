const exerciseForm = document.getElementById("exercise-form");

const logsForm = document.getElementById("logs-form");
const logsContainer = document.getElementById("logs-container");

exerciseForm.addEventListener("submit", () => {
  const userId = document.getElementById("uid").value;
  exerciseForm.action = `/api/users/${userId}/exercises`;

  exerciseForm.submit();
});

logsForm.addEventListener("submit", () => {
  const userId = document.getElementById("user-id").value;
  logsForm.action = `/api/users/${userId}/logs`;

  logsForm.submit();
  console.log("after submitting the form, log this");
});
