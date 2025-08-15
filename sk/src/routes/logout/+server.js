import { userStore } from "$lib/stores/user.svelte.js";
import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals }) => {
    if (locals.pb && locals.pb.authStore) {
        locals.pb.authStore.clear();
        locals.user = null;
        await userStore.logout();
    }
    throw redirect(303, '/');
};
