document.addEventListener("DOMContentLoaded", function () {

  // ==========================
  // DEPARTMENT SELECTION
  // ==========================
  const departments = document.querySelectorAll(".dept");

  departments.forEach(btn => {
    btn.addEventListener("click", () => {
      departments.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ==========================
  // ABSORPTION METHOD
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

    let overheadPU = 0;
    let rate = 0;
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

    // KPI
    document.getElementById("matPU").innerText = "₹" + materialPU.toFixed(2);
    document.getElementById("labPU").innerText = "₹" + labourPU.toFixed(2);
    document.getElementById("ohPU").innerText = "₹" + overheadPU.toFixed(2);
    document.getElementById("totalPU").innerText = "₹" + totalPU.toFixed(2);

    document.getElementById("ratePU").innerText = rateText;
    document.getElementById("rateType").innerText = rateType;

    // DONUT
    const total = materialPU + labourPU + overheadPU;
    const C = 377;

    const matLen = (materialPU/total)*C;
    const labLen = (labourPU/total)*C;
    const ohLen = (overheadPU/total)*C;

    document.getElementById("matCircle").setAttribute("stroke-dasharray",`${matLen} ${C}`);
    document.getElementById("matCircle").setAttribute("stroke-dashoffset","0");

    document.getElementById("labCircle").setAttribute("stroke-dasharray",`${labLen} ${C}`);
    document.getElementById("labCircle").setAttribute("stroke-dashoffset",`-${matLen}`);

    document.getElementById("ohCircle").setAttribute("stroke-dasharray",`${ohLen} ${C}`);
    document.getElementById("ohCircle").setAttribute("stroke-dashoffset",`-${matLen+labLen}`);

    document.getElementById("centerCost").textContent = "₹" + totalPU.toFixed(2);

    document.getElementById("matPct").innerText = Math.round((materialPU/total)*100)+"%";
    document.getElementById("labPct").innerText = Math.round((labourPU/total)*100)+"%";
    document.getElementById("ohPct").innerText = Math.round((overheadPU/total)*100)+"%";

    // METHOD COMPARISON
    const unitRate = oh/units;
    const labourRate = oh/6000;
    const machineRate = oh/3000;
    const dlcRate = (oh/labour)*100;
    const primeRate = (oh/primeCost)*100;

    const maxRate = Math.max(unitRate, labourRate, machineRate, dlcRate, primeRate);

    function drawBar(barId,textId,value,type){

      document.getElementById(barId).style.width=((value/maxRate)*100)+"%";

      if(type==="percent"){
        document.getElementById(textId).innerText=value.toFixed(2)+"%";
      }else{
        document.getElementById(textId).innerText="₹"+value.toFixed(2);
      }

    }

    drawBar("barUnit","txtUnit",unitRate,"rupee");
    drawBar("barLabour","txtLabour",labourRate,"rupee");
    drawBar("barMachine","txtMachine",machineRate,"rupee");
    drawBar("barDLC","txtDLC",dlcRate,"percent");
    drawBar("barPrime","txtPrime",primeRate,"percent");

  });

  // ==========================
  // PDF DOWNLOAD
  // ==========================
  document.getElementById("pdfBtn").addEventListener("click",()=>{

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const dept = document.querySelector(".dept.active");

    doc.setFontSize(18);
    doc.text("OH-MASTER STUDIO",20,20);

    doc.setFontSize(11);
    doc.text("Overhead Absorption Cost Sheet",20,28);

    doc.line(20,32,190,32);

    doc.text("Department : "+(dept?dept.innerText:"Not Selected"),20,42);
    doc.text("Method : "+method.options[method.selectedIndex].text,20,50);
    doc.text("Date : "+new Date().toLocaleDateString(),20,58);

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

    doc.save("OH-Cost-Sheet.pdf");

  });

  // ==========================
  // STUDENT PRACTICE MODE
  // ==========================
  const practiceMethods = [
    "Unit Method",
    "Labour Hour Method",
    "Machine Hour Method"
  ];

  document.getElementById("generateBtn").addEventListener("click",()=>{

    const oh = [96000,108000,120000][Math.floor(Math.random()*3)];
    const mat = [480000,640000,800000][Math.floor(Math.random()*3)];
    const lab = [320000,450000,600000][Math.floor(Math.random()*3)];
    const unit = [4000,5000,6000][Math.floor(Math.random()*3)];
    const lh = [5000,6000,7200][Math.floor(Math.random()*3)];
    const mh = [2500,3000,3600][Math.floor(Math.random()*3)];

    const chosen = practiceMethods[Math.floor(Math.random()*3)];

    document.getElementById("qOH").innerText = oh;
    document.getElementById("qMat").innerText = mat;
    document.getElementById("qLab").innerText = lab;
    document.getElementById("qUnits").innerText = unit;

    if(chosen==="Machine Hour Method"){
      document.getElementById("qLH").innerText = mh;
    }else{
      document.getElementById("qLH").innerText = lh;
    }

    document.getElementById("qMethod").innerText = chosen;

  });

  document.getElementById("loadBtn").addEventListener("click",()=>{

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
      extraInput.disabled=false;
    }

    if(selected==="Labour Hour Method"){
      method.value="labour";
      extraLabel.innerText="Total Labour Hours";
      extraInput.value=hrs;
      extraInput.disabled=false;
    }

    if(selected==="Machine Hour Method"){
      method.value="machine";
      extraLabel.innerText="Total Machine Hours";
      extraInput.value=hrs;
      extraInput.disabled=false;
    }

  });
// ==========================
// RESET SIMULATION
// ==========================
document.getElementById("resetBtn").addEventListener("click", () => {

  // Factory values
  document.getElementById("oh").value = 120000;
  document.getElementById("material").value = 800000;
  document.getElementById("labour").value = 600000;
  document.getElementById("units").value = 6000;

  // Method
  method.value = "unit";
  extraLabel.innerText = "Units Produced";
  extraInput.disabled = false;
  extraInput.value = 6000;

  // Result cards
  document.getElementById("matPU").innerText = "₹0.00";
  document.getElementById("labPU").innerText = "₹0.00";
  document.getElementById("ohPU").innerText = "₹0.00";
  document.getElementById("totalPU").innerText = "₹0.00";
  document.getElementById("ratePU").innerText = "₹0.00";
  document.getElementById("rateType").innerText = "Per Unit";

  // Donut chart
  document.getElementById("matCircle").setAttribute("stroke-dasharray","0 377");
  document.getElementById("labCircle").setAttribute("stroke-dasharray","0 377");
  document.getElementById("ohCircle").setAttribute("stroke-dasharray","0 377");
  document.getElementById("centerCost").textContent = "₹0";

  // Percentages
  document.getElementById("matPct").innerText = "0%";
  document.getElementById("labPct").innerText = "0%";
  document.getElementById("ohPct").innerText = "0%";

  // Method comparison
  ["barUnit","barLabour","barMachine","barDLC","barPrime"].forEach(id=>{
    document.getElementById(id).style.width = "0%";
  });

  document.getElementById("txtUnit").innerText = "₹0";
  document.getElementById("txtLabour").innerText = "₹0";
  document.getElementById("txtMachine").innerText = "₹0";
  document.getElementById("txtDLC").innerText = "0%";
  document.getElementById("txtPrime").innerText = "0%";

  // Student practice
  document.getElementById("qOH").innerText = 120000;
  document.getElementById("qMat").innerText = 800000;
  document.getElementById("qLab").innerText = 600000;
  document.getElementById("qUnits").innerText = 5000;
  document.getElementById("qLH").innerText = 6000;
  document.getElementById("qMethod").innerText = "Labour Hour Method";

});
});
