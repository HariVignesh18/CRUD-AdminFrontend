# Sample Admin Frontend

A dynamic React-based admin panel frontend that provides configurable CRUD interfaces for any MySQL database table.

## 🚀 Features

- **Dynamic CRUD Interface** - Auto-generated Create, Read, Update, Delete operations
- **Visual Table Configuration Wizard** - Step-by-step setup for new tables
- **Real-Time Column Visibility** - Toggle which columns to display on-the-fly
- **Advanced Search & Filtering** - Search across multiple columns with dynamic filters
- **Sortable Tables** - Click column headers to sort data
- **Pagination** - Efficient data loading with configurable page sizes
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Toast Notifications** - User-friendly success/error messages

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Refine Framework** - Data orchestration and state management
- **PrimeReact** - Rich UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS** - Custom styling with PrimeReact themes

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:5081`

## 🚦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

The frontend is configured to connect to `http://localhost:5081` by default. If your backend runs on a different port, update the API calls in:
- `src/components/GenericCRUDRefine.tsx`
- `src/refine/dataProvider.ts`

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The optimized build will be created in the `build/` directory.

## 📁 Project Structure

```
src/
├── api/                    # API client utilities
├── components/             # React components
│   ├── generic/           # Reusable generic components
│   │   ├── GenericActions.tsx
│   │   ├── GenericFilters.tsx
│   │   ├── GenericHeader.tsx
│   │   └── GenericForm.tsx
│   └── GenericCRUDRefine.tsx  # Main CRUD component
├── context/               # React context providers
│   └── ToastContext.tsx   # Toast notification system
├── pages/                 # Page components
│   ├── HomePage.tsx       # Landing page
│   ├── GeneratePage.tsx   # Table configuration wizard
│   └── NotFoundPage.tsx   # 404 page
├── refine/                # Refine framework configuration
│   └── dataProvider.ts    # Data provider for API calls
├── shared/                # Shared utilities
│   └── DataTableWrapper.tsx
├── styles/                # CSS styles
├── App.tsx                # Root application component
└── index.tsx              # Application entry point
```

## 🎯 Key Components

### GenericCRUDRefine
The main component that handles all CRUD operations for a table. Features:
- Fetches table metadata from backend
- Loads table configuration (column order, sortable columns, etc.)
- Manages state for pagination, filters, search, and sorting
- Renders dynamic forms and tables

### GenericHeader
Header component with:
- Table title and description
- Search input (for searchable columns)
- Column visibility dropdown
- Filters toggle button
- New record button

### GenericFilters
Dynamic filter panel that:
- Reads filterable columns from configuration
- Generates appropriate input widgets based on data type
- Applies filters to the data table

### GeneratePage
4-step wizard for configuring new tables:
1. **Table Name** - Select existing MySQL table
2. **Column Order** - Drag-and-drop column ordering
3. **Constraints** - Configure unique fields, sortable/searchable/filterable columns
4. **Review** - Preview and save configuration

## 🔧 Configuration

### API Endpoints

The frontend expects the following backend endpoints:

- `GET /api/:table` - List records
- `GET /api/:table/:id` - Get single record
- `POST /api/:table` - Create record
- `PUT /api/:table/:id` - Update record
- `DELETE /api/:table/:id` - Delete record
- `GET /metadata/:table` - Get table metadata
- `GET /metadata/tables` - Get all tables
- `GET /table-config/:table` - Get table configuration
- `POST /table-config` - Save table configuration

### Environment Variables

Create a `.env` file if needed:

```env
REACT_APP_API_URL=http://localhost:5081
```

## 📖 Usage

### Viewing Data

1. Navigate to any table page (e.g., `/generic/countries`)
2. Data loads automatically with pagination
3. Use search bar to search across configured searchable columns
4. Click "Filters" to show advanced filter panel
5. Toggle columns using the column visibility dropdown

### Creating Records

1. Click the "+ New" button
2. Fill in the form (required fields marked with *)
3. Click "Save" to create the record

### Editing Records

1. Click the edit (pencil) icon on any row
2. Modify the form fields
3. Click "Save" to update

### Deleting Records

1. Click the delete (trash) icon on any row
2. Confirm the deletion in the dialog

### Configuring a New Table

1. Go to `/generate`
2. Enter the name of an existing MySQL table
3. Follow the 4-step wizard:
   - Arrange column display order
   - Select unique constraint columns
   - Choose sortable columns
   - Choose searchable columns
   - Choose filterable columns
4. Review and save the configuration

## 🎨 Styling

The application uses:
- **PrimeReact Theme** - Professional UI components
- **PrimeFlex** - Flexbox utilities
- **Custom CSS** - Additional styling in `src/styles/`

To customize the theme, modify the PrimeReact imports in `index.tsx`.

## 🔒 Features in Detail

### Column Visibility
- Users can show/hide columns using the dropdown
- At least one column must always be visible
- Warning toast appears if user tries to deselect all columns

### Search Functionality
- Searches across all configured searchable columns
- Real-time search as you type
- Backend performs LIKE queries across multiple columns

### Filtering
- Dynamic filters based on column data types
- Text inputs for strings
- Number inputs for numeric columns
- Date pickers for date columns
- Filters combine with AND logic

### Sequential Wizard Navigation
- Users must progress through wizard steps in order
- Cannot skip to final step without validation
- Prevents accidental configuration of existing tables

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React and PrimeReact**
