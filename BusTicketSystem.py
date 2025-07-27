# streamlit_app.py
import streamlit as st
import random
import string
from datetime import datetime
import urllib.parse

st.set_page_config(page_title="Bus Ticket Booking", layout="centered")

# ---------- Helper Functions ----------
def generate_transaction_id():
    date_str = '27072025'
    upper_chars = string.ascii_uppercase + string.digits
    lower_chars = string.ascii_lowercase
    
    txn = ''.join(random.choice(upper_chars) for _ in range(12))
    num_lower = random.choice([1, 2])
    txn_list = list(txn)
    
    for _ in range(num_lower):
        pos = random.randint(0, 11)
        txn_list[pos] = random.choice(lower_chars)
    
    return f'T{date_str}{"".join(txn_list)}'

def generate_qr_data():
    prefix = "gAAAAA"
    characters = string.ascii_letters + string.digits + "-_"
    core = ''.join(random.choice(characters) for _ in range(160))
    return prefix + core + "=="

def calculate_discounted_fare(original):
    return round(float(original) * 0.9, 2)

def get_booking_time():
    return '27 Jul 25 | 12:28 PM'

# ---------- Session States ----------
if "step" not in st.session_state:
    st.session_state.step = 1
    st.session_state.ticket = {
        "busColor": "",
        "busNumber": "",
        "busRoute": "",
        "startingStop": "",
        "endingStop": "",
        "fare": "",
        "ticketCount": 1,
        "bookingTime": "",
        "discountedFare": "",
        "transactionId": "",
        "qrData": ""
    }

# ---------- Step-by-Step Form ----------
st.title("🚌 Delhi Bus Ticket Booking")

if st.session_state.step == 1:
    st.subheader("Select Bus Type")
    color = st.radio("Choose a color:", ["Red", "Blue Dark", "Blue Light", "Orange"])
    if st.button("Next"):
        st.session_state.ticket["busColor"] = color
        st.session_state.step += 1

elif st.session_state.step == 2:
    st.subheader("Enter Bus Number")
    number = st.text_input("Bus Number", placeholder="e.g. DL1PD6008")
    if st.button("Next") and number:
        st.session_state.ticket["busNumber"] = number.upper()
        st.session_state.step += 1

elif st.session_state.step == 3:
    st.subheader("Enter Bus Route")
    route = st.text_input("Route", placeholder="e.g. 740, OMS(-)")
    if st.button("Next") and route:
        st.session_state.ticket["busRoute"] = route
        st.session_state.step += 1

elif st.session_state.step == 4:
    st.subheader("Enter Starting Stop")
    start = st.text_input("From", placeholder="e.g. D Block Janak Puri")
    if st.button("Next") and start:
        st.session_state.ticket["startingStop"] = start
        st.session_state.step += 1

elif st.session_state.step == 5:
    st.subheader("Enter Ending Stop")
    end = st.text_input("To", placeholder="e.g. Uttam Nagar Terminal")
    if st.button("Next") and end:
        st.session_state.ticket["endingStop"] = end
        st.session_state.step += 1

elif st.session_state.step == 6:
    st.subheader("Enter Fare")
    fare = st.number_input("Fare (₹)", step=1.0, min_value=0.0)
    if st.button("Next") and fare > 0:
        st.session_state.ticket["fare"] = fare
        st.session_state.step += 1

elif st.session_state.step == 7:
    st.subheader("Select Ticket Count")
    count = st.slider("Number of Tickets", 1, 5, 1)
    if st.button("Next"):
        st.session_state.ticket["ticketCount"] = count
        st.session_state.step += 1

elif st.session_state.step == 8:
    st.subheader("Confirm Your Booking")
    t = st.session_state.ticket
    discounted = calculate_discounted_fare(t["fare"])
    st.write(f"**Bus Type:** {t['busColor']}")
    st.write(f"**Bus Number:** {t['busNumber']}")
    st.write(f"**Route:** {t['busRoute']}")
    st.write(f"**From:** {t['startingStop']}")
    st.write(f"**To:** {t['endingStop']}")
    st.write(f"**Tickets:** {t['ticketCount']}")
    st.write(f"**Original Fare:** ₹{float(t['fare']):.2f}")
    st.write(f"**You Pay (10% off):** ₹{discounted:.2f}")
    if st.button("Generate Ticket"):
        st.session_state.ticket["bookingTime"] = get_booking_time()
        st.session_state.ticket["discountedFare"] = discounted
        st.session_state.ticket["transactionId"] = generate_transaction_id()
        st.session_state.ticket["qrData"] = generate_qr_data()
        st.session_state.step += 1

# ---------- Final Ticket ----------
elif st.session_state.step == 9:
    t = st.session_state.ticket
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={urllib.parse.quote(t['qrData'])}"
    st.success("🎟️ Ticket Booked Successfully")
    st.markdown(f"""
    **Transport Dept. of Delhi**

    **Bus No:** `{t['busNumber']}`  
    **Route:** `{t['busRoute']}`  
    **From:** {t['startingStop']} → **To:** {t['endingStop']}  
    **Fare:** ₹{float(t['fare']):.2f}  
    **Discounted Fare:** ₹{float(t['discountedFare']):.2f}  
    **Booking Time:** {t['bookingTime']}  
    **Transaction ID:** `{t['transactionId']}`  
    **Tickets:** {t['ticketCount']}  
    """)
    st.image(qr_url, caption="Scan this QR with conductor", use_column_width=False)
    with st.expander("🔐 QR Code Data (Raw)"):
        st.code(t['qrData'])

    if st.button("🔄 Book Another Ticket"):
        st.session_state.step = 1
        st.session_state.ticket = {key: "" if isinstance(value, str) else 1 for key, value in t.items()}


