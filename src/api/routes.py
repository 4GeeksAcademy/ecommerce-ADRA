"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, Product, Category, Order, OrderDetail, Super, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import stripe

app = Flask(__name__)
bcrypt = Bcrypt(app)


api = Blueprint('api', __name__)

stripe.api_key = 'sk_test_51Q7eNvD31DD0ObEk8Mz6esz4fIdfrLpW3U6WKl7U8I6pIwnDcUamqxeml3ap2CZBliowHPkVe7lqNfcwnIUcatOu00UFyrNZzx'

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

    # Verificar si el email ya está registrado
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "Este correo electrónico ya está registrado"}), 400

    # Encriptar el password antes de guardarlo
    encrypted_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Crear el nuevo usuario
    new_user = User(
        name=name,
        last_name=last_name,
        email=email,
        password=encrypted_password,  # Guardar el password encriptado
        mobile=mobile,
        address=address,
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        # Generar el token JWT usando el id del nuevo usuario
        token = create_access_token(identity=new_user.id, additional_claims={"role": "user"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear el usuario: {str(e)}"}), 500

    return jsonify({"msg": "Usuario registrado exitosamente", "token": token}), 201


# Ruta para login de usuario
@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Faltan datos en la solicitud"}), 400

    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({"msg": "Correo y contraseña son obligatorios"}), 400

    # Verificar si el usuario existe en la base de datos
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Verificar si la contraseña es correcta
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    # Generar un token JWT
    token = create_access_token(identity=user.id, additional_claims={"role": "user"})

    return jsonify({'token': token,
            'name': user.name,
            'last_name': user.last_name,
            'email': user.email,
            'mobile': user.mobile,
            'address': user.address,
            'msg': "Login exitoso."}), 200

@app.route('/user', methods=['GET'])
@jwt_required() 
def get_user():
    user_id = get_jwt_identity()  # Obtiene la identidad (ID del usuario) desde el token
    user = User.query.get(user_id)  # Busca al usuario en la base de datos

    if user:
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "mobile": user.mobile,
            "address": user.address,
        }), 200
    else:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
#ruta de logout
@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        jti = get_jwt()["jti"]  # Obtener el JWT ID del token actual
        # Revisar si ya existe en la lista de tokens bloqueados...
        if TokenBlockedList.query.filter_by(jti=jti).first():
            return jsonify({"msg": "Token ya ha sido bloqueado"}), 400
        
        # Guardar el token en la lista de bloqueados
        token_blocked = TokenBlockedList(jti=jti)
        db.session.add(token_blocked)
        db.session.commit()

        return jsonify({"msg": "Sesión cerrada exitosamente"}), 200
    except Exception as e:
        return jsonify({"msg": f"Error al cerrar sesión: {str(e)}"}), 500


@api.route('/super', methods=["POST"])
def super():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not  password: 
        return jsonify({"msg": "email o contraseña obligatorio"}), 400
    super_existe=Super.query.filter_by(email=email).first()
    if super_existe:
        return jsonify({"msg": "Correo existente"}), 400
    new_super = Super(email=email, password=password)
    db.session.add(new_super)
    db.session.commit()
    return jsonify({"msg": "Usuario creado exitosamente"}), 200





# Ruta para obtener todos los productos
@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products]), 200


# Ruta para obtener un producto por ID
@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200


# Ruta para agregar un nuevo producto
@api.route('/products', methods=['POST'])
def add_product():
    body = request.get_json()
    name = body.get('name')
    description = body.get('description')
    price = body.get('price')
    stock = body.get('stock')
    url = body.get('url')

    if not all([name, description, price, stock, url]):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    new_product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        url=url
    )

    try:
        db.session.add(new_product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al agregar producto: {str(e)}"}), 500

    return jsonify(new_product.serialize()), 201


# Ruta para obtener todas las categorías
@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.serialize() for category in categories]), 200


# Ruta para obtener una categoría por ID
@api.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Categoría no encontrada"}), 404
    return jsonify(category.serialize()), 200


# Ruta para crear una nueva orden
@api.route('/orders', methods=['POST'])
def create_order():
    body = request.get_json()
    user_id = body.get('user_id')
    total_amount = body.get('total_amount')
    status = body.get('status')
    order_details = body.get('order_details')  

    if not all([user_id, total_amount, status, order_details]):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    new_order = Order(user_id=user_id, total_amount=total_amount, status=status)

    try:
        db.session.add(new_order)
        db.session.commit()

        # Agregar detalles de la orden
        for detail in order_details:
            product_id = detail.get('product_id')
            quantity = detail.get('quantity')
            product = Product.query.get(product_id)
            if not product:
                return jsonify({"msg": f"Producto con ID {product_id} no encontrado"}), 404

            order_detail = OrderDetail(
                order_id=new_order.id,
                product_id=product_id,
                quantity=quantity,
                price=product.price
            )
            db.session.add(order_detail)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear la orden: {str(e)}"}), 500

    return jsonify(new_order.serialize()), 201


# Ruta para obtener todas las órdenes de un usuario
@api.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([order.serialize() for order in orders]), 200


# Ruta para obtener los detalles de una orden
@api.route('/orders/<int:order_id>/details', methods=['GET'])
def get_order_details(order_id):
    order_details = OrderDetail.query.filter_by(order_id=order_id).all()
    if not order_details:
        return jsonify({"msg": "No hay detalles para esta orden"}), 404
    return jsonify([detail.serialize() for detail in order_details]), 200

# Ruta para actualizar datos del usuario
@api.route('/update-user', methods=['PUT'])
@jwt_required()
def update_user():
    try:
        current_user = get_jwt_identity()  # Obtener el ID del usuario actual
        user = User.query.get(current_user)  # Busca el usuario en la base de datos 
        print(current_user)
        print(user)
        if user:
            data = request.get_json()
            user.name = data.get('name', user.name)
            user.last_name = data.get('last_name', user.last_name)
            user.mobile = data.get('mobile', user.mobile)
            user.address = data.get('address', user.address)

            db.session.commit() 
            return jsonify({"msg": "Datos actualizados correctamente", "user": {
                "name": user.name,
                "last_name": user.last_name,
                "email": user.email,
                "mobile": user.mobile,
                "address": user.address
            }}), 200
        else:
            return jsonify({"msg": "Usuario no encontrado"}), 404
    except Exception as error: 
        print (error)
        return jsonify({"error": "error"})
    
# Ruta para eliminar la cuenta del usuario
@api.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    try:
        current_user = get_jwt_identity()  # Obtener el email del usuario autenticado
        user = User.query.get(current_user)  # Buscar usuario en la BD

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Intentar eliminar el usuario
        db.session.delete(user)
        db.session.commit()  # Aplicar la eliminación en la base de datos

        return jsonify({"msg": "Cuenta eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()  # Hacer rollback en caso de error
        return jsonify({"msg": f"Error al eliminar la cuenta: {str(e)}"}), 500
    

@api.route('/create-payment', methods=['POST'])
def create_payment():
        try:
            data = request.json
            intent = stripe.PaymentIntent.create(
                amount=data['amount'],
                currency=data['currency'],
                automatic_payment_methods={
                    'enabled': True
                }

            )
            return jsonify({
                'clientSecret': intent['client_secret']
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
