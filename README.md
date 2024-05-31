# Merit Aktiva Node.js Library

An unofficial Node.js API wrapper for [**`Merit Aktiva`**][merit-url] accounting software written in [**`TypeScript`**][typescript-url]. Provides convenient typesafe access to the Merit Aktiva API from applications written in server-side JavaScript.

## Progress on library

When the Library exposes tooling for **ALL** Merit Aktiva API endpoints, the version will be bumped to 1.0.0

This is the list of endpoints not yet included in the package:

1. ~~Authentication~~
2. Sales Invoices
    - ~~Get list of sales invoices~~
    - ~~Get sales invoice details~~
    - ~~Delete Invoice~~
    - Create Sales Invoice
        - ~~Create Sales Invoice~~
        - Create Sales Invoice with multiple payments
        - Create Sales Invoice of Estonian e-invoice standard 1.2
        - Send Sales Invoice by e-mail
        - Send Sales Invoice as e-invoice
        - Get Sales Invoice PDF
    - Create Credit Invoice
3. Sales Offers
    - Get List of Sales Offers
    - Create Sales Offer
    - Set Offer status
    - Create Invoice from SalesOffer
    - Get sales offer details
    - Update sales offer
4. Recurring Invoices
    - Create Recurring Invoice
    - Get Recurring Invoices clients address list
    - Send Indication Values
    - Get list of Recurring Invoices
    - Get Recurring  Invoice details
5. Purchase Invoices
    - Get list of purchase invoices
    - Get purchase invoice details
    - Delete Purchase Invoice
    - Create Purchase Invoice
    - Create Purchase Invoice Waiting Approval
    - Create Purchase Invoice Wating Approval of Estonian e-invoice standard 1.2
6. Inventory Movements
    - Get list of locations
    - Send Inventory Movements
    - Get List of Inventory Movements
7. Payments
    - List of Payments
    - List of Payment Types
    - Create Payment of sales invoice
    - Create Payment of purchase invoice
    - Create Payment of sales offer
    - Create payment of sales offer
    - Delete Payment
    - Bank statement import
    - Send Settlement
8. General Ledger Transactions
    - Creating General Ledger Transactions
    - Get list of GL Transactions
    - Getting GL Transaction Details
    - Getting GL Transactions Full Details
9. Fixed asset
    - List Fixed asset locations
    - Responsible employee list
    - Send Fixed assets
    - Get Fixed assets
10. ~~Tax list~~
11. Send Tax
12. Customers
    - Get Customer List
    - Create Customer
    - Update Customer
    - Create Customergroup
    - Get Customergroups
13. Vendors
    - Get Vendor List
    - Create Vendor
    - Update Vendor
    - Create Vendorgroup
    - Get Vendorgroup List
14. Accounts List
15. Project List
16. Cost Centers List
17. Dimensions
    - Get Dimensions List
    - Add Dimensions
    - Add Dimensions values
18. Departments List
19. Sales prices and discounts
    - Send prices
    - Send discounts
    - Get prices
    - Get discounts
    - Get Price
20. Units of Measure
    - Units of Measure List
    - Send units of measure
21. Banks List
22. Financial Years
23. Items
    - Item List
    - Item Groups
    - Add Items
    - Add Item groups
    - Update Item
24. Reports
    - Customer Debts Report
    - Customer Payment Report
    - Statement of Profit or Loss
    - Statement of Financial Position
    - Get Inventory Report
    - Sales Report
    - Purchase Report
    
## Installation

Install the package with:

```sh
npm install merit-aktiva
```
or
```sh
pnpm install merit-aktiva
```

## Usage

This package needs to be configured with a companies Merit API id and key

```ts
import merit, {type MeritConfig, type CreateSalesInvoiceParams} from "merit-aktiva";

const config : MeritConfig = {
  apiId: "...",
  apiKey: "...",
};

const aktiva = merit(config);

const payload: CreateSalesInvoiceParams = {
    //...
  };

const response = await aktiva.createSalesInvoice(payload)

console.log(response.InvoiceId)
```


## Release History

See [**`CHANGELOG.md`**](./CHANGELOG.md) for more information.

## License

Distributed under the **MIT** license. See [**`LICENSE.md`**](./LICENSE.md)
for more information.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

[merit-url]: https://www.merit.ee/
[typescript-url]: https://www.typescriptlang.org/
