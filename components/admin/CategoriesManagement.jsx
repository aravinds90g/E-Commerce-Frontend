"use client";
import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

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

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-commerce-imgs"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/db0blyudd/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
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

    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      if (isEditing) {
        setEditingCategory({ ...editingCategory, image: imageUrl });
      } else {
        setNewCategory({ ...newCategory, image: imageUrl });
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await fetch(
        "https://e-commerce-backend-1-2dj3.onrender.com/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCategory),
        }
      );

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setNewCategory({ name: "", description: "", image: "" });
        toast.success("Category added successfully");
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await fetch(
        `https://e-commerce-backend-1-2dj3.onrender.com/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCategory),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setCategories(
          categories.map((c) => (c.id === updated.id ? updated : c))
        );
        setEditingCategory(null);
        toast.success("Category updated successfully");
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const response = await fetch(
        `https://e-commerce-backend-1-2dj3.onrender.com/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
        toast.success("Category deleted successfully");
      } else if (response.status === 400) {
        toast.error("Category contains products. Remove products first.");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Category Management
        </h2>
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 border border-border bg-background text-foreground rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4 text-foreground">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Category Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-border bg-background text-foreground rounded-lg"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  : setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-border bg-background text-foreground rounded-lg"
                onChange={(e) => handleImageChange(e, !!editingCategory)}
                disabled={isUploading}
              />
              {isUploading && <span className="text-sm">Uploading...</span>}
            </div>
            {(editingCategory?.image || newCategory.image) && (
              <div className="mt-2">
                <img
                  src={
                    editingCategory ? editingCategory.image : newCategory.image
                  }
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-border bg-background text-foreground rounded-lg"
              value={
                editingCategory
                  ? editingCategory.description
                  : newCategory.description
              }
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  : setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
              }
              placeholder="Description"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingCategory ? (
            <>
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                disabled={!editingCategory.name || isUploading}
              >
                <Edit size={16} className="mr-2" />
                Update
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              disabled={!newCategory.name || isUploading}
            >
              <Plus size={16} className="mr-2" />
              Add Category
            </button>
          )}
        </div>
      </div>

      <div className="bg-muted rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-10 w-10 rounded-md object-cover mr-4"
                        />
                      )}
                      <span className="text-foreground text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {category.description || "No description"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted text-muted-foreground">
                      {
                        products.filter((p) => p.categoryId === category.id)
                          .length
                      }{" "}
                      products
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingCategory({ ...category })}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-muted-foreground"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;
