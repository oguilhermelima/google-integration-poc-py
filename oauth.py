import os
import flask
import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
import googleapiclient.discovery
import google_client_config


app = flask.Flask(__name__)
app.secret_key = 'sidjsdj12929isdj002'

# Verificação HTTPS
# 1 para desabilitar
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


@app.route('/')
def index():
    return flask.render_template('index.html', title="Google OAUTH2")


@app.route('/authorize')
def authorize():
    # Cria um instancia que gerencia o fluxo de OAUTH
    flow = Flow.from_client_config(google_client_config.CLIENT_CONFIG, scopes=google_client_config.SCOPES)
    flow.redirect_uri = flask.url_for('callback', _external=True)
    authorization_url, state = flow.authorization_url(
        # Habilita o acesso offline, permite atualizar o token sem reapresentar popup de permissão
        access_type='offline',
        include_granted_scopes='true')
    # Armazena o estado para o callback verificar a resposta do Google
    flask.session['state'] = state

    return flask.redirect(authorization_url)


@app.route('/callback')
def callback():
    flow = Flow.from_client_config(google_client_config.CLIENT_CONFIG,
                                   scopes=google_client_config.SCOPES,
                                   state=flask.session['state'])
    flow.redirect_uri = flask.url_for('callback', _external=True)
    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    flask.session['credentials'] = credentials_to_dict(flow.credentials)
    flask.flash('Autenticado com sucesso')

    response = flask.make_response(flask.redirect(flask.url_for('index')))
    response.set_cookie('token', credentials_to_dict(flow.credentials)['token'])

    return response


@app.route('/revoke')
def revoke():
    if 'credentials' not in flask.session:
        return render_page_with_message('É necessário se autenticar para remover as credenciais', 'index')

    credentials = Credentials(**flask.session['credentials'])

    response = requests.post('https://accounts.google.com/o/oauth2/revoke',
                             params={'token': credentials.token},
                             headers={'content-type': 'application/x-www-form-urlencoded'})
    status_code = getattr(response, 'status_code')

    if status_code == 200:
        del flask.session['credentials']
        return render_page_with_message('Credenciais removidas com sucesso!', 'index')
    else:
        return render_page_with_message("Erro ao tentar remover as credenciais!", 'index')


@app.route('/clear')
def clear_credentials():
    if 'credentials' in flask.session:
        del flask.session['credentials']
    return render_page_with_message("Sessão removida com sucesso!", 'index')


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}


def render_page_with_message(message, dynamic_url):
    flask.flash(message)
    return flask.redirect(flask.url_for('index'))


@app.route('/files')
def files():
    try:
        if 'credentials' not in flask.session:
            return flask.redirect('authorize')

        credentials = Credentials(**flask.session['credentials'])
        drive = googleapiclient.discovery.build('drive', 'v3', credentials=credentials)
        drive_files = drive.files().list().execute()
        flask.session['credentials'] = credentials_to_dict(credentials)

        return flask.jsonify(**drive_files)
    except:
        return render_page_with_message("Erro ao buscar o token! Refaça a autenticação", 'index')


@app.route('/tokenInfo')
def token():
    try:
        if 'credentials' not in flask.session:
            return flask.redirect('authorize')

        credentials = Credentials(**flask.session['credentials'])
        flask.session['credentials'] = credentials_to_dict(credentials)

        return flask.jsonify(flask.session['credentials'])
    except:
        return render_page_with_message("Erro ao buscar o token! Refaça a autenticação", 'index')


@app.route('/js', methods=['POST'])
def js():
    status = flask.request.form['status']
    if status == "success":
        return render_page_with_message("Upload feito com sucesso", 'index')
    else:
        return render_page_with_message("Erro ao fazer upload", 'index')
