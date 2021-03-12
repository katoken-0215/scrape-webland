const KEYS = [
  "Type",
  "Region",
  "MunicipalityCode",
  "Prefecture",
  "Municipality",
  "DistrictName",
  "TradePrice",
  "PricePerUnit",
  "FloorPlan",
  "Area",
  "UnitPrice",
  "LandShape",
  "Frontage",
  "TotalFloorArea",
  "BuildingYear",
  "Structure",
  "Use",
  "Purpose",
  "Direction",
  "Classification",
  "Breadth",
  "CityPlanning",
  "CoverageRatio",
  "FloorAreaRatio",
  "Period",
  "Renovation",
  "Remarks",
];

function updateState(text) {
  document.getElementById("state").textContent=text;
}

window.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    updateState("データ取得中");
    const responseJson = await query(form.fromYear.value, form.fromQuarter.value, form.toYear.value, form.toQuarter.value, form.area.value);
    updateState("データ取得完了。プレビュー作成中");
    const response = await responseJson.json();
    const data = response.data.map((d) => {
      for (const k of KEYS) {
        if (!d[k]) {
          d[k] = "";
        }
      }
      return d;
    });
    render(data.slice(10));
    updateState("プレビュー完了。ダウンロード準備中");
    download(data)
    updateState("ダウンロード準備完了");
    return false;
  });
});

async function query(fromYear, fromQuarter, toYear, toQuarter, area) {
    const url = `https://www.land.mlit.go.jp/webland/api/TradeListSearch?from=${fromYear}${fromQuarter}&to=${toYear}${toQuarter}&area=${area}`;

    return fetch(url)
}

function render(data) {
  const table = document.getElementById('table');
  const tr = document.createElement('tr');
  for (const k of KEYS) {
    const th = document.createElement('th');
    th.textContent = k;
    tr.appendChild(th);
  }
  table.appendChild(tr);

  for (const d of data) {
    const tr = document.createElement('tr')
    for (const k of KEYS) {
      const td = document.createElement('td')
      td.textContent = d[k];
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
}

function download(data) {
  const lines = data.map((d) => {
    return KEYS.map((k) => d[k]).join(',')
  }).join('\n') + '\n';

  const blob = new Blob([lines], {type: 'text/csv'});

  const element = document.createElement('a');
  element.style.display = 'none';
  element.href = window.URL.createObjectURL(blob);
  element.download = 'result.csv';
  document.body.appendChild(element);
  element.click()
  document.body.removeChild(element);
}
