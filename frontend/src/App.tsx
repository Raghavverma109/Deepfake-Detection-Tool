import { useState } from 'react'
// 1. Import routing components
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'

// 2. Import your components and pages
import { Header } from './components/header'
import { Footer } from './components/footer'
import { DeepfakeDetector } from './components/deepfake-detector'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import HistorySidebar from './components/HistorySidebar.tsx' // <-- NEW IMPORT

// Helper function to check authentication state for conditional rendering
const isAuthenticated = () => !!localStorage.getItem('deepfake-token');


// 3. Create a layout component to keep Header/Footer consistent
const MainLayout = () => {
    const isUserAuthenticated = isAuthenticated();

    return (
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          
          {/* Main content area: Flex container for Sidebar + Detector */}
          <div className="flex flex-1 overflow-hidden"> 
              
              {/* 🛑 SIDEBAR: Fixed position, hidden on mobile (md:block) */}
              {isUserAuthenticated && (
                  <HistorySidebar onSelectItem={(item) => console.log("Selected item:", item)} />
              )}

              {/* MAIN CONTENT AREA: Adjust margin based on sidebar visibility */}
              {/* On desktop (md), if authenticated, push content over by the sidebar width (w-64) */}
              <main className={`flex-1 overflow-y-auto p-4 ${isUserAuthenticated ? 'md:pl-68' : ''}`}> 
                  <Outlet /> 
              </main>

          </div>

          <Footer />
        </div>
    );
};


function App() {
    return (
        <Router> 
            <ThemeProvider defaultTheme="dark" storageKey="deepguard-ui-theme">
                
                <Routes>
                    
                    <Route path="/" element={<MainLayout />}>
                        
                        {/* PUBLIC ROUTES */}
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        
                        {/* PROTECTED ROUTES */}
                        <Route element={<ProtectedRoute />}>
                            {/* This is your main protected content route */}
                            <Route index element={<DeepfakeDetector />} /> 
                        </Route>

                        {/* CATCH-ALL ROUTE */}
                        <Route path="*" element={<NotFound />} /> 
                        
                    </Route>
                </Routes>

            </ThemeProvider>
        </Router>
    )
}

export default App