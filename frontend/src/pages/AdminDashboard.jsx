import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { pb, isPocketBaseEnabled } from '../services/pocketbase.js';
import SEO from '../components/SEO.jsx';
import MediaManager from '../components/admin/MediaManager.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ptRequests, setPtRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '', description: '', price: 0, category: 'Supplements', image: null, active: true
  });

  useEffect(() => {
    // Basic admin check (could be refined with a role field)
    if (!user) {
      navigate('/login');
    } else {
      fetchAdminData();
    }
  }, [user, navigate]);

  const fetchAdminData = async () => {
    if (!isPocketBaseEnabled) return setLoading(false);
    try {
      const ordersRes = await pb.collection('orders').getFullList({ sort: '-created', expand: 'user' });
      setOrders(ordersRes);

      const usersRes = await pb.collection('users').getFullList({ sort: '-created' });
      setUsers(usersRes);

      const ptReqRes = await pb.collection('pt_requests').getFullList({ sort: '-created', expand: 'user' });
      setPtRequests(ptReqRes);

      try {
        const prodRes = await pb.collection('products').getFullList({ sort: '-created' });
        setProducts(prodRes);
      } catch (err) { console.warn('Products not available yet', err) }
      
      try {
        const coupRes = await pb.collection('coupons').getFullList({ sort: '-created' });
        setCoupons(coupRes);
      } catch (err) { console.warn('Coupons not available yet', err) }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;

  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditFormData({
      offline_access: u.offline_access || false,
      membership_plan: u.membership_plan || '',
      membership_start: u.membership_start ? u.membership_start.substring(0, 10) : '',
      membership_end: u.membership_end ? u.membership_end.substring(0, 10) : ''
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('users').update(editingUser.id, editFormData);
      alert('User updated successfully!');
      setEditingUser(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update user.');
    }
  };

  const handleUpdatePtStatus = async (id, newStatus) => {
    try {
      await pb.collection('pt_requests').update(id, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleToggleProductStatus = async (id, currentStatus) => {
    try {
      await pb.collection('products').update(id, { active: !currentStatus });
      fetchAdminData();
    } catch (err) { alert('Failed to update product.') }
  };

  const handleToggleCouponStatus = async (id, currentStatus) => {
    try {
      await pb.collection('coupons').update(id, { active: !currentStatus });
      fetchAdminData();
    } catch (err) { alert('Failed to update coupon.') }
  };

  const generateRandomCoupon = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const discount = [0.1, 0.2, 0.5, 0.9][Math.floor(Math.random() * 4)];
    try {
      await pb.collection('coupons').create({ code, discount_rate: discount, active: true });
      fetchAdminData();
      alert(`Created coupon ${code} with ${discount * 100}% discount!`);
    } catch (err) { alert('Failed to create coupon.') }
  };

  const handleAddProduct = () => {
    setEditingProduct({ isNew: true });
    setProductFormData({
      name: '', description: '', price: 0, category: 'Supplements', image: null, active: true
    });
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      category: prod.category,
      active: prod.active,
      image: null
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productFormData.name);
    formData.append('description', productFormData.description);
    formData.append('price', productFormData.price);
    formData.append('category', productFormData.category);
    formData.append('active', productFormData.active);
    if (productFormData.image) {
      formData.append('image', productFormData.image);
    }

    try {
      if (editingProduct.isNew) {
        await pb.collection('products').create(formData);
      } else {
        await pb.collection('products').update(editingProduct.id, formData);
      }
      setEditingProduct(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    }
  };

  return (
    <MainLayout>
      <SEO title="Admin Dashboard - THREE13 Fitness" description="Manage orders and customers." />
      <div className="min-h-screen bg-[#09090b] text-white p-6 pt-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="font-display text-3xl font-black neon-text">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors">
              Export CSV
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white/60 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-neon mt-2">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white/60 text-sm font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-neon mt-2">{totalOrders}</p>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white/60 text-sm font-medium">Registered Users</h3>
            <p className="text-3xl font-bold text-neon mt-2">{totalUsers}</p>
          </div>
        </div>

        <div className="flex gap-4 border-b border-white/10 mb-6">
          <button onClick={() => setActiveTab('orders')} className={`pb-2 px-2 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>Orders</button>
          <button onClick={() => setActiveTab('users')} className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>Customers</button>
          <button onClick={() => setActiveTab('ptRequests')} className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ptRequests' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>PT Requests</button>
          <button onClick={() => setActiveTab('products')} className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>Products</button>
          <button onClick={() => setActiveTab('coupons')} className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'coupons' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>Coupons</button>
          <button onClick={() => setActiveTab('media')} className={`pb-2 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'media' ? 'border-neon text-neon' : 'border-transparent text-white/60 hover:text-white'}`}>Media</button>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/10">
          {loading ? (
            <div className="text-center py-10 text-white/60">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'orders' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/60 text-sm">
                      <th className="p-3 font-medium">Order ID</th>
                      <th className="p-3 font-medium">Customer</th>
                      <th className="p-3 font-medium">Amount</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="5" className="p-4 text-center text-white/40">No orders found.</td></tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                          <td className="p-3 font-mono text-neon">{order.orderId}</td>
                          <td className="p-3">{order.customerSnapshot?.name || 'Guest'}</td>
                          <td className="p-3">₹{order.amount?.toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 text-white/60">{new Date(order.created).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'users' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/60 text-sm">
                      <th className="p-3 font-medium">ID</th>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Joined</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan="4" className="p-4 text-center text-white/40">No users found.</td></tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                          <td className="p-3 font-mono text-white/40">{u.id}</td>
                          <td className="p-3 font-medium">{u.name || u.username || u.displayName || 'Unknown'} {u.offline_access && <span className="ml-2 text-[10px] bg-neon/20 text-neon px-2 py-0.5 rounded uppercase font-bold">Offline Member</span>}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3 text-white/60">{new Date(u.created).toLocaleDateString()}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleEditClick(u)} className="text-xs text-neon hover:text-white underline">Edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'ptRequests' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/60 text-sm">
                      <th className="p-3 font-medium">Customer</th>
                      <th className="p-3 font-medium">Plan</th>
                      <th className="p-3 font-medium">Trainer</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ptRequests.length === 0 ? (
                      <tr><td colSpan="6" className="p-4 text-center text-white/40">No PT requests found.</td></tr>
                    ) : (
                      ptRequests.map((req) => (
                        <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                          <td className="p-3">{req.expand?.user?.name || req.expand?.user?.email || 'Unknown'}</td>
                          <td className="p-3 font-mono text-neon">{req.plan}</td>
                          <td className="p-3">{req.trainer}</td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${req.status === 'Approved' ? 'bg-green-500/20 text-green-400' : req.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-white/60">{new Date(req.created).toLocaleDateString()}</td>
                          <td className="p-3 text-right flex gap-2 justify-end">
                            {req.status === 'Pending' && (
                              <>
                                <button onClick={() => handleUpdatePtStatus(req.id, 'Approved')} className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">Approve</button>
                                <button onClick={() => handleUpdatePtStatus(req.id, 'Rejected')} className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Store Products</h2>
                    <button className="bg-neon text-black px-4 py-2 rounded-lg font-bold hover:bg-neon/90" onClick={handleAddProduct}>+ Add Product</button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/60 text-sm">
                        <th className="p-3 font-medium">Image</th>
                        <th className="p-3 font-medium">Name</th>
                        <th className="p-3 font-medium">Category</th>
                        <th className="p-3 font-medium">Price</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr><td colSpan="6" className="p-4 text-center text-white/40">No products found.</td></tr>
                      ) : (
                        products.map((prod) => (
                          <tr key={prod.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                            <td className="p-3">
                              {prod.image ? (
                                <img src={pb.files.getUrl(prod, prod.image, { thumb: '100x100' })} className="w-10 h-10 object-cover rounded-md" />
                              ) : (
                                <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-white/30 text-xs">No img</div>
                              )}
                            </td>
                            <td className="p-3 font-medium text-neon">{prod.name}</td>
                            <td className="p-3">{prod.category}</td>
                            <td className="p-3">₹{prod.price.toFixed(2)}</td>
                            <td className="p-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${prod.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {prod.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => handleEditProduct(prod)} className="text-xs text-neon hover:text-white underline mr-3">Edit</button>
                              <button onClick={() => handleToggleProductStatus(prod.id, prod.active)} className="text-xs text-white/60 hover:text-white underline">{prod.active ? 'Disable' : 'Enable'}</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Discount Coupons</h2>
                    <button className="bg-neon text-black px-4 py-2 rounded-lg font-bold hover:bg-neon/90" onClick={generateRandomCoupon}>Generate Random Coupon</button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/60 text-sm">
                        <th className="p-3 font-medium">Code</th>
                        <th className="p-3 font-medium">Discount Rate</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.length === 0 ? (
                        <tr><td colSpan="4" className="p-4 text-center text-white/40">No coupons found.</td></tr>
                      ) : (
                        coupons.map((coupon) => (
                          <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                            <td className="p-3 font-mono text-neon font-bold text-lg tracking-widest">{coupon.code}</td>
                            <td className="p-3 font-bold">{(coupon.discount_rate * 100).toFixed(0)}% OFF</td>
                            <td className="p-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${coupon.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {coupon.active ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => handleToggleCouponStatus(coupon.id, coupon.active)} className="text-xs text-white/60 hover:text-white underline">{coupon.active ? 'Disable' : 'Enable'}</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'media' && (
                <MediaManager />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
            <h2 className="text-xl font-bold text-neon mb-6">Edit User: {editingUser.name || editingUser.email}</h2>
            <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editFormData.offline_access} 
                  onChange={(e) => setEditFormData({...editFormData, offline_access: e.target.checked})}
                  className="w-5 h-5 accent-neon"
                />
                <span className="text-white">Enable Offline Gym Access</span>
              </label>

              {editFormData.offline_access && (
                <div className="flex flex-col gap-4 mt-2 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Membership Plan</label>
                    <select 
                      value={editFormData.membership_plan}
                      onChange={(e) => setEditFormData({...editFormData, membership_plan: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon"
                    >
                      <option value="">Select Plan</option>
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Start Date</label>
                    <input 
                      type="date"
                      value={editFormData.membership_start}
                      onChange={(e) => setEditFormData({...editFormData, membership_start: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">End Date</label>
                    <input 
                      type="date"
                      value={editFormData.membership_end}
                      onChange={(e) => setEditFormData({...editFormData, membership_end: e.target.value})}
                      className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="mt-4 w-full bg-neon text-black font-bold py-3 rounded-xl hover:bg-neon/90 transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-20">
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 w-full max-w-md relative my-auto">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-white/60 hover:text-white text-xl">✕</button>
            <h2 className="text-xl font-bold text-neon mb-6">{editingProduct.isNew ? 'Add Product' : 'Edit Product'}</h2>
            
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input 
                  type="text" required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea 
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Price (₹)</label>
                  <input 
                    type="number" required min="0"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})}
                    className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Category</label>
                  <select 
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                  >
                    <option value="Supplements">Supplements</option>
                    <option value="Gear">Gear</option>
                    <option value="Merch">Merch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Product Image</label>
                {!editingProduct.isNew && editingProduct.image && !productFormData.image && (
                  <div className="mb-2">
                    <img src={pb.files.getUrl(editingProduct, editingProduct.image, { thumb: '100x100' })} className="h-16 w-16 object-cover rounded-md border border-white/10" alt="Current" />
                    <span className="text-xs text-white/40 block mt-1">Current Image (Upload new to replace)</span>
                  </div>
                )}
                <input 
                  type="file" accept="image/*"
                  onChange={(e) => setProductFormData({...productFormData, image: e.target.files[0]})}
                  className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon/20 file:text-neon hover:file:bg-neon/30 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  checked={productFormData.active} 
                  onChange={(e) => setProductFormData({...productFormData, active: e.target.checked})}
                  className="w-5 h-5 accent-neon"
                />
                <span className="text-white">Active (Visible in Store)</span>
              </label>

              <button type="submit" className="mt-4 w-full bg-neon text-black font-bold py-3 rounded-xl hover:bg-neon/90 transition-colors">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
