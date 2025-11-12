import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

def send_email(user, token, route, file_name):
    """
    Sends an HTML email to a user.
    """
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    if route == "verify-email":
        link = f"{frontend_url}/{route}?token={token}"
        subject = "Verify your email address"
    elif route == "password-reset":
        uidb64 = urlsafe_base64_encode(force_bytes(user.id))
        link = f"{frontend_url}/{route}?uid={uidb64}&token={token}"
        subject = "Reset your password"

    # Render the HTML template
    html_content = render_to_string(f"emails/{file_name}.html", {
        "user": user,
        "link": link,
    })

    # Fallback plain text version
    text_content = f"Hello {user.first_name}"

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_notify_email(user, notification):
    subject = "Notification"
    html_content = render_to_string(f"emails/notify.html", {
        "user": user,
        "notification": notification
    })

    text_content = notification
    from_email = settings.DEFAULT_FROM_EMAIL
    recepient_list = [user.email]

    msg = EmailMultiAlternatives(subject, text_content, from_email, recepient_list)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
