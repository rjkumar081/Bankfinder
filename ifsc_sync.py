# ifsc_sync.py
# Example script to download IFSC data CSV and convert to JSON (run manually or via cron)
import csv, json, requests

csv_url = 'https://www.example.com/latest-ifsc.csv'  # Replace with real source
output_json = 'bankdata.json'

def csv_to_json(url, json_file):
    response = requests.get(url)
    decoded = response.content.decode('utf-8').splitlines()
    reader = csv.DictReader(decoded)
    data = [row for row in reader]

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(data)} records to {json_file}")

if __name__ == "__main__":
    csv_to_json(csv_url, output_json)
