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
  // Absorption Method
const method = document.getElementById("method");
const extraLabel = document.getElementById("extraLabel");
const extraInput = document.getElementById("extraInput");

method.addEventListener("change", () => {

  if(method.value === "labour"){
    extraLabel.innerText = "Total Labour Hours";
    extraInput.value = 6000;
  }

  if(method.value === "machine"){
    extraLabel.innerText = "Total Machine Hours";
    extraInput.value = 3000;
  }

  if(method.value === "dlc"){
    extraLabel.innerText = "Total Direct Labour Cost (₹)";
    extraInput.value = 600000;
  }

  if(method.value === "prime"){
    extraLabel.innerText = "Prime Cost (₹)";
    extraInput.value = 1400000;
  }

  if(method.value === "unit"){
    extraLabel.innerText = "Units Produced";
    extraInput.value = 6000;
  }

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
  let overheadPU = 0;
const base = Number(extraInput.value);

switch(method.value){

  case "unit":
    overheadPU = oh / units;
    break;

  case "labour":
    overheadPU = oh / base;
    break;

  case "machine":
    overheadPU = oh / base;
    break;

  case "dlc":
    overheadPU = (oh / base) * labourPU;
    break;

  case "prime":
    const primePU = materialPU + labourPU;
    overheadPU = (oh / base) * primePU;
    break;
}
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
