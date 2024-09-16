"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json() 

    if not body:
        return jsonify({"msg": "Faltan datos en la solicitud"}), 400

    name = body.get('name')
    last_name = body.get('last_name')
    email = body.get('email')
    password = body.get('password')
    mobile = body.get('mobile')
    address = body.get('address')

    if not all([name, last_name, email, password, mobile, address]):
        missing_fields = []
        if not name:
            missing_fields.append('name')
        if not last_name:
            missing_fields.append('last_name')
        if not email:
            missing_fields.append('email')
        if not password:
            missing_fields.append('password')
        if not mobile:
            missing_fields.append('mobile')
        if not address:
            missing_fields.append('address')
        
        return jsonify({"msg": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "Este correo electrónico ya está registrado"}), 400

    new_user = User(
        name=name,
        last_name=last_name,
        email=email,
        password=password,
        mobile=mobile,
        address=address,
        is_active=True 
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear el usuario: {str(e)}"}), 500

    return jsonify({"msg": "Usuario registrado exitosamente"}), 201