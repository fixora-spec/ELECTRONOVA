import { useState } from "react";
import "./App.css";
import Encabezado from "./components/organisms/Encabezado";
import PieDePagina from "./components/organisms/PieDePagina";
import { Route, Routes } from "react-router-dom";
import PaginaInicio from "./components/pages/PaginaInicio";
import Productos from "./components/pages/Productos";
import Categorias from "./components/pages/Categorias";
import Nosotros from "./components/pages/Nosotros";
import Contacto from "./components/pages/Contacto";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <>
      <Encabezado theme={theme} setTheme={setTheme} />
      <Routes>
        <Route Component={PaginaInicio} path={"/"} />
        <Route Component={Productos} path={"/productos"} />
        <Route Component={Categorias} path={"/categorias"} />
        <Route Component={Nosotros} path={"/nosotros"} />
        <Route Component={Contacto} path={"/contacto"} />
      </Routes>
      <PieDePagina />
    </>
  );
}

export default App;