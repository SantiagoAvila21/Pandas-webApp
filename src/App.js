import React, { useState, useEffect, useContext, createRef } from 'react';
import { get } from './Api';
import Loading from './Components/Loading';
import { dataContext } from './Context/DataContext';
import Table from './Components/Table'
import Select from './Components/Select';
import Error from './Components/Error';

let fulldata = [];
let args = {};

function App() {
  // Definicion de los estados de los filtros asi como las Referencias correspondientes
  const [loading, setLoading] = useState(true);
  const [muniS, setMuniS] = useState("");
  const municipio = createRef();
  const [sexoS, setSexoS] = useState("");
  const sexo = createRef();
  const [edadS, setEdadS] = useState("");
  const edad = createRef();
  const [estadoS, setEstadoS] = useState("");
  const estado = createRef();
  const context = useContext(dataContext);
  
  // Función que edita los argumentos que se pasaran a la peticion del servidor, y si no hay argumentos
  // Mandara la peticion del servidor de obtener todos los registros
  const handleSelectChange = (currentRef, setCurrentState, filterName) => {
    if(currentRef.current.value.includes("Escoge")){
      delete args[filterName];
      if(Object.entries(args).length === 0){
        getAllData();
        setCurrentState(currentRef.current.value);
        return ;
      }
    } else args[filterName] = currentRef.current.value;
    filter();
    setCurrentState(currentRef.current.value);
  }

  // Funcion que gestiona la peticion al servidor con los filtros y argumentos correspondientes en la variable global 'args'
  // y los envia al estado global de la aplicacion 
  const filter = () => {
    setLoading(true);

    let queryURL = '/api/data/filter?';
    for(const arg in args){
      queryURL += `${arg}=${args[arg]}&`
    }

    get(queryURL)
      .then(({data}) => {
        setLoading(false);
        context.setData(data.info);
      })
      .catch(err => {
        console.log(err)
      })
  }

  // Funcion que gestiona la peticion al servidor de toda la informacion y la manda al estado global de la aplicación
  const getAllData = () => {
    setLoading(true);
    get('/api/data')
      .then(({ data }) => {
        fulldata = data.info.data
        setLoading(false);
        context.setData(data.info);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Al inicio del render, realizar la petición de todas la información al servidor
  useEffect(() => {
    getAllData();
  },[]);


  return (
    <div className="bg-gradient-to-r from-sky-300 to-blue-500 flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-orange-500 font-bold mt-4 h-6 text-lg">Vacunados Dataframe COVID-19</h1>
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="m-5 mb-0 flex flex-row">
            <Select fulldata={fulldata} value={muniS} ref={municipio} handleChange={() => handleSelectChange(municipio, setMuniS, 'municipio')} title="Municipio" col="ciudad_municipio_nom" />
            <Select fulldata={fulldata} value={sexoS} ref={sexo} handleChange={() => handleSelectChange(sexo,setSexoS,"sexo")} title="Sexo" col="sexo" />
            <Select fulldata={fulldata} value={edadS} ref={edad} handleChange={() => handleSelectChange(edad,setEdadS,"edad")} title="Edad" col="edad" />
            <Select fulldata={fulldata} value={estadoS} ref={estado} handleChange={() => handleSelectChange(estado,setEstadoS,"estado")} title="Estado" col="estado" />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-4/5 my-9">
            {context.data.data.length === 0 && <Error />}
            {context.data.data.length !== 0 && <Table />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
