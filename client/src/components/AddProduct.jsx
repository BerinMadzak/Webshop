import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";

export default function AddProduct() {
    const [productData, setProductData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        image_url: '',
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState(null);

    const { setLoading, notification } = useContext(ShopContext);
    
    useEffect(() => {
        fetch('http://localhost:8080/categories').then(res => res.json()).then(json => setCategories(json));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        let errors = {};
        if(!productData.name) errors.name = "Name is required";
        if(!productData.price) errors.price = "Price is required";
        if(!productData.image_url) errors.image_url = "Image is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            try {
                setLoading(true);
                productData.category_id = document.getElementById("category_id").value;
                const response = await fetch('http://localhost:8080/addProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });

                if(!response.ok) {
                    const errorData = await response.json();

                    if(errorData.errors.length > 0) {
                        let errs = {};
                        for(let i = 0; i < errorData.errors.length; i++) {
                            errs[errorData.errors[i].path] = errorData.errors[i].msg;
                        }
                        console.log(errs);
                        setErrors(errs);
                    }
                    throw new Error('Failed to add product');
                }

                const data = await response.json();
                notification(data.message);
                console.log('Product added');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form className="signup-form center" onSubmit={handleSubmit}>
            <h1>Add Product</h1>
            <div>
                <div>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" name="name" value={productData.name} onChange={handleChange} />
                </div>
                {errors.name && <p>{errors.name}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="category_id">Category: </label>
                    <select name="category_id" id="category_id">
                        {categories && 
                            categories.map(c => <option value={c.category_id}>{c.name}</option>)
                        }
                    </select>
                </div>
            </div>

            <div>
                <div>
                    <label htmlFor="description">Description: </label>
                    <textarea name="description" id="description" value={productData.description} onChange={handleChange}></textarea>
                </div>
            </div>

            <div>
                <div>
                    <label htmlFor="price">Price: </label>
                    <input type="numer" min={0} id="price" name="price" value={productData.price} onChange={handleChange} />
                </div>
                {errors.price && <p>{errors.price}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="image_url">Image URL: </label>
                    <input type="text" id="image_url" name="image_url" value={productData.image_url} onChange={handleChange} />
                </div>
                {errors.image_url && <p>{errors.image_url}</p>}
            </div>

            <button type="submit">Add Product</button>
        </form>
    );
}