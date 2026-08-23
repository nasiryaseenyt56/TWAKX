# Security Specification for TWAKX Smart Accessories & Gadgets

## 1. Data Invariants
1. Products can be read by all users (public e-commerce catalog).
2. Product creation, modification, and deletion are restricted to store administrators.
3. Orders can be created by authenticated users or guest checkout with valid schema constraints.
4. An order can be read by its creator (`customerId == request.auth.uid`) or by an administrator.
5. Users can only read and write their own user profile document (`users/{userId}` where `userId == request.auth.uid`).
6. Store settings and coupon codes can be read publicly, but only modified by administrators.
7. Reviews can be read publicly; authenticated customers can create reviews with constrained payload sizes.

## 2. The Dirty Dozen Payloads (Rejections)
1. Unauthenticated client attempting to edit product price or delete inventory.
2. User attempting to read another customer's order containing personal shipping details.
3. User attempting to modify `role: "admin"` on their own user profile.
4. User submitting an order with negative totals or missing required fields.
5. Client submitting product with description exceeding 5000 chars.
6. Client attempting to update someone else's review.
7. Client trying to bypass order status directly to "Delivered" without admin permissions.
8. Injection attack with invalid document ID containing special characters.
9. Malicious user attempting to overwrite store payment numbers in `settings/general`.
10. Anonymous user trying to bulk delete customer records.
11. Client sending ghost fields or excessive array payloads in orders.
12. Attempt to tamper with tracking number on an active order by non-admin.
