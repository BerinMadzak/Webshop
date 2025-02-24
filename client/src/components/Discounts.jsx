import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";

export default function Discounts() {
    const [discountData, setDiscountData] = useState({
        product_id: '',
        amount: '',
        end_date: ''
    });

    const [errors, setErrors] = useState({});
    const [discounts, setDiscounts] = useState(null);
    const [products, setProducts] = useState(null);

    const { setLoading, notification } = useContext(ShopContext);

    useEffect(() => {
        fetch('http://localhost:8080/products').then(res => res.json()).then(json => setProducts(json));
        updateDiscountList();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscountData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const validate = () => {
        let errors = {};
        if(!discountData.amount) errors.amount = "Amount is required";
        if(!discountData.end_date) errors.end_date = "End date is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    function updateDiscountList() {
        fetch('http://localhost:8080/discounts').then(res => res.json()).then(json => setDiscounts(json));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            try {
                setLoading(true);
                if(discountData.product_id === '' && products.length > 0) discountData.product_id = products[0].product_id.toString();
                const response = await fetch('http://localhost:8080/discounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(discountData)
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
                    throw new Error('Failed to add discount');
                }

                const data = await response.json();
                notification(data.message);
                updateDiscountList();
                console.log('Discount added');
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
            const discount_id = document.getElementById("discounts").value;
            const cData = {
                discount_id
            };
            const response = await fetch('http://localhost:8080/discounts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cData)
            });

            if(!response.ok) {
                throw new Error('Failed to delete discount');
            }

            const data = await response.json();
            notification(data.message);
            updateDiscountList(0);
            console.log('Discount deleted');
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
                    <p>Are you sure you want to delete the selected discount?</p>
                    <form method="dialog">
                        <button onClick={handleDelete}>Yes</button>
                        <button onClick={toggleDialog}>No</button>
                    </form>
                </dialog>
            </div>
            <form className="signup-form center" onSubmit={handleSubmit}>
                <h1>Create A New Discount</h1>
                <select name="product_id" id="product_id" onChange={handleChange}>
                    {products &&
                        products.map(p => <option value={p.product_id} key={p.product_id}>{p.name}</option>)
                    }
                </select>
                {errors.product_id && <p>{errors.product_id}</p>}
                <div>
                    <div>
                        <label htmlFor="amount">Amount (%): </label>
                        <input type="number" id="amount" name="amount" value={discountData.amount} onChange={handleChange} />
                    </div>
                    {errors.amount && <p>{errors.amount}</p>}
                </div>
                <div>
                    <div>
                        <label htmlFor="end_date">End Date: </label>
                        <input type="date" id="end_date" name="end_date" value={discountData.end_date} onChange={handleChange} />
                    </div>
                    {errors.end_date && <p>{errors.end_date}</p>}
                </div>

                <button type="submit">Create Discount</button>
            </form>
            <div className="delete-discount">
                <h1>Delete Discount</h1>
                <select name="discounts" id="discounts">
                    {discounts && 
                        discounts.map(d => <option value={d.discount_id} key={d.discount_id}>{d.amount + "% - " + d.name}</option>)
                    }
                </select>

                <button type="button" onClick={toggleDialog} disabled={discounts && discounts.length === 0}>Delete Discount</button>
            </div>
        </div>
    );
}