import React, { useEffect, useState } from 'react';
import '../App.css';

const Home = () => {
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryIdFilter, setCategoryIdFilter] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const CategoryAPI = 'http://103.189.80.13:9091/api/v1/category/all';
  const AddCategoryAPI = 'http://103.189.80.13:9091/api/v1/category/new';
  const UpdateCategoryAPI = (id, catName) => `http://103.189.80.13:9091/api/v1/category?categoryId=${id}&categoryName=${catName}`;
  const DeleteCategoryAPI = (id) => `http://103.189.80.13:9091/api/v1/category?categoryId=${id}`;

  const fetchCategories = async () => {
    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch(CategoryAPI, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      if (result.success) {
        setCategory(result.data);
        setFilteredCategory(result.data);
      } else {
        console.error('Error:', result.message);
      }

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleFilterById = () => {
    if (categoryIdFilter.trim() === '') {
      setFilteredCategory(category);
    } else {
      const filtered = category.filter(item => item.id === parseInt(categoryIdFilter));
      setFilteredCategory(filtered);
    }
  };

  // Handle add update category
  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    const createdBy = localStorage.getItem('loggedInUser');

    const categoryData = {
      category: newCategory,
      createdAt: new Date().toISOString(),
      createdBy: createdBy || 'User',
    };

    try {
      const url = editingCategoryId ? UpdateCategoryAPI(editingCategoryId, newCategory) : AddCategoryAPI;
      const method = editingCategoryId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setNewCategory('');
        setEditingCategoryId(null); 
        fetchCategories(); 
        setShowAddForm(false);
      } else {
        console.error('Error:', result.message);
      }

    } catch (error) {
      console.error('Error:', error.message);
    }
  };
   //handle edit
  const handleEditCategory = (category) => {
    setNewCategory(category.category); 
    setEditingCategoryId(category.id);
    setShowAddForm(true); 
  };

  //handle delete
  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem('token'); 
    const confirmDelete = window.confirm("Are you sure want to delete this category?");
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(DeleteCategoryAPI(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        fetchCategories(); 
      } else {
        console.error('Error :', result.message);
      }

    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="homecontainer">
      <h1>CRUD Operation</h1>

      <div className="add-button">
        <button className="add-user" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : editingCategoryId ? 'Edit Category' : 'Add Category'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddOrUpdateCategory} className="form-container">
          <div className="form-category">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              placeholder="Enter category"
            />
             <button type="submit" className="submit-btn">
            {editingCategoryId ? 'Update' : 'Add'}
          </button>
          </div>
         
        </form>
      )}

      {/*filter by ID */}
      <div className="filter">
        <input
          type="text"
          placeholder="Filter by Category ID"
          value={categoryIdFilter}
          onChange={(e) => setCategoryIdFilter(e.target.value)}
        />
        <button onClick={handleFilterById}>Search</button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategory.length > 0 ? (
            filteredCategory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>
                  <button onClick={() => handleEditCategory(item)} className="edit-btn">Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteCategory(item.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No category found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
