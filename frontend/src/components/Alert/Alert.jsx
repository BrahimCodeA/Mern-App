const Alert = ({ type, message }) => {
  const alertStyles = {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    color: type === "success" ? "green" : "red",
    backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
    border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
    textAlign: "center",
  };

  return <div style={alertStyles}>{message}</div>;
};

export default Alert;
