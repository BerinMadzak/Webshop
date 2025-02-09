import { useNavigate } from "react-router-dom";

export default function Admin() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="admin-grid">
                <button onClick={() => navigate('/admin/product/add')}>Add Product</button>
                <button onClick={() => navigate('/admin/product/update')}>Update Product</button>
                <button>Delete Product</button>
                <button>Add Category</button>
                <button>Delete Category</button>
                <button>Find Order</button>
                <button>Create Discount</button>
                <button>Delete Discount</button>
                <button>View All Discounts</button>
            </div>
        </div>
    );
}