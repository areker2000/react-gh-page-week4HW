import axios from 'axios';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ setIsAuth, getProducts }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const loginData = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = loginData.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      getProducts();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  }

  function handleInputChange(e) {
    setFormData((preData) => ({
      ...preData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form
            id="form"
            className="form-signin"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={(e) => handleInputChange(e)}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

export default Login;
