document.addEventListener("DOMContentLoaded", function () {

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
  const btn = document.querySelector(".simulate-btn");

  btn.addEventListener("click", () => {

    const oh = Number(document.getElementById("oh").value);
    const material = Number(document.getElementById("material").value);
    const labour = Number(document.getElementById("labour").value);
    const units = Number(document.getElementById("units").value);

    const materialPU = material / units;
    const labourPU = labour / units;
    const overheadPU = oh / units;
    const totalPU = materialPU + labourPU + overheadPU;

   document.getElementById("matPU").innerText =
"₹" + materialPU.toFixed(2);

document.getElementById("labPU").innerText =
"₹" + labourPU.toFixed(2);

document.getElementById("ohPU").innerText =
"₹" + overheadPU.toFixed(2);

document.getElementById("totalPU").innerText =
"₹" + totalPU.toFixed(2);

  });

});
