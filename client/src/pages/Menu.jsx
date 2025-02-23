import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contex/ThemeContext";
import menuData from "../pages/menuData";
import logo from "../assets/logo.png";
import AuthModal from "./AuthModal";
import Breadcrumbs from "../pages/Breadcrumbs";

const MenuPage = () => {
  const [filteredMenu, setFilteredMenu] = useState({});
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedComplements, setSelectedComplements] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredMenu(groupByCategory(menuData));
  }, []);

  const groupByCategory = (menuItems) => {
    return menuItems.reduce((result, category) => {
      result[category.category] = category.items;
      return result;
    }, {});
  };

  const handleSearch = () => {
    let filteredItems = menuData.flatMap((category) => category.items);

    if (query.trim()) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (minPrice) {
      filteredItems = filteredItems.filter((item) => item.price >= Number(minPrice));
    }

    if (maxPrice) {
      filteredItems = filteredItems.filter((item) => item.price <= Number(maxPrice));
    }

    if (selectedCategory) {
      filteredItems = filteredItems.filter((item) =>
        menuData.find((cat) => cat.category === selectedCategory)?.items.includes(item)
      );
    }

    setFilteredMenu(groupByCategory([{ category: "Resultados", items: filteredItems }]));
  };

  const handleOpenModal = (item, category) => {
    setSelectedItem({ ...item, category });
    setSelectedComplements([]);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleOpenMaps = () => {
    const mapsUrl = "https://www.google.com/maps/place/Taquer%C3%ADa+Colalambre/@21.1349955,-98.4144672,3a,50.7y,283.47h,95.72t/data=!3m7!1e1!3m5!1sRUiW18igZu3ViDDHkDQfwg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-5.7182727014298536%26panoid%3DRUiW18igZu3ViDDHkDQfwg%26yaw%3D283.46798647937777!7i16384!8i8192!4m7!3m6!1s0x85d7269274b9b783:0x7e6bbe1a3c88de86!8m2!3d21.1350343!4d-98.4143591!10e5!16s%2Fg%2F11c0py_n1c?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D";
    window.open(mapsUrl, "_blank"); // Abre Google Maps en una nueva pestaña
  };

  return (
    <div className="bg-white dark:bg-gray-900  dark:text-white min-h-screen">

    {/* HEADER */}
    <header className="flex flex-col shadow-md text-gray-950 bg-gray-950 dark:bg-gray-800 relative">
  
      {/* Barra principal del header */}
      <div className="flex flex-wrap justify-between items-center p-4 mt-4">
        
        <div className="flex items-center space-x-4">
            <button className="text-white text-2xl" onClick={() => navigate("/")}>
            <i className="fas fa-home"></i>
          </button>
          <img src={logo} alt="Logo" className="h-16 md:h-24 w-auto cursor-pointer" onClick={() => navigate("/")} />
          <div
            className="hidden md:flex items-center text-sm text-gray-400 dark:text-gray-300 cursor-pointer"
            onClick={handleOpenMaps} // Llama la función al hacer clic
          >
            <i className="fas fa-map-marker-alt text-xl text-white"></i>
            <span className="ml-1 text-white">Ubicación</span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full md:flex-1 mx-0 md:mx-6 my-4 md:my-0 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar por especialidad"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded-full border dark:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search text-xl text-white dark:text-white cursor-pointer"></i>
          </button>
          <button className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-500 transition ml-2" onClick={() => setShowFilters(!showFilters)}>
            Filtros
          </button>
        </div>

        {/* Iconos de ingreso, carrito y modo oscuro */}
        <div className="flex items-center space-x-6 text-white">
          <button onClick={toggleTheme} className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm hover:bg-gray-500 transition">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <div className="flex items-center text-sm cursor-pointer" onClick={() => setShowAuthModal(true)}>
            <i className="fas fa-user text-xl"></i>
            <span className="ml-2">Ingreso</span>
          </div>
          <i className="fas fa-shopping-cart text-xl"></i>
        </div>
        </div>
      </header>
      {/* Breadcrumbs en la parte blanca */}
  <div className="bg-white py-3 px-8  rounded-md flex items-center">
    <Breadcrumbs />
  </div>

      {/* Filtros Avanzados */}
      {showFilters && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-300">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block font-semibold">Precio Mínimo:</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="p-2 border rounded" />
            </div>
            <div>
              <label className="block font-semibold">Precio Máximo:</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="p-2 border rounded" />
            </div>
            <div>
              <label className="block font-semibold">Categoría:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 border rounded">
                <option value="">Todas</option>
                {menuData.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* MENÚ */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Menú del Restaurante</h1>
        {Object.keys(filteredMenu).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu[category].map((item) => (
                <div key={item.name} className="border rounded-lg p-4 shadow-md flex justify-between items-center cursor-pointer" onClick={() => handleOpenModal(item, category)}>
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500">{item.description}</p>
                    <p className="text-orange-600 font-bold">${item.price}</p>
                  </div>
                  <img src={item.image || "https://via.placeholder.com/300x200"} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE PLATILLO */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-10 relative w-120">
            <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-300" onClick={handleCloseModal}>
              ✖
            </button>
            <h3 className="text-lg font-semibold text-orange-500">{selectedItem.category}</h3>
            <img src={selectedItem.image || "https://via.placeholder.com/400"} alt={selectedItem.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <p className="text-gray-500">{selectedItem.description}</p>
            <p className="text-orange-600 font-bold mb-4">${selectedItem.price}</p>

            {/* Botones */}
            <div className="flex justify-between items-center mt-6">
              <button className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300">
                Agregar y Seguir Comprando
              </button>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition-all duration-300 ml-4">
                Agregar y Pagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AUTENTICACIÓN */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
          {/* Footer */}
              <footer className="bg-gray-950 dark:bg-gray-800 text-white py-6 px-4 mt-10">
                <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
                  {/* Logo */}
                  <div className="w-full md:w-auto flex justify-center md:justify-start">
                    <img src={logo} alt="Logo" className="h-12" />
                  </div>
        
                  {/* Enlaces */}
                  <div className="w-full md:w-auto flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-8">
                    <ul className="space-y-2 text-center md:text-left">
                      <li>Misión</li>
                      <li>Quiénes Somos</li>
                      <li>Visión</li>
                      
                    </ul>
                    <ul className="space-y-2 text-center md:text-left">
                      
                      <li>Términos y Condiciones</li>
                      <li>Aviso de Privacidad</li>
                    </ul>
                  </div>
        
                  {/* Redes Sociales */}
                  <div className="w-full md:w-auto flex justify-center md:justify-start space-x-4">
                    <i className="fab fa-facebook text-2xl"></i>
                    <i className="fab fa-instagram text-2xl"></i>
                    <i className="fab fa-tiktok text-2xl"></i>
                  </div>
                </div>
              </footer>
    </div>
  );
};

export default MenuPage;
