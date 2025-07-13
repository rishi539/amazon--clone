import React, { useEffect, useState } from "react";
import { productUrl } from "../../Api/endPoints"; // Importing API endpoint for fetching products
import LayOut from "../../components/LayOut/LayOut"; // Importing the layout component for consistent UI
import { useParams } from "react-router-dom"; // Importing hook to access route parameters
import ProductCard from "../../components/Product/ProductCard"; // Importing the ProductCard component to display the product details
import Loader from "../../components/Loader/Loader"; // Importing Loader to show while data is being fetched
import axios from "axios"; // Importing axios for making API requests

// Functional component to display details of a specific product
function ProductDetail() {
  const [product, setProduct] = useState({}); // State to store the product data
  const { productId } = useParams(); // Hook to get the 'productId' from the route parameters
  const [isLoading, setIsLoading] = useState(false); // State to track whether the product is being loaded

  // useEffect to fetch product details when the component mounts or when the productId changes
  useEffect(() => {
    setIsLoading(true); // Set loading to true before starting the API request
    axios
      .get(`${productUrl}/products/${productId}`) // Fetch product details using the productId from the URL
      .then((res) => {
        setProduct(res.data); // Set the product data to the state
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.log(err); // Log any errors during the API request
        setIsLoading(false); // Set loading to false in case of an error
      });
  }, [productId]); // Dependency array ensures this runs when productId changes

  return (
    <LayOut>
      {/* If loading is true, show the Loader component, otherwise show the product details */}
      {isLoading ? (
        <Loader />
      ) : (
        // Display the product using ProductCard component once the data is available
        <ProductCard
          key={product.id}
          titleUp={true} // Show the product title at the top
          product={product} // Pass the product data to ProductCard
          flex={true} // Use a flexible layout for the card
          add_description={true} // Display the full product description
          add_button={true} // (Optional) Display an "Add to Cart" button
          renderAdd={true} // Conditionally render the "Add to Cart" button
        />
      )}
    </LayOut>
  );
}

export default ProductDetail; // Exporting the component for use in other parts of the application
