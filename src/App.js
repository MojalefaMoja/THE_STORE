import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Button from "react-bootstrap/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import MapScreen from "./screens/MapScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />{" "}
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Link to="/">
                <Navbar.Brand> THE_STORE </Navbar.Brand>{" "}
              </Link>{" "}
              <Navbar.Toggle aria="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart{" "}
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {" "}
                        {cart.cartItems.reduce(
                          (a, c) => a + c.quantity,
                          0
                        )}{" "}
                      </Badge>
                    )}{" "}
                  </Link>{" "}
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/profile"> User Profile </Link>{" "}
                      </NavDropdown.Item>{" "}
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/orderhistory"> Order History </Link>{" "}
                      </NavDropdown.Item>{" "}
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out{" "}
                      </Link>{" "}
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In{" "}
                    </Link>
                  )}{" "}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/admin/dashboard"> Dashboard </Link>{" "}
                      </NavDropdown.Item>{" "}
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/admin/products"> Products </Link>{" "}
                      </NavDropdown.Item>{" "}
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/admin/orders"> Orders </Link>{" "}
                      </NavDropdown.Item>{" "}
                      <NavDropdown.Item>
                        {" "}
                        <Link to="/admin/users"> Users </Link>{" "}
                      </NavDropdown.Item>{" "}
                    </NavDropdown>
                  )}{" "}
                </Nav>{" "}
              </Navbar.Collapse>{" "}
            </Container>{" "}
          </Navbar>{" "}
        </header>{" "}
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />{" "}
              <Route path="/cart" element={<CartScreen />} />{" "}
              <Route path="/search" element={<SearchScreen />} />{" "}
              <Route path="/signin" element={<SigninScreen />} />{" "}
              <Route path="/signup" element={<SignupScreen />} />{" "}
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />{" "}
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />{" "}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />{" "}
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />{" "}
              <Route path="/placeorder" element={<PlaceOrderScreen />} />{" "}
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>{" "}
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>{" "}
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>{" "}
              <Route path="/payment" element={<PaymentMethodScreen />}>
                {" "}
              </Route>{" "}
              {/* Admin Routes */}{" "}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>{" "}
              <Route path="/" element={<HomeScreen />} />{" "}
            </Routes>{" "}
          </Container>{" "}
        </main>{" "}
        <footer>
          <div className="text-center"> All rights reserved </div>{" "}
        </footer>{" "}
      </div>{" "}
    </BrowserRouter>
  );
}

export default App;
