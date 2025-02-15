import { useNavigate } from "react-router-dom";

export default function Admin() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="admin-grid">
                <button onClick={() => navigate('/admin/product/add')}>Add Product</button>
                <button onClick={() => navigate('/admin/product/update')}>Update/Delete Product</button>
                <button onClick={() => navigate('/admin/categories')}>Categories</button>
                <button onClick={() => navigate('/admin/orders')}>Find Order</button>
                <button>Create Discount</button>
                <button>View All Discounts</button>
            </div>
        </div>
    );
}