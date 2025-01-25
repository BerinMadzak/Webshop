import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../main";

export default function Login() {
    const [userData, setUserData] = useState({
        username: '',
        passwordConfirm: '',
    });

    const [errors, setErrors] = useState({});
    const { setAccount } = useContext(ShopContext);

    const navigate = useNavigate();

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
        if(!userData.password) errors.password = "Password is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(validate()) {
            try {
                const response = await fetch('http://localhost:8080/login', {
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
                    throw new Error('Failed to login');
                }

                const data = await response.json();
                console.log(data.message);
                setAccount(data.user);
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} />
                </div>
                {errors.username && <p>{errors.username}</p>}
            </div>

            <div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} />
                </div>
                {errors.password && <p>{errors.password}</p>}
            </div>

            <button type="submit">Login</button>
            <button type="button">Back</button>
        </form>
    );
}