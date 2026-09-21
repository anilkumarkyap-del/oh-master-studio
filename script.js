document.addEventListener("DOMContentLoaded", function () {

  // ===== Department Selection =====
  const departments = document.querySelectorAll(".dept");

  departments.forEach(button => {
    button.addEventListener("click", () => {
      departments.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(".panel h2").innerText =
        "Department : " + button.innerText;
    });
  });

  // ===== Absorption Method =====
  const method = document.getElementById("method");
  const extraLabel = document.getElementById("extraLabel");
  const extraInput = document.getElementById("extraInput");

  method.addEventListener("change", () => {

    if(method.value==="unit"){
      extraLabel.innerText="Units Produced";
      extraInput.value=6000;
    }

    if(method.value==="labour"){
      extraLabel.innerText="Total Labour Hours";
      extraInput.value=6000;
    }

    if(method.value==="machine"){
      extraLabel.innerText="Total Machine Hours";
      extraInput.value=3000;
    }

    if(method.value==="dlc"){
      extraLabel.innerText="Total Direct Labour Cost (₹)";
      extraInput.value=600000;
    }

    if(method.value==="prime"){
      extraLabel.innerText="Prime Cost (₹)";
      extraInput.value=1400000;
    }

  });

  // ===== Calculate =====
  document.querySelector(".simulate-btn").addEventListener("click", () => {

    const oh = Number(document.getElementById("oh").value);
    const material = Number(document.getElementById("material").value);
    const labour = Number(document.getElementById("labour").value);
    const units = Number(document.getElementById("units").value);

    const materialPU = material / units;
    const labourPU = labour / units;

   let overheadPU = 0;
let rate = 0;
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

    // KPI Cards
    document.getElementById("matPU").innerText =
      "₹" + materialPU.toFixed(2);

    document.getElementById("labPU").innerText =
      "₹" + labourPU.toFixed(2);

    document.getElementById("ohPU").innerText =
      "₹" + overheadPU.toFixed(2);

    document.getElementById("totalPU").innerText =
      "₹" + totalPU.toFixed(2);

    // ===== Donut Chart =====
    const total = materialPU + labourPU + overheadPU;
    const C = 377;

    const matLen = (materialPU/total)*C;
    const labLen = (labourPU/total)*C;
    const ohLen = (overheadPU/total)*C;

    const mat = document.getElementById("matCircle");
    const lab = document.getElementById("labCircle");
    const ohc = document.getElementById("ohCircle");

    mat.setAttribute("stroke-dasharray", `${matLen} ${C}`);
    mat.setAttribute("stroke-dashoffset", "0");

    lab.setAttribute("stroke-dasharray", `${labLen} ${C}`);
    lab.setAttribute("stroke-dashoffset", `-${matLen}`);

    ohc.setAttribute("stroke-dasharray", `${ohLen} ${C}`);
    ohc.setAttribute("stroke-dashoffset", `-${matLen + labLen}`);

    document.getElementById("centerCost").textContent =
      "₹" + totalPU.toFixed(0);
    // Percentage Legend
document.getElementById("matPct").textContent =
  Math.round((materialPU/total)*100) + "%";

document.getElementById("labPct").textContent =
  Math.round((labourPU/total)*100) + "%";

document.getElementById("ohPct").textContent =
  Math.round((overheadPU/total)*100) + "%";

  });

});
