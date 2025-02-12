import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";

export default function Categories() {
    const [categoryData, setCategoryData] = useState({
        name: '',
    });
    const [categoryDataUpdate, setCategoryDataUpdate] = useState({
        name: '',
        category_id: ''
    });

    const [errors, setErrors] = useState({});
    const [errorsUpdate, setErrorsUpdate] = useState({});
    const [categories, setCategories] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);

    const { setLoading, notification } = useContext(ShopContext);

    useEffect(() => {
        fetch('http://localhost:8080/categories').then(res => res.json()).then(json => setCategories(json));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;
        setCategoryDataUpdate((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        let errors = {};
        if(!categoryData.name) errors.name = "Name is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateUpdate = () => {
        let errors = {};
        if(!categoryDataUpdate.name) errors.name = "Name is required";

        setErrorsUpdate(errors);
        return Object.keys(errors).length === 0;
    };

    function updateCategoryList(id = -1) {
        fetch('http://localhost:8080/categories').then(res => res.json()).then(json => {
            if(id === 0) setCurrentCategory(json[id]);
            else if(id > 0) setCurrentCategory(json.find(c => c.category_id == id));
            setCategories(json);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(categoryData)
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
                    throw new Error('Failed to add category');
                }

                const data = await response.json();
                notification(data.message);
                updateCategoryList();
                console.log('Category added');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        if(validateUpdate()) {
            try {
                setLoading(true);
                categoryDataUpdate.category_id = document.getElementById("category_id").value;
                const response = await fetch('http://localhost:8080/categories', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(categoryDataUpdate)
                });

                if(!response.ok) {
                    const errorDataUpdate = await response.json();

                    if(errorDataUpdate.errors.length > 0) {
                        let errs = {};
                        for(let i = 0; i < errorDataUpdate.errors.length; i++) {
                            errs[errorDataUpdate.errors[i].path] = errorDataUpdate.errors[i].msg;
                        }
                        console.log(errs);
                        setErrorsUpdate(errs);
                    }
                    throw new Error('Failed to update category');
                }

                const data = await response.json();
                notification(data.message);
                updateCategoryList(categoryDataUpdate.category_id);
                console.log('Category updated');
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
            const cData = {
                category_id: currentCategory.category_id,
                name: currentCategory.name
            };
            const response = await fetch('http://localhost:8080/categories', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cData)
            });

            if(!response.ok) {
                throw new Error('Failed to delete category');
            }

            const data = await response.json();
            notification(data.message);
            updateCategoryList(0);
            console.log('Product deleted');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleCategoryChange = (e) => {
        const category = categories.find(p => p.category_id == e.target.value);
        setCurrentCategory(category);
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
                    <p>Are you sure you want to delete <span className="special-text">{currentCategory && currentCategory.name}</span>?</p>
                    <form method="dialog">
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={toggleDialog}>No</button>
                    </form>
                </dialog>
            </div>
            <form className="signup-form center" onSubmit={handleSubmit}>
                <h1>Add A New Category</h1>
                <div>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input type="text" id="name" name="name" value={categoryData.name} onChange={handleChange} />
                    </div>
                    {errors.name && <p>{errors.name}</p>}
                </div>

                <button type="submit">Add Category</button>
            </form>
            <div>
                <h1>Update Category</h1>
                <select name="category_id" id="category_id" onChange={handleCategoryChange}>
                    {categories && 
                        categories.map(c => <option value={c.category_id} key={c.category_id}>{c.name}</option>)
                    }
                </select>
                <form className="signup-form center" onSubmit={handleSubmitUpdate}>
                    <div>
                        <div>
                            <label htmlFor="name">Name: </label>
                            <input type="text" id="name" name="name" value={categoryDataUpdate.name} onChange={handleChangeUpdate} />
                        </div>
                        {errorsUpdate.name && <p>{errorsUpdate.name}</p>}
                    </div>

                    <button type="submit" disabled={categories && categories.length === 0}>Update Category</button>
                    <button type="button" onClick={toggleDialog} disabled={categories && categories.length === 0}>Delete Category</button>
                </form>
            </div>
        </div>
    );
}