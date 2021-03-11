#!/usr/bin/env python3

"""
不動産取引価格情報取得APIから値を取得してCSVとして出力する

不動産取引価格情報取得API 仕様
https://www.land.mlit.go.jp/webland/api.html
"""

# 標準ライブラリ縛り
from urllib.request import Request, urlopen
import json
import csv
from typing import Dict, List

API_URL = "https://www.land.mlit.go.jp/webland/api/TradeListSearch?"
KEYS = [
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
]

def fetch_json(url: str) -> str:
  """
  url を開いて内容を取得し、jsonとして解釈する
  """
  print(url)
  req = Request(url)
  with urlopen(req) as res:
    return json.load(res)

def fill_record(d: Dict) -> Dict:
  """
  データの欠損値を埋める
  """

  return {
    k: d.get(k, "") for k in KEYS
  }

def write_csv(filename: str, data: List[Dict]):
  """
  ファイルにCSVとして出力する
  """

  with open(filename, "w") as f:
    writer = csv.DictWriter(f, fieldnames=KEYS)

    writer.writeheader()
    writer.writerows(data)


def main(from_: str, to: str, area: str, filename: str) -> None:

  # URLにつけるクエリパラメータ
  query = f"from={from_}&to={to}&area={area}"

  response = fetch_json(API_URL + query) # ネットから取得してくる

  if response['status'] != "OK":
    print("ERROR")
    return

  data = [fill_record(d) for d in response['data']]

  write_csv(filename, data)

if __name__ == "__main__":
  import sys

  if len(sys.argv) < 5:
    print("""
python main.py from to area filename

  from: 年+四半期
  to: 年+四半期
  area: 都道府県コード
  filename: 出力先
""")
    sys.exit(-1)

  from_ = sys.argv[1]
  to = sys.argv[2]
  area = sys.argv[3]
  filename = sys.argv[4]
  main(from_, to, area, filename)
