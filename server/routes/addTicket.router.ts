import express from "express";
import pool from "../modules/pool";
const router = express.Router();
import { rejectUnauthenticated } from "../modules/authentication-middleware";

router.post("/", rejectUnauthenticated, async (req, res) => {
  const {
    ticket_number,
    temperature,
    temperature_time,
    truck,
    latitude,
    longitude,
    grower_id,
    piler_id,
    beetbox_id,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert the ticket data
    const ticketInsertQuery = `
        INSERT INTO tickets (ticket_number, grower_id, truck)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
    const ticketResult = await client.query(ticketInsertQuery, [
      ticket_number,
      grower_id,
      truck,
    ]);
    const ticketId = ticketResult.rows[0].id;

    // Insert the beet data
    const beetDataInsertQuery = `
        INSERT INTO beet_data (temperature_time, temperature, piler_id, beetbox_id, coordinates, ticket_id)
        VALUES ($1, $2, $3, $4, POINT($5, $6), $7)
        RETURNING id;
      `;
    const beetDataResult = await client.query(beetDataInsertQuery, [
      temperature_time,
      temperature,
      piler_id,
      beetbox_id,
      longitude,
      latitude,
      ticketId,
    ]);
    const beetDataId = beetDataResult.rows[0].id;

    // Generate an alert if temperature is over 40
    if (temperature >=40) {
      const alertInsertQuery = `
          INSERT INTO alerts (beet_data_id, piler_id)
          VALUES ($1, $2);
        `;
      await client.query(alertInsertQuery, [beetDataId, piler_id]);
    }

    await client.query("COMMIT");
    res.send(piler_id);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding ticket and beet data:", error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

export default router;
