import pandas as pd
import json
from sodapy import Socrata
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

data = pd.DataFrame()

# Obtener toda la data de www.datos.gov.co y almacenarlos en global data
@app.before_first_request
def before_first_request():
    client = Socrata("www.datos.gov.co",None)
    results = client.get("gt2j-8ykr", limit=2000)
    global data
    data = pd.DataFrame.from_records(results)
    data = data.fillna(value="No registro")

# Funcion para parsear dataframe a json
def parser(toParse):
    jsoner = toParse.to_json(orient="table")
    parsed = json.loads(jsoner)
    return parsed

# Ruta para obtener toda la informacion del dataframe
@app.route('/api/data')
def get_data():
    global data
    response = { 'message': 'Success', 'info': parser(data)}
    return jsonify(response)


@app.route('/api/data/filter', methods=['GET'])
def get_filter():
    municipio = request.args.get('municipio', default = '', type=str)
    sexo = request.args.get('sexo', default = '', type=str)
    estado = request.args.get('estado', default = '', type=str)
    minedad = request.args.get('minedad', default = 0, type=int)
    maxedad = request.args.get('maxedad', default = 0, type=int)
    # Parsear los argumentos del request a un diccionario
    argums = request.args.to_dict()
    print(argums)
    print(minedad, maxedad)
    global data
    data['edad'] = data['edad'].astype(int)
    # Analizar cada condición impuesta por los argumentos
    # Donde si algun argumento no existe se pasara como True
    # Ya que asi mismo no afectará cuando se haga un & por toda
    municipioCondition = data['ciudad_municipio_nom'] == municipio if ('municipio' in argums) else True
    sexoCondition = data['sexo'] == sexo if ('sexo' in argums) else True
    estadoCondition = data['estado'] == estado if ('estado' in argums) else True
    edadCondition = ((data['edad'] >= minedad) & (data['edad'] <= maxedad)) if ('minedad' in argums) else True
    # full será un arreglo de todas las Keys en las cuales se cumplen todas las condiciones
    full = municipioCondition & sexoCondition & estadoCondition & edadCondition
    response = {'message': 'Success', 'info': parser(data[full])}
    return jsonify(response)