import sqlite3
import os
import json

db_path = os.path.join('data', 'sih_cybercrime.db')
if not os.path.exists(db_path):
    from backend.synthetic_data import seed_cybercrime_data
    seed_cybercrime_data()

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

out = []
out.append('-- UPIShield Seed File for PostgreSQL')
out.append('TRUNCATE TABLE public.alerts, public.historical_cashouts, public.transactions, public.complaints, public.cases, public.locations RESTART IDENTITY CASCADE;\n')

# Locations
for r in conn.execute('SELECT * FROM locations'):
    name = r['name'].replace("'", "''")
    bank = r['bank'].replace("'", "''")
    addr = r['address'].replace("'", "''")
    city = r['city'].replace("'", "''")
    out.append(f"INSERT INTO public.locations (id, name, type, bank, address, city, latitude, longitude, cctv_available, historical_fraud_count) VALUES ('{r['id']}', '{name}', '{r['type']}', '{bank}', '{addr}', '{city}', {r['latitude']}, {r['longitude']}, {r['cctv_available']}, {r['historical_fraud_count']});")

out.append('')

# Cases
for r in conn.execute('SELECT * FROM cases'):
    title = r['title'].replace("'", "''")
    desc = r['description'].replace("'", "''")
    cat = r['category'].replace("'", "''")
    m_acc = r['primary_mule_account'].replace("'", "''") if r['primary_mule_account'] else ''
    m_upi = r['primary_mule_upi'].replace("'", "''") if r['primary_mule_upi'] else ''
    out.append(f"INSERT INTO public.cases (id, title, description, category, total_amount_lost, created_at, status, primary_mule_account, primary_mule_upi) VALUES ('{r['id']}', '{title}', '{desc}', '{cat}', {r['total_amount_lost']}, '{r['created_at']}', '{r['status']}', '{m_acc}', '{m_upi}');")

out.append('')

# Complaints
for r in conn.execute('SELECT * FROM complaints'):
    v_name = r['victim_name'].replace("'", "''")
    v_phone = r['victim_phone'].replace("'", "''")
    v_upi = r['victim_upi'].replace("'", "''")
    v_acc = r['victim_account'].replace("'", "''")
    v_bank = r['victim_bank'].replace("'", "''")
    f_cat = r['fraud_category'].replace("'", "''")
    city = r['city'].replace("'", "''")
    out.append(f"INSERT INTO public.complaints (id, case_id, victim_name, victim_phone, victim_upi, victim_account, victim_bank, fraud_category, reported_amount, incident_time, reported_time, status, city) VALUES ('{r['id']}', '{r['case_id']}', '{v_name}', '{v_phone}', '{v_upi}', '{v_acc}', '{v_bank}', '{f_cat}', {r['reported_amount']}, '{r['incident_time']}', '{r['reported_time']}', '{r['status']}', '{city}');")

out.append('')

# Transactions
for r in conn.execute('SELECT * FROM transactions'):
    dev = r['device_id'].replace("'", "''") if r['device_id'] else ''
    ip = r['ip_address'].replace("'", "''") if r['ip_address'] else ''
    loc = r['location'].replace("'", "''") if r['location'] else ''
    out.append(f"INSERT INTO public.transactions (id, case_id, sender_id, sender_type, receiver_id, receiver_type, amount, timestamp, device_id, ip_address, location, layer_index) VALUES ('{r['id']}', '{r['case_id']}', '{r['sender_id']}', '{r['sender_type']}', '{r['receiver_id']}', '{r['receiver_type']}', {r['amount']}, '{r['timestamp']}', '{dev}', '{ip}', '{loc}', {r['layer_index']});")

out.append('')

# Historical cashouts
for r in conn.execute('SELECT * FROM historical_cashouts'):
    m_acc = r['mule_account_id'].replace("'", "''")
    out.append(f"INSERT INTO public.historical_cashouts (id, location_id, amount, withdrawal_time, distance_from_last_hop_km, mule_account_id, successful, last_hop_lat, last_hop_lon) VALUES ('{r['id']}', '{r['location_id']}', {r['amount']}, '{r['withdrawal_time']}', {r['distance_from_last_hop_km']}, '{m_acc}', {r['successful']}, {r['last_hop_lat']}, {r['last_hop_lon']});")


out.append('')

# Alerts
for r in conn.execute('SELECT * FROM alerts'):
    title = r['case_title'].replace("'", "''")
    summary = r['summary'].replace("'", "''")
    agencies = r['target_agencies'].replace("'", "''")
    locs = r['predicted_locations'].replace("'", "''")
    out.append(f"INSERT INTO public.alerts (id, case_id, case_title, priority, target_agencies, predicted_locations, dispatched_at, status, action_code, summary) VALUES ('{r['id']}', '{r['case_id']}', '{title}', '{r['priority']}', '{agencies}'::jsonb, '{locs}'::jsonb, '{r['dispatched_at']}', '{r['status']}', '{r['action_code']}', '{summary}');")

os.makedirs('supabase', exist_ok=True)
with open(os.path.join('supabase', 'seed.sql'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print('[SUCCESS] Successfully generated supabase/seed.sql')
