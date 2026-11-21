
import pool from "../config/db.js";

const Address = {
  // ==========================================
  // CREATE ADDRESS
  // ==========================================

  async create({
    userId,
    label = "Home",
    fullName,
    phone = null,
    line1,
    line2 = null,
    city,
    region = null,
    postalCode = null,
    country,
    isDefault = false,
    isActive = true,
  }) {
    const query = `
      INSERT INTO addresses (
        user_id,
        label,
        full_name,
        phone,
        line1,
        line2,
        city,
        region,
        postal_code,
        country,
        is_default,
        is_active
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12
      )
      RETURNING *
    `;

    const values = [
      userId,
      label,
      fullName,
      phone,
      line1,
      line2,
      city,
      region,
      postalCode,
      country,
      isDefault,
      isActive,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // ==========================================
  // FIND ADDRESS BY ID
  // ==========================================

  async findById(id) {
    const query = `
      SELECT *
      FROM addresses
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ==========================================
  // FIND ALL ADDRESSES FOR USER
  // ==========================================

  async findByUserId(userId) {
    const query = `
      SELECT *
      FROM addresses
      WHERE user_id = $1
        AND is_active = TRUE
      ORDER BY is_default DESC, created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows;
  },

  // ==========================================
  // FIND DEFAULT ADDRESS
  // ==========================================

  async findDefaultByUserId(userId) {
    const query = `
      SELECT *
      FROM addresses
      WHERE user_id = $1
        AND is_default = TRUE
        AND is_active = TRUE
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows[0] || null;
  },

  // ==========================================
  // UPDATE ADDRESS
  // ==========================================

  async update(
    id,
    {
      label,
      fullName,
      phone,
      line1,
      line2,
      city,
      region,
      postalCode,
      country,
      isDefault,
      isActive,
    }
  ) {
    const query = `
      UPDATE addresses
      SET
        label = COALESCE($1, label),
        full_name = COALESCE($2, full_name),
        phone = COALESCE($3, phone),
        line1 = COALESCE($4, line1),
        line2 = CASE
          WHEN $5::boolean THEN $6
          ELSE line2
        END,
        city = COALESCE($7, city),
        region = CASE
          WHEN $8::boolean THEN $9
          ELSE region
        END,
        postal_code = CASE
          WHEN $10::boolean THEN $11
          ELSE postal_code
        END,
        country = COALESCE($12, country),
        is_default = COALESCE($13, is_default),
        is_active = COALESCE($14, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      label ?? null,
      fullName ?? null,
      phone ?? null,
      line1 ?? null,
      line2 !== undefined,
      line2 ?? null,
      city ?? null,
      region !== undefined,
      region ?? null,
      postalCode !== undefined,
      postalCode ?? null,
      country ?? null,
      isDefault ?? null,
      isActive ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ==========================================
  // SET DEFAULT ADDRESS
  // ==========================================

  async setDefault(userId, addressId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Verify that the address belongs to the user
      // and is active before changing defaults.
      const addressResult = await client.query(
        `
          SELECT id
          FROM addresses
          WHERE id = $1
            AND user_id = $2
            AND is_active = TRUE
          FOR UPDATE
        `,
        [addressId, userId]
      );

      if (!addressResult.rows.length) {
        await client.query("ROLLBACK");
        return null;
      }

      await client.query(
        `
          UPDATE addresses
          SET
            is_default = FALSE,
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1
        `,
        [userId]
      );

      const { rows } = await client.query(
        `
          UPDATE addresses
          SET
            is_default = TRUE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND user_id = $2
            AND is_active = TRUE
          RETURNING *
        `,
        [addressId, userId]
      );

      await client.query("COMMIT");

      return rows[0] || null;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  async delete(id) {
    const query = `
      DELETE FROM addresses
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Address;