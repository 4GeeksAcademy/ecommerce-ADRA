const apiUrl = process.env.BACKEND_URL + "/api";
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}],
				token: null,
           		user: null,
            	errorMsg: null,
            	successMsg: null,
			
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
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
			signup: async (name, last_name, email, password, mobile, address) => {


                try {
                    const response = await fetch(apiUrl + "/signup", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
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
                        
                        // Aquí puedes almacenar el token si el backend te lo envía después de registrarse
                        const token = data.token;
                        if (token) {
                            localStorage.setItem('token', token); // Guardar el token en localStorage
                            setStore({
                                token: token,
                                user: {
                                    name: name,
                                    last_name: last_name,
                                    email: email,
                                    mobile: mobile,
                                    address: address
                                },
                                successMsg: data.msg,
                                errorMsg: null
                            });
                        } else {
                            setStore({
                                successMsg: data.msg,
                                errorMsg: null
                            });
                        }
                    } else {
                        const errorData = await response.json();
                        setStore({
                            errorMsg: errorData.msg,
                            successMsg: null
                        });
                    }
                } catch (error) {
                    console.error("Error al registrar usuario:", error);
                    setStore({
                        errorMsg: "Error de conexión.",
                        successMsg: null
                    });
                }
            },

		}
	};
};

export default getState;
