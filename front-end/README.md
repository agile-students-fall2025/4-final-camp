### Front-end Structure:

front-end/
│
├── public/
│ └── mock-data/ # Contains mock JSON data for testing
│
├── src/
│ ├── assets/ 
│ ├── hooks/ #Mock Data
│ ├── pages/ # All React page components
│ │ ├── staff/ # Staff-side pages
│ │ │ ├── BrowserCataloguePage.jsx
│ │ │ ├── FacilityItemsPage.jsx
│ │ │ ├── FilterAndSearchPage.jsx
│ │ │ ├── FinesPage.jsx
│ │ │ ├── HelpAndPoliciesPage.jsx
│ │ │ ├── HomePage.jsx
│ │ │ ├── ItemDetailPage.jsx
│ │ │ ├── MyBorrowalsPage.jsx
│ │ │ ├── NotificationsPage.jsx
│ │ │ ├── PayFinePage.jsx
│ │ │ ├── PaymentHistoryPage.jsx
│ │ │ ├── PaymentSuccessPage.jsx
│ │ │ ├── ProfileAndSettingsPage.jsx
│ │ │ ├── ReservationConfirmedPage.jsx
│ │ │ ├── ReserveDateTimePage.jsx
│ │ │ ├── StudentLoginPage.jsx
│ │ │ ├── StudentRegisterPage.jsx
│ │ │ ├── WaitlistConfirmedPage.jsx
│ │ │
│ │ └── landingpage.jsx # Landing page for all users
│ │
│ ├── services/
│ │ ├── App.css
│ │ ├── App.jsx # Main app routing and layout
│ │ ├── index.css # Global styles/Tailwind.CSS
│ │ └── main.jsx 




This project was bootstrapped with [Vite](https://vitejs.dev/), a fast build tool for modern web applications.  
It uses **React**, **Tailwind CSS**, and **JavaScript (ES6)** for the front-end.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload automatically when you make changes to the code.  
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.  
It optimizes and bundles your React components for best performance.  

Your app is now ready to be deployed!

### `npm run preview`

Previews the production build locally.  
This is useful to test your app before deploying it.

### `npm install`

Installs all required dependencies listed in `package.json`.  
You only need to run this once before running or building the app.

---

### Deployment

To deploy your production build:

1. Run `npm run build`
2. Upload the contents of the `dist/` folder to your hosting platform (e.g. Vercel, Netlify, or GitHub Pages)


