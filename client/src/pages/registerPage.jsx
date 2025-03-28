import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";
import { useEffect, useState, useRef } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useTheme } from "../contex/ThemeContext"; // Importa el contexto para el modo oscuro
import ReCAPTCHA from "react-google-recaptcha";
import '../styles/medidor.css';
import Breadcrumbs from "../pages/Breadcrumbs";
import Footer from './Footer.jsx';
import Header from './PrincipalNavBar'; // Importa el componente Header

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input); // Sanitiza los valores ingresados por el usuario
};

function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm();
    const { signup, isAuthenticated, errors: registerErrors, setErrors } = useAuth();
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*(\d)\1{2})(?!.*([a-zA-Z])\2{2})(?!.*(\W)\3{2})(?!.*0123456789)(?!.*123456789)(?!.*23456789)(?!.*34567890)(?!.*45678901)(?!.*987654321)(?!.*98765432)[A-Za-z\d\W_]{12,}$/;

    const [passwordStrength, setPasswordStrength] = useState("");
    const [email, setEmail] = useState(null);
    const { isDarkMode } = useTheme(); // Usar el estado del modo oscuro

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false); // Nuevo estado para el menú desplegable

    // Estado para guardar el token del reCAPTCHA
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    const evaluatePasswordStrength = (password) => {
        if (password.length < 8) {
            setPasswordStrength("weak");
        } else if (passwordRegex.test(password)) {
            setPasswordStrength("strong");
        } else {
            setPasswordStrength("medium");
        }
        clearErrors("password");
    };
    
    useEffect(() => {
        if (isAuthenticated && registerErrors.length === 0 && email) {
            navigate("/verificar-codigo", { state: { email } });
        }
    }, [isAuthenticated, registerErrors, email, navigate]);

    const onSubmit = handleSubmit(async (values) => {
        if (!recaptchaToken) {
            alert("Por favor verifica que no eres un robot.");
            return;
        }
        
        clearErrors();
        localStorage.setItem("email", values.email);

        // Sanitizar los datos antes de enviarlos
        const sanitizedValues = {
        username: sanitizeInput(values.username),
        nombre: sanitizeInput(values.nombre),
        apellidos: sanitizeInput(values.apellidos),
        email: sanitizeInput(values.email),
        password: values.password,
        recaptchaToken
         };

         await signup(sanitizedValues).catch((error) => {
            console.log(error.response?.data || "Unexpected error");
        });

        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    });

    const clearErrors = () => {
        setErrors([]);
    };

    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    return (
        <div className={`bg-white dark:bg-gray-900 dark:text-white min-h-screen`}>
      {/* Header */}
      <Header />
    <Breadcrumbs />
  
        <div className={`min-h flex items-center justify-center px-4 ${isDarkMode ? "bg-gray-900 text-white" : " text-gray-800"}`}>
            <div className={`w-full max-w-3xl p-8 md:p-10 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                {/* Mostrar errores de registro */}
                {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
                    <div className={`rounded-lg py-2 mb-4 ${isDarkMode ? "bg-red text-white" : "bg-red text-white"}`} key={i}>
                        {error.message || error}
                    </div>
                ))}

                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                    Crear cuenta
                </h2>

                {/* Formulario en dos columnas */}
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            {...register("username", { required: true })}
                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)} 
                            className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Nombre</label>
                        <input
                            type="text"
                            {...register("nombre", { required: true })}
                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)} 
                            className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                            placeholder="Nombre"
                        />
                        {errors.nombre && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Apellidos</label>
                        <input
                            type="text"
                            {...register("apellidos", { required: true })}
                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)} 
                            className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                            placeholder="Apellidos"
                        />
                        {errors.apellidos && (
                            <p className="text-red text-sm mt-1">Este campo es obligatorio</p>
                        )}
                    </div>

                    <div>
    <label className="block text-sm font-bold mb-1">Correo electrónico</label>
    <input
        type="email"
        {...register("email", {
            required: "El correo electrónico es obligatorio.",
            pattern: {
                // Expresión regular más estricta con dominios comunes
                value: /^[^\s@]+@(uthh\.edu\.mx|gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/,
                message: "Por favor, introduce un correo electrónico válido con un dominio válido.",
            },
        })}
        onChange={(e) => e.target.value = sanitizeInput(e.target.value)} 
        className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-gray-800"
        }`}
        placeholder="Correo electrónico"
    />
    {errors.email && (
        <p className="text-red text-sm mt-1">{errors.email.message}</p>
    )}
</div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Contraseña</label>
                        <div className="grid relative">
                            <input
                                type={!isPasswordVisible ? "password" : "text"}
                                {...register("password", {
                                    required: true,
                                    minLength: 12,
                                    validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
                                    pattern: {
                                        value: passwordRegex,
                                        message: "Verifique que su contraseña cumpla con todos los puntos para ser una contrasseña segura"
                                    }
                                })}
                                
                                className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                                placeholder="Contraseña"
                                onFocus={() => setShowPasswordRequirements(true)} // Muestra el menú al enfocar
                                onChange={(e) => evaluatePasswordStrength(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-0 top-0 bottom-0 w-20 bg-transparent border-none cursor-pointer px-4 text-lg text-gray-600 transition ease-in-out duration-300 grid place-content-center bg-blue-100"
                            >
                                {isPasswordVisible ? (
                                    <EyeSlashIcon className="icon-password size-6" />
                                ) : (
                                    <EyeIcon className="icon-password size-6" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red text-sm mt-1">{errors.password.message}</p>
                        )}

                        {/* Menú desplegable para requisitos */}
                        {showPasswordRequirements && (
                            <div className={`mt-2 p-3 rounded-md ${isDarkMode
                                ? "bg-gray-700 text-white border-gray-600"
                                : "bg-gray-100 border-gray-300 text-gray-800"
                                } border`}>
                                <p className="text-sm font-bold mb-1">Requisitos de la contraseña:</p>
                                <ul className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-600"} list-disc list-inside`}>
                                    <li>Al menos 12 caracteres</li>
                                    <li>Una letra mayúscula</li>
                                    <li>Una letra minúscula</li>
                                    <li>Un número</li>
                                    <li>Un carácter especial</li>
                                    <li>No patrones consecutivos</li>
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordRequirements(false)} // Oculta el menú al hacer clic
                                    className="mt-2 text-sm text-blue-500 hover:underline"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}

                        <p>Fortaleza de la contraseña:</p>
                        <div className={`password-strength-bar ${passwordStrength}`} />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Confirmar contraseña</label>
                        <div className="grid relative">
                            <input
                                type={!isConfirmPasswordVisible ? "password" : "text"}
                                {...register("Confirmpassword", {
                                    required: true,
                                    validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
                                })}
                                className={`w-full px-4 py-2 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-800"}`}
                                placeholder="Confirmar contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute right-0 top-0 bottom-0 w-20 bg-transparent border-none cursor-pointer px-4 text-lg text-gray-600 transition ease-in-out duration-300 grid place-content-center bg-blue-100"
                            >
                                {isConfirmPasswordVisible ? (
                                    <EyeSlashIcon className="icon-password size-6" />
                                ) : (
                                    <EyeIcon className="icon-password size-6" />
                                )}
                            </button>
                        </div>

                        {errors.Confirmpassword && (
                            <p className="text-red text-sm mt-1">
                                {errors.Confirmpassword.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LdPD2cqAAAAAJwcFkgMCs0aYpq0U6cVU-oeeTid"
                            onChange={onRecaptchaChange}
                            onExpired={() => setRecaptchaToken(null)}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 grid place-items-center">
                        <button
                            type="submit"
                            className="w-full md:w-80 h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-full transition duration-300"
                        >
                            CREAR
                        </button>
                    </div>
                </form>
                    <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
                    <p className="text-xs">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-orange-600 hover:underline">
                        iniciar sesión
                        </Link>
                    </p>
                </div>
            </div >
        </div >
<Footer/>
        </div>
    );
}

export default RegisterPage; 


