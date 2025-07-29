/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};


export const actions = {
    register: async ({ request, locals }) => {
        const formData = await request.formData();
        const displayName = formData.get('displayName');
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordConfirm = formData.get('passwordConfirm');

        if (password !== passwordConfirm) {
            return fail(400, { error: 'Passwords do not match' });
        }

        try {
            const user = await locals.pb.collection('users').create({ email, password, displayName, fullName });
        } catch (error) {
            return fail(400, { error: 'Invalid email or password' });
        }
    }
}