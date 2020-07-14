import os

CLIENT_CONFIG = {
    "web": {
        "client_id": os.environ['client_id'],
        "project_id": os.environ['project_id'],
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://www.googleapis.com/oauth2/v3/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        "client_secret": os.environ['client_secret']
    }
}

SCOPES = ['https://www.googleapis.com/auth/drive']
