import os
import resend

resend.api_key = os.environ["RESEND_API_KEY"]

# temporary for dev only
dev_email = os.environ["DEV_EMAIL"]

def send_to_email(email, code, expiry) :
    params: resend.Emails.SendParams = {
        "from": "Plantetto <onboarding@resend.dev>",
        "to": [dev_email],
        "subject": "Plantetto Email Verification Code",
        "html": f"<h1>here's your plantetto code :)</h1><strong>{code}</strong><p>this will expire in {expiry} minutes</p>",
    }

    email = resend.Emails.send(params)
    print(email, code, expiry)