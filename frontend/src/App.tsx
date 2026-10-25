
import { useEffect, useState } from 'react';

type Vehicle = {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
};

const API = 'http://localhost:3000/api';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [make, setMake] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  async function authenticate() {
    try {
      const response = await fetch(
        `${API}/auth/${isRegistering ? 'register' : 'login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Authentication failed');
        return;
      }

      if (isRegistering) {
        setMessage('Registration successful. Please log in.');
        setIsRegistering(false);
        return;
      }

      setToken(data.token);
      setMessage('Logged in successfully');
    } catch {
      setMessage('Cannot connect to the backend. Check that it is running.');
    }
  }

  async function loadVehicles(search = make) {
    if (!token) return;

    try {
      const response = await fetch(
        `${API}/vehicles?make=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await response.json();

      if (response.ok) {
        setVehicles(data.vehicles);
      } else {
        setMessage(data.message || 'Unable to load vehicles');
      }
    } catch {
      setMessage('Cannot connect to the backend.');
    }
  }

  async function purchase(vehicle: Vehicle) {
    try {
      const response = await fetch(
        `${API}/vehicles/${vehicle.id}/purchase`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      setMessage(data.message || 'Purchase request completed');

      if (response.ok) await loadVehicles();
    } catch {
      setMessage('Purchase request failed');
    }
  }

  useEffect(() => {
    if (token) void loadVehicles();
  }, [token]);

  const isAdmin = (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN';
    } catch {
      return false;
    }
  })();

  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCategory, setNewCategory] = useState('Sedan');
  const [newPrice, setNewPrice] = useState('15000');
  const [newQuantity, setNewQuantity] = useState('1');

  async function addVehicle() {
    try {
      const response = await fetch(`${API}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          make: newMake,
          model: newModel,
          category: newCategory,
          price: Number(newPrice),
          quantity: Number(newQuantity),
        }),
      });

      const data = await response.json();
      setMessage(data.message || (response.ok ? 'Vehicle added' : 'Unable to add vehicle'));

      if (response.ok) {
        setNewMake('');
        setNewModel('');
        await loadVehicles();
      }
    } catch {
      setMessage('Unable to add vehicle');
    }
  }

  async function restock(vehicle: Vehicle) {
    const value = window.prompt('How many vehicles should be added to stock?');
    if (value === null) return;

    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setMessage('Enter a positive whole number');
      return;
    }

    try {
      const response = await fetch(
        `${API}/vehicles/${vehicle.id}/restock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        },
      );

      const data = await response.json();
      setMessage(data.message || 'Restock request completed');
      if (response.ok) await loadVehicles();
    } catch {
      setMessage('Restock request failed');
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-8">
      <header className="mx-auto mb-8 max-w-6xl rounded-2xl bg-slate-900 p-7 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          Dealership management
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Car Dealership Inventory
        </h1>
        <p className="mt-2 text-slate-300">
          Browse available vehicles and manage stock.
        </p>
      </header>

      {!token ? (
        <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            {isRegistering ? 'Create an account' : 'Sign in'}
          </h2>

          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            className="mb-4 w-full rounded-lg border p-3"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            className="mb-4 w-full rounded-lg border p-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />

          <button
            className="w-full rounded-lg bg-amber-500 p-3 font-bold text-slate-950 hover:bg-amber-400"
            onClick={() => void authenticate()}
          >
            {isRegistering ? 'Register' : 'Log in'}
          </button>

          <button
            className="mt-3 w-full p-2 text-sm text-blue-700 underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already registered? Log in' : 'New here? Create an account'}
          </button>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Vehicle inventory</h2>
            <button
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium"
              onClick={() => {
                setToken('');
                setVehicles([]);
                setMessage('Logged out');
              }}
            >
              Log out
            </button>
          </div>

          <div className="mb-6 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border bg-white p-3"
              placeholder="Search by make, e.g. Toyota"
              value={make}
              onChange={(event) => setMake(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void loadVehicles();
              }}
            />
            <button
              className="rounded-lg bg-slate-900 px-5 font-semibold text-white"
              onClick={() => void loadVehicles()}
            >
              Search
            </button>
          </div>

          {isAdmin && (
            <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="mb-4 text-lg font-bold">Add a vehicle (Admin)</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <input className="rounded-lg border p-3" placeholder="Make" value={newMake} onChange={(e) => setNewMake(e.target.value)} />
                <input className="rounded-lg border p-3" placeholder="Model" value={newModel} onChange={(e) => setNewModel(e.target.value)} />
                <input className="rounded-lg border p-3" placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                <input className="rounded-lg border p-3" type="number" min="1" placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                <input className="rounded-lg border p-3" type="number" min="0" placeholder="Quantity" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} />
              </div>
              <button
                className="mt-4 rounded-lg bg-amber-500 px-5 py-3 font-bold hover:bg-amber-400"
                onClick={() => void addVehicle()}
              >
                Add vehicle
              </button>
            </section>
          )}

          {vehicles.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
              No vehicles found. An admin can add vehicles to get started.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <article key={vehicle.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{vehicle.category}</p>
                      <h3 className="mt-1 text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${vehicle.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {vehicle.quantity > 0 ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                  <p className="mb-4 text-2xl font-bold">₹{vehicle.price.toLocaleString('en-IN')}</p>
                  <p className="mb-5 text-sm text-slate-500">Available quantity: {vehicle.quantity}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-lg bg-slate-900 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                      disabled={vehicle.quantity === 0}
                      onClick={() => void purchase(vehicle)}
                    >
                      Purchase
                    </button>
                    
                    {isAdmin && (
                      <>
                        <button
                          className="rounded-lg border border-amber-400 px-3 font-semibold"
                          onClick={() => void restock(vehicle)}
                        >
                          Restock
                        </button>
                        <button
                          className="rounded-lg border border-red-300 px-3 font-semibold text-red-700"
                          onClick={async () => {
                            if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
                            try {
                              const response = await fetch(`${API}/vehicles/${vehicle.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const data = await response.json();
                              setMessage(data.message || 'Delete request completed');
                              if (response.ok) await loadVehicles();
                            } catch {
                              setMessage('Unable to delete vehicle');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {message && (
        <p role="status" className="mx-auto mt-6 max-w-6xl rounded-lg bg-white p-4 text-sm shadow-sm">
          {message}
        </p>
      )}
    </main>
  );
}
