import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_verification_email(user, token):
    """
    Sends an HTML verification email to a user.
    """
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    verification_link = f"{frontend_url}/verify-email?token={token}"
    subject = "Verify your email address"

    # Render the HTML template
    html_content = render_to_string("emails/verify_email.html", {
        "user": user,
        "verification_link": verification_link,
    })

    # Fallback plain text version
    text_content = f"Hello {user.first_name}, please verify your email: {verification_link}"

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
