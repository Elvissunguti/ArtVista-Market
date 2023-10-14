import React from "react";

const Login = () => {
    return (
        <section>
            <div>
                <div>
                    <h1>Login</h1>
                    <div>
                        <form>
                            <input
                              type="text"
                              name="email"
                              placeholder="Enter email"
                              required
                              className=""
                            />
                            <input
                              type="password"
                              name="password"
                              placeholder="Enter Password"
                              required
                              className="className"
                            />
                            <button type="submit">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Login;