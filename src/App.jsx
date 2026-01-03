import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

/* ==================== LocalStorage Utils ==================== */
const STORAGE_KEY = "evalData";
const getRestaurants = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const saveRestaurants = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

/* ==================== Protected Route ==================== */
function ProtectedRoute({ children, role, user }) {
  if (!user) return <Navigate to="/" />;
  if (user !== role) return <Navigate to="/" />;
  return children;
}

/* ==================== Login Page ==================== */
function Login({ setUser }) {
  const navigate = useNavigate();
  const emailRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "admin1234") {
      setUser("admin");
      navigate("/admin/dashboard");
    } else if (email === "customer@gmail.com" && password === "customer1234") {
      setUser("customer");
      navigate("/customers/dashboard");
    } else {
      alert("Wrong email or password");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        ref={emailRef}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

/* ==================== Restaurant Card ==================== */
function RestaurantCard({ data, isAdmin, onDelete, onUpdate }) {
  return (
    <div style={{ border: "1px solid gray", padding: 10 }}>
      <img src={data.image} width="100%" />
      <h4>{data.restaurantName}</h4>
      <p>{data.address}</p>
      <p>{data.type}</p>
      <p>Parking: {data.parkingLot ? "Yes" : "No"}</p>
      {isAdmin && (
        <>
          <button onClick={() => onUpdate(data.restaurantID)}>Update</button>{" "}
          <button onClick={() => onDelete(data.restaurantID)}>Delete</button>
        </>
      )}
    </div>
  );
}

/* ==================== Admin Dashboard ==================== */
function AdminDashboard() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(getRestaurants());

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("Rajasthani");
  const [parkingLot, setParkingLot] = useState(true);

  useEffect(() => {
    setRestaurants(getRestaurants());
  }, []);

  const addRestaurant = () => {
    if (!name || !address) {
      alert("Please fill all required fields");
      return;
    }
    const newRestaurant = {
      restaurantID: Date.now(),
      restaurantName: name,
      address,
      type,
      parkingLot,
      image:
        "https://coding-platform.s3.amazonaws.com/dev/lms/tickets/7524df6e-46fa-4506-8766-eca8da47c2f1/2izhqnTaNLdenHYF.jpeg",
    };
    const updated = [...restaurants, newRestaurant];
    saveRestaurants(updated);
    setRestaurants(updated);
    setName("");
    setAddress("");
    alert("Restaurant added successfully");
  };

  const deleteRestaurant = (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    const updated = restaurants.filter((r) => r.restaurantID !== id);
    saveRestaurants(updated);
    setRestaurants(updated);
    alert("Deleted successfully");
  };

  const updateRestaurant = (id) => {
    navigate(`/admin/restaurants/update/$ {id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      {/* Add Restaurant Form */}
      <div style={{ marginBottom: 20, border: "1px solid black", padding: 10 }}>
        <h3>Add Restaurant</h3>
        <input
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <label>Type: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Rajasthani</option>
          <option>Gujarati</option>
          <option>Mughlai</option>
          <option>Jain</option>
          <option>Thai</option>
          <option>North Indian</option>
          <option>South Indian</option>
        </select>
        <br />
        <label>Parking Lot: </label>
        <select
          value={parkingLot}
          onChange={(e) => setParkingLot(e.target.value === "true")}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <br />
        <br />
        <button onClick={addRestaurant}>Add Restaurant</button>
      </div>

      {/* Restaurant Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {restaurants.map((r) => (
          <RestaurantCard
            key={r.restaurantID}
            data={r}
            isAdmin={true}
            onDelete={deleteRestaurant}
            onUpdate={updateRestaurant}
          />
        ))}
      </div>
    </div>
  );
}

/* ==================== Update Restaurant Page ==================== */
function UpdateRestaurant({ restaurants, setRestaurants }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const restaurantID = parseInt(id);
  const r = restaurants.find((r) => r.restaurantID === restaurantID);

  const [name, setName] = useState(r?.restaurantName || "");
  const [address, setAddress] = useState(r?.address || "");
  const [type, setType] = useState(r?.type || "Rajasthani");
  const [parkingLot, setParkingLot] = useState(r?.parkingLot || true);

  const handleUpdate = () => {
    if (!confirm("Are you sure you want to update?")) return;
    if (!name || !address) {
      alert("Please fill all required fields");
      return;
    }
    const updated = restaurants.map((rest) =>
      rest.restaurantID === restaurantID
        ? { ...rest, restaurantName: name, address, type, parkingLot }
        : rest
    );
    saveRestaurants(updated);
    setRestaurants(updated);
    alert("Updated successfully");
    navigate("/admin/dashboard");
  };

  if (!r) return <p>Restaurant not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Restaurant</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <input value={address} onChange={(e) => setAddress(e.target.value)} />
      <br />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Rajasthani</option>
        <option>Gujarati</option>
        <option>Mughlai</option>
        <option>Jain</option>
        <option>Thai</option>
        <option>North Indian</option>
        <option>South Indian</option>
      </select>
      <br />
      <select
        value={parkingLot}
        onChange={(e) => setParkingLot(e.target.value === "true")}
      >
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
      <br />
      <br />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

/* ==================== Customer Dashboard ==================== */
function CustomerDashboard() {
  const [restaurants, setRestaurantsState] = useState(getRestaurants());

  useEffect(() => {
    setRestaurantsState(getRestaurants());
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {restaurants.map((r) => (
          <RestaurantCard key={r.restaurantID} data={r} />
        ))}
      </div>
    </div>
  );
}

/* ==================== Main App ==================== */
function App() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState(getRestaurants());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin" user={user}>
              <AdminDashboard restaurants={restaurants} setRestaurants={setRestaurants} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/restaurants/update/:id"
          element={
            <ProtectedRoute role="admin" user={user}>
              <UpdateRestaurant restaurants={restaurants} setRestaurants={setRestaurants} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/dashboard"
          element={
            <ProtectedRoute role="customer" user={user}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

/* ==================== Render ==================== */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);