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
    extraInput.placeholder = "";

    switch(method.value){

      case "unit":
        extraLabel.innerText = "Units Produced";
        extraInput.value = document.getElementById("units").value;
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
        extraInput.value = document.getElementById("labour").value;
        break;

      case "prime":
        extraLabel.innerText = "Prime Cost (Auto)";
        extraInput.value = "";
        extraInput.disabled = true;
        extraInput.placeholder = "Calculated Automatically";
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

    const base = Number(extraInput.value);

    let overheadPU = 0;
    let rate = 0;
    let rateText = "";
    let rateType = "";

    // ==========================
    // ABSORPTION METHODS
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
        const labourHourPerUnit = base / units;
        overheadPU = rate * labourHourPerUnit;

        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Labour Hour";
        break;

      case "machine":

        rate = oh / base;
        const machineHourPerUnit = base / units;
        overheadPU = rate * machineHourPerUnit;

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
    // RESULT CARDS
    // ==========================
    document.getElementById("matPU").innerText = "₹" + materialPU.toFixed(2);
    document.getElementById("labPU").innerText = "₹" + labourPU.toFixed(2);
    document.getElementById("ohPU").innerText = "₹" + overheadPU.toFixed(2);
    document.getElementById("totalPU").innerText = "₹" + totalPU.toFixed(2);

    document.getElementById("ratePU").innerText = rateText;
    document.getElementById("rateType").innerText = rateType;

    // ==========================
    // DONUT CHART
    // ==========================
    const total = materialPU + labourPU + overheadPU;
    const C = 377;

    const matLen = (materialPU/total)*C;
    const labLen = (labourPU/total)*C;
    const ohLen = (overheadPU/total)*C;

    document.getElementById("matCircle").setAttribute("stroke-dasharray", `${matLen} ${C}`);
    document.getElementById("matCircle").setAttribute("stroke-dashoffset", "0");

    document.getElementById("labCircle").setAttribute("stroke-dasharray", `${labLen} ${C}`);
    document.getElementById("labCircle").setAttribute("stroke-dashoffset", `-${matLen}`);

    document.getElementById("ohCircle").setAttribute("stroke-dasharray", `${ohLen} ${C}`);
    document.getElementById("ohCircle").setAttribute("stroke-dashoffset", `-${matLen + labLen}`);

    document.getElementById("centerCost").textContent =
      "₹" + totalPU.toFixed(2);

    // ==========================
    // LEGEND %
    // ==========================
    document.getElementById("matPct").innerText =
      Math.round((materialPU/total)*100) + "%";

    document.getElementById("labPct").innerText =
      Math.round((labourPU/total)*100) + "%";

    document.getElementById("ohPct").innerText =
      Math.round((overheadPU/total)*100) + "%";

    // ==========================
    // METHOD COMPARISON
    // (ABSORPTION RATES)
    // ==========================

    const unitRate = oh / units;

    const labourHours = (method.value === "labour") ? base : 6000;
    const labourRate = oh / labourHours;

    const machineHours = (method.value === "machine") ? base : 3000;
    const machineRate = oh / machineHours;

    const dlcRate = (oh / labour) * 100;
    const primeRate = (oh / primeCost) * 100;

    const maxRate = Math.max(
      unitRate,
      labourRate,
      machineRate,
      dlcRate,
      primeRate
    );

    function drawBar(barId, textId, value, type){

      const width = (value / maxRate) * 100;

      document.getElementById(barId).style.width = width + "%";

      if(type === "percent"){
        document.getElementById(textId).innerText = value.toFixed(2) + "%";
      }else{
        document.getElementById(textId).innerText = "₹" + value.toFixed(2);
      }
    }

    drawBar("barUnit", "txtUnit", unitRate, "rupee");
    drawBar("barLabour", "txtLabour", labourRate, "rupee");
    drawBar("barMachine", "txtMachine", machineRate, "rupee");
    drawBar("barDLC", "txtDLC", dlcRate, "percent");
    drawBar("barPrime", "txtPrime", primeRate, "percent");
    // ==========================
// DOWNLOAD PDF
// ==========================

document.getElementById("pdfBtn").addEventListener("click", () => {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Heading
  doc.setFontSize(18);
  doc.text("OH-MASTER STUDIO", 20, 20);

  doc.setFontSize(11);
  doc.text("Overhead Absorption Cost Sheet", 20, 28);

  // Line
  doc.line(20,32,190,32);

  // Factory details
  doc.setFontSize(12);
  doc.text("Department : " + document.querySelector(".dept.active")?.innerText || "Not Selected",20,42);

  doc.text("Method : " + method.options[method.selectedIndex].text,20,50);

  doc.text("Date : " + new Date().toLocaleDateString(),20,58);

  // Cost sheet
  doc.line(20,64,190,64);

  doc.text("Material / Unit",20,76);
  doc.text(document.getElementById("matPU").innerText,150,76);

  doc.text("Labour / Unit",20,86);
  doc.text(document.getElementById("labPU").innerText,150,86);

  doc.text("Overhead / Unit",20,96);
  doc.text(document.getElementById("ohPU").innerText,150,96);

  doc.text("OH Rate",20,106);
  doc.text(document.getElementById("ratePU").innerText,150,106);

  doc.line(20,114,190,114);

  doc.setFontSize(14);
  doc.text("TOTAL COST / UNIT",20,126);
  doc.text(document.getElementById("totalPU").innerText,150,126);

  doc.line(20,134,190,134);

  doc.setFontSize(10);
  doc.text("Generated by OH-Master Studio",20,145);

  doc.save("OH-Cost-Sheet.pdf");

});

  });

});
