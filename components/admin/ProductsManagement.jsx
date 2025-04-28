"use client";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus ,Star } from "lucide-react";
import toast from "react-hot-toast";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
    const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    categoryId: "",
    rating:0
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-backend-1-2dj3.onrender.com/products"
      );
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-backend-1-2dj3.onrender.com/categories"
      );
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name &&
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.id === selectedCategory ||
      (!product.category && selectedCategory === "uncategorized");

    return matchesSearch && matchesCategory;
  });

 const uploadImageToCloudinary = async (file) => {
   if (!file) return null;

   setIsUploading(true);
   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", "e-commerce-imgs");

   try {
     const response = await fetch(
       "https://api.cloudinary.com/v1_1/db0blyudd/image/upload",
       {
         method: "POST",
         body: formData,
       }
     );
     const data = await response.json();
     console.log(data);
     
     return data.secure_url;
   } catch (error) {
     console.error("Error uploading image:", error);
     toast.error("Failed to upload image");
     return null;
   } finally {
     setIsUploading(false);
   }
 };

  const handleImageChange = async (e, isEditing) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEditing) {
      setEditingProduct({
        ...editingProduct,
        image: file, // Store file object temporarily
        imagePreview: URL.createObjectURL(file), // Create preview URL
      });
    } else {
      setNewProduct({
        ...newProduct,
        image: file, // Store file object temporarily
        imagePreview: URL.createObjectURL(file), // Create preview URL
      });
    }
  };



  // Add new product
  const handleAddProduct = async () => {
    try {
      // If we have a file to upload (instead of direct URL)
      let imageUrl = newProduct.image;

      if (newProduct.image instanceof File) {
        imageUrl = await uploadImageToCloudinary(newProduct.image);
        if (!imageUrl) return; // Stop if upload failed
      }

      const response = await fetch(
        "https://e-commerce-backend-1-2dj3.onrender.com/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newProduct,
            image: imageUrl,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            rating: parseFloat(newProduct.rating), // Include rating
            categoryId: newProduct.categoryId || null,
          }),
        }
      );

      if (response.ok) {
        await fetchProducts();
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          image: "",
          categoryId: "",
          rating: 0, // Reset rating
        });
        toast.success("Product added successfully");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // Update product
     const handleUpdateProduct = async () => {
       if (!editingProduct) return;

       try {
         let imageUrl = editingProduct.image;

         // Check if it's a new file upload
         if (editingProduct.image instanceof File) {
           imageUrl = await uploadImageToCloudinary(editingProduct.image);
           if (!imageUrl) return;
         }

         const response = await fetch(
           `https://e-commerce-backend-1-2dj3.onrender.com/products/${editingProduct.id}`,
           {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({
               ...editingProduct,
               image: imageUrl,
               price: parseFloat(editingProduct.price),
               stock: parseInt(editingProduct.stock),
               rating: parseFloat(editingProduct.rating), // Include rating
               categoryId: editingProduct.categoryId || null,
             }),
           }
         );

         if (response.ok) {
           await fetchProducts();
           setEditingProduct(null);
           toast.success("Product updated successfully");
         }
       } catch (error) {
         console.error("Error updating product:", error);
         toast.error("Failed to update product");
       }
     };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `https://e-commerce-backend-1-2dj3.onrender.com/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 400) {
        toast.error("This product has been ordered and cannot be deleted");
      } else if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const startEditing = (product) => {
    setEditingProduct({
      ...product,
      categoryId: product.category?.id || "",
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    <div className="p-4 md:p-6 bg-background text-foreground">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          Product Management
        </h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="w-full md:w-48">
            <select
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="uncategorized">Uncategorized</option>
            </select>
          </div>
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-border rounded-lg w-full bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Product */}
      <div className="bg-background border border-border p-4 md:p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Repeating pattern: labels and inputs */}
          {[
            ["Product Name", "name"],
            ["Description", "description"],
            ["Price", "price", "number"],
            ["Stock Quantity", "stock", "number"],
          ].map(([label, key, type = "text"]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {label}
              </label>
              <input
                type={type}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                value={editingProduct ? editingProduct[key] : newProduct[key]}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        [key]: e.target.value,
                      })
                    : setNewProduct({ ...newProduct, [key]: e.target.value })
                }
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              onChange={(e) => handleImageChange(e, !!editingProduct)}
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm mt-1">Uploading image...</p>}
            {(editingProduct?.imagePreview ||
              (editingProduct?.image &&
                typeof editingProduct.image === "string") ||
              newProduct.imagePreview ||
              (newProduct.image && typeof newProduct.image === "string")) && (
              <div className="mt-2">
                <img
                  src={
                    editingProduct
                      ? editingProduct.imagePreview || editingProduct.image
                      : newProduct.imagePreview || newProduct.image
                  }
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Rating (0-5)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                value={
                  editingProduct ? editingProduct.rating : newProduct.rating
                }
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const clampedValue = Math.min(
                    5,
                    Math.max(0, isNaN(value) ? 0 : value)
                  );

                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        rating: clampedValue,
                      })
                    : setNewProduct({ ...newProduct, rating: clampedValue });
                }}
              />
              <div className="flex items-center text-yellow-500">
                <Star size={16} className="fill-current" />
                <span className="ml-1 text-sm text-foreground">
                  {editingProduct
                    ? editingProduct.rating.toFixed(1)
                    : newProduct.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Category
            </label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              value={
                editingProduct
                  ? editingProduct.categoryId
                  : newProduct.categoryId
              }
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      categoryId: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, categoryId: e.target.value })
              }
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-2">
          {editingProduct ? (
            <>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                onClick={handleUpdateProduct}
                disabled={
                  !editingProduct.name ||
                  !editingProduct.description ||
                  !editingProduct.price ||
                  !editingProduct.stock ||
                  !editingProduct.image
                }
              >
                <Edit size={16} className="mr-2" />
                Update Product
              </button>
              <button
                className="bg-muted text-foreground px-4 py-2 rounded-lg border border-border hover:bg-border"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              onClick={handleAddProduct}
              disabled={
                !newProduct.name ||
                !newProduct.description ||
                !newProduct.price ||
                !newProduct.stock ||
                !newProduct.image
              }
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Product List - Mobile / Desktop */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-background border border-border p-4 rounded-lg shadow"
              >
                {/* Mobile product card layout */}
                <div className="flex items-start gap-4">
                  <img
                    className="h-16 w-16 rounded-md object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="font-semibold">
                        ${product.price.toFixed(2)}
                      </span>
                      <span
                        className={`px-2 text-xs font-semibold rounded-full ${
                          product.stock > 30
                            ? "bg-green-100 text-green-800"
                            : product.stock > 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                      <span className="text-muted-foreground">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => startEditing(product)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-background border border-border p-6 text-center text-muted-foreground rounded-lg shadow">
              No products found
            </div>
          )}
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg shadow overflow-hidden mb-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                {["Product", "Price", "Stock", "Category", "Actions"].map(
                  (title) => (
                    <th
                      key={title}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 30
                            ? "bg-green-100 text-green-800"
                            : product.stock > 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => startEditing(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
