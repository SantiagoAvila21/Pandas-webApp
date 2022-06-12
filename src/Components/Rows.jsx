import Row from "./Row";

const Rows = ({ infoRows }) => {

    return (
        <>
            {infoRows.map((row,index) => <Row key={"R" + index} infoRow={row} rowIndex={index} />)}
        </>
    );
}

export default Rows;