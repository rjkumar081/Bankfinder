
let data = [];

fetch('bankdata.json')
  .then(res => res.json())
  .then(json => {
    if (!Array.isArray(json)) {
      data = Object.values(json);
    } else {
      data = json;
    }

    const banks = [...new Set(data.map(d => d.BANK))].sort();
    populateSelect('bankSelect', banks);
  });

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">Select</option>' + options.map(o => `<option value="\${o}">\${o}</option>`).join('');
}

['bankSelect','stateSelect','districtSelect'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateNext);
});
document.getElementById('branchSelect').addEventListener('change', showResult);

function updateNext(e) {
  const bank = document.getElementById('bankSelect').value;
  const state = document.getElementById('stateSelect').value;
  const district = document.getElementById('districtSelect').value;

  const id = e.target.id;
  if (id === 'bankSelect') {
    const states = [...new Set(data.filter(x => x.BANK === bank).map(x => x.STATE))].sort();
    populateSelect('stateSelect', states);
    reset(['districtSelect','branchSelect']);
  } else if (id === 'stateSelect') {
    const districts = [...new Set(data.filter(x => x.BANK === bank && x.STATE === state).map(x => x.DISTRICT))].sort();
    populateSelect('districtSelect', districts);
    reset(['branchSelect']);
  } else if (id === 'districtSelect') {
    const branches = [...new Set(data.filter(x => x.BANK === bank && x.STATE === state && x.DISTRICT === district).map(x => x.BRANCH))].sort();
    populateSelect('branchSelect', branches);
  }
}

function showResult() {
  const bank = document.getElementById('bankSelect').value;
  const state = document.getElementById('stateSelect').value;
  const district = document.getElementById('districtSelect').value;
  const branch = document.getElementById('branchSelect').value;

  const result = data.find(x => x.BANK === bank && x.STATE === state && x.DISTRICT === district && x.BRANCH === branch);
  const box = document.getElementById('result');

  if (result) {
    box.innerHTML = `<strong>IFSC:</strong> \${result.IFSC}<br>
    <strong>Branch:</strong> \${result.BRANCH}<br>
    <strong>Address:</strong> \${result.ADDRESS}<br>
    <strong>Contact:</strong> \${result.CONTACT || 'N/A'}<br>
    <strong>MICR:</strong> \${result.MICR || 'N/A'}`;
    box.style.display = 'block';
  }
}

function reset(ids) {
  ids.forEach(i => document.getElementById(i).innerHTML = '<option value="">Select</option>');
  document.getElementById('result').style.display = 'none';
}
