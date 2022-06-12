

const Titles = ({titles}) => {
    return (
        <tr>
            {Object.keys(titles).map((title,index) => <th className="px-6 py-3" key={index}>{title}</th>)}
        </tr>
    );
}

export default Titles;