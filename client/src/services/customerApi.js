import api from "./api";

/*
|--------------------------------------------------------------------------
| Customer API
|--------------------------------------------------------------------------
| Handles customer account and address-related API requests.
|
| Backend route:
|   /api/customer
|--------------------------------------------------------------------------
*/

// ============================================================
// GET CUSTOMER PROFILE
// GET /api/customer/profile
// ============================================================

export const getCustomerProfile = () => {
  return api.get("/customer/profile");
};

// ============================================================
// UPDATE CUSTOMER PROFILE
// PUT /api/customer/profile
// ============================================================

export const updateCustomerProfile = (data) => {
  return api.put("/customer/profile", data);
};

// ============================================================
// GET CUSTOMER ADDRESSES
// GET /api/customer/addresses
// ============================================================

export const getCustomerAddresses = () => {
  return api.get("/customer/addresses");
};

// ============================================================
// ADD CUSTOMER ADDRESS
// POST /api/customer/addresses
// ============================================================

export const addCustomerAddress = (data) => {
  return api.post("/customer/addresses", data);
};

// ============================================================
// UPDATE CUSTOMER ADDRESS
// PUT /api/customer/addresses/:id
// ============================================================

export const updateCustomerAddress = (id, data) => {
  return api.put(`/customer/addresses/${id}`, data);
};

// ============================================================
// DELETE CUSTOMER ADDRESS
// DELETE /api/customer/addresses/:id
// ============================================================

export const deleteCustomerAddress = (id) => {
  return api.delete(`/customer/addresses/${id}`);
};

// ============================================================
// SET DEFAULT CUSTOMER ADDRESS
// PUT /api/customer/addresses/:id/default
// ============================================================

export const setDefaultCustomerAddress = (id) => {
  return api.put(`/customer/addresses/${id}/default`);
};