
import { useContext } from 'react';
import { dataContext } from '../Context/DataContext';
import Titles from './Titles'
import Rows from './Rows';

const Table = () => {

    const context = useContext(dataContext);

    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700 shadow-sm">
                <Titles titles={context.data.data[0]} />
            </thead>
            <tbody>
                <Rows infoRows = {context.data.data} />
            </tbody>
        </table>
    );
}

export default Table;