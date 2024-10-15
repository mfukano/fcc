const eventListeners = () => {
  const exerciseForm = document.getElementById("exercise-form");
  const logsForm = document.getElementById("logs-form");
  const logsContainer = document.getElementById("logs-container");

  exerciseForm.addEventListener("submit", () => {
    const userId = document.getElementById("uid").value;
    exerciseForm.action = `/api/users/${userId}/exercises`;

    exerciseForm.submit();
  });

  /**
   * The reason for the weird parameter manipulation and
   * subsequent MANUAL handling of form-submit fetch here is
   * because ?_id={id value} is part of the form structure in
   * index.html. This gets added to the href requested by the
   * form on logsForm.submit() since <form method="GET"> exposes
   * all input element values as parameters.
   *
   * To filter this and correctly format the URL and
   * query parameters, the form action is manually manipulated from
   * the values of the input elements on the page prior to submitting
   * the request to the server, and the subsequent JSON data returned
   * is formatted into template and injected into logsContainer.
   *
   * This uses JSX-like template generation because that's what I'm most
   * familiar with, but opted against using a higher-level library
   * to handle essentially one dynamic data loading function.
   */
  logsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("user-id").value;

    logsForm.action += `${userId}/logs`;

    const [_id, from, to, limit] = [
      ...logsForm
        .querySelectorAll("input")
        .values()
        .map((input) => input.value),
    ];

    const params = new URLSearchParams();
    const addParams = { from, to, limit };

    for (key in addParams) {
      params.append(key, addParams[key]);
    }

    logsForm.action += `?${params}`;

    const res = await fetch(logsForm.action);
    const json = await res.json();

    const template = `<div>
      <p>ID: ${json._id}</p>
      <p>Name: ${json.username}</p>
      <p>Count: ${json.count}</p>
      <p>Log:</p>
      <ul>
      ${json.log
        .map((exercise) => {
          return `<br>
            <li style="list-style: none;">
              <p>Description: ${exercise.description}</p>
              <p>Duration: ${exercise.duration}</p> 
              <p>Date: ${exercise.date}</p>
            </li>`;
        })
        .join("")}
      </ul>
    </div>`;
    console.log(`check template: ${template}`);

    logsContainer.innerHTML = template;

    console.log(`event listeners should be attached`);

    logsForm.action = `api/users/`;
  });
};

window.onload = () => {
  console.log("window onload");
  eventListeners();
};
