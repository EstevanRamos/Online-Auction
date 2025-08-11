import { fail, redirect } from '@sveltejs/kit';

export const actions = { 
    login: async ({ request, locals }) => {
        let success = false;
        console.log("login action started");
        const data = await request.formData();
        console.log("Form data:", Object.fromEntries(data.entries()));
        
        const email = data.get('email')?.toString().trim();
        const password = data.get('password')?.toString();
        const rememberMe = data.get('rememberMe') === 'on';

        // Field-specific validation errors
        let fieldErrors = {};
        let hasFieldErrors = false;

        // Email validation
        if (!email) {
            fieldErrors.email = 'Email is required';
            hasFieldErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            fieldErrors.email = 'Please enter a valid email address';
            hasFieldErrors = true;
        }

        // Password validation
        if (!password) {
            fieldErrors.password = 'Password is required';
            hasFieldErrors = true;
        } else if (password.length < 6) {
            fieldErrors.password = 'Password must be at least 6 characters long';
            hasFieldErrors = true;
        }

        // If there are field validation errors, return them
        if (hasFieldErrors) {
            return fail(400, { 
                error: 'Please fix the errors below',
                fieldErrors,
                email,
                password,
                rememberMe
            });
        }

        try {
            // Attempt authentication
            const authdata = await locals.pb.collection('users').authWithPassword(email, password);
            console.log("Auth successful:", authdata);
            
            // Set remember me if requested
            if (rememberMe) {
                // You might want to set a longer session duration here
                // This depends on your PocketBase configuration
            }
            
            // Redirect to dashboard or home page after successful login
            throw redirect(303, '/');
        } catch (error) {
            if (error.status === 303) {
                redirect(303, '/');
            }
            console.error("Login error:", error);
            
            // Handle specific authentication errors
            if (error.status === 400) {
                if (error.data?.message?.includes('Invalid login credentials')) {
                    return fail(400, { 
                        error: 'Invalid email or password. Please check your credentials and try again.',
                        fieldErrors: { email: 'Invalid email or password' },
                        email,
                        password,
                        rememberMe
                    });
                } else if (error.data?.message?.includes('Failed to authenticate')) {
                    return fail(400, { 
                        error: 'Authentication failed. Please verify your email and password.',
                        fieldErrors: { email: 'Authentication failed' },
                        email,
                        password,
                        rememberMe
                    });
                } else if (error.data?.message?.includes('User not found')) {
                    return fail(400, { 
                        error: 'No account found with this email address. Please check your email or create a new account.',
                        fieldErrors: { email: 'No account found with this email' },
                        email,
                        password,
                        rememberMe
                    });
                }
            }
            
            // Handle rate limiting
            if (error.status === 429) {
                return fail(429, { 
                    error: 'Too many login attempts. Please wait a few minutes before trying again.',
                    email,
                    password,
                    rememberMe
                });
            }
            
            // Check if it's a network or server error
            if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
                return fail(500, { 
                    error: 'Network error. Please check your connection and try again.',
                    email,
                    password,
                    rememberMe
                });
            }
            
            // Handle server errors
            if (error.status >= 500) {
                return fail(500, { 
                    error: 'Server error. Please try again later or contact support if the problem persists.',
                    email,
                    password,
                    rememberMe
                });
            }
            
            // Default error message for unhandled cases
            return fail(400, { 
                error: 'Login failed. Please check your credentials and try again.',
                fieldErrors: { email: 'Login failed' },
                email,
                password,
                rememberMe
            });
        }

    }
}
