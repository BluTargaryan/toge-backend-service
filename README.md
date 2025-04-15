# Toge Backend Service

A RESTful API backend service built with Express, TypeScript, and AWS DynamoDB.

## Features

- RESTful API endpoints for CRUD operations
- TypeScript for type safety
- AWS DynamoDB integration
- Environment-based configuration
- Error handling middleware

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS account with DynamoDB access
- AWS credentials (Access Key ID and Secret Access Key)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
PORT=3000
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

To run the development server with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Items

- `POST /items` - Create a new item
- `GET /items` - Get all items
- `GET /items/:id` - Get item by ID
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

## Project Structure

```
├── config/           # Configuration files
│   └── dynamodb.ts   # DynamoDB configuration
├── models/           # Data models
│   └── item.ts       # Item model and database operations
├── routes/           # API routes
│   └── items.ts      # Item routes
├── app.ts            # Main application file
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript configuration
```

## Error Handling

The API includes error handling for:
- Missing or invalid parameters
- Database operations
- Resource not found
- Server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
