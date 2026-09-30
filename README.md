# THE CRESCENT — Admin Panel

Admin dashboard for **THE CRESCENT** restaurant. Shows incoming **reservations** and **food orders** submitted from the main website.

## Run it

```bash
npm install
npm run dev        # admin panel runs on http://localhost:4000
```

Run the main website in a second terminal:

```bash
# in the cresent project folder
npm run dev        # website runs on http://localhost:3000
```

## Login

- URL: `http://localhost:4000`
- Password: `crescent@123`

## Pages

- **Dashboard** — counts, revenue, recent reservations and orders
- **Reservations** — every booking from the website; change status (pending / confirmed / refused / cancelled) or delete
- **Orders** — every menu order from the website; change status (new / preparing / ready / completed / cancelled) or delete

## How data flows

The website submits to the admin API with CORS open from `localhost:3000`:

| Action on website            | API call                                          |
| ---------------------------- | ------------------------------------------------- |
| Reservation form submitted   | `POST http://localhost:4000/api/reservations`     |
| Menu "Add to Order" + checkout | `POST http://localhost:4000/api/orders`         |

Data is persisted to `data/db.json` (auto-seeded with sample records on first run).

## API

- `POST /api/auth/login` `{password}` — returns session cookie
- `POST /api/auth/logout`
- `GET /api/reservations` — requires admin session
- `POST /api/reservations` — public (from the website)
- `PATCH /api/reservations` `{id, status}` / `DELETE /api/reservations` `{id}` — admin only
- `GET /api/orders`, `POST /api/orders` (public), `PATCH /api/orders`, `DELETE /api/orders` — same pattern

## Notes

- Data is stored locally as JSON — no database needed.
- The admin password is defined in `src/lib/auth.ts` (change it there).
- This project uses `next build --webpack` on Windows if the default Turbopack build fails.