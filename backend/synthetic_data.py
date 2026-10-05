"""
SIH26184 Synthetic Cybercrime Intelligence Data Generator.
Populates SQLite with realistic NCRP/1930 complaints, convergent mule syndicate cases,
multi-hop transaction trails, Delhi-NCR ATM/CSP locations, and historical cashouts.
"""

import random
import json
import math
from datetime import datetime, timedelta
from backend.database import get_db_connection, init_database


def _calc_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# 26 Canonical Delhi-NCR Physical Terminals & Hotspots
DELHI_NCR_LOCATIONS = [
    {
        "id": "LOC-DEL-01",
        "name": "State Bank of India — Connaught Place Inner Circle ATM",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "Block B, Radial 3, Connaught Place, New Delhi",
        "city": "New Delhi",
        "latitude": 28.6328,
        "longitude": 77.2197,
        "cctv_available": 1,
        "historical_fraud_count": 19,
    },
    {
        "id": "LOC-DEL-02",
        "name": "HDFC Bank — Karol Bagh Gurudwara Road ATM",
        "type": "ATM",
        "bank": "HDFC Bank",
        "address": "14/8, Gurudwara Road, Karol Bagh, Central Delhi",
        "city": "New Delhi",
        "latitude": 28.6517,
        "longitude": 77.1906,
        "cctv_available": 1,
        "historical_fraud_count": 24,
    },
    {
        "id": "LOC-DEL-03",
        "name": "Laxmi Nagar Vikas Marg CSP Customer Service Hub",
        "type": "CSP",
        "bank": "Bank of Baroda CSP",
        "address": "Main Vikas Marg, Near Metro Pillar 38, Laxmi Nagar",
        "city": "East Delhi",
        "latitude": 28.6304,
        "longitude": 77.2773,
        "cctv_available": 0,
        "historical_fraud_count": 31,
    },
    {
        "id": "LOC-DEL-04",
        "name": "Punjab National Bank — Chandni Chowk Town Hall ATM",
        "type": "ATM",
        "bank": "Punjab National Bank",
        "address": "Opp. Town Hall, Chandni Chowk, Old Delhi",
        "city": "Old Delhi",
        "latitude": 28.6562,
        "longitude": 77.2309,
        "cctv_available": 1,
        "historical_fraud_count": 27,
    },
    {
        "id": "LOC-DEL-05",
        "name": "Noida Sector 18 Commercial Market Axis Bank ATM",
        "type": "ATM",
        "bank": "Axis Bank",
        "address": "Atta Market, Sector 18, Noida",
        "city": "Noida",
        "latitude": 28.5708,
        "longitude": 77.3260,
        "cctv_available": 1,
        "historical_fraud_count": 22,
    },
    {
        "id": "LOC-DEL-06",
        "name": "Noida Sector 62 Electronic City Banking Kiosk CSP",
        "type": "CSP",
        "bank": "Canara Bank CSP",
        "address": "C-Block Commercial Complex, Sector 62, Noida",
        "city": "Noida",
        "latitude": 28.6280,
        "longitude": 77.3649,
        "cctv_available": 0,
        "historical_fraud_count": 18,
    },
    {
        "id": "LOC-DEL-07",
        "name": "Gurugram Cyber City DLF Phase 2 ICICI ATM",
        "type": "ATM",
        "bank": "ICICI Bank",
        "address": "Tower B, Cyber Hub, DLF Cyber City, Gurugram",
        "city": "Gurugram",
        "latitude": 28.4952,
        "longitude": 77.0895,
        "cctv_available": 1,
        "historical_fraud_count": 14,
    },
    {
        "id": "LOC-DEL-08",
        "name": "Gurugram Sector 14 Old Judicial Complex PNB ATM",
        "type": "ATM",
        "bank": "Punjab National Bank",
        "address": "SCO 42, Sector 14 Market, Gurugram",
        "city": "Gurugram",
        "latitude": 28.4722,
        "longitude": 77.0435,
        "cctv_available": 1,
        "historical_fraud_count": 20,
    },
    {
        "id": "LOC-DEL-09",
        "name": "Faridabad NIT 1 Market State Bank of India ATM",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "1-B Chowk, New Industrial Township, Faridabad",
        "city": "Faridabad",
        "latitude": 28.3954,
        "longitude": 77.3082,
        "cctv_available": 1,
        "historical_fraud_count": 16,
    },
    {
        "id": "LOC-DEL-10",
        "name": "Ghaziabad RDC Raj Nagar Commercial Hub ATM",
        "type": "ATM",
        "bank": "Bank of India",
        "address": "Raj Nagar District Centre, RDC, Ghaziabad",
        "city": "Ghaziabad",
        "latitude": 28.6756,
        "longitude": 77.4426,
        "cctv_available": 1,
        "historical_fraud_count": 25,
    },
    {
        "id": "LOC-DEL-11",
        "name": "Rohini Sector 7 Deepali Chowk Indian Bank ATM",
        "type": "ATM",
        "bank": "Indian Bank",
        "address": "Pocket 12, Sector 7, Rohini, North-West Delhi",
        "city": "Delhi",
        "latitude": 28.7056,
        "longitude": 77.1194,
        "cctv_available": 1,
        "historical_fraud_count": 17,
    },
    {
        "id": "LOC-DEL-12",
        "name": "Saket Community Centre HDFC ATM & CSP Point",
        "type": "ATM",
        "bank": "HDFC Bank",
        "address": "PVR Anupam Complex, Saket, South Delhi",
        "city": "New Delhi",
        "latitude": 28.5245,
        "longitude": 77.2066,
        "cctv_available": 1,
        "historical_fraud_count": 15,
    },
    {
        "id": "LOC-DEL-13",
        "name": "Janakpuri District Centre SBI E-Corner",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "District Centre, Janakpuri, West Delhi",
        "city": "Delhi",
        "latitude": 28.6289,
        "longitude": 77.0788,
        "cctv_available": 1,
        "historical_fraud_count": 21,
    },
    {
        "id": "LOC-DEL-14",
        "name": "Mayur Vihar Phase 1 Pocket 1 PNB CSP Kiosk",
        "type": "CSP",
        "bank": "PNB Banking Kiosk",
        "address": "Acharya Niketan Market, Mayur Vihar Phase 1",
        "city": "East Delhi",
        "latitude": 28.6042,
        "longitude": 77.2952,
        "cctv_available": 0,
        "historical_fraud_count": 29,
    },
    {
        "id": "LOC-DEL-15",
        "name": "Dwarka Sector 12 City Centre Kotak Mahindra ATM",
        "type": "ATM",
        "bank": "Kotak Mahindra Bank",
        "address": "Plot 3, Sector 12 Commercial Mall, Dwarka",
        "city": "Delhi",
        "latitude": 28.5921,
        "longitude": 77.0398,
        "cctv_available": 1,
        "historical_fraud_count": 13,
    },
    {
        "id": "LOC-DEL-16",
        "name": "South Extension Part 2 Ring Road Axis ATM",
        "type": "ATM",
        "bank": "Axis Bank",
        "address": "E-Block, South Extension 2, New Delhi",
        "city": "New Delhi",
        "latitude": 28.5684,
        "longitude": 77.2215,
        "cctv_available": 1,
        "historical_fraud_count": 18,
    },
    {
        "id": "LOC-DEL-17",
        "name": "Pitampura Netaji Subhash Place BOB ATM",
        "type": "ATM",
        "bank": "Bank of Baroda",
        "address": "Pearls Best Heights 1, NSP Complex, Pitampura",
        "city": "Delhi",
        "latitude": 28.6948,
        "longitude": 77.1495,
        "cctv_available": 1,
        "historical_fraud_count": 23,
    },
    {
        "id": "LOC-DEL-18",
        "name": "Kashmere Gate ISBT Concourse PNB ATM",
        "type": "ATM",
        "bank": "Punjab National Bank",
        "address": "Inter-State Bus Terminal Arrival Hall, Kashmere Gate",
        "city": "Old Delhi",
        "latitude": 28.6675,
        "longitude": 77.2312,
        "cctv_available": 1,
        "historical_fraud_count": 34,
    },
    {
        "id": "LOC-DEL-19",
        "name": "Nizamuddin Railway Station Exit Gate SBI ATM",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "Main Passenger Exit, Hazrat Nizamuddin Terminus",
        "city": "New Delhi",
        "latitude": 28.5888,
        "longitude": 77.2536,
        "cctv_available": 1,
        "historical_fraud_count": 36,
    },
    {
        "id": "LOC-DEL-20",
        "name": "Anand Vihar ISBT & Railway Station Cash Kiosk",
        "type": "CSP",
        "bank": "Gramin Bank CSP",
        "address": "Chaudhary Charan Singh Kiosk Hub, Anand Vihar",
        "city": "East Delhi",
        "latitude": 28.6475,
        "longitude": 77.3155,
        "cctv_available": 0,
        "historical_fraud_count": 38,
    },
    {
        "id": "LOC-DEL-21",
        "name": "Nehru Place IT Market Paras Cinema ATM",
        "type": "ATM",
        "bank": "Canara Bank",
        "address": "Nehru Place Commercial Enclave, South Delhi",
        "city": "New Delhi",
        "latitude": 28.5492,
        "longitude": 77.2533,
        "cctv_available": 1,
        "historical_fraud_count": 19,
    },
    {
        "id": "LOC-DEL-22",
        "name": "Sarita Vihar Pocket A Union Bank ATM",
        "type": "ATM",
        "bank": "Union Bank of India",
        "address": "DDA Market, Pocket A, Sarita Vihar",
        "city": "New Delhi",
        "latitude": 28.5312,
        "longitude": 77.2915,
        "cctv_available": 1,
        "historical_fraud_count": 12,
    },
    {
        "id": "LOC-DEL-23",
        "name": "Badarpur Border Mathura Road CSP Outpost",
        "type": "CSP",
        "bank": "Fino Payments Bank CSP",
        "address": "National Highway 2, Badarpur Border, Delhi",
        "city": "Delhi-Faridabad Border",
        "latitude": 28.4984,
        "longitude": 77.3051,
        "cctv_available": 0,
        "historical_fraud_count": 42,
    },
    {
        "id": "LOC-DEL-24",
        "name": "Shahdara Railway Station Road SBI ATM",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "Circular Road, Near Metro Station, Shahdara",
        "city": "East Delhi",
        "latitude": 28.6738,
        "longitude": 77.2882,
        "cctv_available": 1,
        "historical_fraud_count": 28,
    },
    {
        "id": "LOC-DEL-25",
        "name": "Alipur GT Karnal Road Rural CSP Centre",
        "type": "CSP",
        "bank": "Airtel Payments Bank CSP",
        "address": "Main GT Road, Alipur Block, North Delhi",
        "city": "North Delhi",
        "latitude": 28.7995,
        "longitude": 77.1352,
        "cctv_available": 0,
        "historical_fraud_count": 26,
    },
    {
        "id": "LOC-DEL-26",
        "name": "Najafgarh Main Dhansa Stand PNB ATM",
        "type": "ATM",
        "bank": "Punjab National Bank",
        "address": "Dhansa Stand, Najafgarh, South-West Delhi",
        "city": "Delhi",
        "latitude": 28.6088,
        "longitude": 76.9852,
        "cctv_available": 1,
        "historical_fraud_count": 22,
    },
]

# Preserve demo legacy IDs LOC-ATM-101..108 by aliasing to key hotspots
LEGACY_DEMO_LOCATIONS = [
    {
        "id": "LOC-ATM-101",
        "name": "SBI 24x7 E-Corner ATM (Sector 7 Rohini)",
        "type": "ATM",
        "bank": "State Bank of India",
        "address": "Pocket C, Sector 7, Rohini, North West Delhi",
        "city": "Delhi",
        "latitude": 28.7126,
        "longitude": 77.1197,
        "cctv_available": 1,
        "historical_fraud_count": 14
    },
    {
        "id": "LOC-CSP-102",
        "name": "Airtel Payments Bank CSP & Money Transfer (Laxmi Nagar)",
        "type": "CSP",
        "bank": "Airtel Payments Bank",
        "address": "Vikas Marg, Near Metro Pillar 38, Laxmi Nagar",
        "city": "Delhi",
        "latitude": 28.6304,
        "longitude": 77.2773,
        "cctv_available": 0,
        "historical_fraud_count": 22
    },
    {
        "id": "LOC-ATM-103",
        "name": "PNB High-Volume ATM (Karol Bagh)",
        "type": "ATM",
        "bank": "Punjab National Bank",
        "address": "Arya Samaj Road, Karol Bagh Commercial Area",
        "city": "Delhi",
        "latitude": 28.6517,
        "longitude": 77.1906,
        "cctv_available": 1,
        "historical_fraud_count": 9
    },
    {
        "id": "LOC-CSP-104",
        "name": "Fino Payments Bank BC Agent (Chandni Chowk)",
        "type": "CSP",
        "bank": "Fino Payments Bank",
        "address": "Kucha Mahajani, Chandni Chowk",
        "city": "Delhi",
        "latitude": 28.6562,
        "longitude": 77.2310,
        "cctv_available": 0,
        "historical_fraud_count": 18
    },
    {
        "id": "LOC-ATM-105",
        "name": "HDFC Bank ATM (Janakpuri District Centre)",
        "type": "ATM",
        "bank": "HDFC Bank",
        "address": "Community Centre, Janakpuri",
        "city": "Delhi",
        "latitude": 28.6290,
        "longitude": 77.0818,
        "cctv_available": 1,
        "historical_fraud_count": 6
    },
    {
        "id": "LOC-ATM-106",
        "name": "Canara Bank ATM (Connaught Place)",
        "type": "ATM",
        "bank": "Canara Bank",
        "address": "Outer Circle, Block M, Connaught Place",
        "city": "Delhi",
        "latitude": 28.6328,
        "longitude": 77.2197,
        "cctv_available": 1,
        "historical_fraud_count": 5
    },
    {
        "id": "LOC-CSP-107",
        "name": "PayNearby Micro-ATM Kiosk (Dwarka Mor)",
        "type": "CSP",
        "bank": "PayNearby / Yes Bank BC",
        "address": "Near Pillar 782, Dwarka Mor Metro Station",
        "city": "Delhi",
        "latitude": 28.6190,
        "longitude": 77.0330,
        "cctv_available": 0,
        "historical_fraud_count": 12
    },
    {
        "id": "LOC-ATM-108",
        "name": "ICICI Bank ATM (Noida Sector 18)",
        "type": "ATM",
        "bank": "ICICI Bank",
        "address": "Atta Market, Sector 18",
        "city": "Noida",
        "latitude": 28.5708,
        "longitude": 77.3261,
        "cctv_available": 1,
        "historical_fraud_count": 8
    }
]


def seed_cybercrime_data(seed: int = 42):
    """Populates the database with deterministic synthetic data."""
    random.seed(seed)
    init_database()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing tables
    cursor.execute("DELETE FROM alerts")
    cursor.execute("DELETE FROM historical_cashouts")
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM complaints")
    cursor.execute("DELETE FROM cases")
    cursor.execute("DELETE FROM locations")

    # 1. Locations: insert all 26 canonical Delhi-NCR hotspots + 8 legacy demo aliases
    locations = DELHI_NCR_LOCATIONS + LEGACY_DEMO_LOCATIONS
    for loc in locations:
        cursor.execute("""
        INSERT INTO locations (id, name, type, bank, address, city, latitude, longitude, cctv_available, historical_fraud_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (loc["id"], loc["name"], loc["type"], loc["bank"], loc["address"], loc["city"], loc["latitude"], loc["longitude"], loc["cctv_available"], loc["historical_fraud_count"]))

    # 2. Cases: 3 existing demo cases + 497 expanded synthetic cases = 500 total cases
    demo_cases = [
        {
            "id": "CASE-2026-4401",
            "title": "Operation ShadowMule: Multi-State UPI Siphon to Delhi-NCR Cashout Ring",
            "description": "High-priority syndicate where multiple victim complaints across Mumbai, Bengaluru and Pune converge on a coordinated mule network with rapid multi-hop layer splitting and imminent cash withdrawal.",
            "category": "Syndicate / Multi-Hop Mule Ring",
            "total_amount_lost": 270000.0,
            "created_at": "2026-09-24 14:20:00",
            "status": "IMMINENT_CASHOUT_FLAGGED",
            "primary_mule_account": "ACC-SBIN-994812",
            "primary_mule_upi": "fastpay.sharma@okaxis"
        },
        {
            "id": "CASE-2026-4402",
            "title": "Electricity Bill Threat Phishing Ring",
            "description": "Victims threatened with immediate power disconnection coerced into installing remote control APK.",
            "category": "Remote Access / APK Fraud",
            "total_amount_lost": 82000.0,
            "created_at": "2026-09-24 11:15:00",
            "status": "UNDER_INVESTIGATION",
            "primary_mule_account": "ACC-HDFC-331201",
            "primary_mule_upi": "quickbill.support@ybl"
        },
        {
            "id": "CASE-2026-4403",
            "title": "Fake Investment Crypto Arbitrage Portal",
            "description": "Ponzi platform promising 25% daily ROI diverting investor deposits to mule UPI IDs.",
            "category": "Investment / Ponzi Fraud",
            "total_amount_lost": 195000.0,
            "created_at": "2026-09-23 18:40:00",
            "status": "UNDER_INVESTIGATION",
            "primary_mule_account": "ACC-ICIC-884120",
            "primary_mule_upi": "growcap.trading@icici"
        }
    ]

    all_cases = list(demo_cases)
    categories = [
        "Phishing / Mule Layering",
        "Investment / Ponzi Fraud",
        "Electricity Bill Threat Phishing",
        "Part-time Telegram Task Scam",
        "Digital Arrest Impersonation",
        "UPI Collect Request / Fake Refund",
        "Loan App Extortion Ring"
    ]
    banks = ["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "Canara", "AirtelPB", "PaytmPB"]
    upi_handles = ["okaxis", "okhdfcbank", "oksbi", "icici", "ybl", "paytm", "airtel"]

    base_case_time = datetime(2026, 7, 1, 9, 0, 0)
    for c_idx in range(4, 501):
        cid = f"CASE-2026-{4400 + c_idx}"
        cat = random.choice(categories)
        b_name = random.choice(banks)
        u_h = random.choice(upi_handles)
        c_amt = round(random.choice([35000, 68000, 115000, 185000, 240000, 390000, 520000, 850000]), 2)
        c_time = base_case_time + timedelta(days=c_idx // 6, hours=random.randint(8, 20), minutes=random.randint(0, 59))
        status_val = "INVESTIGATING" if c_idx % 4 != 0 else "CRITICAL"

        all_cases.append({
            "id": cid,
            "title": f"Operation Sentinel-{c_idx}: {cat} Syndicate Trail",
            "description": f"Syndicate case involving multi-tier fund siphon of INR {c_amt:,.0f} funneling into mule networks across Delhi-NCR.",
            "category": cat,
            "total_amount_lost": c_amt,
            "created_at": c_time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": status_val,
            "primary_mule_account": f"ACC-{b_name}-{random.randint(100000, 999999)}",
            "primary_mule_upi": f"mule.{random.randint(100, 999)}@{u_h}"
        })

    for c in all_cases:
        cursor.execute("""
        INSERT INTO cases (id, title, description, category, total_amount_lost, created_at, status, primary_mule_account, primary_mule_upi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (c["id"], c["title"], c["description"], c["category"], c["total_amount_lost"], c["created_at"], c["status"], c["primary_mule_account"], c["primary_mule_upi"]))

    # 3. Complaints: Preserve demo complaints + generate complaints for additional cases
    demo_complaints = [
        {
            "id": "NCRP-2026-98124",
            "case_id": "CASE-2026-4401",
            "victim_name": "Priya Sharma",
            "victim_phone": "+91-9820144512",
            "victim_upi": "priyasharma@okaxis",
            "victim_account": "ACC-HDFC-910245",
            "victim_bank": "HDFC Bank",
            "fraud_category": "Part-time Telegram Task Scam",
            "reported_amount": 65000.0,
            "incident_time": "2026-09-24 11:30:00",
            "reported_time": "2026-09-24 12:15:00",
            "status": "ACTIONABLE",
            "city": "Mumbai"
        },
        {
            "id": "NCRP-2026-98150",
            "case_id": "CASE-2026-4401",
            "victim_name": "Rajesh Verma",
            "victim_phone": "+91-9448102319",
            "victim_upi": "rajesh.verma@sbi",
            "victim_account": "ACC-SBIN-772109",
            "victim_bank": "State Bank of India",
            "fraud_category": "Impersonation / Digital Arrest",
            "reported_amount": 120000.0,
            "incident_time": "2026-09-24 12:45:00",
            "reported_time": "2026-09-24 13:20:00",
            "status": "ACTIONABLE",
            "city": "Bengaluru"
        },
        {
            "id": "NCRP-2026-98188",
            "case_id": "CASE-2026-4401",
            "victim_name": "Ankit Mehta",
            "victim_phone": "+91-9764512093",
            "victim_upi": "ankitmehta@icici",
            "victim_account": "ACC-ICIC-449102",
            "victim_bank": "ICICI Bank",
            "fraud_category": "UPI Collect Request / Fake Refund",
            "reported_amount": 85000.0,
            "incident_time": "2026-09-24 13:10:00",
            "reported_time": "2026-09-24 13:55:00",
            "status": "ACTIONABLE",
            "city": "Pune"
        },
        {
            "id": "NCRP-2026-98205",
            "case_id": "CASE-2026-4402",
            "victim_name": "Sunita Kulkarni",
            "victim_phone": "+91-9123456789",
            "victim_upi": "sunita.k@kotak",
            "victim_account": "ACC-KKBK-554412",
            "victim_bank": "Kotak Mahindra Bank",
            "fraud_category": "Electricity Bill Threat Phishing",
            "reported_amount": 82000.0,
            "incident_time": "2026-09-24 10:20:00",
            "reported_time": "2026-09-24 11:10:00",
            "status": "PROCESSING",
            "city": "Nagpur"
        },
        {
            "id": "NCRP-2026-98221",
            "case_id": "CASE-2026-4403",
            "victim_name": "Deepak Choudhary",
            "victim_phone": "+91-9871109923",
            "victim_upi": "deepak.c@paytm",
            "victim_account": "ACC-PYTM-110022",
            "victim_bank": "Paytm Payments Bank",
            "fraud_category": "Crypto Arbitrage Scheme",
            "reported_amount": 195000.0,
            "incident_time": "2026-09-23 16:30:00",
            "reported_time": "2026-09-23 18:15:00",
            "status": "PROCESSING",
            "city": "Jaipur"
        }
    ]

    all_complaints = list(demo_complaints)
    victim_first = ["Aarav", "Neha", "Rohan", "Sneha", "Karan", "Pooja", "Vikram", "Meera", "Aditya", "Divya"]
    victim_last = ["Patel", "Gupta", "Nair", "Iyer", "Reddy", "Singh", "Joshi", "Bose", "Das", "Rao"]
    cities = ["Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur"]

    for c_idx in range(4, 501):
        cid = f"CASE-2026-{4400 + c_idx}"
        v_name = f"{random.choice(victim_first)} {random.choice(victim_last)}"
        v_ph = f"+91-98{random.randint(10000000, 99999999)}"
        v_city = random.choice(cities)
        cat = random.choice(categories)
        amt = round(random.choice([25000, 48000, 75000, 120000, 180000, 250000]), 2)
        inc_time = datetime(2026, 8, 1, 10, 0, 0) + timedelta(days=c_idx // 6, hours=random.randint(8, 18))
        rep_time = inc_time + timedelta(minutes=random.randint(20, 90))

        all_complaints.append({
            "id": f"NCRP-2026-{98220 + c_idx}",
            "case_id": cid,
            "victim_name": v_name,
            "victim_phone": v_ph,
            "victim_upi": f"{v_name.lower().replace(' ', '.')}@{random.choice(upi_handles)}",
            "victim_account": f"ACC-{random.choice(banks)}-{random.randint(100000, 999999)}",
            "victim_bank": f"{random.choice(banks)} Bank",
            "fraud_category": cat,
            "reported_amount": amt,
            "incident_time": inc_time.strftime("%Y-%m-%d %H:%M:%S"),
            "reported_time": rep_time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "ACTIONABLE",
            "city": v_city
        })

    for comp in all_complaints:
        cursor.execute("""
        INSERT INTO complaints (id, case_id, victim_name, victim_phone, victim_upi, victim_account, victim_bank, fraud_category, reported_amount, incident_time, reported_time, status, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (comp["id"], comp["case_id"], comp["victim_name"], comp["victim_phone"], comp["victim_upi"], comp["victim_account"], comp["victim_bank"], comp["fraud_category"], comp["reported_amount"], comp["incident_time"], comp["reported_time"], comp["status"], comp["city"]))

    # 4. Transactions: Preserve demo transactions
    demo_transactions = [
        {
            "id": "TXN-HOP1-001",
            "case_id": "CASE-2026-4401",
            "sender_id": "priyasharma@okaxis",
            "sender_type": "victim",
            "receiver_id": "fastpay.sharma@okaxis",
            "receiver_type": "mule_l1",
            "amount": 65000.0,
            "timestamp": "2026-09-24 11:32:15",
            "device_id": "DEV-VICTIM-MUMBAI",
            "ip_address": "49.36.120.4",
            "location": "Mumbai",
            "layer_index": 1
        },
        {
            "id": "TXN-HOP1-002",
            "case_id": "CASE-2026-4401",
            "sender_id": "rajesh.verma@sbi",
            "sender_type": "victim",
            "receiver_id": "fastpay.sharma@okaxis",
            "receiver_type": "mule_l1",
            "amount": 120000.0,
            "timestamp": "2026-09-24 12:47:30",
            "device_id": "DEV-VICTIM-BLR",
            "ip_address": "122.172.88.91",
            "location": "Bengaluru",
            "layer_index": 1
        },
        {
            "id": "TXN-HOP1-003",
            "case_id": "CASE-2026-4401",
            "sender_id": "ankitmehta@icici",
            "sender_type": "victim",
            "receiver_id": "fastpay.sharma@okaxis",
            "receiver_type": "mule_l1",
            "amount": 85000.0,
            "timestamp": "2026-09-24 13:12:05",
            "device_id": "DEV-VICTIM-PUNE",
            "ip_address": "103.51.24.11",
            "location": "Pune",
            "layer_index": 1
        },
        {
            "id": "TXN-HOP2-004",
            "case_id": "CASE-2026-4401",
            "sender_id": "fastpay.sharma@okaxis",
            "sender_type": "mule_l1",
            "receiver_id": "kumar.settle@paytm",
            "receiver_type": "mule_l2",
            "amount": 140000.0,
            "timestamp": "2026-09-24 13:25:00",
            "device_id": "DEV-MULE-OP1",
            "ip_address": "103.212.45.18",
            "location": "Delhi-Rohini",
            "layer_index": 2
        },
        {
            "id": "TXN-HOP2-005",
            "case_id": "CASE-2026-4401",
            "sender_id": "fastpay.sharma@okaxis",
            "sender_type": "mule_l1",
            "receiver_id": "vikas.traders@airtel",
            "receiver_type": "mule_l2",
            "amount": 130000.0,
            "timestamp": "2026-09-24 13:30:10",
            "device_id": "DEV-MULE-OP1",
            "ip_address": "103.212.45.18",
            "location": "Delhi-LaxmiNagar",
            "layer_index": 2
        },
        {
            "id": "TXN-HOP3-006",
            "case_id": "CASE-2026-4401",
            "sender_id": "kumar.settle@paytm",
            "sender_type": "mule_l2",
            "receiver_id": "RUNNER-CARD-DELHI-01",
            "receiver_type": "runner_token",
            "amount": 90000.0,
            "timestamp": "2026-09-24 14:05:00",
            "device_id": "DEV-RUNNER-991",
            "ip_address": "103.212.45.18",
            "location": "Sector 7 Rohini",
            "layer_index": 3
        },
        {
            "id": "TXN-HOP3-007",
            "case_id": "CASE-2026-4401",
            "sender_id": "vikas.traders@airtel",
            "sender_type": "mule_l2",
            "receiver_id": "RUNNER-CSP-TOKEN-02",
            "receiver_type": "runner_token",
            "amount": 80000.0,
            "timestamp": "2026-09-24 14:10:00",
            "device_id": "DEV-RUNNER-992",
            "ip_address": "103.212.45.22",
            "location": "Laxmi Nagar Vikas Marg",
            "layer_index": 3
        }
    ]

    for tx in demo_transactions:
        cursor.execute("""
        INSERT INTO transactions (id, case_id, sender_id, sender_type, receiver_id, receiver_type, amount, timestamp, device_id, ip_address, location, layer_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (tx["id"], tx["case_id"], tx["sender_id"], tx["sender_type"], tx["receiver_id"], tx["receiver_type"], tx["amount"], tx["timestamp"], tx["device_id"], tx["ip_address"], tx["location"], tx["layer_index"]))

    # 5. Historical Cashouts: 2,000 events with calibrated latent utility choice model
    # Candidate pool for events uses all 26 distinct Delhi-NCR locations (14 candidates evaluated per event)
    candidate_pool = list(DELHI_NCR_LOCATIONS)
    base_time = datetime(2026, 7, 1, 8, 0, 0)
    amounts_choices = [10000, 20000, 25000, 40000, 50000, 75000, 80000, 100000, 120000, 150000, 200000, 250000]

    for i in range(2000):
        # Anchor runner hop around one of the locations with realistic geographic dispersion
        anchor = random.choice(candidate_pool)
        hop_lat = round(anchor["latitude"] + random.gauss(0, 0.025), 6)
        hop_lon = round(anchor["longitude"] + random.gauss(0, 0.025), 6)

        # Evaluate the 14 closest locations from the candidate pool as event candidates
        cands_with_d = []
        for loc in candidate_pool:
            d = _calc_haversine(hop_lat, hop_lon, loc["latitude"], loc["longitude"])
            cands_with_d.append((d, loc))
        cands_with_d.sort(key=lambda x: x[0])
        event_candidates = cands_with_d[:14]

        # Calibrated latent utility choice mechanism:
        # Distance matters (-0.38 per km), but historical fraud (+0.045), lack of CCTV (-0.55),
        # and CSP presence (+0.65) create multi-attribute trade-offs.
        # Gumbel(0, 0.70) noise produces realistic Multinomial Logit decision behavior.
        best_u = -float("inf")
        chosen_loc = event_candidates[0][1]
        chosen_dist = event_candidates[0][0]

        for d, loc in event_candidates:
            u_noise = -0.70 * math.log(-math.log(random.uniform(0.0001, 0.9999)))
            is_csp = 1.0 if loc["type"] == "CSP" else 0.0
            cctv = 1.0 if loc["cctv_available"] else 0.0
            u = (
                -0.38 * d
                + 0.045 * loc["historical_fraud_count"]
                - 0.55 * cctv
                + 0.65 * is_csp
                + u_noise
            )
            if u > best_u:
                best_u = u
                chosen_loc = loc
                chosen_dist = d

        cash_amt = round(random.choice(amounts_choices), 2)
        days_offset = (i * 75) // 2000  # Spread across 75 days chronologically
        w_time = base_time + timedelta(
            days=days_offset,
            hours=random.randint(6, 23),
            minutes=random.randint(0, 59),
            seconds=random.randint(0, 59)
        )
        mule_acc = f"MULE-HIST-{random.randint(100, 999)}"

        cursor.execute("""
        INSERT INTO historical_cashouts (id, location_id, amount, withdrawal_time, distance_from_last_hop_km, mule_account_id, successful, last_hop_lat, last_hop_lon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"CASH-{1000 + i}",
            chosen_loc["id"],
            cash_amt,
            w_time.strftime("%Y-%m-%d %H:%M:%S"),
            round(chosen_dist, 2),
            mule_acc,
            1,
            hop_lat,
            hop_lon
        ))

    # 6. Default Alerts
    alerts = [
        {
            "id": "ALT-2026-8801",
            "case_id": "CASE-2026-4401",
            "case_title": "Operation ShadowMule: Multi-State UPI Siphon",
            "priority": "CRITICAL",
            "target_agencies": json.dumps(["LEA_DELHI_POLICE_CYBERCELL", "BANK_SBI_FRAUD_NODAL", "I4C_REGISTRY"]),
            "predicted_locations": json.dumps([
                {"location_id": "LOC-DEL-11", "name": "Rohini Sector 7 Deepali Chowk Indian Bank ATM", "confidence": "94.8%"},
                {"location_id": "LOC-DEL-03", "name": "Laxmi Nagar Vikas Marg CSP Customer Service Hub", "confidence": "76.4%"}
            ]),
            "dispatched_at": "2026-09-24 14:22:10",
            "status": "DISPATCHED_ACTIVE",
            "action_code": "ACT-DEBIT-FREEZE-PATROL-DEPLOY",
            "summary": "Tactical alert issued for immediate ATM hotspot patrol at Rohini Sector 7 and debit freeze on Layer 2 mule account kumar.settle@paytm."
        }
    ]

    for a in alerts:
        cursor.execute("""
        INSERT INTO alerts (id, case_id, case_title, priority, target_agencies, predicted_locations, dispatched_at, status, action_code, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (a["id"], a["case_id"], a["case_title"], a["priority"], a["target_agencies"], a["predicted_locations"], a["dispatched_at"], a["status"], a["action_code"], a["summary"]))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    seed_cybercrime_data()
    print("[SUCCESS] Successfully seeded database with 26 locations, 500 cases, and 2,000 historical cashout events.")
