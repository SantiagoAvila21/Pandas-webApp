

const Row = ({ infoRow, rowIndex }) => {
    return (
        <tr className="border-b border-2 dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
            {Object.values(infoRow).map((col, index) => <td className="px-6 py-4" key={index + "," + rowIndex}>{col}</td>)}
        </tr>
    );
}

export default Row;