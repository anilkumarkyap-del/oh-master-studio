const departments = document.querySelectorAll(".dept");

departments.forEach(button => {
  button.addEventListener("click", () => {

    // Remove previous blue button
    departments.forEach(b => b.classList.remove("active"));

    // Make selected button blue
    button.classList.add("active");

    // Change the heading
    document.querySelector(".panel h2").innerText =
      "Department : " + button.innerText;

  });
});
