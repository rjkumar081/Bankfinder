
let bankData = [];

async function getBankDetails() {
  const ifsc = document.getElementById('ifscInput').value.trim().toUpperCase();
  const resultBox = document.getElementById('ifscResult');
  resultBox.textContent = "Fetching...";
  try {
    const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
    if (!res.ok) throw new Error("API failed, falling back to offline data.");
    const data = await res.json();
    resultBox.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.warn("API failed, trying offline JSON...", err);
    const result = bankData.find(b => b.IFSC === ifsc);
    resultBox.textContent = result ? JSON.stringify(result, null, 2) : "No matching IFSC found offline.";
  }
}

fetch("assets/bankdata.json")
  .then(res => res.json())
  .then(data => {
    bankData = data;
    const banks = [...new Set(data.map(b => b.BANK))].sort();
    populateDropdown(document.getElementById('bankSelect'), banks);
  });

function populateDropdown(dropdown, options) {
  dropdown.innerHTML = '<option value="">Select</option>';
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = option.textContent = opt;
    dropdown.appendChild(option);
  });
}

document.getElementById('bankSelect').addEventListener('change', function () {
  const states = [...new Set(bankData.filter(b => b.BANK === this.value).map(b => b.STATE))].sort();
  populateDropdown(document.getElementById('stateSelect'), states);
  document.getElementById('citySelect').innerHTML = '';
  document.getElementById('branchSelect').innerHTML = '';
});

document.getElementById('stateSelect').addEventListener('change', function () {
  const bank = document.getElementById('bankSelect').value;
  const cities = [...new Set(bankData.filter(b => b.BANK === bank && b.STATE === this.value).map(b => b.CITY))].sort();
  populateDropdown(document.getElementById('citySelect'), cities);
  document.getElementById('branchSelect').innerHTML = '';
});

document.getElementById('citySelect').addEventListener('change', function () {
  const bank = document.getElementById('bankSelect').value;
  const state = document.getElementById('stateSelect').value;
  const branches = [...new Set(bankData.filter(b => b.BANK === bank && b.STATE === state && b.CITY === this.value).map(b => b.BRANCH))].sort();
  populateDropdown(document.getElementById('branchSelect'), branches);
});

function findIFSCCode() {
  const bank = document.getElementById('bankSelect').value;
  const state = document.getElementById('stateSelect').value;
  const city = document.getElementById('citySelect').value;
  const branch = document.getElementById('branchSelect').value;
  const resultBox = document.getElementById('detailsResult');
  const result = bankData.find(b => b.BANK === bank && b.STATE === state && b.CITY === city && b.BRANCH === branch);
  resultBox.textContent = result ? JSON.stringify(result, null, 2) : "No matching IFSC found.";
}
