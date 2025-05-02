import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Formulario enviado:", formData);
  };

  return (
    <div className="pattern-bg bg-cover bg-center min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl">Formulario de Registro</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmarContrasena"
              className="block text-sm font-medium"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
      </div>
    </div>
  </div>
  );
};

export default Register;