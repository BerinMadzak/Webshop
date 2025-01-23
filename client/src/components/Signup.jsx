import { useState } from "react";

export default function Signup() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
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
        if(!userData.username) errors.username = "Username is required";
        if(!userData.email) errors.email = "Email is required";
        else if(!/\S+@\S+\.\S+/) errors.email = "Email is invalid";
        if(!userData.password) errors.password = "Password is required";
        else if(userData.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if(userData.password !== userData.passwordConfirm) errors.password = "Passwords do not match";
        if(!userData.firstName) errors.firstName = "First name is required";
        if(!userData.lastName) errors.lastName = "Last name is required";
        if(!userData.phone) errors.phone = "Phone number is required";
        if(!userData.address) errors.address = "Address is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            try {
                const response = await fetch('http://localhost:8080/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if(!response.ok) {
                    throw new Error('Failed to create account');
                }

                const data = await response.json();
                console.log('Account created');
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} />
                </div>
                {errors.username && <p>{errors.username}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} />
                </div>
                {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} />
                </div>
                {errors.password && <p>{errors.password}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="passwordConfirm">Confirm Password: </label>
                    <input type="password" id="passwordConfirm" name="passwordConfirm" value={userData.passwordConfirm} onChange={handleChange} />
                </div>
                {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="firstName">First Name: </label>
                    <input type="text" id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} />
                </div>
                {errors.firstName && <p>{errors.firstName}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="lastName">Last Name: </label>
                    <input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} />
                </div>
                {errors.lastName && <p>{errors.lastName}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="phone">Phone: </label>
                    <input type="text" id="phone" name="phone" value={userData.phone} onChange={handleChange} />
                </div>
                {errors.phone && <p>{errors.phone}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="address">Address: </label>
                    <input type="text" id="address" name="address" value={userData.address} onChange={handleChange} />
                </div>
                {errors.address && <p>{errors.address}</p>}
            </div>

            <button type="submit">Create Account</button>
            <button type="button">Back</button>
        </form>
    );
}