# ER Diagram Description

## Entities
1. **users**
   - One record per account.
   - `role` determines USER, PROVIDER, or ADMIN permissions.

2. **services**
   - Created by providers.
   - `provider_id` references `users.id`.

3. **bookings**
   - Created by users for services.
   - `service_id` references `services.id`.
   - `user_id` references `users.id`.

## Relationships
- `users (PROVIDER)` 1 --- N `services`
- `users (USER)` 1 --- N `bookings`
- `services` 1 --- N `bookings`

## Cardinality summary
- A provider can publish many services.
- A service can have many bookings.
- A user can create many bookings.