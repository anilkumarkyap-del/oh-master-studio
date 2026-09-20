// Department Selection
const departments = document.querySelectorAll(".dept");

departments.forEach(button => {
  button.addEventListener("click", () => {
    departments.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(".panel h2").innerText =
      "Department : " + button.innerText;
  });
});

// Cost Sheet Calculation
document.querySelector(".simulate-btn").addEventListener("click", () => {

  let oh = Number(document.getElementById("oh").value);
  let material = Number(document.getElementById("material").value);
  let labour = Number(document.getElementById("labour").value);
  let units = Number(document.getElementById("units").value);

  let materialPU = material / units;
  let labourPU = labour / units;
  let overheadPU = oh / units;
  let totalPU = materialPU + labourPU + overheadPU;

  alert(
`COST SHEET PER T-SHIRT

Material : ₹${materialPU.toFixed(2)}
Labour   : ₹${labourPU.toFixed(2)}
Overhead : ₹${overheadPU.toFixed(2)}

TOTAL COST = ₹${totalPU.toFixed(2)}`
  );

});
