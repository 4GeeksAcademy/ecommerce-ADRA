const apiUrl = process.env.BACKEND_URL + "/api";
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white",
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white",
                },
            ],
            token: localStorage.getItem("token") || null,
            user: null,
            products: [],
            errorMsg: null,
            successMsg: null,
            cart: [],
            total: null,
            
        },
        actions: {
            // Use getActions to call a function within a fuction
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },
            getTotal:() => setStore({total:getStore().cart.reduce(
                (acc, item) => acc + item.price,
                0
            )}),
            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            changeColor: (index, color) => {
                //get the store
                const store = getStore();

                //we have to loop the entire demo array to look for the respective index
                //and change its color
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                //reset the global store
                setStore({ demo: demo });
            },
            signup: async (
                name,
                last_name,
                email,
                password,
                mobile,
                address
            ) => {
                try {
                    const response = await fetch(apiUrl + "/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: name,
                            last_name: last_name,
                            email: email,
                            password: password,
                            mobile: mobile,
                            address: address,
                        }),
                    });

                    
                    if (response.ok) {
                        const data = await response.json();
                        const token = data.token;
                        if (token) {
                            
                            localStorage.setItem("token", token);
                            setStore({
                                token: token,
                                user: {
                                    name: name,
                                    last_name: last_name,
                                    email: email,
                                    mobile: mobile,
                                    address: address,
                                },
                                successMsg: data.msg,
                                errorMsg: null,
                            });
                            return true; 
                        } else {
                            setStore({
                                successMsg: null,
                                errorMsg:
                                    "No se pudo obtener el token. Intente nuevamente.",
                            });
                            return false; 
                        }
                    } else {
                        const errorData = await response.json();
                        setStore({
                            errorMsg: errorData.msg,
                            successMsg: null,
                        });
                        return false; 
                    }
                } catch (error) {
                    console.error("Error al registrar usuario:", error);
                    setStore({
                        errorMsg: "Error de conexión o del servidor.",
                        successMsg: null,
                    });
                    return false; 
                }
            },

            login: async (email, password) => {
                try {
                    const response = await fetch(apiUrl + "/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        }),
                    });

                    
                    if (response.ok) {
                        const data = await response.json();
                        const token = data.token;

                        if (token) {
                            // Especificar los campos del usuario como en el signup
                            const user = {
                                name: data.name, 
                                last_name: data.last_name,
                                email: data.email,
                                mobile: data.mobile,
                                address: data.address,
                            };

                            // Guardar token y datos de usuario en el localStorage y en el store
                            localStorage.setItem("token", token);
                            setStore({
                                token: token,
                                user: user, 
                                successMsg: data.msg,
                                errorMsg: null,
                            });
                            return true; 
                        } else {
                            setStore({
                                successMsg: null,
                                errorMsg:
                                    "No se pudo obtener el token. Intente nuevamente.",
                            });
                            return false; 
                        }
                    } else {
                        const errorData = await response.json();
                        setStore({
                            errorMsg: errorData.msg,
                            successMsg: null,
                        });
                        return false; 
                    }
                } catch (error) {
                    console.error("Error al iniciar sesión:", error);
                    setStore({
                        errorMsg: "Error de conexión o del servidor.",
                        successMsg: null,
                    });
                    return false; 
                }
            },

            loadUserData: async () => {
                const token = localStorage.getItem("token");

                if (token) {
                    setStore({ token: token }); // Guardar token en el store
                    const success = await getActions().getUserInfo(); // Cargar datos del usuario
                    return success;
                } else {
                    return false; // No hay token
                }
            },
            updateUserData: async (userData) => {
                try {
                    const response = await fetch(apiUrl + "/update-user", {
                        method: "PUT", 
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`, 
                        },
                        body: JSON.stringify(userData),
                    });

                    if (!response.ok) {
                        throw new Error(
                            "Error al actualizar los datos del usuario"
                        );
                    }

                    const result = await response.json();

                    setStore({ user: result.user });
                    
                    return true; 
                } catch (error) {
                    console.error("Error al actualizar usuario:", error);
                    return false;
                }
            },

           
            deleteAccount: async () => {
                const store = getStore();
                const response = await fetch(apiUrl + "/delete-account", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                    },
                });
                if (response.ok) {
                    setStore({ token: null, user: null });
                    localStorage.removeItem("token");
                    return true;
                } else {
                    console.error("Error al eliminar la cuenta");
                    return false;
                }
            },

            logout: async () => {
                try {
                    // Borrar el token del localStorage
                    localStorage.removeItem("token");

                    // Limpiar el estado del store 
                    setStore({
                        token: null,
                        user: null,
                        successMsg: null,
                        errorMsg: null,
                    });

                    return true; // Cierre de sesión exitoso
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                    return false; 
                }
            },
            getProducts: async () => {
                try {
                    const response = await fetch(apiUrl + "/products");
                    if (!response.ok)
                        throw new Error("Error al obtener los productos");

                    const data = await response.json();
                    setStore({ products: data });
                } catch (error) {
                    console.error("Error fetching products: ", error);
                }
            },
            addToCart: (product) => {
                const store = getStore();
                const newCart = [...store.cart, product];  // Añadir el producto al carrito
                setStore({ cart: newCart });
            },
        },
    };
};

export default getState;
