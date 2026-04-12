# Shared Expense Ledger API Examples

## Create Group

```http
POST /groups
```

Request body:

```json
{
  "name": "Casa dos B",
  "currency": "BRL",
  "ownerId": "00000000-0000-0000-0000-000000000001"
}
```

## Create Expense

```http
POST /expenses
```

Request body:

```json
{
  "groupId": "00000000-0000-0000-0000-000000000010",
  "paidByUserId": "00000000-0000-0000-0000-000000000001",
  "amount": 22.0,
  "description": "Pao e Queijo",
  "requestId": "req-001",
  "includedUserIds": [
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-000000000002",
    "00000000-0000-0000-0000-000000000003",
    "00000000-0000-0000-0000-000000000004"
  ]
}
```

## Register Settlement

```http
POST /settlements
```

Request body:

```json
{
  "groupId": "00000000-0000-0000-0000-000000000010",
  "fromUserId": "00000000-0000-0000-0000-000000000002",
  "toUserId": "00000000-0000-0000-0000-000000000001",
  "amount": 10.0,
  "requestId": "req-002",
  "outstandingAmount": 15.5
}
```
