
document.addEventListener("DOMContentLoaded", function () {

 // ==========================
// INDUSTRY SELECTION
// ==========================
 const method = document.getElementById("method");
  const extraLabel = document.getElementById("extraLabel");
  const extraInput = document.getElementById("extraInput");

const departments = document.querySelectorAll(".dept");

departments.forEach(btn => {
  btn.addEventListener("click", () => {

    // Active button
    departments.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const industry = btn.innerText;

    // 👕 Garment → Labour Hour Method
if (industry.includes("Garment")) {
  method.value = "labour";
  extraLabel.innerText = "Total Labour Hours";
  extraInput.disabled = false;
  extraInput.value = 6000;
}

    // 🧱 Brick → Unit Method
    else if (industry.includes("Brick")) {
      method.value = "unit";
      extraLabel.innerText = "Units Produced";
      extraInput.disabled = false;
      extraInput.value = document.getElementById("units").value;
    }

    // ⚙️ CNC Automobile → Machine Hour
    else if (industry.includes("CNC")) {
      method.value = "machine";
      extraLabel.innerText = "Total Machine Hours";
      extraInput.disabled = false;
      extraInput.value = 3000;
    }

   // 🏗️ Construction → Direct Labour Cost %
else if (industry.includes("Construction")) {
  method.value = "dlc";
  extraLabel.innerText = "Direct Labour Cost (₹)";
  extraInput.disabled = false;
  extraInput.value = document.getElementById("labour").value;
}

    // 🏭 Steel Fabrication → Prime Cost %
    else if (industry.includes("Steel")) {
      method.value = "prime";
      extraLabel.innerText = "Prime Cost (Auto)";
      extraInput.disabled = true;
      extraInput.value = "";
    }

  });
});

  // ==========================
  // ABSORPTION METHOD
  // ==========================
  
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
  // CALCULATE COST SHEET
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

    let rate = 0;
    let overheadPU = 0;
    let rateText = "";
    let rateType = "";

    switch(method.value){

      case "unit":
        rate = oh / units;
        overheadPU = rate;
        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Unit";
        break;

      case "labour":
        rate = oh / base;
        overheadPU = rate * (base / units);
        rateText = "₹" + rate.toFixed(2);
        rateType = "Per Labour Hour";
        break;

      case "machine":
        rate = oh / base;
        overheadPU = rate * (base / units);
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
// Save per-unit values for Production Calculator
window.materialPU = materialPU;
window.labourPU = labourPU;
window.overheadPU = overheadPU;
window.totalPU = totalPU;
    // Result Cards
    document.getElementById("matPU").innerText = "₹" + materialPU.toFixed(2);
    document.getElementById("labPU").innerText = "₹" + labourPU.toFixed(2);
    document.getElementById("ohPU").innerText = "₹" + overheadPU.toFixed(2);
    document.getElementById("totalPU").innerText = "₹" + totalPU.toFixed(2);

    document.getElementById("ratePU").innerText = rateText;
    document.getElementById("rateType").innerText = rateType;

    // Donut Chart
    const total = materialPU + labourPU + overheadPU;
    const C = 377;

    const matLen = (materialPU / total) * C;
    const labLen = (labourPU / total) * C;
    const ohLen = (overheadPU / total) * C;

    document.getElementById("matCircle").setAttribute("stroke-dasharray",`${matLen} ${C}`);
    document.getElementById("labCircle").setAttribute("stroke-dasharray",`${labLen} ${C}`);
    document.getElementById("labCircle").setAttribute("stroke-dashoffset",`-${matLen}`);
    document.getElementById("ohCircle").setAttribute("stroke-dasharray",`${ohLen} ${C}`);
    document.getElementById("ohCircle").setAttribute("stroke-dashoffset",`-${matLen+labLen}`);

    document.getElementById("centerCost").textContent = "₹" + totalPU.toFixed(2);

    // Legend
    document.getElementById("matPct").innerText = Math.round((materialPU/total)*100)+"%";
    document.getElementById("labPct").innerText = Math.round((labourPU/total)*100)+"%";
    document.getElementById("ohPct").innerText = Math.round((overheadPU/total)*100)+"%";

    // Method Comparison
    const unitRate = oh/units;
    const labourRate = oh/6000;
    const machineRate = oh/3000;
    const dlcRate = (oh/labour)*100;
    const primeRate = (oh/primeCost)*100;

    const maxRate = Math.max(unitRate, labourRate, machineRate, dlcRate, primeRate);

    function drawBar(barId,textId,value,type){

      document.getElementById(barId).style.width = ((value/maxRate)*100)+"%";

      if(type==="percent"){
        document.getElementById(textId).innerText = value.toFixed(2)+"%";
      }else{
        document.getElementById(textId).innerText = "₹"+value.toFixed(2);
      }

    }

    drawBar("barUnit","txtUnit",unitRate,"rupee");
    drawBar("barLabour","txtLabour",labourRate,"rupee");
    drawBar("barMachine","txtMachine",machineRate,"rupee");
    drawBar("barDLC","txtDLC",dlcRate,"percent");
    drawBar("barPrime","txtPrime",primeRate,"percent");
   // REPORT HISTORY
const industry =
document.querySelector(".dept.active")?.innerText || "Not Selected";

const history = document.querySelector("#historyTable tbody");

const row = history.insertRow();

row.insertCell(0).innerText = industry;
row.insertCell(1).innerText =
method.options[method.selectedIndex].text;
row.insertCell(2).innerText =
"₹" + totalPU.toFixed(2);

  });

 // ==========================
// PDF DOWNLOAD
// ==========================
document.getElementById("pdfBtn").addEventListener("click", () => {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const industry = document.querySelector(".dept.active")?.innerText || "Not Selected";
  const methodName = method.options[method.selectedIndex].text;

  let y = 20;

  // HEADER
  doc.setFontSize(18);
  doc.text("EduCost Simulator", 20, y);

  y += 8;
  doc.setFontSize(11);
  doc.text("Interactive Overhead Absorption Simulator",20,y);

  y += 8;
  doc.line(20,y,190,y);

  // INDUSTRY
  y += 10;
  doc.setFontSize(12);
  doc.text("Industry : " + industry,20,y);

  y += 8;
  doc.text("Method : " + methodName,20,y);

  y += 8;
  doc.text("Date : " + new Date().toLocaleString(),20,y);

  // FACTORY SETUP
  y += 12;
  doc.setFontSize(14);
  doc.text("Factory Setup",20,y);

  y += 8;
  doc.setFontSize(11);
  doc.text("Factory Overheads : Rs. " + document.getElementById("oh").value,20,y);

  y += 7;
  doc.text("Direct Material : Rs. " + document.getElementById("material").value,20,y);

  y += 7;
  doc.text("Direct Labour : Rs. " + document.getElementById("labour").value,20,y);

  y += 7;
  doc.text("Units Produced : " + document.getElementById("units").value,20,y);

  y += 7;
  doc.text(extraLabel.innerText + " : " + extraInput.value,20,y);

  // COST SHEET
  y += 12;
  doc.setFontSize(14);
  doc.text("Cost Sheet (Per Unit)",20,y);

  y += 8;
  doc.setFontSize(11);
  doc.text("Material / Unit : " + document.getElementById("matPU").innerText,20,y);

  y += 7;
  doc.text("Labour / Unit : " + document.getElementById("labPU").innerText,20,y);

  y += 7;
  doc.text("Overhead / Unit : " + document.getElementById("ohPU").innerText,20,y);

  y += 7;
  doc.text("OH Rate : " + document.getElementById("ratePU").innerText + " (" + document.getElementById("rateType").innerText + ")",20,y);

  y += 7;
  doc.setFontSize(12);
  doc.text("Total Cost / Unit : " + document.getElementById("totalPU").innerText,20,y);

  // OVERHEAD ABSORPTION
  y += 12;
  doc.setFontSize(14);
  doc.text("Overhead Absorption Calculator",20,y);

  y += 8;
  doc.setFontSize(11);
  doc.text(document.getElementById("absorbLabel").innerText + " : " + (document.getElementById("absorbInput").value || "-"),20,y);

  y += 7;
  doc.text("OH Rate : " + document.getElementById("displayRate").innerText,20,y);

  y += 7;
  doc.setFontSize(12);
  doc.text("Overhead Absorbed : " + document.getElementById("absorbedOH").innerText,20,y);

  // METHOD COMPARISON
  y += 12;
  doc.setFontSize(14);
  doc.text("Method Comparison",20,y);

  y += 8;
  doc.setFontSize(11);
  doc.text("Unit Method : " + document.getElementById("txtUnit").innerText,20,y);

  y += 7;
  doc.text("Labour Hour : " + document.getElementById("txtLabour").innerText,20,y);

  y += 7;
  doc.text("Machine Hour : " + document.getElementById("txtMachine").innerText,20,y);

  y += 7;
  doc.text("Direct Labour % : " + document.getElementById("txtDLC").innerText,20,y);

  y += 7;
  doc.text("Prime Cost % : " + document.getElementById("txtPrime").innerText,20,y);

  // FOOTER
  y += 15;
  doc.setFontSize(10);
  doc.text("Generated by EduCost Simulator",20,y);

  doc.save("EduCost_Simulator_Report.pdf");

});
  // ==========================
  // STUDENT PRACTICE MODE
  // ==========================
  const methods = ["Unit Method","Labour Hour Method","Machine Hour Method"];

  document.getElementById("generateBtn").addEventListener("click", () => {

    const units = [4000,5000,6000][Math.floor(Math.random()*3)];
    const material = [480000,640000,800000][Math.floor(Math.random()*3)];
    const labour = [320000,450000,600000][Math.floor(Math.random()*3)];
    const overhead = [96000,108000,120000][Math.floor(Math.random()*3)];
    const labourHours = [5000,6000,7200][Math.floor(Math.random()*3)];
    const machineHours = [2500,3000,3600][Math.floor(Math.random()*3)];

    const chosen = methods[Math.floor(Math.random()*3)];

    document.getElementById("qOH").innerText = overhead;
    document.getElementById("qMat").innerText = material;
    document.getElementById("qLab").innerText = labour;
    document.getElementById("qUnits").innerText = units;
    document.getElementById("qLH").innerText = (chosen==="Machine Hour Method") ? machineHours : labourHours;
    document.getElementById("qMethod").innerText = chosen;

  });

  document.getElementById("loadBtn").addEventListener("click", () => {

    document.getElementById("oh").value = document.getElementById("qOH").innerText;
    document.getElementById("material").value = document.getElementById("qMat").innerText;
    document.getElementById("labour").value = document.getElementById("qLab").innerText;
    document.getElementById("units").value = document.getElementById("qUnits").innerText;

    const selected = document.getElementById("qMethod").innerText;
    const hrs = document.getElementById("qLH").innerText;

    if(selected==="Unit Method"){
      method.value="unit";
      extraLabel.innerText="Units Produced";
      extraInput.value=document.getElementById("qUnits").innerText;
    }

    if(selected==="Labour Hour Method"){
      method.value="labour";
      extraLabel.innerText="Total Labour Hours";
      extraInput.value=hrs;
    }

    if(selected==="Machine Hour Method"){
      method.value="machine";
      extraLabel.innerText="Total Machine Hours";
      extraInput.value=hrs;
    }

  });

 // ==========================
// OVERHEAD ABSORPTION CALCULATOR
// ==========================

// Change input label according to selected method
method.addEventListener("change", () => {

  switch(method.value){

    case "unit":
      document.getElementById("absorbLabel").innerText = "Enter Units";
      break;

    case "labour":
      document.getElementById("absorbLabel").innerText = "Enter Labour Hours";
      break;

    case "machine":
      document.getElementById("absorbLabel").innerText = "Enter Machine Hours";
      break;

    case "dlc":
      document.getElementById("absorbLabel").innerText = "Enter Labour Cost (₹)";
      break;

    case "prime":
      document.getElementById("absorbLabel").innerText = "Enter Prime Cost (₹)";
      break;
  }

});

// Calculate Overhead Absorbed
document.getElementById("absorbBtn").addEventListener("click", () => {

  const input = Number(document.getElementById("absorbInput").value);
  const oh = Number(document.getElementById("oh").value);
  const labour = Number(document.getElementById("labour").value);
  const material = Number(document.getElementById("material").value);
  const units = Number(document.getElementById("units").value);
  const base = Number(extraInput.value);

  if(input <= 0){
    alert("Please enter a valid value.");
    return;
  }

  let rate = 0;
  let absorbed = 0;

  switch(method.value){

    case "unit":
      rate = oh / units;
      absorbed = rate * input;
      document.getElementById("displayRate").innerText = "₹" + rate.toFixed(2) + "/Unit";
      break;

    case "labour":
      rate = oh / base;
      absorbed = rate * input;
      document.getElementById("displayRate").innerText = "₹" + rate.toFixed(2) + "/Hr";
      break;

    case "machine":
      rate = oh / base;
      absorbed = rate * input;
      document.getElementById("displayRate").innerText = "₹" + rate.toFixed(2) + "/Hr";
      break;

    case "dlc":
      rate = (oh / labour) * 100;
      absorbed = (rate / 100) * input;
      document.getElementById("displayRate").innerText = rate.toFixed(2) + "%";
      break;

    case "prime":
      rate = (oh / (material + labour)) * 100;
      absorbed = (rate / 100) * input;
      document.getElementById("displayRate").innerText = rate.toFixed(2) + "%";
      break;
  }

  document.getElementById("absorbedOH").innerText =
    "₹" + absorbed.toFixed(2);

});
  // ==========================
  // RESET BUTTON
  // ==========================
  document.getElementById("resetBtn").addEventListener("click", () => {

    // Clear Factory Setup
    document.getElementById("oh").value = "";
    document.getElementById("material").value = "";
    document.getElementById("labour").value = "";
    document.getElementById("units").value = "";

    method.value = "unit";
    extraLabel.innerText = "Units Produced";
    extraInput.value = "";
    extraInput.disabled = false;

    // Clear Result Cards
    document.getElementById("matPU").innerText = "₹0.00";
    document.getElementById("labPU").innerText = "₹0.00";
    document.getElementById("ohPU").innerText = "₹0.00";
    document.getElementById("totalPU").innerText = "₹0.00";
    document.getElementById("ratePU").innerText = "₹0.00";
    document.getElementById("rateType").innerText = "Per Unit";

    // Reset Donut
    document.getElementById("matCircle").setAttribute("stroke-dasharray","0 377");
    document.getElementById("labCircle").setAttribute("stroke-dasharray","0 377");
    document.getElementById("ohCircle").setAttribute("stroke-dasharray","0 377");
    document.getElementById("centerCost").textContent = "₹0";

    // Reset Percentages
    document.getElementById("matPct").innerText = "0%";
    document.getElementById("labPct").innerText = "0%";
    document.getElementById("ohPct").innerText = "0%";

    // Reset Method Comparison
    ["barUnit","barLabour","barMachine","barDLC","barPrime"].forEach(id=>{
      document.getElementById(id).style.width = "0%";
    });

    document.getElementById("txtUnit").innerText = "₹0";
    document.getElementById("txtLabour").innerText = "₹0";
    document.getElementById("txtMachine").innerText = "₹0";
    document.getElementById("txtDLC").innerText = "0%";
    document.getElementById("txtPrime").innerText = "0%";

    // Clear Student Practice
    document.getElementById("qOH").innerText = "-";
    document.getElementById("qMat").innerText = "-";
    document.getElementById("qLab").innerText = "-";
    document.getElementById("qUnits").innerText = "-";
    document.getElementById("qLH").innerText = "-";
    document.getElementById("qMethod").innerText = "-";

  });

});
