import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";

export default function UpdateProduct() {
    const [productData, setProductData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        image_url: '',
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);

    const { setLoading, notification } = useContext(ShopContext);
    
    useEffect(() => {
        fetch('http://localhost:8080/categories').then(res => res.json()).then(json => setCategories(json));
        fetch('http://localhost:8080/products').then(res => res.json()).then(json => {
            setProduct(json[0]);
            setProducts(json);
        });
    }, []);

    function updateProductList(refresh = false) {
        fetch('http://localhost:8080/products').then(res => res.json()).then(json => {
            if(refresh) setProduct(json[0]);
            setProducts(json);
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (e) => {
        const product = products.find(p => p.product_id == e.target.value);
        setProduct(product);
    }

    function setProduct(product) {
        setCurrentProduct(product);
        setProductData({
            name: product.name,
            category_id: product.category_id,
            description: product.description,
            price: product.price,
            image_url: product.image_url
        });
    }

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
                productData.product_id = currentProduct.product_id;
                const response = await fetch('http://localhost:8080/products', {
                    method: 'PUT',
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
                updateProductList();
                console.log('Product added');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    async function handleDelete() {
        toggleDialog();
        try {
            setLoading(true);
            const pData = {
                product_id: currentProduct.product_id,
                name: currentProduct.name
            };
            const response = await fetch('http://localhost:8080/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pData)
            });

            if(!response.ok) {
                throw new Error('Failed to delete product');
            }

            const data = await response.json();
            notification(data.message);
            updateProductList(true);
            console.log('Product deleted');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function toggleDialog() {
        document.querySelector(".dialog-overlay").classList.toggle('hidden');

        const dialog = document.querySelector(".delete-dialog");
        if(!dialog.open) dialog.show();
        else dialog.close();
    }

    return (
        <div>
            <div className="dialog-overlay hidden">
                <dialog className="delete-dialog">
                    <p>Are you sure you want to delete <span className="special-text">{currentProduct && currentProduct.name}</span>?</p>
                    <form method="dialog">
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={toggleDialog}>No</button>
                    </form>
                </dialog>
            </div>
            <h1>Update Product</h1>
            <select onChange={handleProductChange}>
                {products &&
                    products.map(p => <option value={p.product_id} key={p.product_id}>{p.name}</option>)
                }
            </select>
            <form className="signup-form center" onSubmit={handleSubmit}>
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
                        <select name="category_id" id="category_id" value={productData.category_id} onChange={handleChange}>
                            {categories && 
                                categories.map(c => <option value={c.category_id} key={c.category_id}>{c.name}</option>)
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
                        <input type="number" id="price" name="price" value={productData.price} onChange={handleChange} />
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

                <button type="submit">Update Product</button>
            </form>
            <button className="delete-button" onClick={toggleDialog}>Delete product</button>
        </div>
    );
}