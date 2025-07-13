import React, { useEffect, useState } from "react"; // Importing React hooks for state management and side effects
import axios from "axios"; // Importing axios for making HTTP requests
import ProductCard from "./ProductCard"; // Importing the ProductCard component to render individual product details
import classes from "./Product.module.css"; // Importing CSS module for custom styles
import Loader from "../Loader/Loader"; // Importing the Loader component to display during data loading

// Functional component to fetch and display a list of products
function Product() {
  // State to hold the fetched product data
  const [products, setProducts] = useState([]);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState(false);

  // useEffect hook to fetch products from the API when the component mounts
  useEffect(() => {
    setIsLoading(true); // Set loading to true when the API call begins
    axios
      .get("https://fakestoreapi.com/products") // Make a GET request to fetch products from FakeStore API
      .then((res) => {
        setProducts(res.data); // Store the fetched products in the state
        setIsLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.log("error: " + err); // Log any error that occurs during the API request
        setIsLoading(false); // Set loading to false even if an error occurs
      });
  }, [setProducts]); // Dependency array ensures this effect runs once when the component mounts

  return (
    <>
      {/* Conditional rendering: show Loader component while data is being loaded */}
      {isLoading ? (
        <Loader />
      ) : (
        <section className={classes.product__container}>
          {/* Map through the products array and render a ProductCard for each product */}
          {products?.map((singleProduct) => {
            return (
              <ProductCard
                renderAdd={true} // Prop to conditionally render an "Add to Cart" button or similar feature
                key={singleProduct.id} // Unique key for each product in the list
                product={singleProduct} // Pass the product data as a prop to ProductCard
                sliceDesc={true} // Prop to indicate whether to shorten the product description
              />
            );
          })}
        </section>
      )}
    </>
  );
}

export default Product; // Exporting the Product component for use in other parts of the application
