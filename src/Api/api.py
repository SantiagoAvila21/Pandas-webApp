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
    results = client.get("gt2j-8ykr", limit=200)
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
    argums = request.args.to_dict()
    print(request.args.to_dict())
    print(len(municipio))
    global data
    print('municipio' in argums)



    response = {'message': 'Success', 'info': parser(data[data['ciudad_municipio_nom'] == municipio])}
    return jsonify(response)