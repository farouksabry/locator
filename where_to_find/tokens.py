from rest_framework_simplejwt.tokens import Token
from datetime import timedelta

class EmailVerificationToken(Token):
    lifetime = timedelta(hours=24)
    token_type = "email_verification"