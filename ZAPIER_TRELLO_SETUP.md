# Zapier + Trello Integration Guide

This app can be fully automated with Zapier and Trello for order management.

## How it works:

1. **Order Created** → Zapier webhook → Trello card created
2. **Card Moves in Trello** → Zapier detects move → App updates stage
3. **Customer tracks order** → Sees live stage from Trello

## Setup Instructions:

### 1. Create Trello Board

1. Go to https://trello.com
2. Create a board with columns for each stage:
   - PRE-PRINTING STAGE
   - RUNNING STAGE
   - COLLATING STAGE
   - STAPLING/PADDING STAGE
   - BROWNING STAGE
   - PACKAGING STAGE

### 2. Set up Zapier Workflow 1: Create Trello Card on Order

1. Go to https://zapier.com and sign in
2. Create a new Zap
3. **Trigger**: Webhook by Zapier
   - Choose "Catch Raw Hook"
   - Copy the webhook URL (you'll use this in the app)
4. **Action**: Create Trello Card
   - Connect your Trello account
   - Board: Select your board
   - List: PRE-PRINTING STAGE
   - Card Name: `{{orderId}} - {{tradeName}}`
   - Description: Include order details from webhook

5. Test and activate the Zap

### 3. Update App to Send to Zapier

The app reads the Zapier webhook URL from environment variables. Add this to `.env.local`:

```env
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/XXXXXXXX/XXXXXXXX/
```

Update `app/api/orders/route.ts` to call the Zapier webhook:

```typescript
// After creating order, send to Zapier
await fetch("YOUR_ZAPIER_WEBHOOK_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderId: order.orderId,
    tradeName: order.tradeName,
    email: order.email,
    stage: order.stage,
    createdAt: order.createdAt,
  }),
});
```

### 4. Set up Zapier Workflow 2: Update App When Card Moves

1. Create another Zap
2. **Trigger**: Trello
   - Event: Card moved to list
   - Board: Your board
   - Choose your board
3. **Action**: Webhook by Zapier
   - URL: `https://yourdomain.com/api/orders/update`
   - Method: PATCH
   - Payload Type: JSON
   - Data:
     ```json
     {
       "orderId": "{{cardName}}",
       "stage": "{{listName}}"
     }
     ```

4. Test and activate

## Testing Locally

For local testing with webhooks, use ngrok:

```bash
npm install -g ngrok
ngrok http 3000
```

Use the ngrok URL as your webhook endpoint in Zapier.

## API Endpoints

### Create Order (with Zapier webhook)
- `POST /api/orders`
- Returns: `{ orderId, status, stage }`

### Update Order Stage
- `PATCH /api/orders/update`
- Body: `{ orderId, stage }`
- Valid stages: PRE-PRINTING STAGE, RUNNING STAGE, COLLATING STAGE, STAPLING/PADDING STAGE, BROWNING STAGE, PACKAGING STAGE

### Get Order
- `GET /api/orders?orderId=LIC-xxx-xxx`
- Returns: Full order object with current stage

## Example Trello Card Structure

Card Title: `LIC-123456-789 - Company Name`
Description:
```
Order Details
Email: company@example.com
Payment Status: paid
Printing Option: 7-10 WORKING DAYS PRINTING
```

As the card moves through lists, the app automatically updates the stage visible to customers.
