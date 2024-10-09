// Import necessary components from UI library and Next.js
import { Button } from "@/components/ui/button"; // Button component
import Link from "next/link"; // Link component for client-side navigation

// Define LandingPage Functional Component
const LandingPage = () => {
    return (
        <div>
            {/* Landing Page Header */}
            <h1>Landing Page (Unprotected)</h1>
            <div>
                {/* Link to Sign In page */}
                <Link href="/sign-in">
                    <Button>
                        Login
                    </Button>
                </Link>
                
                {/* Link to Sign Up page */}
                <Link href="/sign-up">
                    <Button>
                        Register
                    </Button>
                </Link>
            </div>
        </div>
    );
};

// Export LandingPage Component
export default LandingPage;