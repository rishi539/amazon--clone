import React from "react"; // Importing React
import { FadeLoader } from "react-spinners"; // Importing the FadeLoader component from the react-spinners library

// Functional component that displays a loading spinner
function Loader() {
  return (
    <div
      style={{
        display: "flex", // Flexbox for centering the loader
        alignItems: "center", // Vertically centers the loader
        justifyContent: "center", // Horizontally centers the loader
        height: "50vh", // Sets the height of the container to half of the viewport height
      }}
    >
      {/* Rendering the FadeLoader spinner with custom color */}
      <FadeLoader color="#ff9900" />
    </div>
  );
}

export default Loader; // Exporting the Loader component for use in other parts of the application
