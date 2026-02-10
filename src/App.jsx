import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import './assets/style.css';
import './App.css';

import Login from './views/Logn';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INIT_TEMPLATE_DATA = {
  id: '',
  title: '',
  category: '',
  origin_price: '',
  price: '',
  unit: '',
  description: '',
  content: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
  sugarDegree: '',
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templatepProduct, setTemplateProduct] = useState(INIT_TEMPLATE_DATA);
  const [modalType, setModalType] = useState('');
  const [pagination, setPagination] = useState({});
  const modalRef = useRef(null);

  async function getProducts(page = 1) {
    const productsData = await axios.get(
      `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
    );
    setProducts(productsData.data.products);
    setPagination(productsData.data.pagination);
  }

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('hexToken='))
      ?.split('=')[1];
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    modalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    (async function checkLogin() {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.log(error.response);
      }
    })();
  }, []);

  const openModal = (product, type) => {
    setModalType(type);
    setTemplateProduct({
      ...INIT_TEMPLATE_DATA,
      ...product,
    });
    modalRef.current.show();
  };
  const closeModal = () => {
    modalRef.current.hide();
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal(INIT_TEMPLATE_DATA, 'create')}
            >
              建立新的產品
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>
                      <span className={item.is_enabled ? 'text-success' : ''}>
                        {item.is_enabled ? '啟用' : '未啟用'}
                      </span>
                    </td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openModal(item, 'edit')}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openModal(item, 'delete')}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">尚無產品資料</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      ) : (
        <Login setIsAuth={setIsAuth} getProducts={getProducts} />
      )}
      <ProductModal
        modalType={modalType}
        templatepProduct={templatepProduct}
        getProducts={getProducts}
        closeModal={closeModal}
      />
    </>
  );
}

export default App;
