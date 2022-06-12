import React, { useState, useEffect, useContext, createRef } from 'react';
import { get } from './Api';
import Loading from './Components/Loading';
import { dataContext } from './Context/DataContext';
import Table from './Components/Table'
import Select from './Components/Select';

let fulldata = [];

function App() {

  const [loading, setLoading] = useState(true);
  const [muni, setMuni] = useState("");
  const municipio = createRef();
  const [sexoS, setSexoS] = useState("");
  const sexo = createRef();
  const [edadS, setEdadS] = useState("");
  const edad = createRef();
  const context = useContext(dataContext);
  
  const handleMunicipioChange = () => {
    console.log(municipio.current);
    if(municipio.current.value.includes("Escoge")){
      getAllData();
      setMuni(municipio.current.value);
      return;
    }
    filter(municipio.current.value);
    setMuni(municipio.current.value);
  }

  const filter = (muni) => {
    setLoading(true);
    get(`/api/data/filter?municipio=${muni}`)
      .then(({data}) => {
        setLoading(false);
        context.setData(data.info);
      })
      .catch(err => {
        console.log(err)
      })
  }

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

  useEffect(() => {
    getAllData();
  }, []);


  return (
    <div className="bg-gradient-to-r from-sky-300 to-blue-500 flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-orange-500 font-bold mt-4 h-6 text-lg">Vacunados Dataframe COVID-19</h1>
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="m-5 mb-0 flex flex-row">
            <Select fulldata={fulldata} value={muni} ref={municipio} handleChange={handleMunicipioChange} title="Municipio" col="ciudad_municipio_nom" />
            <Select fulldata={fulldata} value={sexoS} ref={sexo} title="Sexo" col="sexo" />
            <Select fulldata={fulldata} value={edadS} ref={edad} title="Edad" col="edad" />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-4/5 my-9">
            <Table />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
