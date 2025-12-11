import os
import resend

resend.api_key = os.environ["RESEND_API_KEY"]

ENV = os.environ["ENVIRONMENT"]

# temporary for dev only
DEV_EMAIL = os.environ["DEV_EMAIL"]

DEV_EMAIL_FROM = os.environ["DEV_EMAIL_FROM"]

PROD_EMAIL_FROM = os.environ["PROD_EMAIL_FROM"]



def send_to_email(email, code, expiry) :
    EMAIL_TO_SEND = DEV_EMAIL if ENV == "DEV" else email
    FROM_EMAIL = DEV_EMAIL_FROM if ENV == "DEV" else PROD_EMAIL_FROM
    params: resend.Emails.SendParams = {
        "from": FROM_EMAIL,
        "to": [EMAIL_TO_SEND],
        "subject": "Plantetto Email Verification Code",
        "html" : f"""
                <div style="
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 450px;
                    margin: auto;
                    padding: 25px;
                    border: 2px solid #2e7d32;
                    border-radius: 15px;
                    background: #e8f5e9;
                    text-align: center;
                ">
                    <h2 style="color: #2e7d32;">🌿 Your Plantetto Code 🌿</h2>
                    <p style="font-size: 18px; margin: 25px 0;">
                        <strong style="
                            font-size: 26px;
                            display: inline-block;
                            background-color: #a5d6a7;
                            padding: 12px 25px;
                            border-radius: 8px;
                            letter-spacing: 2px;
                            box-shadow: 1px 2px 4px rgba(0,0,0,0.2);
                        ">{code}</strong>
                    </p>
                    <p style="color: #4d4d4d; font-size: 14px;">
                        This code will expire in <strong>{expiry} minutes</strong>.<br>
                        Keep your plants happy! 🌱
                    </p>
                    <div style="margin-top: 20px; font-size: 24px;">
                        🍃 🌱 🌿 🍀 🌼
                    </div>
                </div>
                """
    }

    email = resend.Emails.send(params)
    print(email, code, expiry)