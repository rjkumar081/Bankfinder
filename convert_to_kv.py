import json

# Step 1: Load your list-based JSON
with open("bankdata.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Step 2: Convert list to dictionary using IFSC as key
kv_data = {item["IFSC"]: item for item in data if "IFSC" in item}

# Step 3: Save the result to a new file
with open("bankdata_kv.json", "w", encoding="utf-8") as f:
    json.dump(kv_data, f, ensure_ascii=False, indent=2)

print(f"✅ Converted {len(kv_data)} IFSC records to key-value format.")
