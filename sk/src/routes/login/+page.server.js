import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

export const actions = { 
    login: async ({ request, locals }) => {
        console.log("login action started")
        const data = await request.formData();
        console.log("Form data:", Object.fromEntries(data.entries()));
        
        const email = data.get('email');
        const password = data.get('password');
        const rememberMe = data.get('rememberMe') === 'on';

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            const authdata = await locals.pb.collection('users').authWithPassword(email, password);
            console.log("Auth successful:", authdata);
            
            // Redirect to dashboard or home page after successful login
            throw redirect(303, '/');
        } catch (error) {
            console.error("Login error:", error);
            return fail(400, { error: 'Invalid email or password' });
        }
    }
}
