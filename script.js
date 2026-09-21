document.addEventListener("DOMContentLoaded", function () {

  // ==========================
  // Department Selection
  // ==========================
  const departments = document.querySelectorAll(".dept");

  departments.forEach(btn => {
    btn.addEventListener("click", () => {
      departments.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ==========================
  // Absorption Method
  // ==========================
  const method = document.getElementById("method");
  const extraLabel = document.getElementById("extraLabel");
  const extraInput = document.getElementById("extraInput");

  method.addEventListener("change", () => {

    extraInput.disabled = false;

    switch(method.value){

      case "unit":
        extraLabel.innerText = "Units Produced";
        extraInput.value = 6000;
        break;

      case "labour":
        extraLabel.innerText = "Total Labour Hours";
        extraInput.value = 6000;
        break;

      case "machine":
        extraLabel.innerText = "Total Machine Hours";
        extraInput.value = 3000;
        break;

      case "dlc":
        extraLabel.innerText = "Direct Labour Cost (₹)";
        extraInput.value = 600000;
        break;

      case "prime":
        extraLabel.innerText = "Prime Cost (Auto)";
        extraInput.value = "";
        extraInput.placeholder = "Calculated Automatically";
        extraInput.disabled = true;
        break;
    }

  });

  // ==========================
  // Calculate Button
  // ==========================
  document.querySelector(".simulate-btn").addEventListener("click", () => {

    const oh = Number(document.getElementById("oh").value);
    const material = Number(document.getElementById("material").value);
    const labour = Number(document.getElementById("labour").value);
    const units = Number(document.getElementById("units").value);

    const materialPU = material / units;
    const labourPU = labour / units;
    const primeCost = material + labour;

    let overheadPU = 0;
    let rate = 0;
    let rateText = "";
    let rateType = "";

    const base = Number(extraInput.value);

    // ==========================
    // Absorption Methods
    // ==========================
    switch(method.value){

      case "unit":
        rate = oh / units;
        overheadPU = rate;
        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Unit";
        break;

      case "labour":
        rate = oh / base;
        overheadPU = rate;
        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Labour Hour";
        break;

      case "machine":
        rate = oh / base;
        overheadPU = rate;
        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Machine Hour";
        break;

      case "dlc":
        rate = (oh / labour) * 100;
        overheadPU = (oh / labour) * labourPU;
        rateText = rate.toFixed(2) + "%";
        rateType = "Direct Labour %";
        break;

      case "prime":
        rate = (oh / primeCost) * 100;
        overheadPU = (oh / primeCost) * (materialPU + labourPU);
        rateText = rate.toFixed(2) + "%";
        rateType = "Prime Cost %";
        break;
    }

    const totalPU = materialPU + labourPU + overheadPU;

    // ==========================
    // KPI Cards
    // ==========================
    document.getElementById("matPU").innerText =
      "₹" + materialPU.toFixed(2);

    document.getElementById("labPU").innerText =
      "₹" + labourPU.toFixed(2);

    document.getElementById("ohPU").innerText =
      "₹" + overheadPU.toFixed(2);

    document.getElementById("totalPU").innerText =
      "₹" + totalPU.toFixed(2);

    // ==========================
    // OH Rate Card
    // ==========================
    document.getElementById("ratePU").innerText = rateText;
    document.getElementById("rateType").innerText = rateType;

    // ==========================
    // Donut Chart
    // ==========================
    const total = materialPU + labourPU + overheadPU;
    const C = 377;

    const matLen = (materialPU / total) * C;
    const labLen = (labourPU / total) * C;
    const ohLen = (overheadPU / total) * C;

    const matCircle = document.getElementById("matCircle");
    const labCircle = document.getElementById("labCircle");
    const ohCircle = document.getElementById("ohCircle");

    matCircle.setAttribute("stroke-dasharray", `${matLen} ${C}`);
    matCircle.setAttribute("stroke-dashoffset", "0");

    labCircle.setAttribute("stroke-dasharray", `${labLen} ${C}`);
    labCircle.setAttribute("stroke-dashoffset", `-${matLen}`);

    ohCircle.setAttribute("stroke-dasharray", `${ohLen} ${C}`);
    ohCircle.setAttribute("stroke-dashoffset", `-${matLen + labLen}`);

    document.getElementById("centerCost").innerText =
      "₹" + totalPU.toFixed(0);

    // ==========================
    // Percentage Legend
    // ==========================
    document.getElementById("matPct").innerText =
      Math.round((materialPU / total) * 100) + "%";

    document.getElementById("labPct").innerText =
      Math.round((labourPU / total) * 100) + "%";

    document.getElementById("ohPct").innerText =
      Math.round((overheadPU / total) * 100) + "%";

  });

});
