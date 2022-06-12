import React from 'react'

const Select = React.forwardRef(({title, fulldata, handleChange, value, col}, ref) => {


    return (
        <div className="flex flex-col w-full text-white mx-6">
            <h1 className="text-medium">{title}</h1>
            <select value={value} ref={ref} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value={`Escoge ${title}`}>Escoge {title}</option>
              { [...new Set(fulldata.map(obj => obj[col]))].map((muni, index) => <option value={muni} key={muni + index}>{muni}</option>)}
            </select>
        </div>
    );
})

export default Select;
