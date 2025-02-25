import { useContext, useState } from "react";
import { ShopContext } from "../main";

export default function Account() {
    const { account, setLoading, notification } = useContext(ShopContext);

    const [userData, setUserData] = useState({
        user_id: account.user_id,
        username: account.username,
        oldPassword: '',
        password: '',
        passwordConfirm: '',
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        let errors = {};
        if(!userData.password) errors.password = "Password is required";
        else if(userData.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if(userData.password !== userData.passwordConfirm) errors.password = "Passwords do not match";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND}/changePassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if(!response.ok) {
                    const errorData = await response.json();

                    if(errorData.errors.length > 0) {
                        let errs = {};
                        for(let i = 0; i < errorData.errors.length; i++) {
                            console.log(errorData.errors[i]);
                            errs[errorData.errors[i].path] = errorData.errors[i].msg;
                        }
                        console.log(errs);
                        setErrors(errs);
                    }
                    throw new Error('Failed to change password');
                }

                const data = await response.json();
                notification(data.message);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <h1>Account Information</h1>
            <div>
                <p>Email: <span className="bold-text">{account.email}</span></p>
                <p>First Name: <span className="bold-text">{account.first_name}</span></p>
                <p>Last Name: <span className="bold-text">{account.last_name}</span></p>
                <p>Phone Number: <span className="bold-text">{account.phone_number}</span></p>
                <p>Address: <span className="bold-text">{account.address}</span></p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
                <h1>Change Password</h1>
                <div>
                    <div>
                        <label htmlFor="oldPassword">Current Password: </label>
                        <input type="password" id="oldPassword" name="oldPassword" value={userData.oldPassword} onChange={handleChange} />
                    </div>
                    {errors.oldPassword && <p>{errors.oldPassword}</p>}
                </div>

                <div>
                    <div>
                        <label htmlFor="password">New Password: </label>
                        <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} />
                    </div>
                    {errors.password && <p>{errors.password}</p>}
                </div>

                <div>
                    <div>
                        <label htmlFor="passwordConfirm">Confirm New Password: </label>
                        <input type="password" id="passwordConfirm" name="passwordConfirm" value={userData.passwordConfirm} onChange={handleChange} />
                    </div>
                    {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
                </div>

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}