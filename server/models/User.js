import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  // ============================================================
  // CREATE USER
  // ============================================================
  async create({
    first_name,
    last_name,
    email,
    password,
    isAdmin = false,
    profile_picture = null,
    address = {},
  }) {
    const query = `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        profile_picture,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING
        id,
        first_name,
        last_name,
        email,
        profile_picture,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
    `;

    const values = [
      first_name.trim(),
      last_name.trim(),
      email.toLowerCase().trim(),
      password,
      profile_picture,
      isAdmin,

      address.fullName || null,
      address.line1 || null,
      address.line2 || null,
      address.city || null,
      address.region || null,
      address.postalCode || null,
      address.country || null,
      address.phone || null,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // FIND USER BY ID
  // ============================================================
  async findById(id) {
    const query = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        profile_picture,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // FIND USER BY ID WITH PASSWORD
  // ============================================================
  async findByIdWithPassword(id) {
    const query = `
      SELECT *
      FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // FIND USER BY EMAIL
  // ============================================================
  async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;

    const { rows } = await pool.query(query, [
      email.toLowerCase().trim(),
    ]);

    return rows[0] || null;
  },

  // ============================================================
  // MATCH PASSWORD
  // ============================================================
  async matchPassword(user, enteredPassword) {
    return bcrypt.compare(
      enteredPassword,
      user.password
    );
  },

  // ============================================================
  // UPDATE USER PROFILE
  // ============================================================
  async update(id, data) {
    const {
      first_name,
      last_name,
      email,
      phone,
      profile_picture,
      address,
    } = data;

    const query = `
      UPDATE users
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        profile_picture = COALESCE($4, profile_picture),

        address_full_name =
          COALESCE($5, address_full_name),

        address_line1 =
          COALESCE($6, address_line1),

        address_line2 =
          COALESCE($7, address_line2),

        address_city =
          COALESCE($8, address_city),

        address_region =
          COALESCE($9, address_region),

        address_postal_code =
          COALESCE($10, address_postal_code),

        address_country =
          COALESCE($11, address_country),

        address_phone =
          COALESCE($12, address_phone),

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $13

      RETURNING
        id,
        first_name,
        last_name,
        email,
        profile_picture,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
    `;

    const values = [
      first_name?.trim() || null,
      last_name?.trim() || null,
      email?.trim().toLowerCase() || null,
      profile_picture || null,

      address?.fullName || null,
      address?.line1 || null,
      address?.line2 || null,
      address?.city || null,
      address?.region || null,
      address?.postalCode || null,
      address?.country || null,

      phone?.trim() || address?.phone || null,

      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // UPDATE PASSWORD
  // ============================================================
  async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users
      SET
        password = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        first_name,
        last_name,
        email,
        profile_picture,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
    `;

    const { rows } = await pool.query(query, [
      hashedPassword,
      id,
    ]);

    return rows[0] || null;
  },
};

export default User;